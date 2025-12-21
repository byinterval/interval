'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// VERSION LABEL: Check for this in the bottom-right corner of your screen
const DEPLOY_VERSION = "v6.0";

// --- ROBUST URL BUILDER ---
// Safely constructs URLs even if Sanity data is messy
const manualUrlBuilder = (source: any) => {
  if (!source) return null;

  try {
    // 1. Direct URL check
    if (typeof source === 'string' && source.startsWith('http')) return source;
    if (source.url && typeof source.url === 'string' && source.url.startsWith('http')) return source.url;

    // 2. Extract Reference
    const ref = source.asset?._ref || source._ref;
    if (typeof ref !== 'string') return null;

    // 3. Parse ID
    // Example: image-5d3...-1000x800-jpg
    const parts = ref.split('-');
    if (parts.length !== 4) return null;
    
    const [_, id, dimensions, format] = parts;

    // 4. Resolve Project ID
    let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    // Fallback: Try to get from client config safely
    if (!projectId && client) {
      try {
        const config = (client as any).config ? 
          (typeof (client as any).config === 'function' ? (client as any).config() : (client as any).config) 
          : null;
        if (config?.projectId) projectId = config.projectId;
      } catch (err) {
        // Ignore config errors
      }
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    // 5. Fallback Placeholder if Project ID is truly missing
    if (!projectId) {
      return `https://placehold.co/600x400/E5E5E5/A3A3A3?text=Missing+Project+ID`;
    }

    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (error) {
    return null;
  }
};

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;

      try {
        // Query looks in multiple places for image data to ensure we find it
        const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]{
          ...,
          "coverImageUrl": coverImage.asset->url,
          
          // Legacy location
          signalImages[]{ "url": asset->url, asset },

          // New v2.0 location (Inline Object)
          signal {
            images[]{ "url": asset->url, asset }
          },

          // New v2.0 location (Reference)
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

        const result = await client.fetch(query);
        
        if (result) {
          setData(result);
        } else {
          setError("Issue not found");
        }
      } catch (err: any) {
        console.error("Fetch failed:", err);
        setError(err.message || "Failed to load issue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="animate-pulse text-xs uppercase tracking-widest text-gray-400">Loading Issue...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-red-500 text-sm font-mono">Error: {error || "Data unavailable"}</div>
      </div>
    );
  }

  // --- DATA PROCESSING ---
  
  // 1. Resolve Signal Content (Ref > Inline > Legacy)
  const resolvedSignal = data.signalRef || data.signal || {};
  const signalTitle = resolvedSignal.title || data.signalStudio;
  const signalContext = resolvedSignal.context || data.signalContext;
  const signalMethod = resolvedSignal.method || data.signalMethod;

  // 2. Resolve Images
  const rawImages = resolvedSignal.images || data.signalImages || [];
  
  // Map raw data to valid URLs
  const processedImages = Array.isArray(rawImages) ? rawImages.map((img: any) => {
    if (img?.url) return img.url;
    return manualUrlBuilder(img);
  }).filter(Boolean) as string[] : [];

  // Fallback: If no images found, use placeholders to prove layout works
  const finalImages = processedImages.length > 0 ? processedImages : [
    'https://placehold.co/800x600/E5E5E5/A3A3A3?text=No+Signal+Images',
    'https://placehold.co/800x600/E5E5E5/A3A3A3?text=Check+Sanity+Data'
  ];

  // 3. Resolve Other Images
  const heroImage = data.coverImageUrl || manualUrlBuilder(data.coverImage) || '';
  
  const getArtifactImage = () => {
    if (!data.linkedArtifact) return null;
    const a = data.linkedArtifact;
    return a.imageUrl || a.coverImageUrl || manualUrlBuilder(a.image || a.coverImage);
  };

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen relative pb-20">
        
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={heroImage}
        />

        <ThesisModule text={data.thesisBody || data.thesis} />

        {/* SIGNAL SECTION */}
        <SignalAnalysis 
          studioName={signalTitle || "Unknown Studio"}
          context={signalContext || "No context provided."}
          method={signalMethod || "No method provided."}
          images={finalImages} 
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

        {/* DEPLOYMENT VERIFICATION BADGE */}
        <div className="fixed bottom-4 right-4 bg-black text-white text-[10px] px-2 py-1 font-mono rounded z-50 opacity-50 hover:opacity-100">
           {DEPLOY_VERSION}
        </div>

      </main>
    </CalmEntry>
  );
}