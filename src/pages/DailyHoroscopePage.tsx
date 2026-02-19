import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getZodiacSign } from '../utils/zodiac';

// ── Static daily readings keyed by sign name ──────────────────────────────
const DAILY_READINGS: Record<string, {
  overall: string; love: string; career: string; health: string; spiritual: string;
  tip: string; scores: Record<string, number>; lucky: Record<string, string | number>;
  planet: string; planetEffect: string;
}> = {
  Aries: {
    overall: 'The universe is igniting your pioneering spirit today, Aries. Mars supercharges your drive, making this a powerful day for bold moves and new beginnings. Trust your instincts — they are sharper than ever.',
    love: 'Passion runs high today. Express your feelings directly; your honesty will be magnetic. Singles may have a charged encounter. Couples benefit from spontaneous adventure together.',
    career: 'Your competitive edge is razor-sharp. Take the lead on that project you\'ve been eyeing. Colleagues respond well to your enthusiasm. An important opportunity may arise before the day ends.',
    health: 'High energy demands physical outlet. A vigorous workout will do wonders. Watch for impulsiveness that could lead to minor injuries — channel that fire into focused exercise.',
    spiritual: 'Fire meditations and working with red crystals like carnelian align your energy. Your warrior spirit is awakened — call upon your inner strength to face any challenge.',
    tip: 'Start something new today. The cosmic energy strongly supports initiating bold actions.',
    scores: { overall: 88, love: 82, career: 91, health: 78, energy: 95 },
    lucky: { number: 9, color: 'Crimson', time: '8:00 AM – 10:00 AM', direction: 'East', crystal: 'Carnelian' },
    planet: 'Mars ♂', planetEffect: 'Mars fuels your ambition and courage, making you unstoppable today.',
  },
  Taurus: {
    overall: 'Venus wraps your day in a warm, sensual glow, Taurus. Beauty, pleasure, and meaningful connections are highlighted. This is a day to savor the finer things and appreciate what you have built.',
    love: 'Romance is tender and deeply satisfying today. Express love through thoughtful gestures. Long-term partners feel especially close. Singles attract admirers through their natural warmth and sensuality.',
    career: 'Steady persistence pays off beautifully today. A financial decision made now will serve you well long-term. Your patience and reliability impress those in positions of authority.',
    health: 'Your body craves nourishment and rest. A wholesome meal and time in nature will restore you completely. Avoid overindulgence — your body is asking for quality, not quantity.',
    spiritual: 'Earth-based practices and time in gardens or forests deeply nourish your soul today. Work with green crystals like malachite to amplify abundance energy.',
    tip: 'Indulge one genuine pleasure today — your soul needs beauty and satisfaction.',
    scores: { overall: 84, love: 92, career: 79, health: 85, energy: 72 },
    lucky: { number: 6, color: 'Emerald', time: '2:00 PM – 4:00 PM', direction: 'South', crystal: 'Malachite' },
    planet: 'Venus ♀', planetEffect: 'Venus surrounds you with beauty, luxury, and the sweetness of life today.',
  },
  Gemini: {
    overall: 'Mercury electrifies your already brilliant mind today, Gemini. Ideas flow effortlessly and conversations open doors. This is an exceptional day for communication, learning, and making connections.',
    love: 'Wit and words are your most powerful tools in love today. A meaningful conversation deepens a connection. Singles sparkle with charm — your mind captivates as much as your smile.',
    career: 'Networking and communication are your superpowers today. A pitch, presentation, or important conversation goes exceptionally well. Your versatility impresses everyone in the room.',
    health: 'Mental overstimulation is the only risk today. Schedule quiet time between social engagements. Breathing exercises and short walks between tasks keep your nervous system balanced.',
    spiritual: 'Your mind is a portal to the divine today. Journaling, automatic writing, or oracle cards reveal profound insights. Yellow citrine amplifies your mental clarity and joy.',
    tip: 'Make that important call or send that message today — Mercury\'s energy guarantees it lands well.',
    scores: { overall: 87, love: 80, career: 93, health: 74, energy: 88 },
    lucky: { number: 5, color: 'Yellow', time: '10:00 AM – 12:00 PM', direction: 'West', crystal: 'Citrine' },
    planet: 'Mercury ☿', planetEffect: 'Mercury sharpens your intellect and accelerates all forms of communication today.',
  },
  Cancer: {
    overall: 'The Moon cradles you in heightened intuition today, Cancer. Your emotional radar is extraordinarily precise — trust every feeling and instinct. Home, family, and deep connections take center stage.',
    love: 'Emotional intimacy reaches beautiful new depths today. Share your inner world openly; vulnerability creates unbreakable bonds. Family matters bring unexpected joy and warmth.',
    career: 'Your intuition about colleagues and clients is spot-on today. Creative work and projects involving care, hospitality, or nurturing others excel. Trust your gut on business decisions.',
    health: 'Emotional and physical wellbeing are deeply linked today. Honor your feelings fully — suppressed emotions manifest as physical tension. A nurturing bath or gentle yoga works wonders.',
    spiritual: 'Moon rituals and water-based practices are especially powerful today. Meditate near water or with moonstone to amplify your already heightened psychic sensitivity.',
    tip: 'Create a sacred, cozy space today. Your home is your sanctuary and your power source.',
    scores: { overall: 82, love: 95, career: 76, health: 80, energy: 70 },
    lucky: { number: 2, color: 'Silver', time: '8:00 PM – 10:00 PM', direction: 'North', crystal: 'Moonstone' },
    planet: 'Moon ☽', planetEffect: 'The Moon amplifies your intuition and emotional intelligence to extraordinary levels.',
  },
  Leo: {
    overall: 'The Sun blazes through your chart today, Leo, filling you with radiant confidence and creative fire. You are at your most magnetic and powerful — the whole world notices your light.',
    love: 'Your charisma is irresistible today. Grand romantic gestures land perfectly. Couples reignite passion through playfulness and celebration. Singles command attention effortlessly — embrace it.',
    career: 'Leadership opportunities come to you naturally today. Your vision inspires others and your confidence opens doors. A moment of recognition or praise affirms your hard work.',
    health: 'Vitality is sky-high. Channel this solar energy into physical activity you genuinely enjoy — dance, sports, or anything that makes your heart sing and your body move with joy.',
    spiritual: 'Creative expression IS your spiritual practice today. Art, performance, and heartfelt generosity connect you to the divine. Work with sunstone or golden topaz to amplify your solar energy.',
    tip: 'Step into the spotlight today — you were made for this moment.',
    scores: { overall: 93, love: 89, career: 95, health: 88, energy: 97 },
    lucky: { number: 1, color: 'Gold', time: '12:00 PM – 2:00 PM', direction: 'East', crystal: 'Sunstone' },
    planet: 'Sun ☀️', planetEffect: 'The Sun amplifies your natural radiance, leadership, and creative power to its peak.',
  },
  Virgo: {
    overall: 'Mercury sharpens your already keen analytical mind today, Virgo. Details that others miss are crystal clear to you. This is an ideal day for planning, organizing, and problem-solving with surgical precision.',
    love: 'Small, thoughtful gestures speak volumes in love today. Your attentiveness makes your partner feel deeply cherished. Singles attract through genuine helpfulness and intelligent conversation.',
    career: 'Your eye for detail catches a critical error or reveals an important insight. Process improvements and systematic approaches bring measurable results. Colleagues appreciate your thoroughness.',
    health: 'Your mind-body connection is especially strong today. A clean, nutritious meal and an organized environment dramatically improve your energy. Digestive health responds well to mindful eating.',
    spiritual: 'Service and ritual are your spiritual languages today. Organizing a sacred space, crafting detailed intentions, or helping someone in need connects you deeply to the divine.',
    tip: 'Fix or improve one system or process today — your precision brings outsized rewards.',
    scores: { overall: 85, love: 77, career: 92, health: 88, energy: 80 },
    lucky: { number: 5, color: 'Forest Green', time: '7:00 AM – 9:00 AM', direction: 'South', crystal: 'Jade' },
    planet: 'Mercury ☿', planetEffect: 'Mercury activates your analytical genius and brings extraordinary clarity to complex problems.',
  },
  Libra: {
    overall: 'Venus drapes your day in elegance and harmony today, Libra. Beauty, balance, and meaningful partnerships are highlighted. Negotiations, collaborations, and creative projects all flourish under this cosmic grace.',
    love: 'Romance is exquisitely balanced and mutually fulfilling today. A heart-to-heart conversation brings beautiful resolution or deeper understanding. Singles encounter someone who matches their ideals.',
    career: 'Partnerships and negotiations reach favorable outcomes today. Your diplomatic skills broker solutions that everyone celebrates. Creative collaborations produce work of exceptional quality.',
    health: 'Balance is your medicine today. Ensure equal portions of activity and rest, social time and solitude, nourishment and movement. Your kidneys respond well to increased water intake.',
    spiritual: 'Beauty itself is a spiritual practice for you today. Surround yourself with art, music, and harmony. Rose quartz and pink tourmaline support your heart chakra beautifully.',
    tip: 'Seek beauty in every interaction today — your ability to find it is your greatest gift.',
    scores: { overall: 86, love: 93, career: 84, health: 79, energy: 78 },
    lucky: { number: 6, color: 'Rose Pink', time: '3:00 PM – 5:00 PM', direction: 'West', crystal: 'Rose Quartz' },
    planet: 'Venus ♀', planetEffect: 'Venus fills your interactions with grace, charm, and the power to create lasting harmony.',
  },
  Scorpio: {
    overall: 'Pluto intensifies your already formidable perception today, Scorpio. Hidden truths surface, power dynamics shift in your favor, and your ability to transform challenges into victories is at its peak.',
    love: 'Emotional and physical intimacy reach extraordinary intensity today. Deep vulnerability creates unbreakable bonds. Trust your instincts completely — they reveal what words cannot.',
    career: 'Research, investigation, and strategic planning yield powerful results today. You uncover information others miss entirely. A power play at work resolves decisively in your favor.',
    health: 'Intense emotions need healthy physical release today. High-intensity exercise, deep tissue massage, or cathartic creative work transforms tension into vitality and power.',
    spiritual: 'Shadow work and transformation practices are exceptionally potent today. Work with obsidian or black tourmaline to transmute old wounds into wisdom and authentic power.',
    tip: 'Face one difficult truth today — your transformation on the other side will be extraordinary.',
    scores: { overall: 89, love: 91, career: 87, health: 76, energy: 85 },
    lucky: { number: 8, color: 'Deep Crimson', time: '9:00 PM – 11:00 PM', direction: 'North', crystal: 'Obsidian' },
    planet: 'Pluto ♇', planetEffect: 'Pluto awakens your power to transform, investigate, and rise from any circumstance.',
  },
  Sagittarius: {
    overall: 'Jupiter expands every horizon in your world today, Sagittarius. Opportunities for adventure, learning, and philosophical expansion appear from unexpected directions. Say yes to the journey.',
    love: 'Adventure and shared laughter are the love languages of today. Plan something spontaneous with your partner. Singles attract through their infectious optimism and fearless authenticity.',
    career: 'International connections, higher learning, and ambitious projects are strongly favored. A big-picture vision you share today sparks others\' enthusiasm. Expansion is your theme.',
    health: 'Movement and outdoor activity restore your vitality completely today. A long walk, run, or any physical adventure in nature recharges your spirit and body simultaneously.',
    spiritual: 'Philosophy, spiritual study, and travel — even through books or meditation — deepen your connection to universal truth today. Turquoise and lapis lazuli expand your higher mind.',
    tip: 'Follow your curiosity wherever it leads today — Jupiter\'s expansion energy is fully on your side.',
    scores: { overall: 90, love: 84, career: 88, health: 90, energy: 93 },
    lucky: { number: 3, color: 'Royal Blue', time: '11:00 AM – 1:00 PM', direction: 'East', crystal: 'Turquoise' },
    planet: 'Jupiter ♃', planetEffect: 'Jupiter blesses every venture with expansion, abundance, and extraordinary good fortune.',
  },
  Capricorn: {
    overall: 'Saturn rewards your discipline with tangible recognition today, Capricorn. Authority figures take notice of your consistent excellence. Long-term ambitions receive powerful cosmic support.',
    love: 'Steady devotion and practical gestures communicate love most powerfully today. Make plans for the future with your partner — shared goals deepen commitment beautifully.',
    career: 'Your expertise and track record open important doors today. A leadership opportunity or significant responsibility is offered. Accept it with the confidence you have earned.',
    health: 'Structure serves your body well today. Maintain your routines with extra discipline — consistency is your medicine. Your skeletal system benefits from calcium-rich foods and posture awareness.',
    spiritual: 'Achievement itself is your spiritual path today. Set a meaningful intention and take one concrete step toward your highest goal. Garnet and smoky quartz ground your ambitious energy beautifully.',
    tip: 'Show up with your full expertise today — the universe is watching and ready to reward you.',
    scores: { overall: 86, love: 78, career: 94, health: 82, energy: 77 },
    lucky: { number: 8, color: 'Charcoal', time: '6:00 AM – 8:00 AM', direction: 'South', crystal: 'Garnet' },
    planet: 'Saturn ♄', planetEffect: 'Saturn rewards your hard work, discipline, and long-term commitment with lasting recognition.',
  },
  Aquarius: {
    overall: 'Uranus sparks a flash of genius in your mind today, Aquarius. An unconventional idea or breakthrough approach arrives with sudden, electric clarity. Your most innovative thinking is your greatest gift.',
    love: 'Intellectual connection is the deepest form of intimacy for you today. A stimulating conversation sparks genuine attraction. Your authenticity and uniqueness draw exactly the right people close.',
    career: 'Technology, innovation, and collaborative projects surge forward with brilliant momentum. An unconventional solution to a persistent problem earns admiration from unexpected quarters.',
    health: 'Social connection and community activities boost your wellbeing significantly today. Group fitness, team sports, or any activity shared with others energizes you on every level.',
    spiritual: 'Your connection to collective consciousness is heightened today. Humanitarian acts, community service, and working toward a vision larger than yourself align you with your highest purpose.',
    tip: 'Share your most unconventional idea today — the world needs your revolutionary thinking.',
    scores: { overall: 88, love: 81, career: 92, health: 79, energy: 87 },
    lucky: { number: 11, color: 'Electric Blue', time: '4:00 PM – 6:00 PM', direction: 'West', crystal: 'Amethyst' },
    planet: 'Uranus ♅', planetEffect: 'Uranus electrifies your genius, bringing sudden insights and revolutionary breakthroughs.',
  },
  Pisces: {
    overall: 'Neptune wraps your day in a luminous, dreamy glow today, Pisces. Your intuition, creativity, and spiritual sensitivity are operating at their absolute peak. Magic is real and it is happening for you.',
    love: 'Romantic connection transcends the ordinary today — soulmate energy is strongly present. Let your guard down completely and allow yourself to be seen. Unconditional love flows both ways.',
    career: 'Creative projects, artistic work, and anything requiring empathy or imagination flourish beautifully today. Your ability to feel what others need makes you invaluable in team settings.',
    health: 'Water is your greatest healer today — swim, take a healing bath, or simply be near a natural water source. Rest is equally sacred. Your dreams tonight may carry important guidance.',
    spiritual: 'Your psychic channels are wide open today. Meditation, dream work, and any intuitive practice yields extraordinary clarity and guidance. Protect your energy with intention and amethyst.',
    tip: 'Trust the magical, impossible-seeming thing that keeps calling to your soul today.',
    scores: { overall: 85, love: 95, career: 80, health: 75, energy: 80 },
    lucky: { number: 12, color: 'Sea Foam', time: '7:00 PM – 9:00 PM', direction: 'North', crystal: 'Amethyst' },
    planet: 'Neptune ♆', planetEffect: 'Neptune dissolves boundaries between worlds, opening you to divine inspiration and unconditional love.',
  },
};

