import React, { useState, useEffect } from 'react';

// --- ICONS (Inline to remove external dependencies) ---
const Play = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Pause = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const ArrowRight = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Share2 = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const Bookmark = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

// --- TYPES ---
// Defined based on Component B Strategy structure
export interface IssueContent {
  id: string;
  date: string;
  title: string;
  heroImage: string;
  thesis: {
    content: string;
    author: string;
  };
  signal: {
    studioName: string;
    location: string;
    tags: string[];
    images: string[];
    context: string;
    method: string;
    takeaway: string;
  };
  artifact: {
    name: string;
    creator: string;
    image: string;
    description: string;
    cta: string;
  };
}

// --- EMPTY STATE / PLACEHOLDERS ---
// Used to prevent crashes if no data is passed, while keeping the UI visible for dev
const EMPTY_CONTENT: IssueContent = {
  id: "000",
  date: "DD.MM.YYYY",
  title: "[Issue Title Here]",
  heroImage: "", // Use empty string or placeholder URL
  thesis: {
    content: "[Thesis Statement: A short, sharp essay defining the mood of the week.]",
    author: "Editorial Board"
  },
  signal: {
    studioName: "[Studio Name]",
    location: "[City, Country]",
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    images: ["", ""], // Placeholder slots for images
    context: "[The Context: Who the studio is and why they are relevant.]",
    method: "[The Method: Analysis of how they achieved the aesthetic.]",
    takeaway: "[The Takeaway: Specific insight for the user.]"
  },
  artifact: {
    name: "[Artifact Name]",
    creator: "[Creator/Brand]",
    image: "",
    description: "[The Ritual: Connection to the user's inner life.]",
    cta: "Acquire"
  }
};

const IssuePage = ({ data = EMPTY_CONTENT }: { data?: IssueContent }) => {
  const [scrolled, setScrolled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200">
      
      {/* --- NAVIGATION (Atmospheric) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 border-b border-neutral-100' : 'bg-transparent py-6 text-white'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 flex justify-between items-center">
          <div className="text-sm tracking-widest font-medium uppercase">
            The Interval <span className="opacity-50 mx-2">|</span> No. {data.id}
          </div>
          <div className="flex gap-6 items-center">
            <button className="hover:opacity-70 transition-opacity">
              <Share2 size={18} />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Bookmark size={18} />
            </button>
            <div className={`text-xs tracking-widest border px-3 py-1 rounded-full ${scrolled ? 'border-neutral-900' : 'border-white'}`}>
              SUBSCRIBER
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO HEADER (The Evidence) --- */}
      <header className="relative h-screen w-full overflow-hidden bg-neutral-900">
        <div className="absolute inset-0">
          {data.heroImage ? (
            <img 
              src={data.heroImage} 
              alt="Atmospheric Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
              <span className="tracking-widest uppercase text-xs">[Hero Image Placeholder]</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/30" /> {/* Scrim for text readability */}
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase mb-6 opacity-90 animate-fade-in-up">
            Issue {data.id} • {data.date}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-8 max-w-5xl leading-tight">
            {data.title}
          </h1>
          
          {/* Audio Artifact Interaction */}
          <button 
            onClick={() => setAudioPlaying(!audioPlaying)}
            className="flex items-center gap-3 text-xs md:text-sm tracking-widest border border-white/30 hover:bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full transition-all"
          >
            {audioPlaying ? <Pause size={14} /> : <Play size={14} />}
            {audioPlaying ? "PAUSE SOUNDSCAPE" : "PLAY SOUNDSCAPE"}
          </button>
        </div>

        <div className="absolute bottom-10 left-0 w-full flex justify-center animate-bounce duration-[2000ms]">
          <div className="w-[1px] h-16 bg-white/50"></div>
        </div>
      </header>

      {/* --- PILLAR I: THE THESIS (The Intellectual Context) --- */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-[1px] bg-neutral-900 mx-auto mb-12"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-neutral-800">
            "{data.thesis.content}"
          </h2>
          <div className="mt-12 text-xs font-bold tracking-widest uppercase text-neutral-500">
            — {data.thesis.author}
          </div>
        </div>
      </section>

      {/* --- PILLAR II: THE SIGNAL (The Cultural Intelligence) --- */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left: Forensic Images (Sticky on Desktop) */}
        <div className="bg-neutral-100 lg:sticky lg:top-0 lg:h-screen p-4 grid gap-4 content-center overflow-hidden">
          {data.signal.images.map((img, idx) => (
            <div key={idx} className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
              {img ? (
                <img 
                  src={img} 
                  alt={`Detail ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <span className="text-xs uppercase tracking-widest">[Image Slot {idx + 1}]</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: The Analysis */}
        <div className="bg-white p-8 md:p-20 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-8">
            {data.signal.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] uppercase tracking-widest rounded-sm">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-4xl font-serif mb-2">{data.signal.studioName}</h3>
          <p className="text-neutral-500 italic mb-12">{data.signal.location}</p>

          <div className="space-y-12 max-w-md">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-neutral-900 pl-3">The Context</h4>
              <p className="text-neutral-600 leading-relaxed font-light text-lg">
                {data.signal.context}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-neutral-900 pl-3">The Method</h4>
              <p className="text-neutral-600 leading-relaxed font-light text-lg">
                {data.signal.method}
              </p>
            </div>

            <div className="bg-neutral-50 p-6 border border-neutral-100">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-neutral-400">The Takeaway</h4>
              <p className="text-neutral-800 font-medium">
                {data.signal.takeaway}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PILLAR III: THE ARTIFACT (The Ritual Object) --- */}
      <section className="py-32 px-6 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            
            {/* The Totemic Image */}
            <div className="order-2 md:order-1 bg-white p-12 shadow-sm aspect-square flex items-center justify-center">
              {data.artifact.image ? (
                <img 
                  src={data.artifact.image} 
                  alt={data.artifact.name}
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              ) : (
                <span className="text-xs uppercase tracking-widest text-neutral-300">[Object Image]</span>
              )}
            </div>

            {/* The Museum Placard */}
            <div className="order-1 md:order-2">
              <div className="text-xs tracking-widest uppercase text-neutral-500 mb-6">
                Object No. 03 • {data.artifact.creator}
              </div>
              
              <h3 className="text-4xl font-serif mb-6 text-neutral-900">
                {data.artifact.name}
              </h3>
              
              <p className="text-neutral-600 leading-relaxed mb-8 text-lg font-light">
                {data.artifact.description}
              </p>

              <button className="group flex items-center gap-4 text-xs tracking-[0.2em] uppercase border-b border-neutral-900 pb-2 hover:opacity-60 transition-opacity">
                {data.artifact.cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-neutral-900 text-neutral-400 py-24 px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="text-white text-xl font-serif mb-6">The Interval</div>
            <p className="max-w-xs text-sm leading-relaxed opacity-60">
              A digital sanctuary for the psychographic elite. 
              The only 5 minutes of calm you need this week.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-xs tracking-widest uppercase">
            <ul className="space-y-4">
              <li className="text-white">Living Atlas</li>
              <li className="hover:text-white cursor-pointer transition-colors">By City</li>
              <li className="hover:text-white cursor-pointer transition-colors">By Mood</li>
              <li className="hover:text-white cursor-pointer transition-colors">Archive</li>
            </ul>
            <ul className="space-y-4">
              <li className="text-white">Account</li>
              <li className="hover:text-white cursor-pointer transition-colors">Membership</li>
              <li className="hover:text-white cursor-pointer transition-colors">Settings</li>
              <li className="hover:text-white cursor-pointer transition-colors">Log Out</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IssuePage;