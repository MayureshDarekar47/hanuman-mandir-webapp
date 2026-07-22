"use client";
import { useState, useRef } from "react";
import { Plus, Trash2, Music2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface SongRow {
  id: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  focusKeyword: string;
  metaDescription: string;
  file: File | null;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

interface Props {
  onSuccess?: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function MultiAartiUploadForm({ onSuccess }: Props) {
  const router = useRouter();
  const [songs, setSongs] = useState<SongRow[]>([
    { id: uid(), title: "", subtitle: "", seoTitle: "", focusKeyword: "", metaDescription: "", file: null, progress: 0, status: "idle" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [overallResult, setOverallResult] = useState<{
    success?: number;
    failed?: number;
    total?: number;
  } | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addSong = () => {
    setSongs(prev => [...prev, { id: uid(), title: "", subtitle: "", seoTitle: "", focusKeyword: "", metaDescription: "", file: null, progress: 0, status: "idle" }]);
  };

  const removeSong = (id: string) => {
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  const updateSong = (id: string, patch: Partial<SongRow>) => {
    setSongs(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    updateSong(id, { file: f, status: "idle", error: undefined, progress: 0 });
  };

  const handleUploadAll = async () => {
    const validSongs = songs.filter(s => s.title.trim() && s.file);
    if (validSongs.length === 0) {
      alert("Please add at least one song with a title and audio file.");
      return;
    }

    setUploading(true);
    setOverallResult(null);

    // Mark all valid as uploading
    setSongs(prev => prev.map(s =>
      s.title.trim() && s.file
        ? { ...s, status: "uploading", progress: 0 }
        : s
    ));

    const finalResults = await Promise.all(validSongs.map(async (song) => {
      try {
        // 1. Get presigned URL
        const presignRes = await fetch("/api/upload/aarti/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: song.file!.name })
        });
        const presignData = await presignRes.json();
        if (!presignRes.ok) throw new Error(presignData.error || "Failed to get upload URL");
        
        const { signedUrl, token, publicUrl } = presignData;
        
        // 2. Upload to Supabase Storage directly via XHR
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signedUrl);
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          
          if (song.file!.type) {
            xhr.setRequestHeader("Content-Type", song.file!.type);
          }
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              updateSong(song.id, { progress: pct });
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Direct upload failed: ${xhr.statusText}`));
            }
          };
          xhr.onerror = () => reject(new Error("Network error during direct upload"));
          xhr.send(song.file);
        });

        return { songId: song.id, success: true, title: song.title.trim(), subtitle: song.subtitle.trim(), audioUrl: publicUrl, seoTitle: song.seoTitle.trim() || null, focusKeyword: song.focusKeyword.trim() || null, metaDescription: song.metaDescription.trim() || null };
      } catch (err: any) {
        updateSong(song.id, { status: "error", error: err.message, progress: 0 });
        return { songId: song.id, success: false, error: err.message };
      }
    }));

    const successfulUploads = finalResults.filter(r => r.success);
    let metadataSaved = 0;

    if (successfulUploads.length > 0) {
      try {
        // 3. Save metadata via /api/upload/aarti
        const metaRes = await fetch("/api/upload/aarti", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songs: successfulUploads })
        });
        const metaData = await metaRes.json();
        
        if (metaRes.ok && metaData.success) {
          successfulUploads.forEach(r => updateSong(r.songId!, { status: "success", progress: 100 }));
          metadataSaved = successfulUploads.length;
        } else {
          successfulUploads.forEach(r => updateSong(r.songId!, { status: "error", error: metaData.error || "Failed to save metadata", progress: 0 }));
        }
      } catch (err: any) {
        successfulUploads.forEach(r => updateSong(r.songId!, { status: "error", error: "Failed to connect to server", progress: 0 }));
      }
    }

    const totalFailed = validSongs.length - metadataSaved;
    setOverallResult({ success: metadataSaved, failed: totalFailed, total: validSongs.length });
    
    if (metadataSaved > 0) {
      onSuccess?.();
      router.refresh();
    }
    
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Song rows */}
      <div className="space-y-3">
        {songs.map((song, idx) => (
          <div
            key={song.id}
            className={`border rounded-xl p-4 transition-all ${
              song.status === "success"
                ? "border-green-200 bg-green-50"
                : song.status === "error"
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                {song.status === "success" ? "✅" : song.status === "error" ? "❌" : idx + 1}
              </div>
              <span className="text-sm font-semibold text-gray-700">Song #{idx + 1}</span>
              {songs.length > 1 && song.status === "idle" && (
                <button
                  onClick={() => removeSong(song.id)}
                  className="ml-auto text-gray-300 hover:text-red-500 transition-colors"
                  aria-label="Remove song"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Song Title *"
                value={song.title}
                onChange={e => updateSong(song.id, { title: e.target.value })}
                disabled={uploading || song.status === "success"}
                className="p-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-50"
              />
              <input
                type="text"
                placeholder="Subtitle (optional)"
                value={song.subtitle}
                onChange={e => updateSong(song.id, { subtitle: e.target.value })}
                disabled={uploading || song.status === "success"}
                className="p-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-50"
              />
              <div className="sm:col-span-2">
                <input
                  ref={el => { fileRefs.current[song.id] = el; }}
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a,.flac"
                  onChange={e => handleFileChange(song.id, e)}
                  disabled={uploading || song.status === "success"}
                  className="w-full p-2 rounded-lg border border-gray-200 text-sm cursor-pointer
                    file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 
                    file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 
                    hover:file:bg-orange-200 bg-white disabled:bg-gray-50"
                />
                {song.file && (
                  <p className="text-xs text-gray-400 mt-1">
                    📁 {song.file.name} ({(song.file.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <details className="text-sm">
                  <summary className="cursor-pointer text-orange-600 font-semibold mb-2 select-none">SEO Settings (Optional)</summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-orange-50/60 rounded-xl border border-orange-100 mt-2">
                    <input
                      type="text"
                      placeholder="SEO Title"
                      value={song.seoTitle}
                      onChange={e => updateSong(song.id, { seoTitle: e.target.value })}
                      disabled={uploading || song.status === "success"}
                      className="p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-50"
                    />
                    <input
                      type="text"
                      placeholder="Focus Keyword"
                      value={song.focusKeyword}
                      onChange={e => updateSong(song.id, { focusKeyword: e.target.value })}
                      disabled={uploading || song.status === "success"}
                      className="p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-50"
                    />
                    <textarea
                      placeholder="Meta Description"
                      value={song.metaDescription}
                      onChange={e => updateSong(song.id, { metaDescription: e.target.value })}
                      disabled={uploading || song.status === "success"}
                      rows={2}
                      className="sm:col-span-2 p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-50 resize-none"
                    />
                  </div>
                </details>
              </div>
            </div>

            {/* Per-song progress */}
            {song.status === "uploading" && (
              <div className="mt-3 space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                    style={{ width: `${song.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">{song.progress}%</p>
              </div>
            )}

            {song.status === "error" && (
              <p className="mt-2 text-xs text-red-600 font-medium">❌ {song.error}</p>
            )}
            {song.status === "success" && (
              <p className="mt-2 text-xs text-green-700 font-medium">✅ Uploaded successfully</p>
            )}
          </div>
        ))}
      </div>

      {/* Add more + Upload buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={addSong}
          disabled={uploading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-orange-300 text-orange-600 hover:border-orange-500 hover:bg-orange-50 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Add Another Song
        </button>
        <button
          onClick={handleUploadAll}
          disabled={uploading || songs.every(s => !s.title.trim() || !s.file)}
          className="flex items-center justify-center gap-2 flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {uploading
            ? "Uploading…"
            : `Upload ${songs.filter(s => s.title.trim() && s.file).length} Song${songs.filter(s => s.title.trim() && s.file).length !== 1 ? "s" : ""}`}
        </button>
      </div>

      {/* Overall result */}
      {overallResult && (
        <div className={`p-4 rounded-xl border font-medium text-sm ${
          overallResult.failed === 0
            ? "bg-green-50 border-green-200 text-green-800"
            : overallResult.success === 0
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-yellow-50 border-yellow-200 text-yellow-800"
        }`}>
          {overallResult.failed === 0
            ? `✅ All ${overallResult.success} song${overallResult.success !== 1 ? "s" : ""} uploaded successfully!`
            : overallResult.success === 0
            ? `❌ All ${overallResult.total} uploads failed. Check errors above.`
            : `⚠️ ${overallResult.success} uploaded, ${overallResult.failed} failed. Check errors above.`}
        </div>
      )}
    </div>
  );
}
