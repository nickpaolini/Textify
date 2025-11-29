import Link from 'next/link';

import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';

const navLinks = [
  { href: '/history', label: 'History' },
  { href: '/about', label: 'About' },
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
    <path d="M3 7h18M3 12h18M3 17h18" />
    <circle cx="4" cy="4" r="1" />
    <circle cx="4" cy="20" r="1" />
    <circle cx="20" cy="4" r="1" />
    <circle cx="20" cy="20" r="1" />
  </svg>
);

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <div className="p-1 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <TextifyIcon />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Textify
          </span>
        </Link>
        <nav className="flex gap-1 items-center">
          {navLinks.map((link) => (
            <Button
              asChild
              key={link.href}
              variant="ghost"
              className="text-base font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 transition-all duration-200 relative group"
            >
              <Link href={link.href}>
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </Button>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
