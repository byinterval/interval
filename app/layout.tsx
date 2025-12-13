import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import GlobalNavigation from './components/GlobalNavigation'; 
import "./globals.css";

// 1. Configure Typography
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
        
        {/* Navigation is the only header now */}
        <GlobalNavigation />

        {/* REMOVED: The static <header> block that contained "The Interval" title 
           has been deleted to prevent overlapping with the sticky navigation.
        */}

        {/* Padding top (pt-32) ensures content starts below the sticky nav */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 min-h-screen pt-32">
          {children}
        </main>
      </body>
    </html>
  );
}