'use client';

interface ThesisProps {
  text: string;
}

export default function ThesisModule({ text }: ThesisProps) {
  return (
    <section className="py-24 md:py-32 px-6 bg-primary-bg">
      <div className="max-w-3xl mx-auto text-center">
        {/* Decorative Divider */}
        <div className="w-px h-16 bg-accent-brown/20 mx-auto mb-12" />
        
        <div className="prose prose-xl md:prose-2xl mx-auto">
          <p className="font-serif-title text-3xl md:text-4xl leading-relaxed text-brand-ink">
            {text}
          </p>
        </div>
        
        {/* Decorative Divider */}
        <div className="w-px h-16 bg-accent-brown/20 mx-auto mt-12" />
      </div>
    </section>
  );
}