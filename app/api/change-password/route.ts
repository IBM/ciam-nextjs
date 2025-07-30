import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tenantUrl = process.env.tenantUrl;
    const changePasswordUrl = `${tenantUrl}/authsvc/mtfim/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:changepassword&login_hint=`;
    return NextResponse.json({
      url: changePasswordUrl,
      themeID: "themeId=d2ca09b4-06e6-457d-89cf-357f5553ee62",
    });
  } catch (error) {
    console.error("change password error:", error);
    return NextResponse.json(
      { message: "Error changing password" },
      { status: 500 }
    );
  }
}
