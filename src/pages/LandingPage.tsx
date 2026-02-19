import { Sparkles, Star, Moon, ChevronDown } from 'lucide-react';
import { Page } from '../types';

const zodiacSymbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between"
        style={{ background: 'rgba(26,5,51,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,97,255,0.15)' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-cyan-400" />
          <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>AstroSoul</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="px-5 py-2 text-sm text-purple-200 hover:text-white transition-colors"
          >Login</button>
          <button
            onClick={() => onNavigate('register')}
            className="px-5 py-2 text-sm rounded-full font-medium transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)', border: '1px solid rgba(123,97,255,0.5)', color: '#fff', boxShadow: '0 0 20px rgba(91,45,142,0.4)' }}
          >Get Started</button>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-cyan-300 mb-4"
            style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)' }}>
            <Star size={12} fill="currentColor" /> Your cosmic journey begins here
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 40px rgba(123,97,255,0.5)' }}>
          Discover Your<br />
          <span style={{ background: 'linear-gradient(135deg, #7B61FF, #00BFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Cosmic Identity
          </span>
        </h1>

        <p className="text-purple-200 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Explore the ancient wisdom of the stars. Personalized horoscopes, zodiac insights, and cosmic guidance — all tailored to your celestial blueprint.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #5B2D8E 0%, #2D1B69 100%)', boxShadow: '0 0 30px rgba(91,45,142,0.5)', border: '1px solid rgba(123,97,255,0.4)' }}
          >
            Begin Your Journey
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-4 rounded-full text-purple-200 font-semibold text-base transition-all hover:text-white"
            style={{ border: '1px solid rgba(123,97,255,0.3)', background: 'rgba(123,97,255,0.05)' }}
          >
            Sign In
          </button>
        </div>

        {/* Zodiac ring */}
        <div className="flex flex-wrap justify-center gap-3 max-w-md mb-12">
          {zodiacSymbols.map((sym, i) => (
            <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all hover:scale-125 cursor-default"
              style={{
                background: 'radial-gradient(circle, rgba(123,97,255,0.15), rgba(26,5,51,0.8))',
                border: '1px solid rgba(123,97,255,0.25)',
                boxShadow: '0 0 10px rgba(123,97,255,0.15)',
              }}>
              {sym}
            </div>
          ))}
        </div>

        <ChevronDown size={24} className="text-purple-400 animate-bounce" />
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              What AstroSoul Offers
            </h2>
            <p className="text-purple-300 text-lg">Everything you need to navigate your celestial path</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '♌', title: 'Zodiac Profiles', desc: 'Deep dive into your sign — traits, element, ruling planet, compatibility and more.' },
              { icon: '☀', title: 'Daily Horoscopes', desc: 'Fresh cosmic guidance every day, personalized to your unique zodiac sign.' },
              { icon: '🌙', title: 'Monthly Forecasts', desc: 'Plan ahead with detailed monthly horoscopes covering love, career, and growth.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-7 text-center transition-all hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,27,105,0.6), rgba(26,5,51,0.8))',
                  border: '1px solid rgba(123,97,255,0.2)',
                  boxShadow: '0 4px 30px rgba(26,5,51,0.5)',
                }}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{title}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Moon size={40} className="text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Ready to Know Your Stars?
          </h2>
          <p className="text-purple-300 mb-8">Create your free account and unlock your personalized cosmic experience.</p>
          <button
            onClick={() => onNavigate('register')}
            className="px-10 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #5B2D8E 0%, #00BFFF 100%)',
              boxShadow: '0 0 40px rgba(0,191,255,0.3)',
            }}
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-purple-900/30">
        <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
          <Sparkles size={14} className="text-cyan-400" />
          <span style={{ fontFamily: 'Cinzel, serif' }}>AstroSoul</span>
          <span>— Discover Your Cosmic Identity</span>
        </div>
      </footer>
    </div>
  );
}
