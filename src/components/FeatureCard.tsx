export function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/40 shadow-xl border border-white/20">
      <div className="mb-6 text-4xl">
        {title.includes('Learn') && '🤝'}
        {title.includes('Bugs') && '🐛'}
        {title.includes('Hello') && '🚀'}
      </div>
      <h3 className="text-2xl font-bold mb-4 font-mono">{title}</h3>
      <p className="text-lg text-white/90">{description}</p>
      <div className="mt-4 text-sm text-white/70">
        {title.includes('Learn') && '#MemeSquad'}
        {title.includes('Bugs') && '#FeatureNotBug'}
        {title.includes('Hello') && '#FromZeroToHero'}
      </div>
    </div>
  );
} 