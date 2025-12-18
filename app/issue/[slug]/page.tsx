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
        // DRAGNET: We try every possible name for the note field.
        // pt::text(body) converts Rich Text blocks to plain strings.
        "note": coalesce(
          description, 
          curatorNote, 
          note, 
          pt::text(body), 
          pt::text(description),
          "Note pending..."
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
        <section className="py-32 bg-secondary-bg flex flex-col items-center justify-center text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-8 block">
            III. The Artifact
          </span>
          
          {/* THE UNIFIED CARD: bg-white contains EVERYTHING */}
          <div className="bg-white max-w-lg w-full shadow-2xl border border-accent-brown/5 overflow-hidden">
             
             {/* 1. Image (Flush at top, no padding around it) */}
             <div className="relative w-full aspect-[3/4] bg-gray-100">
                {data.artifact?.imagePlaceholder ? (
                   <img 
                     src={data.artifact.imagePlaceholder} 
                     alt={data.artifact.title} 
                     className="absolute inset-0 w-full h-full object-cover" 
                   />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-accent-brown/30 font-serif-title italic">
                    Artifact Image
                  </div>
                )}
             </div>
             
             {/* 2. Content Container (Padding is only here) */}
             <div className="p-10 md:p-12 flex flex-col items-center">
                 <h3 className="font-serif-title text-2xl text-brand-ink mb-2">
                   {data.artifact?.title || 'Untitled Artifact'}
                 </h3>
                 
                 <p className="font-sans-body text-[10px] text-brand-ink/50 uppercase tracking-widest mb-6">
                   {data.artifact?.subtitle}
                 </p>

                 {/* 3. The Note (Now robustly fetched) */}
                 <div className="mb-8 max-w-sm text-brand-ink/80 font-serif-title text-sm leading-relaxed italic">
                    "{data.artifact?.note}"
                 </div>

                 {/* 4. Button */}
                 <div className="w-full border-t border-accent-brown/10 pt-8 mt-2">
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