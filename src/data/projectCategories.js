export const PROJECT_CATEGORIES = [
  { id: "cctv", label: "CCTV Camera Installation" },
  { id: "gate-motor", label: "Gate Motor Installation" },
  { id: "electric-fence-access", label: "Electric Fence & Access Control" },
  { id: "fire-alarm", label: "Fire Alarm System" },
];

// 4 images + 1 short clip per project, matching Frank's brief.
export const PROJECT_MEDIA_SLOTS = [
  { key: "shot_1", label: "Site photo 1", type: "image" },
  { key: "shot_2", label: "Site photo 2", type: "image" },
  { key: "shot_3", label: "Site photo 3", type: "image" },
  { key: "shot_4", label: "Site photo 4", type: "image" },
  { key: "project_video", label: "Project walkthrough clip", type: "video", maxSeconds: 60 },
];
