import { createClient } from 'next-sanity';
import { notFound } from 'next/navigation';

// 1. Setup Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// 2. The Page Component
export default async function IssuePage(props: any) {
  // SAFE PARAM HANDLING: Works for Next.js 14 OR 15
  const params = await Promise.resolve(props.params); 
  const slug = params.slug;

  console.log(`[Server] Looking for Issue: ${slug}`);

  // 3. Simple Fetch
  // We fetch EVERYTHING to see what the database actually returns
  const data = await client.fetch(
    `*[_type == "issue" && slug.current == $slug][0]`,
    { slug }
  );

  // 4. If no data, show a clear message
  if (!data) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace' }}>
        <h1 style={{ color: 'red' }}>ISSUE NOT FOUND</h1>
        <p>Searched for slug: <strong>{slug}</strong></p>
        <p>Result: Database returned null.</p>
        <hr />
        <h3>Debug Info:</h3>
        <pre>{JSON.stringify({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID }, null, 2)}</pre>
      </div>
    );
  }

  // 5. If data exists, dump it to the screen (Raw Mode)
  return (
    <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ color: 'green' }}>SUCCESS: DATA CONNECTED</h1>
      <p>The database connection is perfect. The error was in a UI Component.</p>
      
      <h3>Here is the raw data for Issue {slug}:</h3>
      <pre style={{ background: '#f0f0f0', padding: 20, borderRadius: 8, overflowX: 'scroll' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}