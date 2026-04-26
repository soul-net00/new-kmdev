import { NextRequest, NextResponse } from "next/server";
import { getAdminByEmail } from "@/models/Admin";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = await getAdminByEmail(email);

    if (admin) {
      return NextResponse.json({
        exists: true,
        email: admin.email,
        role: admin.role
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Check admin error:", error);
    return NextResponse.json({ error: "Failed to check admin" }, { status: 500 });
  }
}