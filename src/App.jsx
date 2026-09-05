import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrainingPrograms from "./components/TrainingPrograms";
import DeviceVideoLibrary from "./components/DeviceVideoLibrary";
import ProjectsShowcase from "./components/ProjectsShowcase";
import Footer from "./components/Footer";
import { store } from "./lib/store";
import { TRAINING_PROGRAMS } from "./data/trainingPrograms";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    store.listRows("training_sessions").then(setSessions).catch(() => {});
    store.listRows("device_videos").then(setVideos).catch(() => {});
    store.listRows("projects").then(setProjects).catch(() => {});
  }, []);

  const sessionsByProgram = useMemo(() => {
    const grouped = {};
    for (const program of TRAINING_PROGRAMS) grouped[program.slug] = [];
    for (const s of sessions) {
      if (!grouped[s.program_slug]) grouped[s.program_slug] = [];
      grouped[s.program_slug].push(s);
    }
    return grouped;
  }, [sessions]);

  async function handleLogSession(program, form) {
    const row = await store.insertRow("training_sessions", {
      program_slug: program.slug,
      company_name: form.company_name,
      week_label: form.week_label,
      session_date: form.session_date,
      technicians_count: Number(form.technicians_count) || 0,
      description: form.description || "",
    });
    setSessions((prev) => [row, ...prev]);
  }

  async function handleAddVideo(form) {
    const row = await store.insertRow("device_videos", form);
    setVideos((prev) => [row, ...prev]);
  }

  async function handleAddProject(form) {
    const row = await store.insertRow("projects", form);
    setProjects((prev) => [row, ...prev]);
  }

  const stats = [
    { label: "Training programs", value: TRAINING_PROGRAMS.length },
    { label: "Sessions logged", value: sessions.length },
    { label: "Device tutorials", value: videos.length },
    { label: "Field projects", value: projects.length },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero stats={stats} />
      <TrainingPrograms sessionsByProgram={sessionsByProgram} onLogSession={handleLogSession} />
      <DeviceVideoLibrary videos={videos} onAddVideo={handleAddVideo} />
      <ProjectsShowcase projects={projects} onAddProject={handleAddProject} />
      <Footer />
    </div>
  );
}
