export default function Footer() {
  return (
    <footer className="w-full border-t border-border py-4 bg-background/80 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Textify. All rights reserved.
      <span className="mx-2">|</span>
      <a
        href="#"
        className="underline hover:text-primary"
        tabIndex={0}
        aria-label="Privacy Policy"
      >
        Privacy Policy
      </a>
      <span className="mx-2">|</span>
      <a
        href="#"
        className="underline hover:text-primary"
        tabIndex={0}
        aria-label="Terms of Service"
      >
        Terms of Service
      </a>
    </footer>
  );
} 