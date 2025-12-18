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
    note: string; // <--- NEW FIELD
    imagePlaceholder: string | null; 
    link: string;
  };
}

// 3. Data Fetching
async function getIssueData(slug: string): Promise<IssueData | null> {
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
        // We look for common names for the note field
        "note": coalesce(description, note, body, text, curatorNote, ""),
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

// 4. The Page Component
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

        {/* ARTIFACT */}
        <section className="py-32 bg-secondary-bg flex flex-col items-center justify-center text-center px-6">
          <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] mb-8 block">
            III. The Artifact
          </span>
          
          <div className="bg-white p-12 max-w-lg w-full border border-accent-brown/10 shadow-xl">
             
             {/* 1. Image */}
             <div className="relative w-full aspect-[3/4] mb-8 bg-primary-bg">
                {data.artifact?.imagePlaceholder ? (
                   <img src={data.artifact.imagePlaceholder} alt={data.artifact.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-accent-brown/30 font-serif-title italic bg-gray-50">
                    Image Pending
                  </div>
                )}
             </div>
             
             {/* 2. Titles */}
             <h3 className="font-serif-title text-2xl text-brand-ink mb-2">
               {data.artifact?.title || 'Untitled Artifact'}
             </h3>
             <p className="font-sans-body text-xs text-brand-ink/60 uppercase tracking-wider mb-6">
               {data.artifact?.subtitle}
             </p>

             {/* 3. The Curator Note (Now Visible) */}
             {data.artifact?.note && (
                <div className="mb-8 text-brand-ink/80 font-serif-title text-sm leading-relaxed px-4">
                  {data.artifact.note}
                </div>
             )}

             {/* 4. Button */}
             <div className="pt-4 border-t border-accent-brown/10 w-full flex justify-center">
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