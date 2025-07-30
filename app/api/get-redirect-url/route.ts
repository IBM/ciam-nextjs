import { NextResponse } from "next/server";

export async function GET() {
  const tenantUrl = process.env.tenantUrl;
  const clientId = process.env.redirectClientId;
  const clientSecret = process.env.redirectClientSecret;
  const redirectUri = process.env.CE_URL || "http://localhost:3000/"; // Default if not set
  const scope = process.env.scope || "openid"; // Default if not set

  if (!tenantUrl || !clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing required environment variables" },
      { status: 500 }
    );
  }

  const redirectUrl = `${tenantUrl}/oauth2/authorize?client_id=${clientId}&client_secret=${clientSecret}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

  return NextResponse.json({ redirectUrl });
}
