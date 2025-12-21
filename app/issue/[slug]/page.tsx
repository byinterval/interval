import { notFound } from 'next/navigation';
// USE THE SHARED CLIENT (Same as Atlas)
import { client } from '@/lib/sanity'; 
import { urlFor } from '@/lib/image';
import IssueHero from '../../components/IssueHero';
import ThesisModule from '../../components/ThesisModule';
import SignalAnalysis from '../../components/SignalAnalysis';
import ArtifactButton from '../../components/ArtifactButton';
import CalmEntry from '../../components/CalmEntry';

export const revalidate = 0; // Force dynamic data fetching (Disable Cache)

async function getIssueData(slug: string) {
  try {
    // 1. SIMPLE QUERY (No complex coalescing)
    // We fetch the raw arrays exactly as they are in the database.
    const query = `*[_type == "issue" && slug.current == $slug][0]{
      "slug": slug.current,
      issueNumber,
      title,
      coverImage,
      "thesis": coalesce(thesisBody, thesis),
      
      // RAW DATA FETCHING
      signalStudio,
      signalContext,
      signalMethod,
      signalImages, 
      images, // Legacy support
      
      cityTag->,
      seasonTag->,
      moodTags[]->,

      "artifact": linkedArtifact->{
        title,
        subtitle,
        description,
        curatorNote,
        note,
        body,
        // FETCH RAW ARTIFACT IMAGE
        image,
        coverImage,
        mainImage,
        photo,
        asset,
        link
      }
    }`;

    const data = await client.fetch(query, { slug });
    return data;

  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return null;
  }
}

export default async function IssuePage(props: any) {
  const params = await Promise.resolve(props.params);
  const data = await getIssueData(params.slug);

  if (!data) notFound();

  // --- PRE-PROCESS DATA (Like Atlas does) ---
  
  // 1. Resolve Signal Images
  // We check signalImages -> then images -> then coverImage
  let rawSignalImages = data.signalImages || data.images || [];
  if (rawSignalImages.length === 0 && data.coverImage) {
    rawSignalImages = [data.coverImage];
  }

  // 2. Resolve Tags
  const city = data.cityTag?.title || data.cityTag?.label || data.cityTag?.name || "City";
  const season = data.seasonTag?.title || data.seasonTag?.label || data.seasonTag?.name || "Season";
  const moodTags = (data.moodTags || []).map((t: any) => ({ label: "Mood", value: t.title }));

  // 3. Resolve Artifact Image
  const artImg = data.artifact?.image || data.artifact?.coverImage || data.artifact?.mainImage || data.artifact?.photo || data.artifact?.asset;
  let artifactImageUrl = null;
  if (artImg) {
    try { artifactImageUrl = urlFor(artImg).url(); } catch (e) {}
  }

  // 4. Resolve Artifact Note
  const artNote = data.artifact?.description || data.artifact?.curatorNote || data.artifact?.note || "The object speaks for itself.";

  return (
    <CalmEntry>
      <main className="bg-primary-bg min-h-screen">
        
        {/* HERO */}
        {/* We use urlFor to ensure the cover image works */}
        <IssueHero 
          issueNumber={data.issueNumber || "00"}
          title={data.title || "Untitled"}
          imageSrc={data.coverImage ? urlFor(data.coverImage).url() : ''}
        />

        {/* THESIS */}
        <ThesisModule text={data.thesis} />

        {/* SIGNAL */}
        {/* We pass the RAW objects to the component, which now handles urlFor */}
        <SignalAnalysis 
          studioName={data.signalStudio}
          context={data.signalContext}
          method={data.signalMethod}
          images={rawSignalImages} 
          tags={[
            { label: "City", value: city },
            { label: "Season", value: season },
            ...moodTags
          ]} 
        />

        {/* ARTIFACT */}
        <section className="py-24 px-6 min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0]">
          <span className="mb-12 font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown/60">
            III. The Artifact
          </span>
          <div className="w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
            <div className="w-full h-[500px] bg-[#E5E5E5] relative overflow-hidden">
              {artifactImageUrl ? (
                <img 
                  src={artifactImageUrl} 
                  alt={data.artifact?.title || "Artifact"}
                  className="w-full h-full object-cover block"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                  No Image Data
                </div>
              )}
            </div>
            <div className="p-12 flex flex-col items-center text-center bg-white">
              <h3 className="mb-4 font-serif-title text-2xl text-gray-900">
                {data.artifact?.title || 'Untitled'}
              </h3>
              <p className="mb-8 font-sans-body text-xs leading-relaxed text-gray-500 max-w-[280px]">
                {artNote}
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