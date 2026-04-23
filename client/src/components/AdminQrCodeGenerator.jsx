import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function AdminQrCodeGenerator() {
  const [url, setUrl] = useState("https://echochic.org/cleanup/neighborhood");
  const [fileName, setFileName] = useState("cleanup-neighborhood-qr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");

  const handleGenerateAndDownload = async () => {
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/qr-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url.trim(),
          fileName: fileName.trim() || "cleanup-qr"
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to generate QR code");
      }

      const qrBlob = await response.blob();
      const objectUrl = URL.createObjectURL(qrBlob);
      setPreviewSrc((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return objectUrl;
      });

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${(fileName.trim() || "cleanup-qr").replace(/\s+/g, "-")}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800">QR Code Generator</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste any product or cleanup URL and download a printable QR code.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Target URL</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://echochic.org/cleanup/your-area"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">File name</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            type="text"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            placeholder="cleanup-qr"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateAndDownload}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Generating..." : "Generate & Download QR"}
        </button>
      </div>

      {previewSrc ? (
        <div className="mt-5 inline-block rounded-xl border border-slate-200 bg-slate-50 p-3">
          <img
            src={previewSrc}
            alt="Generated QR code preview"
            className="h-40 w-40 rounded-md bg-white object-contain"
          />
        </div>
      ) : null}
    </section>
  );
}
