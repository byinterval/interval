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
        // Robust Note Fetching
        "note": coalesce(
          description, 
          curatorNote, 
          note, 
          pt::text(body), 
          pt::text(description), 
          ""
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

        {/* ARTIFACT SECTION */}
        <section className="py-32 bg-secondary-bg flex justify-center px-6">
          
          {/* THE CARD CONTAINER */}
          {/* We use flex-col to force top-to-bottom stacking */}
          <div className="bg-white max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
             
             {/* 1. HEADER (Top of Card) */}
             <div className="py-8 text-center border-b border-gray-100">
               <span className="font-sans-body text-[10px] text-accent-brown uppercase tracking-[0.2em]">
                  III. The Artifact
               </span>
             </div>

             {/* 2. IMAGE (Middle Block) */}
             {/* We use a standard img tag (no absolute) to force the card to stretch */}
             <div className="w-full bg-gray-50">
                {data.artifact?.imagePlaceholder ? (
                   <img 
                     src={data.artifact.imagePlaceholder} 
                     alt={data.artifact.title} 
                     className="w-full h-auto object-cover" 
                     style={{ display: 'block' }} // Removes tiny gap at bottom of images
                   />
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center text-gray-300 italic">
                    No Image Available
                  </div>
                )}
             </div>

             {/* 3. TEXT CONTENT (Bottom Block) */}
             <div className="p-10 flex flex-col items-center text-center bg-white z-10">
                 
                 <h3 className="font-serif-title text-2xl text-brand-ink mb-2">
                   {data.artifact?.title || 'Untitled Artifact'}
                 </h3>
                 
                 <p className="font-sans-body text-[10px] text-brand-ink/50 uppercase tracking-widest mb-6">
                   {data.artifact?.subtitle}
                 </p>

                 {/* The Note */}
                 {data.artifact?.note && (
                   <div className="mb-8 font-serif-title text-sm leading-relaxed text-gray-600 max-w-xs italic">
                      "{data.artifact.note}"
                   </div>
                 )}

                 {/* The Button */}
                 <div className="w-full pt-6 border-t border-gray-100 flex justify-center">
                     <ArtifactButton 
                       title="Acquire the Edition" 
                       link={data.artifact?.link || '#'} 
                     />
                 </div>
             </div>

          </div>
        </section>

      </main>
    </CalmEntry>
  );
}