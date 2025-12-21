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
    const ref = source?.asset?._ref || source?._ref || (typeof source === 'string' ? source : null);
    
    if (!ref) return null;

    // 3. Parse the Sanity ID
    const parts = ref.split('-');
    if (parts.length !== 4) return null;

    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    
    // 4. Get Project Config
    let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    // Fallback: Try to grab from the client object
    if (!projectId && client) {
        // Try multiple access patterns for the config
        const config = typeof client.config === 'function' ? client.config() : (client as any).config;
        if (config) projectId = config.projectId;
        if (!projectId) projectId = (client as any).projectId; // Rare fallback
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    if (!projectId) {
      console.warn("⚠️ ManualBuilder: Missing Project ID. Cannot construct URL.");
      return null;
    }

    // 5. Return Constructed URL
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (e) {
    console.warn("ManualBuilder Exception:", e);
    return null;
  }
}

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      // FIX: Query aggressively looks for images in Referenced docs, Inline objects, and Arrays.
      const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]{
        ...,
        "coverImageUrl": coverImage.asset->url,
        
        // 1. Array on Issue Document (Legacy)
        signalImages[]{ "url": asset->url, asset },

        // 2. Inline Object on Issue Document
        signal {
          images[]{ "url": asset->url, asset }
        },

        // 3. Reference to Separate Signal Document (v2.0 Architecture)
        "signalRef": signal->{
           title,
           context,
           method,
           images[]{ "url": asset->url, asset }
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

  // --- RESOLVE DATA SOURCE ---
  // We prioritize the Reference (v2.0), then Inline, then Legacy Array
  const resolvedSignal = data.signalRef || data.signal || {};
  
  // Aggregate all potential image sources
  const rawImages = resolvedSignal.images || data.signalImages || [];
  
  const processedImages = rawImages.map((img: any) => {
    if (img?.url) return img.url;
    const manualUrl = manualUrlBuilder(img);
    if (manualUrl) return manualUrl;
    return null;
  }).filter(Boolean);

  // Fallback for Text Content (If moved to Reference)
  const signalStudio = resolvedSignal.title || data.signalStudio;
  const signalContext = resolvedSignal.context || data.signalContext;
  const signalMethod = resolvedSignal.method || data.signalMethod;

  // Helper for safe artifact image resolution
  const getArtifactImage = () => {
    if (!data.linkedArtifact) return null;
    const artifact = data.linkedArtifact;
    return artifact.imageUrl || artifact.coverImageUrl || manualUrlBuilder(artifact.image || artifact.coverImage);
  };

  const getHeroImage = () => {
      return data.coverImageUrl || manualUrlBuilder(data.coverImage) || '';
  };

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* DEBUG BAR: Remove after verifying fix */}
        <div className="w-full bg-slate-900 text-white text-[10px] py-2 px-4 font-mono border-b border-slate-700">
           <div className="max-w-4xl mx-auto flex justify-between">
             <span>DEBUG MODE</span>
             <span>
               RAW: {rawImages.length} | 
               PROCESSED: {processedImages.length} | 
               SOURCE: {data.signalRef ? 'Reference (v2.0)' : data.signalImages ? 'Array (Legacy)' : 'Unknown'}
             </span>
           </div>
        </div>

        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={getHeroImage()}
        />

        <ThesisModule text={data.thesisBody || data.thesis} />

        <SignalAnalysis 
          studioName={signalStudio}
          context={signalContext}
          method={signalMethod}
          images={processedImages.length > 0 ? processedImages : ['https://placehold.co/800x600/E5E5E5/A3A3A3?text=No+Images+Found']} 
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