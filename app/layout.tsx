// app/layout.tsx
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

// High-readability serif for the "Intellectual Context" 
const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'The Interval | A Digital Sanctuary',
  description: 'The definitive edit of the global season.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* "Calm" background and high-fidelity typography [cite: 35, 76] */}
      <body className={`${serif.variable} ${sans.variable} bg-[#F9F7F2] text-stone-900 antialiased`}>
        <header className="py-12 px-6 text-center">
          <h1 className="font-serif text-3xl tracking-tight">The Interval</h1>
        </header>
        {/* Generous whitespace (max-width 3xl) to focus the eye  */}
        <main className="max-w-3xl mx-auto px-6 pb-24">
          {children}
        </main>
      </body>
    </html>
  )
}