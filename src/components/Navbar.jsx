const LINKS = [
  { href: "#programs", label: "Training Programs" },
  { href: "#library", label: "Device Library" },
  { href: "#projects", label: "Field Projects" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#0b0e11]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-xl tracking-wide text-ink">
          Field Training Desk
        </a>
        <nav className="hidden md:flex gap-8 font-body text-sm text-mute">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-amber transition-colors focus-ring">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
