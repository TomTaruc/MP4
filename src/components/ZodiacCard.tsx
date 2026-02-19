import { ZodiacSign } from '../types';

interface ZodiacCardProps {
  sign: ZodiacSign;
  size?: 'sm' | 'lg';
}

export default function ZodiacCard({ sign, size = 'sm' }: ZodiacCardProps) {
  const isLarge = size === 'lg';

  return (
    <div
      className={`rounded-2xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 ${isLarge ? 'p-8' : 'p-5'}`}
      style={{
        background: `radial-gradient(ellipse at top, ${sign.color_hex}22 0%, #1A0533 100%)`,
        borderColor: `${sign.color_hex}44`,
        boxShadow: `0 0 30px ${sign.color_hex}22`,
      }}
    >
      <div
        className={`rounded-full flex items-center justify-center mb-3 ${isLarge ? 'w-24 h-24 text-5xl' : 'w-14 h-14 text-3xl'}`}
        style={{
          background: `radial-gradient(circle, ${sign.color_hex}33, transparent)`,
          border: `2px solid ${sign.color_hex}55`,
          boxShadow: `0 0 20px ${sign.color_hex}33`,
        }}
      >
        {sign.symbol}
      </div>
      <h3
        className={`font-bold text-white ${isLarge ? 'text-2xl mb-1' : 'text-base mb-0.5'}`}
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {sign.sign_name}
      </h3>
      <p className={`text-purple-300 ${isLarge ? 'text-sm mb-3' : 'text-xs mb-2'}`}>{sign.date_range}</p>
      {isLarge && (
        <>
          <div className="flex gap-4 text-sm mb-3">
            <span className="text-cyan-400">
              <span className="text-purple-400 text-xs uppercase tracking-wider block">Element</span>
              {sign.element}
            </span>
            <span className="text-cyan-400">
              <span className="text-purple-400 text-xs uppercase tracking-wider block">Ruler</span>
              {sign.ruling_planet}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {sign.traits.split(',').slice(0, 3).map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: `${sign.color_hex}22`, color: sign.color_hex, border: `1px solid ${sign.color_hex}44` }}>
                {t.trim()}
              </span>
            ))}
          </div>
        </>
      )}
      {!isLarge && (
        <div className="flex gap-2 text-xs">
          <span style={{ color: sign.color_hex }}>{sign.element}</span>
          <span className="text-purple-500">•</span>
          <span className="text-purple-300">{sign.ruling_planet}</span>
        </div>
      )}
    </div>
  );
}
