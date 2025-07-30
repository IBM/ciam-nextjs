import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const client_body = await request.json();
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token");

  try {
    if (!accessToken) {
      const tokenResponse = await fetch(
        new URL("/api/get-access-token", request.url),
        {
          method: "POST",
        }
      );
      if (!tokenResponse.ok) {
        return NextResponse.json(
          { error: "Failed to refresh access token" },
          { status: 500 }
        );
      }
      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
    }

    const tenantUrl = process.env.tenantUrl;

    if (!tenantUrl) {
      console.error("Missing environment variables for access token call");
      return NextResponse.json(
        {
          error:
            "Server configuration error: Required API credentials missing.",
        },
        { status: 500 }
      );
    }

    const url =
      `${tenantUrl}/v2.0/factors/emailotp/transient/verifications/` +
      client_body.otpId;

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${
          typeof accessToken === "string"
            ? accessToken
            : accessToken?.value || ""
        }`,
      },
      body: JSON.stringify({ otp: client_body.otp }),
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

    return new NextResponse(null, { status: apiResponse.status });
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
