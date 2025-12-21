'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// --- THE MANUAL BUILDER (Robust Fallback) ---
function manualUrlBuilder(source: any) {
  try {
    if (!source) return null;

    // 1. If it's already a full URL, return it
    if (typeof source === 'string' && source.startsWith('http')) return source;
    if (source.url && source.url.startsWith('http')) return source.url;

    // 2. Extract the Reference ID
    // Handles cases: { asset: { _ref: ... } }, { _ref: ... }, or direct string
    const ref = source?.asset?._ref || source?._ref || (typeof source === 'string' ? source : null);
    
    if (!ref) {
      // console.warn("ManualBuilder: No reference found in source", source);
      return null;
    }

    // 3. Parse the Sanity ID
    // Format: image-{ID}-{WIDTH}x{HEIGHT}-{FORMAT}
    // Example: image-5d...-1000x800-jpg
    const parts = ref.split('-');
    if (parts.length !== 4) {
      // console.warn("ManualBuilder: Malformed reference ID", ref);
      return null;
    }

    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    
    // 4. Get Project Config
    // CRITICAL FIX: If env var is missing, this usually breaks. 
    // We try to get it from the imported client config if possible, or fail gracefully.
    let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    // Fallback: Try to grab from the client object if accessible (depending on client setup)
    if (!projectId && client && client.config) {
        const config = client.config();
        if (config) projectId = config.projectId;
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    if (!projectId) {
      console.error("❌ ManualBuilder Error: NEXT_PUBLIC_SANITY_PROJECT_ID is missing. Images cannot be constructed.");
      return null;
    }

    // 5. Return Constructed URL
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (e) {
    console.error("ManualBuilder Exception:", e);
    return null;
  }
}

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      // FIX: Query explicitly fetches 'url' from the asset reference
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
        console.log("🔥 SANITY DATA LOADED:", result);
        setData(result);
      } catch (e) {
        console.error("Sanity Fetch Error:", e);
      }
    };
    
    fetchData();
  }, [params?.slug]);

  if (!data) return <div className="min-h-screen bg-primary-bg" />;

  // --- PROCESS IMAGES ROBUSTLY ---
  const rawImages = data.signalImages || [];
  
  const processedImages = rawImages.map((img: any) => {
    // Priority 1: Use the URL returned directly by GROQ (most reliable)
    if (img?.url) return img.url;

    // Priority 2: Attempt to construct it manually using the ID
    const manualUrl = manualUrlBuilder(img);
    if (manualUrl) return manualUrl;

    console.warn("⚠️ Could not resolve image URL for:", img);
    return null;
  }).filter(Boolean);

  // Helper for safe artifact image resolution
  const getArtifactImage = () => {
    if (!data.linkedArtifact) return null;
    const artifact = data.linkedArtifact;
    return artifact.imageUrl || artifact.coverImageUrl || manualUrlBuilder(artifact.image || artifact.coverImage);
  };

  // Helper for hero image resolution
  const getHeroImage = () => {
      return data.coverImageUrl || manualUrlBuilder(data.coverImage) || '';
  };

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* DEBUG BAR: Visible only if images fail to load to help diagnose */}
        {processedImages.length === 0 && rawImages.length > 0 && (
          <div className="w-full bg-red-600 text-white text-center text-[10px] py-1 font-mono uppercase">
             Debug: {rawImages.length} images found but 0 resolved. Check Console for Project ID errors.
          </div>
        )}

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