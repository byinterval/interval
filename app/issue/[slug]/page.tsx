import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity';
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
  useCdn: false, 
});

// 2. Define Data Shape
interface IssueData {
  slug: string;
  issueNumber: string;
  title: string;
  coverImage: string | null;
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
    imagePlaceholder: string | null; 
    link: string;
  };
}

// 3. Robust Data Fetching
async function getIssueData(slug: string): Promise<IssueData | null> {
  try {
    // COALESCE (match || fallback) logic is added to the query for safety
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled Issue"),
      "coverImage": coverImage.asset->url,
      "thesis": coalesce(thesis, ""),
      signal {
        "studio": coalesce(studio, "Unknown Studio"),
        "context": coalesce(context, ""),
        "method": coalesce(method, ""),
        "geoTag": coalesce(geoTag, ""),
        "seasonTag": coalesce(seasonTag, ""),
        "moodTags": coalesce(moodTags, []),
        "images": coalesce(images[].asset->url, [])
      },
      artifact {
        "title": coalesce(title, "Artifact"),
        "subtitle": coalesce(subtitle, ""),
        "imagePlaceholder": image.asset->url,
        "link": coalesce(link, "#")
      }
    }`;

    const data = await client.fetch(query, { slug });
    console.log(`[IssuePage] Fetched data for ${slug}:`, data ? 'Found' : 'Null');
    return data || null;

  } catch (error) {
    console.error(`[IssuePage Error] Failed to fetch issue ${slug}:`, error);
    // Returning null here prevents the entire server from crashing 500
    return null;
  }
}

// 4. The Page Component
export default async function IssuePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getIssueData(slug);

  if (!data) {
    // If fetch failed or returned null, show 404
    notFound(); 
  }

  // --- SAFEGUARDS ---
  // We ensure every prop has a fallback value so sub-components don't crash
  
  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* HERO */}
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          // Fallback image if Sanity image is missing
          imageSrc={data.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'}
        />

        {/* THESIS */}
        <ThesisModule 
          text={data.thesis}
        />

        {/* SIGNAL */}
        <SignalAnalysis 
          studioName={data.signal?.studio || 'Unknown'}
          context={data.signal?.context || ''}
          method={data.signal?.method || ''}
          images={data.signal?.images || []}
          tags={[
            { label: "City", value: data.signal?.geoTag },
            { label: "Season", value: data.signal?.seasonTag },
            // Ensure we don't map over null
            ...(data.signal?.moodTags || []).map(tag => ({ label: "Mood", value: tag }))
          ].filter(t => t.value && t.value.trim() !== '')} 
        />

        {/* ARTIFACT */}
        <section className="py-32 bg-secondary-bg flex flex-col items-center justify-center text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-8 block">
            III. The Artifact
          </span>
          <div className="bg-white p-12 max-w-lg w-full border border-accent-brown/10 shadow-xl">
             <div className="relative w-full aspect-[3/4] mb-8 bg-primary-bg">
                {/* Safe Image Check */}
                {data.artifact?.imagePlaceholder ? (
                   <img src={data.artifact.imagePlaceholder} alt={data.artifact.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-accent-brown/30 font-serif-title italic bg-gray-50">
                    Image Pending
                  </div>
                )}
             </div>
             <h3 className="font-serif-title text-2xl text-brand-ink mb-2">
               {data.artifact?.title || 'Coming Soon'}
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