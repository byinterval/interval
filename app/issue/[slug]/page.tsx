import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// 1. Setup Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // Ensure we have permission
});

// 2. Data Fetching
async function getIssueData(slug: string) {
  try {
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled"),
      "coverImage": coverImage.asset->url,
      "thesis": coalesce(thesis, ""),
      signal {
        "studio": coalesce(studio, "Unknown Studio"),
        "context": coalesce(context, ""),
        "method": coalesce(method, ""),
        "geoTag": coalesce(geoTag, ""),
        "seasonTag": coalesce(seasonTag, ""),
        "moodTags": coalesce(moodTags, []),
        "images": coalesce(images[].asset->url, [])
      },
      artifact {
        "title": coalesce(title, "Artifact"),
        "subtitle": coalesce(subtitle, ""),
        "imagePlaceholder": image.asset->url,
        "link": coalesce(link, "#")
      }
    }`;

    const data = await client.fetch(query, { slug });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// 3. The Page Component
// Notice: We type 'params' as a Promise to support Next.js 15
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function IssuePage(props: Props) {
  // CRITICAL FIX: Await the params before using them
  const params = await props.params;
  const { slug } = params;

  const data = await getIssueData(slug);

  // --- DEBUG MODE ---
  // If data is missing, we SHOW WHY instead of 404ing immediately.
  if (!data) {
    return (
      <div className="min-h-screen bg-white text-black p-12 font-mono">
        <h1 className="text-2xl font-bold text-red-600 mb-4">DIAGNOSTIC REPORT</h1>
        <div className="space-y-4 border p-4 bg-gray-50">
          <p><strong>Status:</strong> Issue not found in database.</p>
          <p><strong>Searching for Slug:</strong> <span className="bg-yellow-200 px-2">"{slug}"</span></p>
          <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? "Connected (Exists)" : "MISSING!"}</p>
          <p><strong>Dataset:</strong> production</p>
          <hr className="border-gray-300"/>
          <p className="text-sm text-gray-600">
            <strong>Possible Fixes:</strong><br/>
            1. Check Sanity Studio. Is the slug <em>exactly</em> "{slug}"?<br/>
            2. Is the issue <strong>Published</strong> (Green button clicked)?<br/>
            3. Are there hidden spaces? (e.g. "issue-01 " vs "issue-01")
          </p>
        </div>
      </div>
    );
  }

  // --- STANDARD RENDER (If data exists) ---
  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'}
        />
        <ThesisModule text={data.thesis} />
        <SignalAnalysis 
          studioName={data.signal?.studio}
          context={data.signal?.context}
          method={data.signal?.method}
          images={data.signal?.images}
          tags={[
            { label: "City", value: data.signal?.geoTag },
            { label: "Season", value: data.signal?.seasonTag },
            ...(data.signal?.moodTags || []).map((tag: string) => ({ label: "Mood", value: tag }))
          ].filter(t => t.value)} 
        />
        <section className="py-32 bg-secondary-bg flex flex-col items-center justify-center text-center px-6">
          <div className="bg-white p-12 max-w-lg w-full border border-accent-brown/10 shadow-xl">
             <h3 className="font-serif-title text-2xl text-brand-ink mb-2">{data.artifact?.title}</h3>
             <ArtifactButton title="Acquire" link={data.artifact?.link} />
          </div>
        </section>
      </main>
    </CalmEntry>
  );
}