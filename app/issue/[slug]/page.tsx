'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';

// --- THE MANUAL BUILDER (Debug Version) ---
function manualUrlBuilder(source: any) {
  try {
    if (!source) return null;

    // 1. If it's already a full URL, return it
    if (typeof source === 'string' && source.startsWith('http')) return source;
    if (source.url && source.url.startsWith('http')) return source.url;

    // 2. Extract the Reference ID
    const ref = source?.asset?._ref || source?._ref || (typeof source === 'string' ? source : null);
    
    // Fallback: If no ref, return a placeholder so we know data exists but format is wrong
    if (!ref) return 'https://placehold.co/600x400/orange/white?text=Invalid+Ref+Format';

    // 3. Parse the Sanity ID
    const parts = ref.split('-');
    if (parts.length !== 4) return 'https://placehold.co/600x400/orange/white?text=Malformed+ID';

    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    
    // 4. Get Project Config
    let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    // Fallback: Try to grab from the client object
    if (!projectId && client) {
        const config = typeof client.config === 'function' ? client.config() : (client as any).config;
        if (config) projectId = config?.projectId;
        if (!projectId) projectId = (client as any).projectId;
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    // CRITICAL: If ID is missing, return a loud error image
    if (!projectId) {
      return 'https://placehold.co/600x400/red/white?text=MISSING+PROJECT+ID';
    }

    // 5. Return Constructed URL
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (e) {
    console.warn("ManualBuilder Exception:", e);
    return 'https://placehold.co/600x400/black/white?text=Builder+Exception';
  }
}

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      // Fetch data from all potential schema locations
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
        setData(result);
      } catch (e: any) {
        console.error("Sanity Fetch Error:", e);
        setError(e.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params?.slug]);

  // --- PROCESSING LOGIC ---
  const resolvedSignal = data?.signalRef || data?.signal || {};
  const rawImages = resolvedSignal.images || data?.signalImages || [];
  
  // Use map to generate URLs or placeholders
  const processedImages = rawImages.map((img: any) => {
    if (img?.url) return img.url;
    return manualUrlBuilder(img);
  });
  
  // Filter out strict nulls, but keep error placeholders
  const validImages = processedImages.filter(Boolean);

  const signalStudio = resolvedSignal.title || data?.signalStudio;
  const signalContext = resolvedSignal.context || data?.signalContext;
  const signalMethod = resolvedSignal.method || data?.signalMethod;

  const getHeroImage = () => data?.coverImageUrl || manualUrlBuilder(data?.coverImage) || '';
  const getArtifactImage = () => {
    if (!data?.linkedArtifact) return null;
    return data.linkedArtifact.imageUrl || manualUrlBuilder(data.linkedArtifact.image);
  };

  return (
    <>
      {/* 🔴 FORCE-VISIBLE DEBUG OVERLAY (Fixed Position) 🔴 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#1e293b', // slate-800
        color: '#ffffff',
        padding: '12px',
        zIndex: 99999, // Super high z-index
        fontSize: '11px',
        fontFamily: 'monospace',
        borderBottom: '4px solid #ef4444', // red-500
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ color: '#facc15' }}>DEBUGGER ACTIVE</strong><br/>
            STATUS: {loading ? 'Loading...' : error ? 'Error' : data ? 'Data Loaded' : 'No Data'}<br/>
            PROJECT ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅ Set' : '❌ MISSING'}
          </div>
          <div>
            RAW IMAGES: {rawImages.length}<br/>
            RESOLVED: {validImages.length}<br/>
            SOURCE: {data?.signalRef ? 'Reference Doc' : data?.signal ? 'Inline Object' : 'Legacy Array'}
          </div>
        </div>
      </div>

      <main className="bg-primary-bg min-h-screen relative pt-24 pb-20">
        {!loading && data && (
          <>
            <IssueHero 
              issueNumber={data.issueNumber}
              title={data.title}
              imageSrc={getHeroImage()}
            />

            <ThesisModule text={data.thesisBody || data.thesis} />

            {/* 📸 RAW DATA DUMP (To verify Sanity is returning data) */}
            {rawImages.length > 0 && validImages.length === 0 && (
               <div className="max-w-4xl mx-auto bg-red-100 p-4 mb-8 border border-red-400 text-red-900 rounded">
                 <strong>CRITICAL DEBUG:</strong> Sanity returned data, but URLs failed.
                 <pre className="mt-2 text-[10px] overflow-auto max-h-40 bg-white p-2">
                   {JSON.stringify(rawImages, null, 2)}
                 </pre>
               </div>
            )}

            {/* MAIN COMPONENT */}
            <SignalAnalysis 
              studioName={signalStudio}
              context={signalContext}
              method={signalMethod}
              images={validImages.length > 0 ? validImages : ['https://placehold.co/800x600/E5E5E5/A3A3A3?text=No+Valid+Images']} 
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
          </>
        )}

        {/* LOADING / ERROR STATES */}
        {loading && <div className="text-center py-20">Loading Data...</div>}
        {error && <div className="text-center py-20 text-red-600">Error: {error}</div>}
      </main>
    </>
  );
}