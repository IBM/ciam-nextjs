import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  const tenantUrl = process.env.tenantUrl;
  const clientId = process.env.redirectClientId;
  const clientSecret = process.env.redirectClientSecret;
  const redirectUri = process.env.CE_URL;

  if (!tenantUrl || !clientId || !clientSecret || !redirectUri) {
    console.error("Required environment variables are not set.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    console.log(code, tenantUrl, clientId, clientSecret, redirectUri);
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch(`${tenantUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        scope: "openid",
      }),
    });

    let tokenData = await tokenResponse.json();
    console.log(tokenData);
    // tokenData = await tokenResponse.json(); // Corrected line to parse

    if (!tokenResponse.ok) {
      console.error("Failed to exchange code for token:", tokenData);
      return NextResponse.json(
        {
          error: "Failed to authenticate",
          details: tokenData.error_description || "Token exchange failed",
        },
        { status: tokenResponse.status }
      );
    }

    const { access_token } = tokenData;

    // 2. Use access token to fetch user profile
    const userResponse = await fetch(`${tenantUrl}/v2.0/Me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Failed to fetch user data:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch user profile", details: errorData },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    console.log(userData);

    // 3. Extract required data and create a session
    const userName = userData.name?.formatted || "User";
    const userEmail = userData.userName;
    const userRole =
      userData["urn:ietf:params:scim:schemas:extension:ibm:2.0:User"]
        ?.customAttributes?.[0]?.values?.[0] || "user";

    await createSession({
      name: userName,
      email: userEmail,
      role: userRole,
      accessToken: access_token,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in login route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
