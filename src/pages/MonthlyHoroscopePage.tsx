import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const MONTHLY_DATA: Record<string, {
  theme: string; overview: string;
  weeks: { title: string; dates: string; reading: string; focus: string }[];
  bestDays: number[]; challengingDays: number[];
  scores: { love: number; career: number; finance: number; health: number; creativity: number; spirituality: number };
  transits: { planet: string; event: string; date: string; meaning: string }[];
  mantra: string; intention: string;
  powerColor: string; powerCrystal: string;
}> = {
  Aries: {
    theme: 'Ignition & Expansion', powerColor: '#FF4136', powerCrystal: 'Carnelian',
    overview: 'February is a month of cosmic ignition for Aries. Mars, your ruler, moves through your financial sector in the first half, bringing dynamic energy to money matters and resource building. The full moon mid-month illuminates your solar seventh house, bringing important relationship themes to the surface for examination and resolution. By month\'s end, you\'re ready to plant seeds for a major new cycle.',
    weeks: [
      { title: 'The Spark', dates: 'Feb 1–7', focus: 'Finance & Self-Worth', reading: 'Mars energizes your earning potential. A bold financial move could set you apart from the competition. Your confidence in what you deserve is magnetic — negotiate, ask, claim.' },
      { title: 'The Full Moon Storm', dates: 'Feb 8–14', focus: 'Relationships', reading: 'The full moon illuminates relationship dynamics you\'ve been navigating. An important conversation about mutual needs reaches its climax. Truth spoken lovingly transforms everything.' },
      { title: 'The Turning Point', dates: 'Feb 15–21', focus: 'Communication', reading: 'Mercury sharpens your already direct communication. A message you\'ve been drafting in your mind finally gets sent. Local travel or a short course expands your immediate world.' },
      { title: 'The Launch Pad', dates: 'Feb 22–28', focus: 'New Beginnings', reading: 'The new moon in Pisces activates your subconscious sector. Release what no longer serves you and dream boldly. The next chapter is being written in invisible ink — it will appear in March.' },
    ],
    bestDays: [3, 8, 12, 17, 21, 26], challengingDays: [5, 10, 18, 23],
    scores: { love: 78, career: 88, finance: 82, health: 80, creativity: 75, spirituality: 70 },
    transits: [
      { planet: 'Mars ♂', event: 'enters Gemini', date: 'Feb 4', meaning: 'Your communication becomes fiery and persuasive. Ideas that have been stuck begin to accelerate.' },
      { planet: 'Full Moon', event: 'in Leo', date: 'Feb 12', meaning: 'Relationship dynamics peak. A creative project or romance reaches an important milestone.' },
      { planet: 'Venus ♀', event: 'trines your Sun', date: 'Feb 19', meaning: 'Attraction, beauty, and harmony flow easily. Love and financial opportunities arrive through your natural magnetism.' },
      { planet: 'New Moon', event: 'in Pisces', date: 'Feb 28', meaning: 'A spiritual fresh start. Plant seeds of intention in your hidden garden of the soul.' },
    ],
    mantra: 'I ignite the world with my passion and claim the abundance I deserve.',
    intention: 'This month I commit to boldly pursuing what I truly want, without apology or hesitation.',
  },
  Taurus: {
    theme: 'Deepening & Receiving', powerColor: '#2ECC40', powerCrystal: 'Malachite',
    overview: 'February invites Taurus into a powerful period of deepening — in love, in values, and in spiritual connection. Venus, your ruler, moves through your tenth house of career mid-month, creating favorable professional conditions and possibly a public recognition moment. The full moon highlights your creativity and romantic life, while the new moon at month\'s end opens a new cycle of community and belonging.',
    weeks: [
      { title: 'Grounding Power', dates: 'Feb 1–7', focus: 'Career & Public Image', reading: 'Venus in your career sector makes you irresistibly appealing to authority figures and clients. Your aesthetic sensibility solves a professional problem in an unexpected way.' },
      { title: 'Creative Bloom', dates: 'Feb 8–14', focus: 'Love & Creativity', reading: 'The full moon in your fifth house activates romance, creative self-expression, and joy. A creative project reaches completion. A romantic connection deepens significantly.' },
      { title: 'The Inner Turn', dates: 'Feb 15–21', focus: 'Health & Daily Rituals', reading: 'Mercury highlights your health routines. Small, consistent adjustments to your daily habits now will yield extraordinary results by summer. Your body is asking for something specific — listen.' },
      { title: 'Community Rising', dates: 'Feb 22–28', focus: 'Friends & Belonging', reading: 'The new moon activates your circle of community. A new friendship or group connection forms that aligns perfectly with your evolving values and aspirations.' },
    ],
    bestDays: [2, 7, 14, 18, 23, 27], challengingDays: [6, 11, 19, 24],
    scores: { love: 88, career: 82, finance: 85, health: 80, creativity: 90, spirituality: 75 },
    transits: [
      { planet: 'Venus ♀', event: 'conjuncts Saturn', date: 'Feb 3', meaning: 'A committed, serious approach to love or money pays off. What you build now is built to last.' },
      { planet: 'Full Moon', event: 'in Leo', date: 'Feb 12', meaning: 'A creative or romantic peak. Something you\'ve been working on receives a beautiful culmination.' },
      { planet: 'Mercury ☿', event: 'enters Pisces', date: 'Feb 14', meaning: 'Intuitive thinking and artistic expression are enhanced. Dreamy insights arrive in the quiet moments.' },
      { planet: 'New Moon', event: 'in Pisces', date: 'Feb 28', meaning: 'A fresh social cycle begins. New friendships and community connections align with your authentic values.' },
    ],
    mantra: 'I receive all the beauty and abundance the universe offers me with gracious ease.',
    intention: 'This month I commit to honoring my body, my values, and my capacity for joy in equal measure.',
  },
  Gemini: {
    theme: 'Expansion & Truth-Telling', powerColor: '#FFDC00', powerCrystal: 'Blue Kyanite',
    overview: 'February is an extraordinary month for Gemini\'s professional and intellectual development. Mercury, your ruler, moves through your tenth house, making you the most articulate and persuasive you\'ve been all year in professional settings. The full moon illuminates your home and family sector, while the new moon at month\'s end opens a major career chapter that your hard work has been building toward.',
    weeks: [
      { title: 'Voice & Vision', dates: 'Feb 1–7', focus: 'Career Communication', reading: 'Mercury in your career house makes you the most compelling communicator in any room. Pitch boldly, write prolifically, and trust that your words are building your future.' },
      { title: 'Home Revelations', dates: 'Feb 8–14', focus: 'Home & Family', reading: 'The full moon illuminates unresolved family dynamics or housing situations. An honest conversation at home resolves something that has been simmering beneath the surface.' },
      { title: 'The Romantic Stretch', dates: 'Feb 15–21', focus: 'Love & Creativity', reading: 'Venus warms your fifth house. Romance becomes playful and electric. Singles may meet someone through a creative class or cultural event. Couples discover a new dimension of their chemistry.' },
      { title: 'The Career Launch', dates: 'Feb 22–28', focus: 'Professional Destiny', reading: 'The new moon in Pisces plants seeds in your career house. An opportunity that seems slightly beyond your current reach is actually perfectly timed for your next level of growth.' },
    ],
    bestDays: [4, 9, 13, 18, 22, 27], challengingDays: [7, 12, 20, 25],
    scores: { love: 80, career: 95, finance: 78, health: 72, creativity: 90, spirituality: 68 },
    transits: [
      { planet: 'Mercury ☿', event: 'trines your Sun', date: 'Feb 5', meaning: 'Your natural wit and intelligence operate at peak performance. Every conversation moves in your favor.' },
      { planet: 'Full Moon', event: 'in Leo', date: 'Feb 12', meaning: 'Home and family matters peak. An honest conversation resolves a long-standing domestic pattern.' },
      { planet: 'Venus ♀', event: 'enters Pisces', date: 'Feb 16', meaning: 'Love and creativity flow with magical ease. Your imagination becomes your greatest romantic gift.' },
      { planet: 'New Moon', event: 'in Pisces', date: 'Feb 28', meaning: 'A career seed of profound importance is planted. The harvest will be extraordinary.' },
    ],
    mantra: 'My words build worlds, and I speak my truth with confident, loving clarity.',
    intention: 'This month I commit to expressing my authentic voice in my career and relationships without dilution.',
  },
};

