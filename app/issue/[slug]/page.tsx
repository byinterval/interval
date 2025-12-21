'use client';

// v11.0 - SELF-CONTAINED FIX
// We have INLINED the components to bypass build errors.
// This guarantees the page will build if the basic environment works.

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Attempt to import client. If this fails, we will handle it gracefully or you might need to adjust this path.
// Standard path assumption: app/issue/[slug]/page.tsx -> ../../../lib/sanity
import { client } from '../../../lib/sanity'; 

// --- INLINE COMPONENTS (To fix "Cannot find module" build errors) ---

const IssueHero = ({ title, issueNumber, imageSrc }: any) => (
  <header className="relative w-full h-[60vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
    {imageSrc && (
      <img src={imageSrc} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-50" />
    )}
    <div className="relative z-10 text-center p-4">
      <p className="text-xs uppercase tracking-[0.2em] mb-2">Issue {issueNumber}</p>
      <h1 className="text-4xl md:text-6xl font-serif font-light">{title}</h1>
    </div>
  </header>
);

const ThesisModule = ({ text }: any) => (
  <section className="py-20 px-6 max-w-3xl mx-auto text-center">
    <h2 className="text-xs font-bold tracking-widest text-stone-400 mb-6 uppercase">I. The Thesis</h2>
    <p className="text-xl md:text-2xl font-serif leading-relaxed text-stone-800">{text}</p>
  </section>
);

const SignalAnalysis = ({ studioName, context, method, images }: any) => (
  <section className="bg-stone-50 py-20 px-6 border-t border-stone-200">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="grid gap-6">
        {(images || []).map((url: string, i: number) => (
          <img key={i} src={url} alt="Signal Detail" className="w-full h-auto shadow-sm" />
        ))}
        {(!images || images.length === 0) && (
          <div className="p-10 bg-gray-200 text-gray-500 text-center text-xs font-mono">
            NO SIGNAL IMAGES FOUND
          </div>
        )}
      </div>
      <div className="sticky top-20">
        <h2 className="text-xs font-bold tracking-widest text-stone-400 mb-6 uppercase">II. The Signal</h2>
        <h3 className="text-3xl font-serif mb-6 text-stone-900">{studioName}</h3>
        <div className="space-y-6 text-stone-600 font-serif leading-relaxed">
          <p>{context}</p>
          <div className="pl-4 border-l-2 border-stone-300">
            <p className="italic">{method}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ArtifactButton = ({ title, link }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity">
    {title} &rarr;
  </a>
);

// --- ROBUST URL BUILDER ---
const manualUrlBuilder = (source: any) => {
  if (!source) return null;
  try {
    if (typeof source === 'string' && source.startsWith('http')) return source;
    if (source.url && typeof source.url === 'string' && source.url.startsWith('http')) return source.url;

    const ref = source.asset?._ref || source._ref;
    if (typeof ref !== 'string') return null;

    const parts = ref.split('-');
    if (parts.length !== 4) return null;
    
    const [_, id, dimensions, format] = parts;

    // Resolve Project ID
    let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    
    // Fallback: Try to grab from the client object
    if (!projectId && client) {
      try {
        const config = (client as any).config ? 
          (typeof (client as any).config === 'function' ? (client as any).config() : (client as any).config) 
          : null;
        if (config?.projectId) projectId = config.projectId;
      } catch (err) {}
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    if (!projectId) {
      return `https://placehold.co/600x400/red/white?text=MISSING+ID`;
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
          signalImages[]{ "url": asset->url, asset },
          signal { images[]{ "url": asset->url, asset } },
          "signalRef": signal->{
             title, context, method,
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

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center p-10 font-mono text-sm text-gray-500">LOADING v11.0...</div>;
  if (error || !data) return <div className="min-h-screen bg-white flex items-center justify-center p-10 font-mono text-sm text-red-500">ERROR: {error}</div>;

  // --- DATA PROCESSING ---
  const resolvedSignal = data.signalRef || data.signal || {};
  const rawImages = resolvedSignal.images || data.signalImages || [];
  
  const processedImages = Array.isArray(rawImages) ? rawImages.map((img: any) => {
    if (img?.url) return img.url;
    return manualUrlBuilder(img);
  }).filter(Boolean) as string[] : [];

  const finalImages = processedImages.length > 0 ? processedImages : [
    'https://placehold.co/800x600/E5E5E5/A3A3A3?text=No+Signal+Images',
  ];

  const heroImage = data.coverImageUrl || manualUrlBuilder(data.coverImage) || '';
  
  const getArtifactImage = () => {
    if (!data.linkedArtifact) return null;
    const a = data.linkedArtifact;
    return a.imageUrl || a.coverImageUrl || manualUrlBuilder(a.image || a.coverImage);
  };

  return (
    <main className="bg-white min-h-screen relative pb-20">
      <IssueHero 
        issueNumber={data.issueNumber}
        title={data.title}
        imageSrc={heroImage}
      />

      <ThesisModule text={data.thesisBody || data.thesis} />

      <SignalAnalysis 
        studioName={resolvedSignal.title || data.signalStudio || "Studio"}
        context={resolvedSignal.context || data.signalContext}
        method={resolvedSignal.method || data.signalMethod}
        images={finalImages} 
      />

      <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0]">
        <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-gray-400">
          III. The Artifact
        </span>
        {data.linkedArtifact && (
           <div className="w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
              <div className="w-full h-[500px] bg-gray-200 relative overflow-hidden">
                 {getArtifactImage() ? (
                    <img 
                      src={getArtifactImage()!} 
                      alt={data.linkedArtifact.title}
                      className="w-full h-full object-cover"
                    />
                 ) : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>}
              </div>
              <div className="p-12 flex flex-col items-center text-center bg-white">
                <h3 className="mb-4 font-serif text-2xl text-gray-900">{data.linkedArtifact.title}</h3>
                <p className="mb-8 font-sans text-xs leading-relaxed text-gray-500 max-w-[280px]">
                  {data.linkedArtifact.note || data.linkedArtifact.description}
                </p>
                <ArtifactButton title="Acquire" link={data.linkedArtifact.link || '#'} />
              </div>
           </div>
        )}
      </section>

      {/* VERSION BADGE - If you see this, the deploy worked */}
      <div style={{
        position: 'fixed', bottom: '10px', right: '10px', 
        background: 'green', color: 'white', padding: '4px 8px', 
        borderRadius: '4px', zIndex: 99999, fontSize: '10px', fontFamily: 'monospace'
      }}>
        v11.0 (Inlined)
      </div>
    </main>
  );
}