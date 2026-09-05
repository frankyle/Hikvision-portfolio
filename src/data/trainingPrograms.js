// The five recurring training programs, in the order Frank delivers them.
// `slug` is used as the storage folder prefix and Supabase filter key.
export const TRAINING_PROGRAMS = [
  {
    id: 1,
    slug: "cctv-audio",
    name: "CCTV Camera & Audio Systems",
    covers: ["Hik-ProConnect", "Turbo HD / IP camera lineup", "Audio & alarm accessories"],
  },
  {
    id: 2,
    slug: "access-intercom",
    name: "Access Control & Video Intercom",
    covers: ["Access control controllers", "Video intercom", "Hik-Connect"],
  },
  {
    id: 3,
    slug: "gate-motor-energizer",
    name: "Gate Motor, Energizer & AX Pro",
    covers: ["Gate motor installation", "Electric fence energizers", "AX Pro alarm panel"],
  },
  {
    id: 4,
    slug: "networking",
    name: "Networking Fundamentals",
    covers: ["OSI model", "VLANs & IP addressing", "Switch types & PoE"],
  },
  {
    id: 5,
    slug: "fire-alarm",
    name: "Fire Alarm Systems",
    covers: ["Detectors & call points", "Control panels", "Zoning & wiring practice"],
  },
];

// The three photo slots Frank captures per session, plus one video slot.
export const SESSION_MEDIA_SLOTS = [
  { key: "classroom", label: "Classroom teaching", type: "image" },
  { key: "practical", label: "Practical / hands-on", type: "image" },
  { key: "group_photo", label: "Group photo with banner", type: "image" },
  { key: "session_video", label: "Training session clip", type: "video", maxSeconds: 60 },
];
