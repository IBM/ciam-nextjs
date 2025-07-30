import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    const tenantUrl = process.env.tenantUrl;
    const logoutUrl = `${tenantUrl}/idaas/mtfim/sps/idaas/logout?themeId=d2ca09b4-06e6-457d-89cf-357f5553ee62`;
    await deleteSession();
    console.log("session deleted");
    console.log(tenantUrl);
    return NextResponse.json({ url: logoutUrl });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Error logging out" }, { status: 500 });
  }
}
