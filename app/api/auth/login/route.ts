import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "toggletiny_session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
