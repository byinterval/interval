// app/atlas/page.tsx
import CalmEntry from '@/app/components/CalmEntry';
import { Playfair_Display } from 'next/font/google'; // Import the font for consistency

const serif = Playfair_Display({ subsets: ['latin'] });

export default function LivingAtlas() {
  return (
    <CalmEntry>
      <div className={`${serif.className} space-y-8`}>
        <h1 className="text-4xl font-serif tracking-tight">The Living Atlas</h1>
        <p className="text-xl text-stone-600">
          Welcome, Curator. You have successfully entered the Sanctuary. 
          Here, you can use the Atmospheric Search to filter by Moods like Silence and Patina.
        </p>
        
        {/* Placeholder for the actual Atlas functionality */}
        <section className="bg-white p-8 border border-stone-200 mt-12">
            <h2 className="text-2xl font-serif mb-4">Dynamic Field Guides:</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
                <li>The Solitude Collection (Filtered by 'Silence') [cite: 177]</li>
                <li>Interval: Tokyo Archive (Filtered by Geo-tag) [cite: 91, 176]</li>
                <li>Latest Signal Profiles...</li>
            </ul>
        </section>
      </div>
    </CalmEntry>
  );
}