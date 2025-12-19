import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// --- 1. CONFIGURATION ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// --- 2. DATA FETCHING ---
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
        "note": coalesce(description, curatorNote, note, pt::text(body), subtitle, ""),
        
        // FIX: WE RESTORE THE DRAGNET TO FIND THE IMAGE
        // We check every possible field name so we don't miss it.
        "imageSrc": coalesce(
            image.asset->url,
            coverImage.asset->url,
            mainImage.asset->url,
            photo.asset->url,
            asset->url
        ),
        link
      }
    }`;

    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// --- 3. PAGE COMPONENT ---
export default async function IssuePage(props: any) {
  const params = await Promise.resolve(props.params);
  const data = await getIssueData(params.slug);

  if (!data) notFound();

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* SECTION 1: HERO */}
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'}
        />

        {/* SECTION 2: THESIS */}
        <ThesisModule text={data.thesis} />

        {/* SECTION 3: SIGNAL */}
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

        {/* --- SECTION 4: THE ARTIFACT --- */}
        <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F4F4F0]">
          
          <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60">
            III. The Artifact
          </span>

          {/* THE CARD */}
          <div className="w-full max-w-[420px] bg-white shadow-2xl overflow-hidden flex flex-col">
            
            {/* TOP: THE IMAGE */}
            <div className="relative w-full aspect-[4/5] bg-[#EAEAEA]">
              {data.artifact?.imageSrc ? (
                <img 
                  src={data.artifact.imageSrc} 
                  alt={data.artifact.title}
                  className="w-full h-full object-cover block" 
                />
              ) : (
                // If this still shows, check your Sanity Studio to see exactly what the image field is named!
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* BOTTOM: THE CONTENT */}
            <div className="p-10 flex flex-col items-center text-center">
              <h3 className="mb-3 font-serif-title text-2xl text-gray-900">
                {data.artifact?.title || 'Untitled Artifact'}
              </h3>

              <p className="mb-8 font-sans-body text-xs leading-relaxed text-gray-500 max-w-[280px]">
                {data.artifact?.note}
              </p>

              <div className="mb-8 h-px w-10 bg-gray-200" />

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