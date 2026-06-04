"use client";

import { useState } from "react";
import { normalizeChild } from "@/lib/defaults";
import type { Child } from "@/lib/types";

interface DownloadPdfButtonProps {
  childList: Child[];
  className?: string;
}

export function DownloadPdfButton({
  childList,
  className = "",
}: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const { generateEstimatePdf } = await import("@/lib/generateEstimatePdf");
      await generateEstimatePdf(childList.map(normalizeChild));
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Could not generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className={
          className ||
          "flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 disabled:cursor-wait disabled:opacity-70"
        }
      >
        <DownloadIcon />
        {loading ? "Generating PDF…" : "Download PDF Estimate"}
      </button>
      {error && (
        <p className="text-center text-xs text-red-200" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3"
      />
    </svg>
  );
}
