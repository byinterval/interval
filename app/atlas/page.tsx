import CalmEntry from '../components/CalmEntry';
import MoodFilter from '../components/MoodFilter';
import SignalCard from '../components/SignalCard';
import ArtifactVault from '../components/ArtifactVault';

// Mock Data simulating "The Brain" (Sanity)
// We vary the height class to create the visual rhythm (Masonry)
// UPDATE: Added 'image' property to satisfy the updated SignalCard interface
const signals = [
  { 
    studio: "Studio O", 
    title: "Light as Material", 
    mood: "Low Light", 
    height: "aspect-[3/4]",
    image: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800&auto=format&fit=crop" // Placeholder architectural image
  },
  { 
    studio: "Ryokan Z", 
    title: "The Acoustics of Tatami", 
    mood: "Silence", 
    height: "aspect-square",
    image: "https://images.unsplash.com/photo-1598337633293-189f76f7f631?q=80&w=800&auto=format&fit=crop"
  },
  { 
    studio: "Atelier V", 
    title: "Concrete Patina", 
    mood: "Texture", 
    height: "aspect-[4/5]",
    image: "https://images.unsplash.com/photo-1516962080544-e1163c804e15?q=80&w=800&auto=format&fit=crop"
  },
  { 
    studio: "Cafe K", 
    title: "Rainy Day Architecture", 
    mood: "Rain", 
    height: "aspect-[3/4]",
    image: "https://images.unsplash.com/photo-1515266591878-5a1408089456?q=80&w=800&auto=format&fit=crop"
  },
  { 
    studio: "House N", 
    title: "Morning Light Study", 
    mood: "Morning", 
    height: "aspect-square",
    image: "https://images.unsplash.com/photo-1595844730298-b96053705296?q=80&w=800&auto=format&fit=crop"
  },
  { 
    studio: "Gallery X", 
    title: "Void Space", 
    mood: "Silence", 
    height: "aspect-[4/5]",
    image: "https://images.unsplash.com/photo-1493723843689-d205189326e5?q=80&w=800&auto=format&fit=crop"
  },
];

export default function AtlasPage() {
  return (
    <CalmEntry>
      {/* 1. Hero Header */}
      <div className="text-center mb-20 md:mb-32 pt-12">
        <h1 className="font-serif-title text-5xl md:text-7xl text-brand-ink mb-6 tracking-tight">
          The Living Atlas
        </h1>
        <p className="font-sans-body text-accent-brown/80 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          A permanent library of taste. Filter the archive by atmospheric mood to unblock your creativity.
        </p>
      </div>

      {/* 2. Sticky Navigation (Mood Selector) */}
      <div className="sticky top-0 bg-primary-bg/95 backdrop-blur-md z-40 py-6 mb-16 border-b border-secondary-bg transition-all">
        <MoodFilter />
      </div>

      {/* 3. The Signal Grid (Masonry Layout) */}
      {/* Tailwind's 'columns' utility creates the Masonry flow automatically */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {signals.map((signal, i) => (
          <SignalCard 
            key={i}
            studio={signal.studio}
            title={signal.title}
            mood={signal.mood}
            image={signal.image} // Pass the image prop here
            heightClass={signal.height}
          />
        ))}
      </div>

      {/* 4. The Artifact Vault */}
      <ArtifactVault />
    </CalmEntry>
  );
}