import { client } from "@/lib/sanity";
import CalmEntry from './components/CalmEntry';
import HomepageFilter from './components/HomepageFilter';
import ArtifactButton from './components/ArtifactButton';

async function getMoods() {
  // Safe fetch that works even if backend is empty
  try {
    return await client.fetch(`*[_type == "mood"]{title}`);
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const moods = await getMoods();

  return (
    <CalmEntry>
      {/* 1. The Thesis (Centered, Intellectual Context) */}
      <section className="text-center max-w-2xl mx-auto mb-32">
        <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-4 block">
          The Weekly Ritual | Issue 01
        </span>
        <h2 className="font-serif-title text-5xl text-accent-brown mb-8 leading-tight">
          The Architecture of Silence
        </h2>
        <p className="font-serif-title text-xl leading-relaxed text-brand-ink/80">
          This week we explore how physical spaces can dampen the noise of modern life, 
          turning the home into a vessel for quietude.
        </p>
      </section>

      {/* 2. Atmospheric Filter */}
      <HomepageFilter />

      {/* 3. The Signal (Split Layout: Text Left / Image Right) */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mt-32 border-t border-secondary-bg pt-24">
        
        {/* Left Column: Text & Context */}
        <div className="space-y-8 order-2 md:order-1">
          <div className="space-y-2">
            <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown">
              II. The Signal
            </span>
            <h3 className="font-serif-title text-3xl text-brand-ink">
              Studio O: Light as Material
            </h3>
          </div>
          
          <div className="prose prose-lg font-sans-body text-brand-ink/70 leading-relaxed">
            <p>
              We profile the Tokyo-based lighting studio that treats light not as utility, 
              but as a tactile material. Their latest installation uses washi paper 
              to filter harsh city frequencies into a soft, amber glow.
            </p>
          </div>

          {/* The Artifact Card */}
          <ArtifactButton 
            title="In Praise of Shadows" 
            link="https://geniuslink.com/example" 
          />
        </div>

        {/* Right Column: Visual Evidence (Museum Quality Image) */}
        <div className="order-1 md:order-2 bg-secondary-bg aspect-[4/5] relative overflow-hidden flex items-center justify-center">
           <span className="text-accent-brown/40 font-serif-title italic">
             [Signal Hero Image]
           </span>
        </div>
      </article>
    </CalmEntry>
  );
}