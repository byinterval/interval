'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// --- THE MANUAL BUILDER (Bypasses Libraries) ---
function manualUrlBuilder(source: any) {
  try {
    // 1. Get the Reference ID (looks like: image-8273...-1000x800-jpg)
    const ref = source?.asset?._ref || source?._ref || source?.asset?.url;
    
    // If it's already a link, return it
    if (typeof ref === 'string' && ref.startsWith('http')) return ref;

    if (!ref) return null;

    // 2. Parse the ID
    // Pattern: image-{ID}-{WIDTH}x{HEIGHT}-{FORMAT}
    const parts = ref.split('-');
    if (parts.length !== 4) return null;

    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = 'production';

    // 3. Construct the String
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  } catch (e) {
    return null;
  }
}

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      // Fetch 'signalImages' with the asset reference
      const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]{
        ...,
        signalImages[]{ asset }, 
        linkedArtifact->{ ... }
      }`;
      
      try {
        const result = await client.fetch(query);
        console.log("🔥 SANITY DATA:", result);
        setData(result);
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchData();
  }, [params?.slug]);

  if (!data) return <div className="min-h-screen bg-primary-bg" />;

  // --- PROCESS IMAGES MANUALLY ---
  const rawImages = data.signalImages || [];
  
  const processedImages = rawImages.map((img: any) => {
    const url = manualUrlBuilder(img);
    console.log("🛠️ Generated URL:", url); // Check your console for this!
    return url;
  }).filter(Boolean);

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* DEBUG BAR: If you see this, the code is live */}
        <div className="w-full bg-orange-600 text-white text-center text-[10px] py-1 font-mono uppercase">
           Manual Builder Active • {processedImages.length} Images Generated
        </div>

        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={manualUrlBuilder(data.coverImage) || ''}
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
                   {manualUrlBuilder(data.linkedArtifact.image || data.linkedArtifact.coverImage) ? (
                      <img 
                        src={manualUrlBuilder(data.linkedArtifact.image || data.linkedArtifact.coverImage)!} 
                        alt="Artifact"
                        className="w-full h-full object-cover"
                      />
                   ) : <div className="w-full h-full bg-gray-200" />}
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