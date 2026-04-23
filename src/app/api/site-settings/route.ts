import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return NextResponse.json(settings || null);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const current = await SiteSettings.findOne();
    
    const result = current
      ? await SiteSettings.findByIdAndUpdate(current._id, body, { new: true, runValidators: true })
      : await SiteSettings.create(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
