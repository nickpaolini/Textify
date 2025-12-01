import './globals.css';
import { type ReactNode } from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';
import { ToastProvider } from '../components/ui/toast';

export const metadata = {
  title: 'Textify',
  description: 'AI-powered text transformation tool',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
