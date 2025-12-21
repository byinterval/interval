import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function getIssueData(slug: string) {
  try {
    // X-RAY QUERY: We fetch EVERYTHING to find the missing images
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled"),
      "coverImage": coverImage.asset->url,
      "thesis": coalesce(thesisBody, thesis, ""),
      
      // DEBUG: We fetch the raw objects to inspect them
      "DEBUG_signalImages": signalImages,
      "DEBUG_images": images,
      "DEBUG_gallery": gallery,
      
      "signal": {
        "studio": coalesce(signalStudio, "Unknown Studio"),
        "context": coalesce(signalContext, ""),
        "method": coalesce(signalMethod, ""),
        
        // Try to fetch images from every possible location
        "images": coalesce(
           signalImages[].asset->url,
           images[].asset->url,
           gallery[].asset->url,
           [coverImage.asset->url]
        ),
        
        "geoTag": coalesce(cityTag->title, cityTag->label, cityTag->name, "City"),
        "seasonTag": coalesce(seasonTag->title, seasonTag->label, seasonTag->name, "Season"),
        "moodTags": moodTags[]->title
      },

      "artifact": linkedArtifact->{
        title,
        subtitle,
        "note": coalesce(description, curatorNote, note, pt::text(body), subtitle, ""),
        "imageSrc": coalesce(image.asset->url, coverImage.asset->url, mainImage.asset->url, asset->url),
        link
      }
    }`;

    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function IssuePage(props: any) {
  const params = await Promise.resolve(props.params);
  const data = await getIssueData(params.slug);

  if (!data) notFound();

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen relative">
        
        {/* --- THE RED DEBUG BOX --- */}
        <div className="bg-red-100 border-4 border-red-500 p-6 m-6 text-xs font-mono text-red-900 z-[999] relative">
          <h2 className="font-bold text-lg mb-2">🕵️‍♂️ DATA X-RAY</h2>
          <p className="mb-2"><strong>Look at the "DEBUG_" fields below. Which one has data?</strong></p>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              signalImages: data.DEBUG_signalImages,
              images: data.DEBUG_images,
              gallery: data.DEBUG_gallery,
              resolvedSignalImages: data.signal.images
            }, null, 2)}
          </pre>
        </div>
        {/* ------------------------- */}

        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'}
        />

        <ThesisModule text={data.thesis} />

        <SignalAnalysis 
          studioName={data.signal.studio}
          context={data.signal.context}
          method={data.signal.method}
          images={data.signal.images || []}
          tags={[
            { label: "City", value: data.signal.geoTag },
            { label: "Season", value: data.signal.seasonTag },
            ...(data.signal.moodTags || []).map((tag: string) => ({ label: "Mood", value: tag }))
          ].filter(t => t.value)} 
        />

        <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0]">
          <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60">
            III. The Artifact
          </span>
          <div className="w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
            <div className="w-full h-[500px] bg-[#E5E5E5] relative overflow-hidden">
              {data.artifact?.imageSrc ? (
                <img 
                  src={data.artifact.imageSrc} 
                  alt={data.artifact.title}
                  className="w-full h-full object-cover block"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                  No Image Found
                </div>
              )}
            </div>
            <div className="p-12 flex flex-col items-center text-center bg-white">
              <h3 className="mb-4 font-serif-title text-2xl text-gray-900">
                {data.artifact?.title || 'Untitled Artifact'}
              </h3>
              <p className="mb-8 font-sans-body text-xs leading-relaxed text-gray-500 max-w-[280px]">
                {data.artifact?.note}
              </p>
              <div className="mb-8 h-px w-12 bg-gray-200" />
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