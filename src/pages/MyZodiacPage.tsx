import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ZodiacSign } from '../types';

export default function MyZodiacPage() {
  const { profile } = useAuth();
  const [sign, setSign] = useState<ZodiacSign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.zodiac_sign) return;
    supabase.from('zodiac_signs').select('*').eq('sign_name', profile.zodiac_sign).maybeSingle()
      .then(({ data }) => { setSign(data); setLoading(false); });
  }, [profile]);

  if (loading) return <div className="p-8 text-purple-300">Loading your cosmic profile...</div>;
  if (!sign) return <div className="p-8 text-purple-300">No zodiac data found.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>My Zodiac Sign</h1>
        <p className="text-purple-400 text-sm">Your celestial blueprint</p>
      </div>

      {/* Main sign card */}
      <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top left, ${sign.color_hex}22 0%, #1A0533 70%)`,
          border: `1px solid ${sign.color_hex}44`,
          boxShadow: `0 0 60px ${sign.color_hex}20`,
        }}>
        <div className="absolute top-4 right-4 text-8xl opacity-10 select-none">{sign.symbol}</div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-6xl flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${sign.color_hex}44, transparent)`,
              border: `2px solid ${sign.color_hex}66`,
              boxShadow: `0 0 30px ${sign.color_hex}33`,
            }}>
            {sign.symbol}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{sign.sign_name}</h2>
            <p className="text-purple-300 mb-4">{sign.date_range}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {sign.traits.split(',').map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${sign.color_hex}22`, color: sign.color_hex, border: `1px solid ${sign.color_hex}44` }}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Element', value: sign.element },
          { label: 'Ruling Planet', value: sign.ruling_planet },
          { label: 'Compatibility', value: sign.compatibility.split(',')[0].trim() },
          { label: 'Quality', value: sign.element === 'Fire' || sign.element === 'Air' ? 'Cardinal' : 'Fixed' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(45,27,105,0.4)', border: '1px solid rgba(123,97,255,0.2)' }}>
            <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-cyan-400 font-semibold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="rounded-2xl p-6 mb-4"
        style={{ background: 'linear-gradient(135deg, rgba(45,27,105,0.5), rgba(26,5,51,0.8))', border: '1px solid rgba(123,97,255,0.2)' }}>
        <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'Cinzel, serif' }}>About {sign.sign_name}</h3>
        <p className="text-purple-100 leading-relaxed text-sm">{sign.description}</p>
      </div>

      {/* Compatibility */}
      <div className="rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, rgba(45,27,105,0.5), rgba(26,5,51,0.8))', border: '1px solid rgba(123,97,255,0.2)' }}>
        <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Most Compatible With</h3>
        <div className="flex flex-wrap gap-3">
          {sign.compatibility.split(',').map(s => (
            <span key={s} className="px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(0,191,255,0.1)', color: '#00BFFF', border: '1px solid rgba(0,191,255,0.25)' }}>
              {s.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
