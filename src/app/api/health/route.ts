import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const dynamic = "force-dynamic";

/**
 * PUBLIC diagnostics — reports configuration status WITHOUT exposing any
 * secret values (only booleans + the non-sensitive NEXTAUTH_URL). Use it to
 * confirm the deployment is wired up, then it can be removed.
 *
 * Visit: /api/health
 */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))
  ]);
}

export async function GET() {
  const env = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
    NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "(not set)",
    GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
    GROK_API_KEY: Boolean(process.env.GROK_API_KEY)
  };

  let database: { connected: boolean; adminAccounts: number | null; error: string | null } = {
    connected: false,
    adminAccounts: null,
    error: null
  };

  try {
    await withTimeout(connectToDatabase(), 8000);
    const count = await withTimeout<number>(Admin.countDocuments() as Promise<number>, 8000);
    database = { connected: mongoose.connection.readyState === 1, adminAccounts: Number(count), error: null };
  } catch (e: any) {
    database = { connected: false, adminAccounts: null, error: e?.message || "connection failed" };
  }

  const ready =
    env.MONGODB_URI &&
    env.NEXTAUTH_SECRET &&
    env.NEXTAUTH_URL !== "(not set)" &&
    database.connected &&
    (database.adminAccounts || 0) > 0;

  return NextResponse.json({
    status: ready ? "ok" : "needs-attention",
    timestamp: new Date().toISOString(),
    env,
    database,
    hints: [
      !env.MONGODB_URI && "Set MONGODB_URI in Vercel env vars.",
      !env.NEXTAUTH_SECRET && "Set NEXTAUTH_SECRET in Vercel env vars.",
      env.NEXTAUTH_URL === "(not set)" && "Set NEXTAUTH_URL to the exact domain you visit.",
      !database.connected && "Database not reachable — check MONGODB_URI and add 0.0.0.0/0 in Atlas Network Access.",
      database.connected && (database.adminAccounts || 0) === 0 && "No admin account — POST /api/admin/setup to create one."
    ].filter(Boolean)
  });
}
