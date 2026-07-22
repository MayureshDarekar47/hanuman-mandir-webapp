"use client";
import { Download } from "lucide-react";

interface CsvDownloadButtonProps {
  data: Record<string, string | number | null | undefined>[];
  filename: string;
  disabled?: boolean;
}

export default function CsvDownloadButton({ data, filename, disabled }: CsvDownloadButtonProps) {
  const handleDownload = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => {
        const val = row[h] ?? "";
        const str = String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !data || data.length === 0}
      className="flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-green-100"
    >
      <Download size={14} />
      Download CSV
    </button>
  );
}