// Fill remaining signs with Aries data as base (in a real app, each would be unique)
(['Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'] as const).forEach(sign => {
  (MONTHLY_DATA as Record<string, typeof MONTHLY_DATA['Aries']>)[sign] = {
    ...MONTHLY_DATA['Aries'],
    theme: sign === 'Cancer' ? 'Intuition & Nourishment' : sign === 'Leo' ? 'Leadership & Radiance' :
           sign === 'Virgo' ? 'Mastery & Healing' : sign === 'Libra' ? 'Balance & Beauty' :
           sign === 'Scorpio' ? 'Transformation & Power' : sign === 'Sagittarius' ? 'Freedom & Wisdom' :
           sign === 'Capricorn' ? 'Achievement & Legacy' : sign === 'Aquarius' ? 'Revolution & Vision' :
           'Surrender & Magic',
    powerColor: sign === 'Cancer' ? '#7FDBFF' : sign === 'Leo' ? '#FF851B' : sign === 'Virgo' ? '#01FF70' :
                sign === 'Libra' ? '#F012BE' : sign === 'Scorpio' ? '#85144b' : sign === 'Sagittarius' ? '#3D9970' :
                sign === 'Capricorn' ? '#111111' : sign === 'Aquarius' ? '#00B4D8' : '#74C0FC',
  };
});

