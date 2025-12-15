import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/image"; 
import CalmEntry from './components/CalmEntry';
import HomepageFilter from './components/HomepageFilter';
import ArtifactButton from './components/ArtifactButton';
import IssueHero from './components/IssueHero'; 
import SanityImage from './components/SanityImage';
import ThesisLock from './components/ThesisLock'; // New Import

const query = `*[_type == "issue"] | order(issueNumber desc)[0] {
  issueNumber,
  title,
  isLocked,
  coverImage, 
  thesisBody,
  signalStudio,
  signalContext,
  signalMethod,
  signalImages,
  "artifact": linkedArtifact->{
    _id,
    title,
    category,
    "link": link,
    image,
    "description": curatorNote // Fetch description
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

  const heroUrl = issue.coverImage ? urlFor(issue.coverImage).width(1920).url() : null;
  const signalUrl = issue.signalImages?.[0] ? urlFor(issue.signalImages[0]).width(800).url() : heroUrl;

  return (
    <CalmEntry>
      <div className="-mt-32 mb-20">
        <IssueHero 
          issueNumber={issue.issueNumber}
          title={issue.title}
          imageSrc={heroUrl}
        />
      </div>

      <section className="text-center max-w-2xl mx-auto mb-32 px-6">
        <span className="font-sans-body text-xs text-accent-brown uppercase tracking-widest mb-4 block">
          The Weekly Ritual
        </span>
        
        {/* REPLACED DIRECT TEXT WITH LOCK COMPONENT */}
        <ThesisLock fullText={issue.thesisBody || ""} />
        
      </section>

      <HomepageFilter />

      <article className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mt-32 border-t border-secondary-bg pt-24">
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

          {issue.artifact && (
            <ArtifactButton 
              id={issue.artifact._id}
              title={issue.artifact.title} 
              link={issue.artifact.link}
              category={issue.artifact.category}
              image={issue.artifact.image}
              description={issue.artifact.description} // Pass description
            />
          )}
        </div>

        <div className="order-1 md:order-2 bg-secondary-bg aspect-[4/5] relative overflow-hidden">
           <SanityImage 
             src={signalUrl} 
             alt={issue.signalStudio || "Signal Image"}
             fill
             className="object-cover"
           />
        </div>
      </article>
    </CalmEntry>
  );
}