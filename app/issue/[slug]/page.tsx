import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity'; // Import Sanity Client
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// 1. Setup Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false so you see updates immediately
});

// 2. Define the shape of your CMS data
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
    imagePlaceholder: string; 
    link: string;
  };
}

// 3. Real Database Fetch
async function getIssueData(slug: string): Promise<IssueData | null> {
  // We query Sanity for the issue with the matching slug
  // And we map the Sanity fields to fit your component structure
  const query = `*[_type == "issue" && slug.current == $slug][0]{
    "slug": slug.current,
    issueNumber,
    title,
    "coverImage": coverImage.asset->url,
    thesis,
    signal {
      studio,
      context,
      method,
      geoTag,
      seasonTag,
      moodTags,
      "images": images[].asset->url
    },
    artifact {
      title,
      subtitle,
      "imagePlaceholder": image.asset->url,
      link
    }
  }`;

  const data = await client.fetch(query, { slug });
  return data || null;
}

// 4. The Dynamic Page Component
export default async function IssuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getIssueData(slug);

  if (!data) {
    notFound(); // Returns the 404 page if issue doesn't exist in Sanity
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
        <SignalAnalysis 
          studioName={data.signal?.studio || 'Unknown Studio'}
          context={data.signal?.context}
          method={data.signal?.method}
          images={data.signal?.images || []}
          tags={[
            { label: "City", value: data.signal?.geoTag },
            { label: "Season", value: data.signal?.seasonTag },
            ...(data.signal?.moodTags || []).map(tag => ({ label: "Mood", value: tag }))
          ].filter(t => t.value)} // Filter out empty tags
        />

        {/* ARTIFACT */}
        <section className="py-32 bg-secondary-bg flex flex-col items-center justify-center text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-8 block">
            III. The Artifact
          </span>
          <div className="bg-white p-12 max-w-lg w-full border border-accent-brown/10 shadow-xl">
             <div className="relative w-full aspect-[3/4] mb-8 bg-primary-bg">
                {/* Check if image exists, otherwise show title */}
                {data.artifact?.imagePlaceholder ? (
                   <img src={data.artifact.imagePlaceholder} alt={data.artifact.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-accent-brown/30 font-serif-title italic">
                    Artifact Image
                  </div>
                )}
             </div>
             <h3 className="font-serif-title text-2xl text-brand-ink mb-2">
               {data.artifact?.title}
             </h3>
             <p className="font-sans-body text-xs text-brand-ink/60 uppercase tracking-wider mb-8">
               {data.artifact?.subtitle}
             </p>
             <ArtifactButton 
               title="Acquire the Edition" 
               link={data.artifact?.link || '#'} 
             />
          </div>
        </section>

      </main>
    </CalmEntry>
  );
}