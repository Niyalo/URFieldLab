import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.json(
      { message: "No user logged in" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    _id: session._id,
    name: session.name,
    login_name: session.login_name,
    pictureURL: session.pictureURL,
    isLoggedIn: session.isLoggedIn,
    isAdmin: session.isAdmin, // Add this line
  });
}