export default function MonthlyHoroscopePage() {
  const { profile } = useAuth();
  const sign = profile?.zodiac_sign || 'Aries';
  const data = MONTHLY_DATA[sign] || MONTHLY_DATA['Aries'];
  const now = new Date();
  const monthName = MONTH_NAMES[now.getMonth()];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();

  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [intentions, setIntentions] = useState<string[]>(['', '', '']);
  const [savedIntentions, setSavedIntentions] = useState(false);
  const [viewedTransit, setViewedTransit] = useState<number | null>(null);

  const scoreColor = (n: number) => n >= 85 ? '#22c55e' : n >= 70 ? '#f59e0b' : '#ef4444';
  const scoreLabel = (n: number) => n >= 85 ? 'Excellent' : n >= 70 ? 'Good' : 'Challenging';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto pb-16 relative z-10">
      <style>{`
        .cal-day:hover { transform: scale(1.1); transition: all .15s; }
        .pulse-glow { animation: pulse-ring 3s ease infinite; }
        @keyframes pulse-ring { 0%,100%{opacity:.6} 50%{opacity:1} }
      `}</style>

      {/* ── 1. MONTH OVERVIEW NARRATIVE */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(45,27,105,0.9), rgba(10,1,24,0.95))',
        border: `1px solid ${data.powerColor}44`,
      }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15" style={{
          background: `radial-gradient(circle, ${data.powerColor}, transparent)`,
          transform: 'translate(30%, -30%)',
        }} />
        <div className="relative z-10">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: data.powerColor }}>
            {monthName} · {sign}
          </p>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
            {data.theme}
          </h1>
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 rounded-lg text-xs" style={{ background: `${data.powerColor}25`, color: data.powerColor }}>
              ✨ {data.powerCrystal}
            </span>
          </div>
          <p className="text-sm text-white/75 leading-relaxed">{data.overview}</p>
        </div>
      </div>

      {/* ── 2. WEEK-BY-WEEK BREAKDOWN */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">📅 Weekly Breakdown</h2>
        <div className="space-y-3">
          {data.weeks.map((week, i) => (
            <div key={i}>
              <button onClick={() => setSelectedWeek(selectedWeek === i ? null : i)}
                className="w-full text-left p-4 rounded-xl transition-all" style={{
                  background: selectedWeek === i ? `${data.powerColor}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedWeek === i ? data.powerColor + '50' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-semibold text-white">Week {i + 1}: {week.title}</span>
                    <span className="ml-2 text-xs text-white/40">{week.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${data.powerColor}30`, color: data.powerColor }}>
                      {week.focus}
                    </span>
                    <span className="text-white/40">{selectedWeek === i ? '▲' : '▼'}</span>
                  </div>
                </div>
              </button>
              {selectedWeek === i && (
                <div className="mt-2 p-4 rounded-xl text-sm text-white/75 leading-relaxed" style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  {week.reading}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. BEST & WORST DAYS CALENDAR */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">📆 {monthName} Power Calendar</h2>
        <div className="flex items-center gap-4 mb-4 text-xs text-white/50">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block bg-green-500"></span> Best Days</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block bg-red-500"></span> Challenging</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: data.powerColor }}></span> Today</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {['S','M','T','W','T','F','S'].map(d => (
            <div key={d} className="text-center text-xs text-white/30 py-1">{d}</div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isBest = data.bestDays.includes(day);
            const isChallenging = data.challengingDays.includes(day);
            const isToday = day === today;
            return (
              <div key={day} className="cal-day text-center py-2 rounded-lg text-xs font-medium cursor-default" style={{
                background: isToday ? data.powerColor : isBest ? 'rgba(34,197,94,0.2)' : isChallenging ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                color: isToday ? 'white' : isBest ? '#86efac' : isChallenging ? '#fca5a5' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${isToday ? data.powerColor : isBest ? 'rgba(34,197,94,0.3)' : isChallenging ? 'rgba(239,68,68,0.25)' : 'transparent'}`,
                fontWeight: isToday ? 'bold' : 'normal',
              }}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. MONTHLY SCORES DASHBOARD */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">📊 Monthly Forecast Scores</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.entries(data.scores) as [string, number][]).map(([key, val]) => (
            <div key={key} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: scoreColor(val) }}>{val}</div>
              <div className="text-xs text-white/50 capitalize mb-1">{key}</div>
              <div className="text-xs font-medium" style={{ color: scoreColor(val) }}>{scoreLabel(val)}</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${val}%`, background: `linear-gradient(90deg, ${scoreColor(val)}66, ${scoreColor(val)})`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. PLANETARY TRANSITS */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">🪐 Key Planetary Transits</h2>
        <div className="space-y-2">
          {data.transits.map((transit, i) => (
            <div key={i}>
              <button onClick={() => setViewedTransit(viewedTransit === i ? null : i)}
                className="w-full text-left p-4 rounded-xl transition-all" style={{
                  background: viewedTransit === i ? 'rgba(123,97,255,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${viewedTransit === i ? 'rgba(123,97,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-300 font-semibold text-sm">{transit.planet}</span>
                    <span className="text-white/60 text-sm">{transit.event}</span>
                  </div>
                  <span className="text-xs text-white/40">{transit.date}</span>
                </div>
              </button>
              {viewedTransit === i && (
                <div className="mt-1 px-4 py-3 rounded-xl text-sm text-white/70 italic" style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  ✨ {transit.meaning}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. MONTHLY MANTRA */}
      <div className="rounded-2xl p-6 text-center" style={{
        background: `radial-gradient(ellipse, ${data.powerColor}12, rgba(10,1,24,0.9))`,
        border: `1px solid ${data.powerColor}30`, borderRadius: '16px',
      }}>
        <div className="text-2xl mb-2 pulse-glow">🌙</div>
        <h2 className="text-xs uppercase tracking-widest text-white/40 mb-2">{monthName} Mantra</h2>
        <p className="text-xl text-white leading-relaxed italic" style={{ fontFamily: 'Cinzel, serif' }}>
          "{data.mantra}"
        </p>
      </div>

      {/* ── 7. GOALS & INTENTIONS TRACKER */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">🎯 Monthly Intentions</h2>
        <p className="text-xs text-white/40 mb-4">Set 3 cosmic intentions for {monthName}</p>
        <div className="space-y-3 mb-4">
          {intentions.map((val, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="text-sm w-5 text-center" style={{ color: data.powerColor }}>✦</span>
              <input
                value={val}
                onChange={e => {
                  const next = [...intentions];
                  next[i] = e.target.value;
                  setIntentions(next);
                  setSavedIntentions(false);
                }}
                placeholder={`Intention ${i + 1}...`}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-white/40 mb-3 italic">{data.intention}</p>
        <button onClick={() => setSavedIntentions(true)}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all" style={{
            background: savedIntentions ? `${data.powerColor}40` : `${data.powerColor}20`,
            border: `1px solid ${data.powerColor}50`,
            color: data.powerColor,
          }}>
          {savedIntentions ? '✓ Intentions Set Under the Stars' : '🌟 Set My Intentions'}
        </button>
      </div>
    </div>
  );
}