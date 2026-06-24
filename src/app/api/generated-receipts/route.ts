import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GeneratedReceipt } from "@/models/GeneratedReceipt";

export async function GET() {
  try {
    await connectToDatabase();
    const receipts = await GeneratedReceipt.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(receipts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Batch push: accept array of receipts
    const receipts = Array.isArray(body) ? body : [body];
    const results = [];

    for (const rec of receipts) {
      const existing = await GeneratedReceipt.findOne({ localId: rec.localId || rec.id });
      if (existing) {
        // Update
        Object.assign(existing, { ...rec, localId: rec.localId || rec.id });
        await existing.save();
        results.push(existing);
      } else {
        // Create
        const created = await GeneratedReceipt.create({ ...rec, localId: rec.localId || rec.id });
        results.push(created);
      }
    }

    return NextResponse.json({ success: true, count: results.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { localId } = await request.json();
    if (!localId) return NextResponse.json({ error: "localId required" }, { status: 400 });
    await GeneratedReceipt.deleteOne({ localId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
