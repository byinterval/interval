import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';
import { urlFor } from '@/lib/image';

// 1. FORCE NO CACHING (Crucial for debugging)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Force fresh data
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// 2. BRUTE FORCE IMAGE RESOLVER
// This function takes ANY messy data and extracts a clean URL string.
function getCleanUrl(item: any): string | null {
  try {
    if (!item) return null;
    if (typeof item === 'string') return item; // It's already a URL
    
    // Check for "asset" reference (Standard Sanity)
    const ref = item.asset?._ref || item.image?.asset?._ref || item.photo?.asset?._ref;
    
    if (ref) {
      // Manually construct URL if helper fails (Backup plan)
      // Pattern: image-TB4...-1200x800-jpg
      const [_, id, dim, ext] = ref.split('-');
      return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${id}-${dim}.${ext}`;
    }

    // Try standard helper
    return urlFor(item).url();
  } catch (e) {
    return null;
  }
}

async function getIssueData(slug: string) {
  try {
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled"),
      "coverImage": coverImage,
      "thesis": coalesce(thesisBody, thesis, ""),
      
      // FETCH RAW DATA
      "signalStudio": coalesce(signalStudio, "Unknown Studio"),
      "signalContext": coalesce(signalContext, ""),
      "signalMethod": coalesce(signalMethod, ""),
      "rawSignalImages": coalesce(signalImages, images, []),
      
      "cityTag": coalesce(cityTag->title, cityTag->label, "City"),
      "seasonTag": coalesce(seasonTag->title, seasonTag->label, "Season"),
      "moodTags": moodTags[]->title,

      "artifact": linkedArtifact->{
        title,
        "note": coalesce(description, curatorNote, note, ""),
        image, coverImage, mainImage, asset,
        link
      }
    }`;

    const data = await client.fetch(query, { slug });
    if (!data) return null;

    // 3. PRE-PROCESS IMAGES ON SERVER
    // We convert everything to strings HERE, so the component can't fail.
    let cleanImages = (data.rawSignalImages || []).map(getCleanUrl).filter(Boolean);
    
    // Fallback: Use cover image if signal images are empty
    if (cleanImages.length === 0 && data.coverImage) {
      const coverUrl = getCleanUrl(data.coverImage);
      if (coverUrl) cleanImages = [coverUrl];
    }

    data.signalImages = cleanImages;
    
    // Resolve Artifact Image same way
    const artRaw = data.artifact?.image || data.artifact?.coverImage || data.artifact?.mainImage || data.artifact?.asset;
    data.artifactImage = getCleanUrl(artRaw);

    return data;
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
      <main className="bg-primary-bg min-h-screen">
        
        {/* --- VISUAL CONFIRMATION BANNER --- */}
        {/* If you don't see this purple bar, the deployment failed. */}
        <div className="w-full bg-purple-600 text-white text-center text-xs py-1 font-mono uppercase tracking-widest z-[9999] relative">
           System Update: v3.1 (Fresh Cache)
        </div>

        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={getCleanUrl(data.coverImage) || ''}
        />

        <ThesisModule text={data.thesis} />

        {/* We now pass SIMPLE STRINGS to the component */}
        <SignalAnalysis 
          studioName={data.signalStudio}
          context={data.signalContext}
          method={data.signalMethod}
          images={data.signalImages} 
          tags={[
            { label: "City", value: data.cityTag },
            { label: "Season", value: data.seasonTag },
            ...(data.moodTags || []).map((t: string) => ({ label: "Mood", value: t }))
          ]} 
        />

        <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0]">
          <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60">
            III. The Artifact
          </span>
          <div className="w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
            <div className="w-full h-[500px] bg-[#E5E5E5] relative overflow-hidden">
              {data.artifactImage ? (
                <img 
                  src={data.artifactImage} 
                  alt={data.artifact?.title}
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