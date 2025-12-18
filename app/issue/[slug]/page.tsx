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

// 2. Data Fetching
async function getIssueData(slug: string) {
  try {
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled"),
      "coverImage": coverImage.asset->url,
      "thesis": coalesce(thesisBody, thesis, ""),
      
      "signal": {
        "studio": coalesce(signalStudio, "Unknown Studio"),
        "context": coalesce(signalContext, ""),
        "method": coalesce(signalMethod, ""),
        "images": coalesce(signalImages[].asset->url, []),
        "geoTag": coalesce(cityTag->title, cityTag->label, cityTag->name, "City"),
        "seasonTag": coalesce(seasonTag->title, seasonTag->label, seasonTag->name, "Season"),
        "moodTags": moodTags[]->title
      },

      "artifact": linkedArtifact->{
        title,
        subtitle,
        // We use pt::text to flatten any Rich Text into a simple string
        "note": coalesce(
          description, 
          curatorNote, 
          note, 
          pt::text(body), 
          pt::text(description), 
          "The object speaks for itself."
        ),
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

        {/* ARTIFACT SECTION - The Museum Placard */}
        <section className="py-32 bg-[#F5F5F0] flex flex-col items-center justify-center min-h-[90vh] px-6">
          
          <span className="font-sans-body text-[10px] text-accent-brown uppercase tracking-[0.2em] mb-12 opacity-50">
            III. The Artifact
          </span>

          {/* THE CARD: White box, Shadow, Centered */}
          <div className="bg-white max-w-[400px] w-full shadow-xl border border-white/50 overflow-hidden flex flex-col">
             
             {/* 1. TOP HALF: The Image (Edge-to-Edge) */}
             <div className="w-full aspect-square bg-[#EAEAEA] relative">
                {data.artifact?.imagePlaceholder ? (
                   <img 
                     src={data.artifact.imagePlaceholder} 
                     alt={data.artifact.title} 
                     className="absolute inset-0 w-full h-full object-cover" 
                   />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-serif-title italic">
                    [Totemic Object]
                  </div>
                )}
             </div>

             {/* 2. BOTTOM HALF: The Label (Padding Only Here) */}
             <div className="p-10 flex flex-col items-center text-center">
                 
                 {/* Metadata */}
                 <span className="font-sans-body text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                   Ritual Object
                 </span>

                 {/* Title */}
                 <h3 className="font-serif-title text-2xl text-gray-900 mb-2">
                   {data.artifact?.title || 'Untitled'}
                 </h3>

                 {/* Subtitle / Note */}
                 <p className="font-sans-body text-xs text-gray-500 leading-relaxed mb-8 max-w-[250px]">
                   {data.artifact?.note || data.artifact?.subtitle || "A souvenir of meaning."}
                 </p>

                 {/* Divider */}
                 <div className="w-12 h-px bg-gray-200 mb-8"></div>

                 {/* Button */}
                 <ArtifactButton 
                   title="Acquire the Edition" 
                   link={data.artifact?.link || '#'} 
                 />
             </div>
          </div>

        </section>

      </main>
    </CalmEntry>
  );
}