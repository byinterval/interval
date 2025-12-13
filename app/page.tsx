import { client } from "@/lib/sanity";
import CalmEntry from './components/CalmEntry';
import MoodFilter from './components/MoodFilter';
import ArtifactButton from './components/ArtifactButton';
import Image from "next/image";

// 1. The GROQ Query (The "Live Wire")
// Fetches the latest issue by sorting issueNumber descending and taking the first one [0]
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

// 2. Data Fetching Function
async function getLatestIssue() {
  const data = await client.fetch(query, {}, { cache: 'no-store' }); // no-store ensures fresh data
  return data;
}

async function getMoods() {
  return await client.fetch(`*[_type == "mood"]{title}`);
}

export default async function Home() {
  const issue = await getLatestIssue();
  const moods = await getMoods();

  // Fallback if no issue is published yet
  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg text-accent-brown">
        <p className="font-serif-title text-xl">Sanctuary is preparing the first issue...</p>
      </div>
    );
  }

  return (
    <CalmEntry>
      {/* 1. The Thesis (Fetched from Sanity) */}
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

      {/* 2. Atmospheric Filter (Live Moods) */}
      {/* We map the mood objects to simple strings for the filter */}
      <MoodFilter moods={moods.map((m: any) => m.title)} activeMood={null} onMoodSelect={() => {}} />

      {/* 3. The Signal (Fetched from Sanity) */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mt-32 border-t border-secondary-bg pt-24">
        
        {/* Left Column: Text & Context */}
        <div className="space-y-8 order-2 md:order-1">
          <div className="space-y-2">
            <span className="font-sans-body text-xs uppercase tracking-widest text-accent-brown">
              II. The Signal
            </span>
            <h3 className="font-serif-title text-3xl text-brand-ink">
              {issue.signalStudio}
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

          {/* The Artifact Card (Linked from Sanity) */}
          {issue.artifact && (
            <ArtifactButton 
              title={issue.artifact.title} 
              link={issue.artifact.link} 
            />
          )}
        </div>

        {/* Right Column: Visual Evidence */}
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