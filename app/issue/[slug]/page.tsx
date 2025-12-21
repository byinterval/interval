'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// --- ROBUST URL BUILDER ---
// Handles missing Project IDs by returning a visual placeholder instead of breaking.
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
    // Expected format: image-{ID}-{WIDTH}x{HEIGHT}-{FORMAT}
    if (parts.length !== 4) return null;

    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    
    // 4. Get Project Config (Env or Client Fallback)
    let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    if (!projectId && client) {
        // Safe access to client config
        const config = (client as any).config ? 
          (typeof (client as any).config === 'function' ? (client as any).config() : (client as any).config) 
          : null;
        if (config) projectId = config.projectId;
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    // 5. CRITICAL FALLBACK: If Project ID is missing, return a placeholder
    // This ensures the user sees *something* (grey box) rather than empty space.
    if (!projectId) {
      console.warn("⚠️ Sanity Project ID missing. Using placeholder.");
      return `https://placehold.co/${dimensions.split('x')[0]}x${dimensions.split('x')[1]}/E5E5E5/A3A3A3?text=Missing+Project+ID`;
    }

    // 6. Return Valid URL
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (e) {
    console.error("UrlBuilder Error:", e);
    return 'https://placehold.co/800x600/E5E5E5/A3A3A3?text=Error';
  }
}

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  
  // Use a fallback state so the page renders "Loading" instead of crashing
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      console.log("🚀 Fetching Issue:", params.slug);

      // QUERY: Checks both legacy and v2.0 schema locations
      const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]{
        ...,
        "coverImageUrl": coverImage.asset->url,
        
        // Location 1: Legacy Array
        signalImages[]{ "url": asset->url, asset },

        // Location 2: Nested Object (v2.0)
        signal {
          images[]{ "url": asset->url, asset }
        },

        // Location 3: Reference (v2.0)
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
        console.log("✅ Sanity Result:", result);
        
        if (result) {
          setData(result);
          setStatus('SUCCESS');
        } else {
          console.warn("❌ No data found for slug");
          setStatus('ERROR');
        }
      } catch (e) {
        console.error("❌ Sanity Fetch Error:", e);
        setStatus('ERROR');
      }
    };
    
    fetchData();
  }, [params?.slug]);

  if (status === 'LOADING') return <div className="min-h-screen bg-primary-bg flex items-center justify-center">Loading...</div>;
  if (status === 'ERROR' || !data) return <div className="min-h-screen bg-primary-bg flex items-center justify-center">Issue Not Found</div>;

  // --- DATA PROCESSING ---
  
  // Resolve Signal Data (Priority: Ref -> Inline -> Legacy)
  const resolvedSignal = data.signalRef || data.signal || {};
  const signalTitle = resolvedSignal.title || data.signalStudio;
  const signalContext = resolvedSignal.context || data.signalContext;
  const signalMethod = resolvedSignal.method || data.signalMethod;

  // Resolve Images
  const rawImages = resolvedSignal.images || data.signalImages || [];
  const processedImages = rawImages.map((img: any) => {
    if (img?.url) return img.url;
    return manualUrlBuilder(img);
  }).filter(Boolean); // Filter out nulls

  // Fallback for Hero
  const heroImage = data.coverImageUrl || manualUrlBuilder(data.coverImage) || '';

  // Fallback for Artifact
  const getArtifactImage = () => {
    if (!data.linkedArtifact) return null;
    const a = data.linkedArtifact;
    return a.imageUrl || a.coverImageUrl || manualUrlBuilder(a.image || a.coverImage);
  };

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={heroImage}
        />

        <ThesisModule text={data.thesisBody || data.thesis} />

        {/* SIGNAL SECTION */}
        <SignalAnalysis 
          studioName={signalTitle}
          context={signalContext}
          method={signalMethod}
          // Pass placeholders if processedImages is empty to prove component works
          images={processedImages.length > 0 ? processedImages : ['https://placehold.co/600x800/E5E5E5/A3A3A3?text=No+Images']} 
          tags={[]} 
        />

        {/* ARTIFACT SECTION */}
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