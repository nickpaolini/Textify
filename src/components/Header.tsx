import Link from "next/link";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-xl tracking-tight">
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