import { Sparkles, Star, ChevronDown, Shield } from 'lucide-react';
import { Page } from '../types';

const zodiacSymbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen relative z-10">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(26,5,51,0.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(123,97,255,0.15)' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-cyan-400" />
          <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
            AstroSoul
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('login')}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/5"
            style={{ color: 'rgba(196,181,253,0.8)' }}>
            Login
          </button>
          <button onClick={() => onNavigate('register')}
            className="px-4 py-2 text-sm rounded-lg font-medium transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)',
              border: '1px solid rgba(123,97,255,0.5)',
              color: '#fff',
              boxShadow: '0 0 18px rgba(91,45,142,0.4)',
            }}>
            Get Started
          </button>
          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
          {/* Admin Portal button — takes user to login page in admin mode */}
          <button onClick={() => onNavigate('login')}
            className="px-3 py-2 text-xs rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-1.5"
            style={{
              background: 'rgba(0,191,255,0.08)',
              border: '1px solid rgba(0,191,255,0.22)',
              color: '#7dd3fc',
            }}>
            <Shield size={12} />
            Admin
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-cyan-300 mb-8"
          style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)' }}>
          <Star size={12} fill="currentColor" /> Your cosmic journey begins here
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
          style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 40px rgba(123,97,255,0.5)' }}>
          Discover Your<br />
          <span style={{
            background: 'linear-gradient(135deg, #7B61FF, #00BFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Cosmic Identity
          </span>
        </h1>

        <p className="text-purple-200/80 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Explore the ancient wisdom of the stars. Personalized horoscopes, zodiac insights,
          and cosmic guidance — tailored to your celestial blueprint.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button onClick={() => onNavigate('register')}
            className="px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)',
              boxShadow: '0 0 30px rgba(91,45,142,0.5)',
              border: '1px solid rgba(123,97,255,0.4)',
            }}>
            Begin Your Journey
          </button>
          <button onClick={() => onNavigate('login')}
            className="px-8 py-4 rounded-full text-purple-200 font-semibold text-base transition-all hover:text-white"
            style={{ border: '1px solid rgba(123,97,255,0.3)', background: 'rgba(123,97,255,0.05)' }}>
            Sign In
          </button>
        </div>

        {/* Zodiac ring */}
        <div className="flex flex-wrap justify-center gap-3 max-w-sm mb-14">
          {zodiacSymbols.map((sym, i) => (
            <div key={i}
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all hover:scale-125 cursor-default"
              style={{
                background: 'radial-gradient(circle, rgba(123,97,255,0.15), rgba(26,5,51,0.8))',
                border: '1px solid rgba(123,97,255,0.22)',
              }}>
              {sym}
            </div>
          ))}
        </div>

        <ChevronDown size={22} className="text-purple-400/60 animate-bounce" />
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
              What AstroSoul Offers
            </h2>
            <p className="text-purple-300/70 text-base">Everything you need to navigate your celestial path</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '♌', title: 'Zodiac Profiles',   desc: 'Deep dive into your sign — traits, element, ruling planet, compatibility and more.' },
              { icon: '☀️', title: 'Daily Horoscopes',  desc: 'Fresh cosmic guidance every day, personalized to your unique zodiac sign.' },
              { icon: '🌙', title: 'Monthly Forecasts', desc: 'Plan ahead with detailed monthly horoscopes covering love, career, and growth.' },
            ].map(f => (
              <div key={f.title}
                className="rounded-2xl p-8 text-center transition-all hover:-translate-y-1.5 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,27,105,0.4), rgba(10,1,24,0.8))',
                  border: '1px solid rgba(123,97,255,0.2)',
                }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  {f.title}
                </h3>
                <p className="text-purple-300/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(123,97,255,0.12)' }}>
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-white text-sm font-bold" style={{ fontFamily: 'Cinzel, serif' }}>AstroSoul</span>
        </div>
        <p className="text-purple-500/60 text-xs mb-3">© 2024 AstroSoul. Navigate by the stars.</p>
        <button onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: 'rgba(255,255,255,0.15)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#7dd3fc')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.15)')}>
          <Shield size={10} /> Admin Portal
        </button>
      </footer>
    </div>
  );
}