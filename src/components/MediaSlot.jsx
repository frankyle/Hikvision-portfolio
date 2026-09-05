import { useRef, useState } from "react";
import { uploadFile, readVideoDuration, supabaseReady } from "../lib/supabase";

/**
 * A single labeled upload slot (one photo, or one video with a duration cap).
 * Renders a thumbnail once media is attached, and reports the public URL
 * back up via onUploaded(key, url).
 */
export default function MediaSlot({ bucket, folder, slot, existingUrl, onUploaded }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | checking | uploading | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState(existingUrl || null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");

    if (slot.type === "video" && slot.maxSeconds) {
      setStatus("checking");
      try {
        const duration = await readVideoDuration(file);
        if (duration > slot.maxSeconds) {
          setStatus("error");
          setErrorMsg(
            `This clip is ${Math.round(duration)}s. ${slot.label} must be ${slot.maxSeconds}s or under.`
          );
          return;
        }
      } catch {
        // If duration can't be read, let it through — server-side checks can catch it later.
      }
    }

    if (!supabaseReady) {
      setStatus("error");
      setErrorMsg("Storage isn't connected yet — add Supabase keys in .env (see README).");
      return;
    }

    setStatus("uploading");
    try {
      const url = await uploadFile(bucket, folder, file);
      setPreviewUrl(url);
      setStatus("done");
      onUploaded?.(slot.key, url);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Upload failed.");
    }
  }

  return (
    <div className="border border-line bg-panel2 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-mute font-body">{slot.label}</span>
        {slot.type === "video" && slot.maxSeconds && (
          <span className="text-xs font-mono text-mute">≤ {slot.maxSeconds}s</span>
        )}
      </div>

      <div className="aspect-video bg-panel border border-line flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          slot.type === "video" ? (
            <video src={previewUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img src={previewUrl} alt={slot.label} className="w-full h-full object-cover" />
          )
        ) : (
          <span className="text-xs text-mute font-mono">empty</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "checking" || status === "uploading"}
        className="focus-ring text-sm border border-line px-3 py-1.5 text-ink hover:border-amber hover:text-amber transition-colors disabled:opacity-50"
      >
        {status === "uploading"
          ? "Uploading…"
          : status === "checking"
          ? "Checking clip…"
          : previewUrl
          ? "Replace"
          : "Attach file"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={slot.type === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={handleFile}
      />

      {status === "error" && <p className="text-xs text-amber">{errorMsg}</p>}
    </div>
  );
}
