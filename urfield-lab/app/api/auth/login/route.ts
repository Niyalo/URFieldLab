import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const { login_name, password } = await request.json();

  try {
    const author = await client.fetch(
      `*[_type == "author" && login_name == $login_name][0]{
        _id,
        name,
        login_name,
        password,
        verified,
        "pictureURL": picture.asset->url
      }`,
      { login_name }
    );

    if (!author) {
      return NextResponse.json(
        { message: "Author does not exist." },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, author.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (!author.verified) {
      return NextResponse.json(
        { message: "Your account has not been verified by an admin yet." },
        { status: 403 }
      );
    }

    // Save user data in the session
    session._id = author._id;
    session.name = author.name;
    session.login_name = author.login_name;
    session.pictureURL = author.pictureURL || undefined;
    session.isLoggedIn = true;
    await session.save();

    // Return a subset of author data to the client (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...authorData } = author;
    return NextResponse.json(authorData);

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}