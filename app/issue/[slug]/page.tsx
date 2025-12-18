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

        {/* ARTIFACT SECTION */}
        <section className="py-24 bg-[#E5E5E5] flex flex-col items-center justify-center min-h-screen px-6">
          
          <span className="font-sans-body text-[10px] text-accent-brown uppercase tracking-[0.2em] mb-8 block opacity-60">
            III. THE ARTIFACT
          </span>

          {/* THE CARD: A single rigidly defined box */}
          <article className="bg-white w-full max-w-[420px] shadow-2xl flex flex-col">
            
            {/* A. The Image (Top Half) */}
            <div className="w-full h-[500px] bg-gray-100 relative">
               {data.artifact?.imagePlaceholder ? (
                  <img 
                    src={data.artifact.imagePlaceholder} 
                    alt={data.artifact.title} 
                    className="w-full h-full object-cover block" 
                  />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300 italic">
                   No Image Found
                 </div>
               )}
            </div>

            {/* B. The Content (Bottom Half) */}
            <div className="p-10 flex flex-col items-center text-center">
                
                {/* Title */}
                <h3 className="font-serif-title text-2xl text-black mb-2">
                  {data.artifact?.title || 'Untitled'}
                </h3>
                
                {/* Subtitle */}
                <p className="font-sans-body text-[10px] text-gray-400 uppercase tracking-widest mb-8">
                  {data.artifact?.subtitle}
                </p>

                {/* The Note (With a small divider above/below to verify it renders) */}
                <div className="w-8 h-px bg-gray-200 mb-6"></div>
                <div className="font-serif-title text-sm leading-relaxed text-gray-600 mb-6 max-w-[280px]">
                   "{data.artifact?.note}"
                </div>
                <div className="w-8 h-px bg-gray-200 mb-8"></div>

                {/* Button */}
                <ArtifactButton 
                  title="Acquire the Edition" 
                  link={data.artifact?.link || '#'} 
                />
            </div>

          </article>

        </section>

      </main>
    </CalmEntry>
  );
}