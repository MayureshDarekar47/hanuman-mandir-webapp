"use client";
import { useState, useRef } from "react";

interface UploadResult {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  message: string;
}

interface Props {
  onSuccess?: () => void;
}

const TABS = ["CSV", "Excel", "PDF"] as const;
type Tab = (typeof TABS)[number];

type ParsedPreview = {
  date: string;
  category: string;
  amount: number;
  remark?: string;
}[];

export default function SevaUploadForm({ onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("CSV");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult>({ progress: 0, status: "idle", message: "" });
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptMap: Record<Tab, string> = {
    CSV: ".csv,text/csv",
    Excel: ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
    PDF: ".pdf,application/pdf",
  };

  const [pdfYear, setPdfYear] = useState<number>(new Date().getFullYear());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult({ progress: 0, status: "idle", message: "" });
    setPreview(null);
    setDownloadUrl(null);
  };

  const handleUpload = () => {
    if (!file) return;
    if (activeTab === "PDF" && !pdfYear) {
      setResult({ progress: 0, status: "error", message: "Please select a year for the PDF." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (activeTab === "PDF") {
      formData.append("year", pdfYear.toString());
    }

    setResult({ progress: 0, status: "uploading", message: "Uploading..." });
    setPreview(null);
    setDownloadUrl(null);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/seva-file");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setResult({ progress: pct, status: "uploading", message: `Uploading… ${pct}%` });
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          setResult({ progress: 100, status: "success", message: data.message || "Import successful!" });
          if (data.preview) setPreview(data.preview);
          if (data.downloadUrl) setDownloadUrl(data.downloadUrl);
          if (fileRef.current) fileRef.current.value = "";
          setFile(null);
          onSuccess?.();
          // Reload to show new data only if records were actually imported
          if (data.count && data.count > 0) {
            setTimeout(() => window.location.reload(), 1500);
          }
        } else {
          setResult({ progress: 0, status: "error", message: data.error || "Upload failed" });
        }
      } catch {
        setResult({ progress: 0, status: "error", message: "Server error. Please try again." });
      }
    };

    xhr.onerror = () => {
      setResult({ progress: 0, status: "error", message: "Network error. Check your connection." });
    };

    xhr.send(formData);
  };

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFile(null);
              setResult({ progress: 0, status: "idle", message: "" });
              setPreview(null);
              setDownloadUrl(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-white text-orange-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "CSV" && "📄 "}
            {tab === "Excel" && "📊 "}
            {tab === "PDF" && "📑 "}
            {tab}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
        {activeTab === "PDF" ? (
          <span>PDF will be stored for download. If it contains parsable text with seva data, records will also be imported automatically.</span>
        ) : (
          <span>
            Column order: <code className="bg-gray-200 px-1 rounded">Date (dd/mm/yyyy), Category, Amount, Remark</code> — first row is header and will be skipped.
          </span>
        )}
      </div>

      {/* File input */}
      <div className="flex flex-col sm:flex-row gap-3">
        {activeTab === "PDF" && (
          <div className="w-full sm:w-32 flex-shrink-0">
            <input
              type="number"
              value={pdfYear}
              onChange={(e) => setPdfYear(parseInt(e.target.value))}
              placeholder="Year"
              required
              min="2000"
              max="2100"
              className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={acceptMap[activeTab]}
          onChange={handleFileChange}
          className="flex-1 p-3 rounded-xl border border-gray-200 bg-white text-sm
            file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 
            file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 
            hover:file:bg-orange-200 cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={!file || result.status === "uploading"}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 
            text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors 
            shadow-sm whitespace-nowrap disabled:cursor-not-allowed flex-shrink-0"
        >
          {result.status === "uploading" ? "Uploading…" : `Import ${activeTab}`}
        </button>
      </div>

      {/* Progress bar */}
      {result.status === "uploading" && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{ width: `${result.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">{result.progress}%</p>
        </div>
      )}

      {/* Status message */}
      {result.status === "success" && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <span className="text-green-600 text-lg">✅</span>
          <div>
            <p className="text-sm font-semibold text-green-800">{result.message}</p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-orange-600 hover:text-orange-800 underline"
              >
                📥 Download Original PDF
              </a>
            )}
          </div>
        </div>
      )}

      {result.status === "error" && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-500 text-lg">❌</span>
          <p className="text-sm font-semibold text-red-700">{result.message}</p>
        </div>
      )}

      {/* Preview table */}
      {preview && preview.length > 0 && (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 bg-gray-50 border-b border-gray-100">
            Preview (first {preview.length} records)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Date", "Category", "Amount (₹)", "Remark"].map(h => (
                    <th key={h} className="py-2 px-4 text-gray-400 uppercase tracking-wider font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-orange-50/30">
                    <td className="py-2 px-4 text-gray-500">{row.date ? new Date(row.date).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="py-2 px-4 font-semibold text-gray-800">{row.category}</td>
                    <td className="py-2 px-4 text-red-700 font-bold">₹{Number(row.amount).toLocaleString("en-IN")}</td>
                    <td className="py-2 px-4 text-gray-400">{row.remark || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
