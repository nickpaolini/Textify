import Link from "next/link";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/about", label: "About" },
];

const TextifyIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 7h18M3 12h18M3 17h18"/>
    <circle cx="4" cy="4" r="1"/>
    <circle cx="4" cy="20" r="1"/>
    <circle cx="20" cy="4" r="1"/>
    <circle cx="20" cy="20" r="1"/>
  </svg>
);

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          <TextifyIcon />
          Textify
        </Link>
        <nav className="flex gap-2 items-center">
          {navLinks.map((link) => (
            <Button
              asChild
              key={link.href}
              variant="ghost"
              className="text-base font-medium hover:bg-accent/60 transition"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
} 