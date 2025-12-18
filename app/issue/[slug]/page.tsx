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
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// 2. Data Fetching Logic
async function getIssueData(slug: string) {
  try {
    // CRITICAL FIX: Mapping the *Actual* Sanity fields to our Component props
    // The "->" arrow tells Sanity to follow the reference and get the data inside.
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled"),
      "coverImage": coverImage.asset->url,
      
      // Map 'thesisBody' (DB) to 'thesis' (Component)
      "thesis": coalesce(thesisBody, ""),
      
      // Construct the Signal object from flat fields
      "signal": {
        "studio": coalesce(signalStudio, "Unknown Studio"),
        "context": coalesce(signalContext, ""),
        "method": coalesce(signalMethod, ""),
        "images": coalesce(signalImages[].asset->url, []),
        
        // Expand the Tag References
        // We try 'title', 'label', or 'name' just to be safe
        "geoTag": coalesce(cityTag->title, cityTag->label, cityTag->name, "City"),
        "seasonTag": coalesce(seasonTag->title, seasonTag->label, seasonTag->name, "Season"),
        "moodTags": moodTags[]->title
      },

      // Expand the Artifact Reference
      "artifact": linkedArtifact->{
        title,
        subtitle,
        "imagePlaceholder": image.asset->url,
        link
      }
    }`;

    const data = await client.fetch(query, { slug });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// 3. The Page Component
export default async function IssuePage(props: any) {
  // Handle Next.js 15 Params
  const params = await Promise.resolve(props.params);
  const { slug } = params;

  const data = await getIssueData(slug);

  if (!data) {
    notFound(); 
  }

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* HERO */}
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'}
        />

        {/* THESIS */}
        <ThesisModule 
          text={data.thesis}
        />

        {/* SIGNAL */}
        <SignalAnalysis 
          studioName={data.signal.studio}
          context={data.signal.context}
          method={data.signal.method}
          images={data.signal.images}
          tags={[
            { label: "City", value: data.signal.geoTag },
            { label: "Season", value: data.signal.seasonTag },
            ...(data.signal.moodTags || []).map((tag: string) => ({ label: "Mood", value: tag }))
          ].filter(t => t.value)} 
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
                    Artifact Image
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