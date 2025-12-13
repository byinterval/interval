'use client';

export default function ArtifactButton({ link, title }: { link: string, title: string }) {
  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full md:w-auto max-w-sm mt-8"
    >
      <div className="border border-secondary-bg bg-white p-6 transition-all duration-500 hover:shadow-xl hover:border-accent-brown/20">
        <span className="block font-sans-body text-[10px] uppercase tracking-[0.2em] text-accent-brown mb-3">
          Ritual Object
        </span>
        <h4 className="font-serif-title text-xl text-brand-ink mb-4 group-hover:text-accent-brown transition-colors">
          {title}
        </h4>
        <div className="flex items-center space-x-2 text-xs font-sans-body uppercase tracking-wider text-brand-ink border-b border-brand-ink pb-1 w-max group-hover:border-accent-brown group-hover:text-accent-brown transition-colors">
          <span>Acquire the Artifact</span>
          <span>→</span>
        </div>
      </div>
    </a>
  );
}