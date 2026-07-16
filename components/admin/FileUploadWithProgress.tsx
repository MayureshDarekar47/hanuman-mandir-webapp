"use client";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface Props {
  endpoint: string; // API route
  fieldName?: string; // form field name (default: "image")
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  onSuccess?: () => void;
}

export default function FileUploadWithProgress({
  endpoint,
  fieldName = "image",
  accept = "image/*",
  maxSizeMB = 10,
  label = "Upload File",
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > maxSizeMB * 1024 * 1024) {
      setStatus("error");
      setMessage(`File must be under ${maxSizeMB}MB`);
      return;
    }
    setFile(f);
    setStatus("idle");
    setMessage("");
    setProgress(0);
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append(fieldName, file);

    setStatus("uploading");
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if ((xhr.status >= 200 && xhr.status < 300) && (data.success || !data.error)) {
          setStatus("success");
          setProgress(100);
          setMessage("Upload successful!");
          setFile(null);
          if (fileRef.current) fileRef.current.value = "";
          onSuccess?.();
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setStatus("error");
          setMessage(data.error || "Upload failed");
        }
      } catch {
        setStatus("error");
        setMessage("Server error. Please try again.");
      }
    };

    xhr.onerror = () => {
      setStatus("error");
      setMessage("Network error. Check your connection.");
    };

    xhr.send(formData);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={status === "uploading"}
          className="flex-1 p-2.5 rounded-xl border border-gray-200 bg-white text-sm cursor-pointer
            file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 
            file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 
            hover:file:bg-orange-200 disabled:opacity-50"
        />
        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading"}
          className="flex items-center gap-2 justify-center bg-orange-600 hover:bg-orange-700 
            disabled:bg-orange-300 text-white px-5 py-2.5 rounded-xl font-bold text-sm 
            transition-colors shadow-sm disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Upload size={15} />
          {status === "uploading" ? `${progress}%` : label}
        </button>
      </div>

      {status === "uploading" && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">{progress}%</p>
        </div>
      )}

      {status === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-800">
          ✅ {message}
        </div>
      )}
      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-700">
          ❌ {message}
        </div>
      )}
    </div>
  );
}
