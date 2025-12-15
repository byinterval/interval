import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import GlobalNavigation from './components/GlobalNavigation'; 
import Script from 'next/script'; // Import Script component
import "./globals.css";

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
        {/* Load Memberful Script */}
        <Script 
          src="https://d15k2d11r6t6rl.cloudfront.net/public/users/integrations/memberful.js" 
          strategy="afterInteractive"
          data-memberful-site="https://theinterval.memberful.com" // REPLACE THIS
        />
        
        <GlobalNavigation />

        <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 min-h-screen pt-32">
          {children}
        </main>
      </body>
    </html>
  );
}