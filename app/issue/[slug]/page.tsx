'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';
import { urlFor } from '@/lib/image';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

export default function IssuePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      
      try {
        // 1. TARGET 'signalImages' DIRECTLY
        const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]{
          ...,
          signalImages, 
          linkedArtifact->{ ... }
        }`;
        
        const result = await client.fetch(query);
        console.log("✅ FRESH DATA:", result); // Verify in console
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params?.slug]);

  if (loading) return <div className="min-h-screen bg-primary-bg" />;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Issue not found</div>;

  // 2. PROCESS IMAGES
  // We take the specific 'signalImages' field and convert it to URLs
  const rawImages = data.signalImages || [];
  
  const processedImages = rawImages.map((img: any) => {
    try {
      return urlFor(img).width(1200).url();
    } catch (e) {
      return null;
    }
  }).filter(Boolean); // Removes any nulls

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage ? urlFor(data.coverImage).url() : ''}
        />

        <ThesisModule text={data.thesisBody || data.thesis} />

        {/* 3. PASS CLEAN URLS TO COMPONENT */}
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
                   {data.linkedArtifact.image || data.linkedArtifact.coverImage ? (
                      <img 
                        src={urlFor(data.linkedArtifact.image || data.linkedArtifact.coverImage).url()} 
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