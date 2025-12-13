import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";

// 1. Configure Typography (Proxies for Brown & Atlas Grotesk)
const serif = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Interval | Digital Sanctuary",
  description: "The definitive edit of the global season.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} bg-primary-bg text-brand-ink antialiased`}>
        {/* Header: Clean, Minimal, Accent Brown Title */}
        <header className="py-12 px-6 text-center border-b border-secondary-bg/50">
          <h1 className="font-serif-title text-5xl tracking-tight text-accent-brown">
            The Interval
          </h1>
        </header>

        {/* Main: Generous whitespace (>15%) per UI Strategy */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}