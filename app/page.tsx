import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image"; 
import CalmEntry from './components/CalmEntry';
import HomepageFilter from './components/HomepageFilter';
import ArtifactButton from './components/ArtifactButton';
import IssueHero from './components/IssueHero'; 
import SanityImage from './components/SanityImage';

// QUERY UPDATE: Fetch ALL signal images, not just the first one
const query = `*[_type == "issue"] | order(issueNumber desc)[0] {
  issueNumber,
  title,
  coverImage, 
  thesisBody,
  signalStudio,
  signalContext,
  signalMethod,
  signalImages, // Fetch the array
  "artifact": linkedArtifact->{
    title,
    "link": link
  },
  "moods": moodTags[]->title
}`;

async function getLatestIssue() {
  try {
    return await client.fetch(query, {}, { cache: 'no-store' });
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return null;
  }
}

export default async function Home() {
  const issue = await getLatestIssue();

  if (!issue) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-primary-bg text-brand-ink p-6 text-center">
        <h1 className="font-serif-title text-4xl mb-4">The Interval</h1>
        <p className="font-sans-body text-accent-brown">Sanctuary is preparing the first issue...</p>
      </main>
    );
  }

  // Generate Hero URL
  const heroUrl = issue.coverImage ? urlFor(issue.coverImage).width(1920).url() : null;

  return (
    <CalmEntry>
      {/* 1. HERO HEADER */}
      <div className="-mt-32 mb-20">
        <IssueHero 
          issueNumber={issue.issueNumber}
          title={issue.title}
          imageSrc={heroUrl}
        />
      </div>

      {/* 2. The Thesis */}
      <section className="text-center max-w-2xl mx-auto mb-32 px-6">
        <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-4 block">
          The Weekly Ritual
        </span>
        <p className="font-serif-title text-xl leading-relaxed text-brand-ink/80 whitespace-pre-wrap">
          {issue.thesisBody}
        </p>
      </section>

      <HomepageFilter />

      {/* 3. The Signal (Forensic Stack) */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start mt-32 border-t border-secondary-bg pt-24">
        
        {/* Left Column: Text & Context (Sticky on Desktop) */}
        <div className="space-y-8 order-2 md:order-1 md:sticky md:top-32">
          <div className="space-y-2">
            <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown">
              II. The Signal
            </span>
            <h3 className="font-serif-title text-3xl text-brand-ink">
              {issue.signalStudio || "Studio Profile"}
            </h3>
          </div>
          
          <div className="prose prose-lg font-sans-body text-brand-ink/70 leading-relaxed space-y-4">
            <div>
                <strong className="text-xs uppercase tracking-wider text-accent-brown block mb-1">Context</strong>
                <p>{issue.signalContext}</p>
            </div>
            <div>
                <strong className="text-xs uppercase tracking-wider text-accent-brown block mb-1">Method</strong>
                <p>{issue.signalMethod}</p>
            </div>
          </div>

          {issue.artifact && (
            <ArtifactButton 
              title={issue.artifact.title} 
              link={issue.artifact.link} 
            />
          )}
        </div>

        {/* Right Column: Visual Evidence (Vertical Stack) */}
        <div className="order-1 md:order-2 flex flex-col gap-8">
           {issue.signalImages && issue.signalImages.length > 0 ? (
             issue.signalImages.map((img: any, i: number) => (
               <div key={i} className="bg-secondary-bg w-full relative">
                 {/* Using SanityImage with auto-height logic by not forcing 'fill' if we want natural aspect ratio, 
                     but for masonry feel, let's use a standard container aspect ratio or just width */}
                 <div className="relative w-full aspect-[3/4]">
                   <SanityImage 
                     src={urlFor(img).width(800).url()} 
                     alt={`Forensic Detail ${i + 1}`}
                     fill
                     className="object-cover"
                   />
                 </div>
                 <p className="text-[10px] uppercase tracking-widest text-accent-brown/60 mt-2">
                   Fig. {i + 1}
                 </p>
               </div>
             ))
           ) : (
             <div className="aspect-[3/4] bg-secondary-bg flex items-center justify-center text-accent-brown/30 font-serif-title italic">
               [No Forensic Images Available]
             </div>
           )}
        </div>
      </article>
    </CalmEntry>
  );
}