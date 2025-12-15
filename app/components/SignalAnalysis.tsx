'use client';
import Image from 'next/image';
import SaveButton from './SaveButton';

interface SignalAnalysisProps {
  studioName: string;
  context: string;
  method: string;
  tags: { label: string; value: string }[];
  images: string[];
}

export default function SignalAnalysis({ studioName, context, method, tags, images }: SignalAnalysisProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-primary-bg border-t border-secondary-bg">
      <div className="relative md:sticky md:top-0 h-auto md:h-screen overflow-y-auto no-scrollbar bg-secondary-bg">
        <div className="flex flex-col">
          {images.map((img, i) => (
            <div key={i} className="relative w-full aspect-[4/5] md:aspect-auto md:h-screen group">
              <Image src={img} alt={`Detail ${i}`} fill className="object-cover" />
              <SaveButton />
              <div className="absolute bottom-4 left-4 text-primary-bg/80 font-sans-body text-[10px] uppercase tracking-widest drop-shadow-sm">
                Fig. {i + 1} — Evidence
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-8 md:p-24 bg-primary-bg">
        <div className="max-w-md space-y-12">
          <div className="space-y-4">
             <span className="font-sans-body text-xs text-accent-brown uppercase tracking-[0.2em] block">
               II. The Signal
             </span>
             <h2 className="font-serif-title text-4xl md:text-5xl text-brand-ink leading-tight">
               {studioName}
             </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 border border-accent-brown/20 rounded-full font-sans-body text-[10px] uppercase tracking-wide text-accent-brown">
                {tag.label}: {tag.value}
              </span>
            ))}
          </div>
          <div className="space-y-8 font-serif-title text-lg leading-relaxed text-brand-ink/80">
            <div><strong className="block font-sans-body text-xs uppercase tracking-wider text-accent-brown mb-2">The Context</strong><p>{context}</p></div>
            <div><strong className="block font-sans-body text-xs uppercase tracking-wider text-accent-brown mb-2">The Method</strong><p>{method}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}