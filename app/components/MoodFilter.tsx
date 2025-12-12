// app/components/MoodFilter.tsx
'use client';

const moods = ["Silence", "Texture", "Morning", "Patina", "Low Light"]; // Based on sensory tags [cite: 16, 181]

export default function MoodFilter() {
  return (
    <nav className="flex flex-wrap gap-4 border-y border-stone-200 py-6 my-8 justify-center">
      <span className="text-xs uppercase tracking-widest text-stone-400 w-full text-center mb-2">
        Filter by Atmospheric Mood 
      </span>
      {moods.map((mood) => (
        <button 
          key={mood}
          className="font-serif italic text-stone-600 hover:text-stone-900 transition-colors px-2"
        >
          {mood}
        </button>
      ))}
    </nav>
  );
}