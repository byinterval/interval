'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// --- THE MANUAL BUILDER (Fallback) ---
// Kept as a backup for edge cases, but the primary data source is now the API directly.
function manualUrlBuilder(source: any) {
  try {
    // If it's already a string URL, return it
    if (typeof source === 'string' && source.startsWith('http')) return source;
    
    // Check for direct URL property first (from updated query)
    if (source?.url) return source.url;

    // 1. Get the Reference ID
    const ref = source?.asset?._ref || source?._ref || source?.asset?.url;
    if (typeof ref === 'string' && ref.startsWith('http')) return ref;
    if (!ref) return null;

    // 2. Parse the ID (image-{ID}-{WIDTH}x{HEIGHT}-{FORMAT})
    const parts = ref.split('-');
    if (parts.length !== 4) return null;

    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = 'production';

    // If project ID is missing, this builder fails silently in production
    if (!projectId) return null;

    // 3. Construct the String
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (e) {
    console.error("URL Builder Error:", e);
    return null;
  }
}

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      // FIX: Updated query to fetch fully resolved URLs directly from Sanity.
      // This bypasses the need to manually construct URLs or rely on env vars.
      const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]{
        ...,
        "coverImageUrl": coverImage.asset->url,
        signalImages[]{ 
          "url": asset->url,
          asset 
        }, 
        linkedArtifact->{ 
          ...,
          "imageUrl": image.asset->url,
          "coverImageUrl": coverImage.asset->url
        }
      }`;
      
      try {
        const result = await client.fetch(query);
        // console.log("🔥 SANITY DATA (Resolved):", result);
        setData(result);
      } catch (e) {
        console.error("Sanity Fetch Error:", e);
      }
    };
    
    fetchData();
  }, [params?.slug]);

  if (!data) return <div className="min-h-screen bg-primary-bg" />;

  // --- PROCESS IMAGES ROBUSTLY ---
  // Now we try the direct URL first, then fall back to the builder
  const rawImages = data.signalImages || [];
  
  const processedImages = rawImages.map((img: any) => {
    // 1. Try the pre-fetched URL
    if (img.url) return img.url;
    // 2. Try the manual builder
    return manualUrlBuilder(img);
  }).filter(Boolean);

  // Helper for safe artifact image resolution
  const getArtifactImage = () => {
    if (!data.linkedArtifact) return null;
    const artifact = data.linkedArtifact;
    // Check all possible locations for the image URL
    return artifact.imageUrl || artifact.coverImageUrl || manualUrlBuilder(artifact.image || artifact.coverImage);
  };

  // Helper for hero image resolution
  const getHeroImage = () => {
      return data.coverImageUrl || manualUrlBuilder(data.coverImage) || '';
  };

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* DEBUG BAR: Remove this div when confident the fix works */}
        {/* <div className="w-full bg-emerald-600 text-white text-center text-[10px] py-1 font-mono uppercase">
           Status: Robust URL Fetching Active • {processedImages.length} Signals Loaded
        </div> 
        */}

        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={getHeroImage()}
        />

        <ThesisModule text={data.thesisBody || data.thesis} />

        <SignalAnalysis 
          studioName={data.signalStudio}
          context={data.signalContext}
          method={data.signalMethod}
          images={processedImages} 
          tags={[]} 
        />

        {/* Artifact Section */}
        <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0]">
          <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60">
            III. The Artifact
          </span>
          {data.linkedArtifact && (
             <div className="w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
                <div className="w-full h-[500px] bg-[#E5E5E5] relative overflow-hidden">
                   {getArtifactImage() ? (
                      <img 
                        src={getArtifactImage()!} 
                        alt={data.linkedArtifact.title || "Artifact"}
                        className="w-full h-full object-cover"
                      />
                   ) : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">No Image</div>}
                </div>
                <div className="p-12 flex flex-col items-center text-center bg-white">
                  <h3 className="mb-4 font-serif-title text-2xl text-gray-900">{data.linkedArtifact.title}</h3>
                  <p className="mb-8 font-sans-body text-xs leading-relaxed text-gray-500 max-w-[280px]">
                    {data.linkedArtifact.note || data.linkedArtifact.description}
                  </p>
                  <ArtifactButton title="Acquire" link={data.linkedArtifact.link || '#'} />
                </div>
             </div>
          )}
        </section>

      </main>
    </CalmEntry>
  );
}
