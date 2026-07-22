"use client";
import { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onSuccess?: () => void;
}

export default function GalleryUploadForm({ onSuccess }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setStatus("idle");
    setMessage("");
    setProgress(0);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    setStatus("uploading");
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/gallery");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          setStatus("success");
          setProgress(100);
          setMessage("Image uploaded successfully!");
          setFile(null);
          setPreview(null);
          if (fileRef.current) fileRef.current.value = "";
          onSuccess?.();
          router.refresh();
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview */}
        {preview && (
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-orange-200 flex-shrink-0 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        {!preview && (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-orange-200 flex items-center justify-center text-gray-300 flex-shrink-0 bg-orange-50">
            <ImageIcon size={28} />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={status === "uploading"}
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm cursor-pointer
              file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 
              file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 
              hover:file:bg-orange-200 disabled:opacity-50"
          />
          {file && (
            <p className="text-xs text-gray-400">
              📁 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading"}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 
              text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm 
              disabled:cursor-not-allowed"
          >
            <Upload size={15} />
            {status === "uploading" ? `Uploading… ${progress}%` : "Upload Image"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
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

      {/* Status */}
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
