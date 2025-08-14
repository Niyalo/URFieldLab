import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SanityImageAssetDocument } from "next-sanity";

// Client with write access
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: "2024-01-01",
  useCdn: false, // Must be false to ensure fresh data and for mutations
  token: process.env.SANITY_API_WRITE_TOKEN || 'placeholder-token',
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const login_name = formData.get('login_name') as string;
    const password = formData.get('password') as string;
    const yearId = formData.get('yearId') as string;
    const email = formData.get('email') as string | null;
    const role = formData.get('role') as string | null;
    const institute = formData.get('institute') as string | null;
    const bio = formData.get('bio') as string | null;
    const pictureFile = formData.get('picture') as File | null;

    if (!name || !login_name || !password || !yearId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingAuthor = await client.fetch(
      `*[_type == "author" && login_name == $login_name][0]`,
      { login_name }
    );

    if (existingAuthor) {
      return NextResponse.json(
        { message: "Login name is already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageAsset: SanityImageAssetDocument | undefined;
    if (pictureFile && pictureFile.size > 0) {
        const pictureBuffer = await pictureFile.arrayBuffer();
        imageAsset = await client.assets.upload('image', Buffer.from(pictureBuffer), {
            filename: pictureFile.name,
        });
    }

    const newAuthor: {
      _type: string;
      name: string;
      login_name: string;
      password: string;
      email?: string;
      year?: { _type: string; _ref: string };
      verified: boolean;
      role?: string;
      institute?: string;
      bio?: string;
      picture?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } };
    } = {
      _type: "author",
      name,
      login_name,
      password: hashedPassword,
      verified: false,
      year: { _type: "reference", _ref: yearId },
      ...(email && { email }),
      ...(role && { role }),
      ...(institute && { institute }),
      ...(bio && { bio }),
      ...(imageAsset && { picture: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } } }),
    };

    await client.create(newAuthor);

    return NextResponse.json(
      { message: "Signup successful! Please log in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