const MOODS = ['✨ Inspired', '🔥 Energized', '😌 Peaceful', '💪 Determined', '🌊 Emotional', '😴 Low Energy', '🌟 Grateful', '😤 Frustrated'];

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export default function DailyHoroscopePage() {
  const { profile } = useAuth();

  // AuthContext guarantees profile.zodiac_sign is correct — no fallback to Aries needed
  const sign = (profile?.date_of_birth ? getZodiacSign(profile.date_of_birth) : null)
    || profile?.zodiac_sign
    || 'Aries';
  const reading = DAILY_READINGS[sign] || DAILY_READINGS['Aries'];

  const [activeSection, setActiveSection] = useState<'overall' | 'love' | 'career' | 'health' | 'spiritual'>('overall');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showLucky, setShowLucky] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const scoreColor = (n: number) => n >= 85 ? '#22c55e' : n >= 70 ? '#f59e0b' : '#ef4444';

  const handleShare = () => {
    if (!reading || !sign) return;
    const text = `My ${sign} horoscope today: "${reading.overall.slice(0, 120)}..." — Powered by AstroSoul ✨`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    });
  };

  const sectionText: Record<string, string> = {
    overall: reading.overall, love: reading.love, career: reading.career,
    health: reading.health, spiritual: reading.spiritual,
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto pb-16 relative z-10">
      <style>{`
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 15px rgba(123,97,255,0.3)} 50%{box-shadow:0 0 30px rgba(123,97,255,0.6)} }
        @keyframes score-fill { from{width:0} to{width:var(--target)} }
        .score-bar { animation: score-fill 1.2s ease forwards; }
        .section-btn { transition: all .2s; }
      `}</style>

      {/* ── 1. HEADER */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(45,27,105,0.9), rgba(10,1,24,0.95))',
        border: '1px solid rgba(123,97,255,0.3)',
      }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, #7B61FF, transparent)',
          transform: 'translate(30%,-30%)',
        }} />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-purple-400 mb-1">{today}</p>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              Daily Horoscope
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">{SIGN_SYMBOLS[sign] || '✦'}</span>
              <span className="text-cyan-400 font-semibold">{sign}</span>
              <span className="text-purple-400 text-sm">· {reading.planet}</span>
            </div>
          </div>
          <button onClick={handleShare}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(123,97,255,0.2)', border: '1px solid rgba(123,97,255,0.4)', color: '#c4b5fd' }}>
            {copiedShare ? '✓ Copied!' : '📤 Share'}
          </button>
        </div>
        <div className="mt-4 p-3 rounded-xl relative z-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-sm text-purple-200 italic">⚡ {reading.planetEffect}</p>
        </div>
      </div>

      {/* ── 2. ENERGY SCORES */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">📊 Today's Cosmic Scores</h2>
        <div className="space-y-3">
          {(Object.entries(reading.scores) as [string, number][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm text-white/60 capitalize w-20">{key}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full score-bar" style={{
                  width: `${val}%`, '--target': `${val}%` as string,
                  background: `linear-gradient(90deg, ${scoreColor(val)}88, ${scoreColor(val)})`,
                } as React.CSSProperties} />
              </div>
              <span className="text-sm font-bold w-10 text-right" style={{ color: scoreColor(val) }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. SECTION READER */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2 flex-wrap mb-5">
          {(['overall', 'love', 'career', 'health', 'spiritual'] as const).map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`section-btn px-3 py-1.5 rounded-lg text-xs font-medium capitalize border ${activeSection === s
                ? 'bg-purple-600/40 border-purple-400 text-white'
                : 'border-transparent text-white/50 hover:text-white/80'}`}>
              {s === 'overall' ? '🌟' : s === 'love' ? '❤️' : s === 'career' ? '💼' : s === 'health' ? '🌿' : '🔮'} {s}
            </button>
          ))}
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{sectionText[activeSection]}</p>
      </div>

      {/* ── 4. LUCKY DETAILS */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">🍀 Lucky Details</h2>
          <button onClick={() => setShowLucky(!showLucky)}
            className="text-xs text-purple-400 hover:text-purple-300">
            {showLucky ? 'Hide' : 'Reveal'}
          </button>
        </div>
        {showLucky && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(reading.lucky).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(123,97,255,0.2)' }}>
                <span className="text-xs text-white/40 block capitalize mb-1">{key}</span>
                <span className="text-sm font-medium text-cyan-400">{String(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. DAILY TIP */}
      <div className="rounded-2xl p-5 text-center" style={{
        background: 'linear-gradient(135deg, rgba(123,97,255,0.15), rgba(10,1,24,0.9))',
        border: '1px solid rgba(123,97,255,0.3)',
      }}>
        <p className="text-purple-400 text-xs uppercase tracking-widest mb-2">Cosmic Tip</p>
        <p className="text-white/85 text-sm leading-relaxed italic">✨ {reading.tip}</p>
      </div>

      {/* ── 6. MOOD TRACKER */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">🌡️ How Are You Feeling?</h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(mood => (
            <button key={mood} onClick={() => setSelectedMood(mood)}
              className="px-3 py-1.5 rounded-full text-sm transition-all"
              style={{
                background: selectedMood === mood ? 'rgba(123,97,255,0.4)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${selectedMood === mood ? 'rgba(123,97,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
                color: selectedMood === mood ? 'white' : 'rgba(255,255,255,0.6)',
              }}>
              {mood}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="mt-3 text-sm text-purple-300">
            The stars acknowledge your energy today: <strong className="text-white">{selectedMood}</strong>. Honor this feeling — it carries cosmic wisdom.
          </p>
        )}
      </div>
    </div>
  );
}