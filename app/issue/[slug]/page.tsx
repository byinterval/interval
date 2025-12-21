import { notFound } from 'next/navigation';
import { createClient } from 'next-sanity';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

// 1. CONFIGURATION
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// --- HELPER: THE IMAGE HUNTER ---
// This function recursively looks for a URL in the raw Sanity data.
// It solves the "Nested Object" problem.
function extractUrl(item: any): string | null {
  if (!item) return null;
  if (typeof item === 'string') return item; // It's already a URL
  
  // Check standard locations
  if (item.asset?.url) return item.asset.url; 
  if (item.url) return item.url;
  
  // Check nested object locations (common in Page Builders)
  if (item.image?.asset?.url) return item.image.asset.url;
  if (item.photo?.asset?.url) return item.photo.asset.url;
  if (item.file?.asset?.url) return item.file.asset.url;
  
  return null;
}

// 2. DATA FETCHING
async function getIssueData(slug: string) {
  try {
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      "issueNumber": coalesce(issueNumber, "00"),
      "title": coalesce(title, "Untitled"),
      "coverImage": coverImage.asset->url,
      "thesis": coalesce(thesisBody, thesis, ""),
      
      "signal": {
        "studio": coalesce(signalStudio, "Unknown Studio"),
        "context": coalesce(signalContext, ""),
        "method": coalesce(signalMethod, ""),
        
        // --- FETCH RAW DATA ---
        // We fetch the 'signalImages' array with full expansion of the 'asset' reference.
        // We DO NOT try to guess the path here. We grab it all.
        "rawSignalImages": signalImages[]{
            ..., 
            asset->{url},
            "image": image { asset->{url} }
        },
        
        // Fallback: Check 'images' field (legacy name)
        "rawGallery": images[]{
            ..., 
            asset->{url}
        },
        
        "geoTag": coalesce(cityTag->title, cityTag->label, cityTag->name, "City"),
        "seasonTag": coalesce(seasonTag->title, seasonTag->label, seasonTag->name, "Season"),
        "moodTags": moodTags[]->title
      },

      "artifact": linkedArtifact->{
        title,
        subtitle,
        "note": coalesce(description, curatorNote, note, pt::text(body), subtitle, ""),
        "imageSrc": coalesce(
            image.asset->url,
            coverImage.asset->url,
            mainImage.asset->url,
            photo.asset->url,
            artifactImage.asset->url,
            asset->url
        ),
        link
      }
    }`;

    const data = await client.fetch(query, { slug });
    
    if (!data) return null;

    // 3. LOGIC: EXTRACT & FALLBACK
    // Run the 'extractUrl' hunter on whatever array we found.
    const signalUrls = (data.signal.rawSignalImages || []).map(extractUrl).filter(Boolean);
    const galleryUrls = (data.signal.rawGallery || []).map(extractUrl).filter(Boolean);

    // Decision Logic: Signal Images > Gallery > Cover Image
    const finalImages = signalUrls.length > 0 
      ? signalUrls 
      : galleryUrls.length > 0 
        ? galleryUrls 
        : [data.coverImage].filter(Boolean);

    data.signal.images = finalImages;

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// 4. PAGE COMPONENT
export default async function IssuePage(props: any) {
  const params = await Promise.resolve(props.params);
  const data = await getIssueData(params.slug);

  if (!data) notFound();

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* HERO */}
        <IssueHero 
          issueNumber={data.issueNumber}
          title={data.title}
          imageSrc={data.coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000'}
        />

        {/* THESIS */}
        <ThesisModule text={data.thesis} />

        {/* SIGNAL */}
        <SignalAnalysis 
          studioName={data.signal.studio}
          context={data.signal.context}
          method={data.signal.method}
          images={data.signal.images} 
          tags={[
            { label: "City", value: data.signal.geoTag },
            { label: "Season", value: data.signal.seasonTag },
            ...(data.signal.moodTags || []).map((tag: string) => ({ label: "Mood", value: tag }))
          ].filter(t => t.value)} 
        />

        {/* ARTIFACT */}
        <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0]">
          <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60">
            III. The Artifact
          </span>
          <div className="w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
            <div className="w-full h-[500px] bg-[#E5E5E5] relative overflow-hidden">
              {data.artifact?.imageSrc ? (
                <img 
                  src={data.artifact.imageSrc} 
                  alt={data.artifact.title}
                  className="w-full h-full object-cover block"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                  No Image Found
                </div>
              )}
            </div>
            <div className="p-12 flex flex-col items-center text-center bg-white">
              <h3 className="mb-4 font-serif-title text-2xl text-gray-900">
                {data.artifact?.title || 'Untitled Artifact'}
              </h3>
              <p className="mb-8 font-sans-body text-xs leading-relaxed text-gray-500 max-w-[280px]">
                {data.artifact?.note}
              </p>
              <div className="mb-8 h-px w-12 bg-gray-200" />
              <ArtifactButton 
                title="Acquire the Edition" 
                link={data.artifact?.link || '#'} 
              />
            </div>
          </div>
        </section>

      </main>
    </CalmEntry>
  );
}