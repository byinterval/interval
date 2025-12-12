// app/page.tsx
import { client } from "@/lib/sanity";
import CalmEntry from './components/CalmEntry';
import MoodFilter from './components/MoodFilter';

async function getMoods() {
  // This is the "Atmospheric Search" logic bridge [cite: 155]
  return await client.fetch(`*[_type == "mood"]{title}`);
}

export default async function Home() {
  const moods = await getMoods();

  return (
    <CalmEntry>
      <section className="text-center mb-16">
        <p className="font-serif italic text-xl text-stone-600">
          "The only 5 minutes of calm you need this week." [cite: 11]
        </p>
      </section>

      {/* This now uses real data from your "Brain" */}
      <nav className="flex flex-wrap gap-4 border-y border-stone-200 py-6 my-8 justify-center">
        <span className="text-xs uppercase tracking-widest text-stone-400 w-full text-center mb-2">
          The Living Atlas: Filter by Mood [cite: 151, 187]
        </span>
        {moods.map((mood: any) => (
          <button key={mood.title} className="font-serif italic text-stone-600 hover:text-stone-900 px-2">
            {mood.title}
          </button>
        ))}
      </nav>

      <article className="space-y-8 mt-12">
        <h2 className="font-serif text-3xl">The Weekly Ritual [cite: 31, 34]</h2>
        <p className="leading-relaxed text-lg font-light text-stone-700">
          Welcome to a post-algorithmic alternative. This space is designed to de-fragment 
          your experience and replace "content soup" with a high-potency signal. [cite: 8, 12]
        </p>
        <div className="pt-8">
          <a href="/atlas" className="border border-stone-800 px-10 py-4 uppercase text-[10px] tracking-[0.3em] hover:bg-stone-900 hover:text-white transition-all duration-700">
            Explore the Living Atlas [cite: 60]
          </a>
        </div>
      </article>
    </CalmEntry>
  );
}