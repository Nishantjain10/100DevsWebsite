export function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/40 shadow-xl border border-white/20">
      <div className="mb-4 text-3xl">
        {author.includes('Meme') ? '🎭' : '💻'}
      </div>
      <p className="italic mb-6 text-xl leading-relaxed">"{quote}"</p>
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg">- {author}</p>
        <div className="text-sm opacity-70">
          {author.includes('Meme') ? '#MemesMakeTheTeam' : '#CodingNeverSleeps'}
        </div>
      </div>
    </div>
  );
} 