'use client';

interface MoodFilterProps {
  moods: string[];
  activeMood: string | null;
  onMoodSelect: (mood: string) => void;
}

export default function MoodFilter({ moods, activeMood, onMoodSelect }: MoodFilterProps) {
  // Guard clause: If moods is undefined or null, fallback to empty array to prevent crash
  const safeMoods = moods || [];

  // DEBUG: Log the received moods to the console to verify data flow
  console.log("MoodFilter Rendered. Received moods:", safeMoods);

  return (
    <nav className="w-full flex flex-col items-center justify-center space-y-6 py-12">
      <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown/70 transition-opacity duration-500">
        Filter the Archive by Atmospheric Mood
      </span>
      
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl w-full mx-auto px-6">
        {safeMoods.length > 0 ? (
          safeMoods.map((mood) => {
            const isActive = activeMood === mood;
            return (
              <button 
                key={mood}
                onClick={() => onMoodSelect(mood)}
                className={`
                  font-sans-body text-xs uppercase tracking-wide 
                  px-6 py-3 rounded-full border border-accent-brown/20
                  transition-all duration-500 ease-out
                  ${isActive 
                    ? "bg-brand-ink text-primary-bg border-brand-ink scale-105" 
                    : "bg-transparent text-accent-brown hover:border-accent-brown hover:bg-accent-brown/5"
                  }
                `}
              >
                {mood}
              </button>
            );
          })
        ) : (
          <p className="text-xs text-accent-brown/40 italic">Add Moods in Sanity Studio to see filters.</p>
        )}
        
        {/* Reset Button */}
        <button
          onClick={() => onMoodSelect("")}
          className={`
            font-sans-body text-xs uppercase tracking-wide px-4 py-3 
            text-accent-brown/50 hover:text-accent-brown underline decoration-1 underline-offset-4
            transition-opacity duration-500
            ${activeMood ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
        >
          Reset View
        </button>
      </div>
    </nav>
  );
}