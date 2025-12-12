// app/components/ArtifactButton.tsx
'use client';

export default function ArtifactButton({ link, title }: { link: string, title: string }) {
  return (
    <a 
      href={link}
      onClick={() => {
        // In the future, you connect Mixpanel here to track "Artifact CTR" [cite: 66]
        console.log(`User clicked Artifact: ${title}`); 
      }}
      target="_blank"
      // "Anti-Ad Framing": Simple, elegant styling [cite: 60]
      className="inline-block border-b border-stone-400 pb-1 hover:border-stone-900 transition-colors"
    >
      Acquire: {title}
    </a>
  )
}