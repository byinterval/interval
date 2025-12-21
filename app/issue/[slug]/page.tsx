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

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) return;
      // FETCH EVERYTHING (No filtering, raw object)
      const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]`;
      try {
        const result = await client.fetch(query);
        setData(result);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [params?.slug]);

  if (!data) return <div className="p-10">Loading Detective...</div>;

  // --- THE ON-SCREEN DETECTIVE ---
  // We look for any field that might look like a list of images
  const candidateFields = Object.keys(data).filter(key => 
     Array.isArray(data[key]) && key !== 'moodTags' && key !== 'content'
  );

  return (
    <main className="bg-primary-bg min-h-screen relative">
      
      {/* 🕵️‍♂️ THE DEBUG OVERLAY (Black Box) */}
      <div className="fixed inset-0 z-[9999] bg-black/90 text-green-400 p-8 font-mono text-sm overflow-auto backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white mb-4">🕵️‍♂️ DATA INVESTIGATION</h1>
        
        <div className="mb-8 border border-green-800 p-4 bg-green-900/20 rounded">
          <h2 className="text-white font-bold mb-2">1. THE FIELD NAMES (Your "ID Card")</h2>
          <p className="break-words leading-relaxed text-xs text-green-300">
            {Object.keys(data).join(', ')}
          </p>
        </div>

        <div className="mb-8 border border-yellow-800 p-4 bg-yellow-900/20 rounded">
          <h2 className="text-white font-bold mb-2">2. SUSPICIOUS ARRAYS (Is your image list here?)</h2>
          {candidateFields.length > 0 ? (
            candidateFields.map(field => (
              <div key={field} className="mb-4">
                <span className="text-yellow-400 font-bold">{field}</span>: 
                <span className="ml-2 text-white">Found {data[field].length} items.</span>
                <pre className="mt-2 text-[10px] text-gray-400 bg-black p-2 rounded">
                  {JSON.stringify(data[field][0], null, 2).substring(0, 200)}...
                </pre>
              </div>
            ))
          ) : (
             <p className="text-red-400">No arrays found! The images might be hidden inside a "Page Builder" block.</p>
          )}
        </div>
        
        <p className="text-white/50 text-xs mt-8">
          Scroll down to see the normal site underneath...
        </p>
      </div>

      {/* NORMAL SITE CONTENT (Hidden underneath) */}
      <div className="opacity-20 pointer-events-none">
        <IssueHero 
          issueNumber={data.issueNumber} 
          title={data.title} 
          imageSrc={data.coverImage ? urlFor(data.coverImage).url() : ''} 
        />
      </div>

    </main>
  );
}