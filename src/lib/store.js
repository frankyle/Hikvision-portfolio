import { supabase, supabaseReady } from "./supabase";

// In-memory fallback so the app is usable before Supabase is wired up.
const memory = {
  training_sessions: [],
  training_media: [],
  device_videos: [],
  projects: [],
  project_media: [],
};
let idCounter = 1;
const nextId = () => String(idCounter++);

async function listRows(table, filter) {
  if (supabaseReady) {
    let query = supabase.from(table).select("*").order("created_at", { ascending: false });
    if (filter) query = query.match(filter);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
  const rows = memory[table];
  return filter ? rows.filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v)) : rows;
}

async function insertRow(table, row) {
  if (supabaseReady) {
    const { data, error } = await supabase.from(table).insert(row).select().single();
    if (error) throw error;
    return data;
  }
  const record = { id: nextId(), created_at: new Date().toISOString(), ...row };
  memory[table].unshift(record);
  return record;
}

export const store = { listRows, insertRow };
