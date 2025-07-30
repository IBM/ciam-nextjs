import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const tenantUrl = process.env.tenantUrl;
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;
    const scope = process.env.scope;

    if (!clientId || !clientSecret || !tenantUrl || !scope) {
      console.error("Missing environment variables for access token call");
      return NextResponse.json(
        {
          error:
            "Server configuration error: Required API credentials missing.",
        },
        { status: 500 }
      );
    }

    const credentials = new URLSearchParams({
      grant_type: "client_credentials",
      scope: scope,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const apiResponse = await fetch(`${tenantUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: credentials,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(
        "External API call failed with status:",
        apiResponse.status,
        "Body:",
        errorText
      );
      return NextResponse.json(
        {
          message: "Failed to call external API",
          details: errorText || "Unknown error",
        },
        { status: apiResponse.status }
      );
    }

    const tokenData = await apiResponse.json();
    const accessToken = tokenData.access_token;

    if (accessToken) {
      const response = NextResponse.json({
        success: true,
        access_token: accessToken,
      });
      response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: tokenData.expires_in || 3600,
        path: "/",
      });
      return response;
    } else {
      return NextResponse.json(
        { error: "Access token not received from provider" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
