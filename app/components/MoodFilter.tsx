'use client';

const moods = ["Silence", "Texture", "Morning", "Patina", "Low Light"];

export default function MoodFilter() {
  return (
    <nav className="flex flex-col items-center justify-center space-y-6 py-12">
      <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown/70">
        Filter the Archive by Atmospheric Mood
      </span>
      
      <div className="flex flex-wrap justify-center gap-3">
        {moods.map((mood) => (
          <button 
            key={mood}
            className="font-sans-body text-xs uppercase tracking-wide 
                       text-accent-brown bg-transparent border border-accent-brown/30
                       px-5 py-2 rounded-full
                       hover:bg-accent-brown hover:text-primary-bg hover:border-accent-brown
                       transition-all duration-300 ease-out"
          >
            {mood}
          </button>
        ))}
      </div>
    </nav>
  );
}