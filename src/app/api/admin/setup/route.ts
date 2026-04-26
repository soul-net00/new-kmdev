import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { createAdmin, getAdminByEmail } from "@/models/Admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. Use password change feature." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const admin = await createAdmin(email, hashedPassword);

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      email: admin.email
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to create an admin",
    body: {
      email: "your@email.com",
      password: "yourpassword"
    }
  });
}