import { useEffect, useState } from 'react';
import { Sun, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ZodiacSign } from '../types';
import HoroscopeCard from '../components/HoroscopeCard';

export default function DailyHoroscopePage() {
  const { profile } = useAuth();
  const [sign, setSign] = useState<ZodiacSign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.zodiac_sign) return;
    supabase.from('zodiac_signs').select('*').eq('sign_name', profile.zodiac_sign).maybeSingle()
      .then(({ data }) => { setSign(data); setLoading(false); });
  }, [profile]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="p-8 text-purple-300">Consulting the stars...</div>;
  if (!sign) return <div className="p-8 text-purple-300">No horoscope data available.</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
          <Sun size={14} />
          <span>{today}</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Daily Horoscope</h1>
        <p className="text-purple-400 text-sm">What the cosmos reveal for you today</p>
      </div>

      <div className="rounded-2xl p-6 mb-6 flex items-center gap-4"
        style={{
          background: `linear-gradient(135deg, ${sign.color_hex}18, #1A0533)`,
          border: `1px solid ${sign.color_hex}33`,
        }}>
        <div className="text-5xl w-16 h-16 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: `radial-gradient(circle, ${sign.color_hex}33, transparent)`, border: `1px solid ${sign.color_hex}55` }}>
          {sign.symbol}
        </div>
        <div>
          <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'Cinzel, serif' }}>{sign.sign_name}</h2>
          <p className="text-purple-300 text-sm">{sign.element} Sign · {sign.ruling_planet}</p>
        </div>
      </div>

      <HoroscopeCard
        title="Today's Reading"
        subtitle={today}
        accentColor={sign.color_hex}
        icon={<Star size={18} style={{ color: sign.color_hex }} />}
      >
        <p className="leading-loose">{sign.daily_horoscope}</p>
      </HoroscopeCard>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Love', value: '★★★★☆' },
          { label: 'Career', value: '★★★★★' },
          { label: 'Wellness', value: '★★★☆☆' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(45,27,105,0.4)', border: '1px solid rgba(123,97,255,0.2)' }}>
            <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p style={{ color: sign.color_hex }} className="text-sm tracking-wider">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
