"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface AdminImageInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function AdminImageInput({ value, onChange, label = "Image" }: AdminImageInputProps) {
  const [mode, setMode] = useState<"url" | "upload">(value ? "url" : "url");
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageError, setImageError] = useState(false);

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = () => {
    setImageError(false);
    if (urlInput && isValidUrl(urlInput)) {
      onChange(urlInput);
    } else if (urlInput) {
      setError("Please enter a valid image URL");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setError("");
    setImageError(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
        setUrlInput(data.url);
        setMode("url");
      } else {
        setError(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const hasImage = Boolean(value);

  return (
    <div className="space-y-3">
      {label && <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>}
      
      {hasImage && (
        <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
          <img src={value} alt="Preview" className="h-40 w-full object-cover" onError={() => setImageError(true)} />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      )}
      {imageError && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-center">
          <p className="text-sm font-medium text-red-400">Image failed to load. Please check the URL or try another image.</p>
          <button onClick={handleRemove} className="mt-2 text-sm text-red-300 underline">Remove image</button>
        </div>
      )}

      {!hasImage && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "url"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Use URL
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "upload"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Upload
            </button>
          </div>

          {mode === "url" && (
            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setError("");
                  setImageError(false);
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <Button onClick={handleUrlSubmit} disabled={!urlInput} variant="secondary">
                Add Image
              </Button>
            </div>
          )}

          {mode === "upload" && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="secondary"
              >
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
              <p className="text-xs text-slate-500">JPG, PNG, GIF, WebP up to 10MB</p>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      )}

      {hasImage && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "url"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Change URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "upload"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Upload New
          </button>
        </div>
      )}
    </div>
  );
}