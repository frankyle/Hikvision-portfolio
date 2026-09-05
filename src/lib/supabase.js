import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && anonKey);

// When env vars aren't set yet, we export a null client instead of crashing
// the whole app — components check `supabaseReady` before calling it.
export const supabase = supabaseReady ? createClient(url, anonKey) : null;

export const BUCKETS = {
  training: "training-media",
  deviceVideos: "device-videos",
  projects: "project-media",
};

/**
 * Uploads a file to a bucket and returns its public URL.
 * folder e.g. "cctv-audio/2026-09-week1"
 */
export async function uploadFile(bucket, folder, file) {
  if (!supabaseReady) throw new Error("Supabase is not configured yet.");
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${cleanName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Reads a video's duration (seconds) client-side before upload, for validation. */
export function readVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error("Could not read video file."));
    video.src = URL.createObjectURL(file);
  });
}
