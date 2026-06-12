"use client";

import { useRef, useState, useEffect } from "react";
import type { SignatureData } from "@/types";

interface SignaturePadProps {
  onSave: (signature: { method: "draw" | "type" | "upload"; data: string; signedBy: string }) => void;
  busy?: boolean;
  defaultName?: string;
}

export function SignaturePad({ onSave, busy, defaultName = "" }: SignaturePadProps) {
  const [method, setMethod] = useState<"draw" | "type" | "upload">("draw");
  const [signedBy, setSignedBy] = useState(defaultName);
  const [typed, setTyped] = useState("");
  const [uploadData, setUploadData] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
  }, [method]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasDrawn.current = true;
  }

  function end() {
    drawing.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadData(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!signedBy.trim()) return alert("Please enter your full name.");
    let data = "";
    if (method === "draw") {
      if (!hasDrawn.current) return alert("Please draw your signature.");
      data = canvasRef.current!.toDataURL("image/png");
    } else if (method === "type") {
      if (!typed.trim()) return alert("Please type your signature.");
      data = typed.trim();
    } else {
      if (!uploadData) return alert("Please upload a signature image.");
      data = uploadData;
    }
    onSave({ method, data, signedBy: signedBy.trim() });
  }

  const tabs: Array<{ key: typeof method; label: string }> = [
    { key: "draw", label: "Draw" },
    { key: "type", label: "Type" },
    { key: "upload", label: "Upload" }
  ];

  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="mb-3 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setMethod(t.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              method === t.key
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {method === "draw" && (
        <div>
          <canvas
            ref={canvasRef}
            width={460}
            height={150}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="w-full touch-none rounded-xl border border-dashed border-slate-300 bg-white dark:border-slate-600"
          />
          <button type="button" onClick={clearCanvas} className="mt-2 text-xs text-slate-500 underline">
            Clear
          </button>
        </div>
      )}

      {method === "type" && (
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Type your signature"
          className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-2xl text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          style={{ fontFamily: "cursive" }}
        />
      )}

      {method === "upload" && (
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm text-slate-600 dark:text-slate-300" />
          {uploadData && <img src={uploadData} alt="Signature preview" className="mt-2 h-20 rounded border border-slate-200 bg-white object-contain p-1" />}
        </div>
      )}

      <input
        value={signedBy}
        onChange={(e) => setSignedBy(e.target.value)}
        placeholder="Full name of signatory"
        className="mt-3 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {busy ? "Saving..." : "Save signature"}
      </button>
    </div>
  );
}

export function SignaturePreview({ signature }: { signature?: SignatureData | null }) {
  if (!signature || !signature.signedAt) return <span className="text-slate-400">Not signed</span>;
  return (
    <div className="flex items-center gap-3">
      {signature.method === "type" ? (
        <span className="text-xl text-slate-900 dark:text-white" style={{ fontFamily: "cursive" }}>{signature.data}</span>
      ) : (
        <img src={signature.data} alt="Signature" className="h-12 rounded bg-white object-contain p-1" />
      )}
      <div className="text-xs text-slate-500">
        <div>{signature.signedBy}</div>
        <div>{new Date(signature.signedAt).toLocaleString("en-ZA")}</div>
      </div>
    </div>
  );
}
