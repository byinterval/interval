'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/lib/sanity';

// TEMPORARY: Commenting out child components to isolate the crash
// import IssueHero from '../../components/IssueHero';
// import ThesisModule from '../../components/ThesisModule';
// import SignalAnalysis from '../../components/SignalAnalysis';
// import ArtifactButton from '../../components/ArtifactButton';

export default function IssuePage() {
  const params = useParams();
  const [status, setStatus] = useState('INIT');
  const [debugData, setDebugData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 PAGE MOUNTED. Slug:", params?.slug);
    
    const fetchData = async () => {
      if (!params?.slug) {
        setStatus('NO_SLUG');
        return;
      }

      setStatus('FETCHING');
      try {
        console.log("📡 Client Config:", client.config());
        
        // SIMPLEST POSSIBLE QUERY TO TEST CONNECTION
        // Fetches everything to see what raw data looks like
        const query = `*[_type == "issue" && slug.current == "${params.slug}"][0]`;
        const result = await client.fetch(query);
        
        console.log("🔥 RAW SANITY RESULT:", result);

        if (result) {
          setDebugData(result);
          setStatus('SUCCESS');
        } else {
          setStatus('EMPTY_RESULT');
        }

      } catch (e: any) {
        console.error("❌ FETCH ERROR:", e);
        setError(e.message);
        setStatus('ERROR');
      }
    };

    fetchData();
  }, [params?.slug]);

  // --- MANUAL URL BUILDER (Inline for Debugging) ---
  const buildUrl = (source: any) => {
    if (!source) return 'NULL_SOURCE';
    try {
      const ref = source?.asset?._ref || source?._ref;
      if (!ref) return 'NO_REF';
      
      const parts = ref.split('-');
      // Format: image-ID-WIDTHxHEIGHT-FORMAT
      const id = parts[1];
      const dimensions = parts[2];
      const format = parts[3];
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'MISSING_ENV';
      const dataset = 'production';
      
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
    } catch (e) {
      return 'BUILD_ERROR';
    }
  };

  // --- RAW IMAGE EXTRACTION ---
  const rawImages = debugData?.signalImages || debugData?.signal?.images || [];
  const debugUrls = rawImages.map((img: any) => buildUrl(img));

  // RENDER: Raw HTML only (No complex components)
  // This layout ensures NOTHING can hide the debug info
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#fff', color: '#000', minHeight: '100vh', zIndex: 99999, position: 'relative' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'red', borderBottom: '2px solid red' }}>
        NUCLEAR DEBUG MODE
      </h1>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }}>
        <strong>STATUS:</strong> {status}<br/>
        <strong>ERROR:</strong> {error || 'None'}<br/>
        <strong>SLUG:</strong> {params?.slug}<br/>
        <strong>PROJECT ID ENV:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ MISSING (Check Vercel/Netlify Env Vars)'}
      </div>

      <h2 style={{ fontSize: '18px', marginTop: '20px', fontWeight: 'bold' }}>1. Raw Data Check</h2>
      <p>If this is empty, Sanity is returning nothing.</p>
      <pre style={{ background: '#eee', padding: '10px', overflowX: 'auto', maxHeight: '300px', fontSize: '11px' }}>
        {JSON.stringify(debugData, null, 2)}
      </pre>

      <h2 style={{ fontSize: '18px', marginTop: '20px', fontWeight: 'bold' }}>2. Image URL Check</h2>
      <p>Attempting to manually build URLs from data...</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
         {debugUrls.map((url: string, i: number) => (
           <div key={i} style={{ border: '1px solid #ccc', padding: '5px' }}>
             <img src={url} alt="debug" style={{ width: '100px', height: '100px', objectFit: 'cover', background: '#ccc' }} />
             <div style={{ fontSize: '10px', maxWidth: '100px', wordBreak: 'break-all' }}>{url}</div>
           </div>
         ))}
         {debugUrls.length === 0 && <div>No images found in data.</div>}
      </div>

      {/* INSTRUCTIONS:
        If you see the JSON above, UNCOMMENT the components below one by one 
        to find which one crashes the page. 
      */}
      
      {/* {status === 'SUCCESS' && (
        <div style={{ marginTop: '50px', borderTop: '2px dashed red' }}>
           <h3>Visual Test Area (Uncomment in code to test)</h3>
           <IssueHero ... />
        </div>
      )} 
      */}
    </div>
  );
}