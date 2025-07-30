import { NextRequest, NextResponse } from "next/server";
import { getSession, deleteSession } from "@/lib/session";

const TENANT_URL = process.env.tenantUrl;

async function fetchWithAuth(
  url: string,
  method: "GET" | "PUT" | "DELETE",
  accessToken: string,
  body?: any
) {
  const headers = {
    "Content-Type": "application/scim+json",
    Authorization: `Bearer ${accessToken}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.text();
    console.error(
      `API call failed: ${response.status} ${response.statusText}`,
      errorData
    );
    throw new Error(
      `Failed to ${method} user data: ${response.statusText} - ${errorData}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = `${TENANT_URL}/v2.0/Me`;
    const data = await fetchWithAuth(url, "GET", session.accessToken);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const url = `${TENANT_URL}/v2.0/Me`;

    const data = await fetchWithAuth(url, "PUT", session.accessToken, body);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: "error.message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = `${TENANT_URL}/v2.0/Me`;

    await fetchWithAuth(url, "DELETE", session.accessToken);

    // Clear the session upon successful deletion
    await deleteSession();

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: "error.message" },
      { status: 500 }
    );
  }
}
