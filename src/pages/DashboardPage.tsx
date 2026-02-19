import { useEffect, useState } from 'react';
import { Sparkles, Sun, Calendar, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ZodiacSign, Page } from '../types';
import HoroscopeCard from '../components/HoroscopeCard';
import { getZodiacSign } from '../utils/zodiac';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { profile, loading } = useAuth();
  const [sign, setSign] = useState<ZodiacSign | null>(null);

  useEffect(() => {
    if (!profile) return;

    // FIX: Force calculation from DOB first to bypass "stale" Aries data stored in test accounts
    const calculatedSign = profile.date_of_birth ? getZodiacSign(profile.date_of_birth) : null;
    const finalSign = calculatedSign || profile.zodiac_sign || 'Aries';

    supabase.from('zodiac_signs').select('*').eq('sign_name', finalSign).maybeSingle()
      .then(({ data }) => setSign(data));
  }, [profile]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) return <div className="p-8 text-purple-300">Aligning the stars...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-purple-400 text-sm mb-1">{today}</p>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
          {greeting}, {profile?.full_name?.split(' ')[0] || 'Seeker'} ✨
        </h1>
        <p className="text-purple-300">Your cosmic dashboard awaits.</p>
      </div>

      {sign ? (
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${sign.color_hex}18 0%, #1A0533 100%)`,
            border: `1px solid ${sign.color_hex}33`,
            boxShadow: `0 0 40px ${sign.color_hex}15`,
          }}>
          <div className="absolute top-0 right-0 text-9xl opacity-10 leading-none select-none pr-4 pt-2">{sign.symbol}</div>
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
              style={{ background: `radial-gradient(circle, ${sign.color_hex}33, transparent)`, border: `2px solid ${sign.color_hex}55` }}>
              {sign.symbol}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'Cinzel, serif' }}>{sign.sign_name}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${sign.color_hex}22`, color: sign.color_hex, border: `1px solid ${sign.color_hex}44` }}>
                  {sign.element} Sign
                </span>
              </div>
              <p className="text-purple-300 text-sm mb-3">{sign.date_range}</p>
              <div className="flex gap-4 text-sm">
                <div><span className="text-purple-400 text-xs block">Ruling Planet</span><span className="text-cyan-400">{sign.ruling_planet}</span></div>
                <div><span className="text-purple-400 text-xs block">Compatibility</span><span className="text-cyan-400">{sign.compatibility.split(',')[0].trim()}</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 mb-6 border border-purple-500/20 bg-purple-900/10 text-center text-purple-300">
          Loading your astrological chart...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Sun, label: 'Daily Horoscope', page: 'daily' as Page, color: '#FF851B' },
          { icon: Calendar, label: 'Monthly Forecast', page: 'monthly' as Page, color: '#00BFFF' },
          { icon: Star, label: 'My Zodiac Sign', page: 'my-zodiac' as Page, color: '#7B61FF' },
        ].map(({ icon: Icon, label, page, color }) => (
          <button key={page} onClick={() => onNavigate(page)}
            className="rounded-xl p-5 text-left transition-all hover:scale-105 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${color}15, rgba(26,5,51,0.8))`,
              border: `1px solid ${color}33`,
              boxShadow: `0 4px 20px ${color}15`,
            }}>
            <Icon size={20} style={{ color }} className="mb-3" />
            <span className="text-white font-medium text-sm">{label}</span>
            <p className="text-purple-400 text-xs mt-1">View your reading →</p>
          </button>
        ))}
      </div>

      {sign && (
        <HoroscopeCard
          title="Today's Horoscope Preview"
          subtitle={sign.sign_name}
          accentColor={sign.color_hex}
          icon={<TrendingUp size={18} style={{ color: sign.color_hex }} />}
        >
          <p>{sign.daily_horoscope.slice(0, 220)}...{' '}
            <button onClick={() => onNavigate('daily')} className="text-cyan-400 hover:text-cyan-300 text-xs underline">
              Read full horoscope
            </button>
          </p>
        </HoroscopeCard>
      )}
    </div>
  );
}