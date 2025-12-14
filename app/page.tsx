import { client } from "@/lib/sanity";
import CalmEntry from './components/CalmEntry';
import MoodFilter from './components/MoodFilter'; // Assuming this uses the client wrapper or is adapted
import HomepageFilter from './components/HomepageFilter'; // Use the wrapper if you created it
import ArtifactButton from './components/ArtifactButton';
import Image from "next/image";

// 1. The GROQ Query
const query = `*[_type == "issue"] | order(issueNumber desc)[0] {
  issueNumber,
  title,
  "coverImage": coverImage.asset->url,
  thesisBody,
  signalStudio,
  signalContext,
  signalMethod,
  "signalImage": signalImages[0].asset->url,
  "artifact": linkedArtifact->{
    title,
    "link": link
  },
  "moods": moodTags[]->title
}`;

// 2. Data Fetching
async function getLatestIssue() {
  try {
    const data = await client.fetch(query, {}, { cache: 'no-store' });
    return data;
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return null;
  }
}

export default async function Home() {
  const issue = await getLatestIssue();

  // FIX: Robust Null Check to prevent Server Crash
  if (!issue) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-primary-bg text-brand-ink p-6 text-center">
        <h1 className="font-serif-title text-4xl mb-4">The Interval</h1>
        <p className="font-sans-body text-accent-brown">
          Sanctuary is preparing the first issue...
        </p>
        <p className="text-xs mt-4 opacity-50">Status: Waiting for published content in Sanity.</p>
      </main>
    );
  }

  return (
    <CalmEntry>
      {/* 1. The Thesis */}
      <section className="text-center max-w-2xl mx-auto mb-32">
        <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-4 block">
          The Weekly Ritual | Issue {issue.issueNumber}
        </span>
        <h2 className="font-serif-title text-5xl text-accent-brown mb-8 leading-tight">
          {issue.title}
        </h2>
        <p className="font-serif-title text-xl leading-relaxed text-brand-ink/80 whitespace-pre-wrap">
          {issue.thesisBody}
        </p>
      </section>

      {/* 2. Atmospheric Filter */}
      {/* Using the wrapper to handle client-side state in a server component */}
      <HomepageFilter />

      {/* 3. The Signal */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mt-32 border-t border-secondary-bg pt-24">
        
        {/* Left Column */}
        <div className="space-y-8 order-2 md:order-1">
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

          {/* Artifact Card */}
          {issue.artifact && (
            <ArtifactButton 
              title={issue.artifact.title} 
              link={issue.artifact.link} 
            />
          )}
        </div>

        {/* Right Column */}
        <div className="order-1 md:order-2 bg-secondary-bg aspect-[4/5] relative overflow-hidden">
           {issue.signalImage ? (
             <Image 
               src={issue.signalImage} 
               alt={issue.signalStudio || "Signal Image"}
               fill
               className="object-cover"
             />
           ) : (
             <div className="absolute inset-0 flex items-center justify-center text-accent-brown/30 font-serif-title italic">
               [No Signal Image Uploaded]
             </div>
           )}
        </div>
      </article>
    </CalmEntry>
  );
}