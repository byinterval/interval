import { notFound } from 'next/navigation';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// 1. Define the shape of your CMS data (The Interface)
interface IssueData {
  slug: string;
  issueNumber: string;
  title: string;
  coverImage: string;
  thesis: string;
  signal: {
    studio: string;
    context: string;
    method: string;
    geoTag: string;
    seasonTag: string;
    moodTags: string[];
    images: string[];
  };
  artifact: {
    title: string;
    subtitle: string;
    imagePlaceholder: string; // In real app, this is a URL
    link: string;
  };
}

// 2. Simulate the Database Fetch (Mocking Sanity Client)
async function getIssueData(slug: string): Promise<IssueData | null> {
  // In a real app, this would be: await client.fetch(query, { slug })
  
  // MOCK DATABASE
  const db: Record<string, IssueData> = {
    "01": {
      slug: "01",
      issueNumber: "01",
      title: "The Architecture of Silence",
      coverImage: "https://images.unsplash.com/photo-1493723843689-d205189326e5?q=80&w=2000&auto=format&fit=crop",
      thesis: "Silence is not merely the absence of noise. It is a physical material, constructed through shadow, texture, and density. This week, we explore how to build it.",
      signal: {
        studio: "Studio O",
        context: "In the frenetic heart of Tokyo, Studio O treats light not as a utility, but as a tactile material.",
        method: "By layering washi paper over raw concrete, they filter harsh city frequencies into a soft, amber glow. Note the absence of overhead lighting—shadow creates the volume.",
        geoTag: "Tokyo",
        seasonTag: "Late Autumn",
        moodTags: ["Silence", "Texture"],
        images: [
          "https://images.unsplash.com/photo-1516962080544-e1163c804e15?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800&auto=format&fit=crop"
        ]
      },
      artifact: {
        title: "In Praise of Shadows",
        subtitle: "Special Edition Reissue",
        imagePlaceholder: "[Totemic Object Shot]",
        link: "https://geniuslink.com/example"
      }
    }
  };

  return db[slug] || null;
}

// 3. The Dynamic Page Component
// Next.js passes the 'params' object automatically to dynamic routes
export default async function IssuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getIssueData(slug);

  if (!data) {
    notFound(); // Returns the 404 page if issue doesn't exist
  }

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* HERO */}
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage}
        />

        {/* THESIS */}
        <ThesisModule 
          text={data.thesis}
        />

        {/* SIGNAL */}
        {/* We map the flat CMS data to the specific structure the component needs */}
        <SignalAnalysis 
          studioName={data.signal.studio}
          context={data.signal.context}
          method={data.signal.method}
          images={data.signal.images}
          tags={[
            { label: "City", value: data.signal.geoTag },
            { label: "Season", value: data.signal.seasonTag },
            ...data.signal.moodTags.map(tag => ({ label: "Mood", value: tag }))
          ]}
        />

        {/* ARTIFACT */}
        <section className="py-32 bg-secondary-bg flex flex-col items-center justify-center text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-8 block">
            III. The Artifact
          </span>
          <div className="bg-white p-12 max-w-lg w-full border border-accent-brown/10 shadow-xl">
             <div className="relative w-full aspect-[3/4] mb-8 bg-primary-bg">
                <div className="absolute inset-0 flex items-center justify-center text-accent-brown/30 font-serif-title italic">
                  {data.artifact.imagePlaceholder}
                </div>
             </div>
             <h3 className="font-serif-title text-2xl text-brand-ink mb-2">
               {data.artifact.title}
             </h3>
             <p className="font-sans-body text-xs text-brand-ink/60 uppercase tracking-wider mb-8">
               {data.artifact.subtitle}
             </p>
             <ArtifactButton 
               title="Acquire the Edition" 
               link={data.artifact.link} 
             />
          </div>
        </section>

      </main>
    </CalmEntry>
  );
}