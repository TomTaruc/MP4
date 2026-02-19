import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getZodiacSign } from '../utils/zodiac';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Monthly data keyed by sign
const MONTHLY_DATA: Record<string, {
  overview: string; theme: string; powerCrystal: string; powerColor: string;
  weeks: { title: string; focus: string; advice: string }[];
  scores: { love: number; career: number; health: number; finance: number };
  transits: { planet: string; effect: string; date: string }[];
  intentions: string[];
}> = {
  Aries: {
    theme: 'Bold Beginnings', powerCrystal: 'Carnelian', powerColor: '#FF4136',
    overview: 'This month ignites your pioneering spirit, Aries. Mars energizes your drive for new ventures and bold actions. The first two weeks are ideal for launching initiatives you\'ve been planning. Mid-month brings a surge in social connections that could lead to exciting collaborations. The final weeks call for reflection before your next powerful move forward.',
    weeks: [
      { title: 'Week 1: Launch', focus: 'New beginnings and bold initiatives', advice: 'Start the project you\'ve been delaying — cosmic timing is perfect.' },
      { title: 'Week 2: Build', focus: 'Momentum and confidence', advice: 'Double down on what\'s working. Your energy is magnetic.' },
      { title: 'Week 3: Connect', focus: 'Alliances and collaborations', advice: 'The right people are entering your orbit. Be open.' },
      { title: 'Week 4: Reflect', focus: 'Integration and planning', advice: 'Assess progress honestly before the next bold move.' },
    ],
    scores: { love: 82, career: 94, health: 85, finance: 78 },
    transits: [
      { planet: 'Mars', effect: 'Supercharges ambition and physical vitality', date: 'Week 1-2' },
      { planet: 'Venus', effect: 'Softens edges, invites romantic opportunity', date: 'Week 2-3' },
      { planet: 'Mercury', effect: 'Accelerates communication and clever ideas', date: 'Week 3-4' },
    ],
    intentions: ['I boldly claim what is mine', 'I lead with courage and passion', 'I initiate and I conquer'],
  },
  Taurus: {
    theme: 'Abundance & Security', powerCrystal: 'Emerald', powerColor: '#2ECC40',
    overview: 'Venus showers your month with beauty, pleasure, and financial opportunity, Taurus. The opening weeks favor investments, creative projects, and deepening relationships. Mid-month brings a moment to reassess your values and what truly matters. The closing weeks deliver tangible rewards for your patient, consistent efforts throughout the month.',
    weeks: [
      { title: 'Week 1: Cultivate', focus: 'Financial and creative growth', advice: 'Make one smart financial decision this week.' },
      { title: 'Week 2: Savor', focus: 'Beauty, pleasure, and connection', advice: 'Invest in relationships — they are your greatest asset.' },
      { title: 'Week 3: Value', focus: 'Reassessing priorities', advice: 'Release what no longer aligns with your authentic values.' },
      { title: 'Week 4: Harvest', focus: 'Rewards and recognition', advice: 'Accept what you\'ve earned with gratitude and grace.' },
    ],
    scores: { love: 90, career: 81, health: 84, finance: 93 },
    transits: [
      { planet: 'Venus', effect: 'Amplifies beauty, love, and financial magnetism', date: 'All month' },
      { planet: 'Jupiter', effect: 'Expands abundance in all material areas', date: 'Week 1-3' },
      { planet: 'Saturn', effect: 'Rewards disciplined efforts with lasting gains', date: 'Week 3-4' },
    ],
    intentions: ['I am a magnet for abundance', 'I build with patience and love', 'I deserve all beautiful things'],
  },
  Gemini: {
    theme: 'Communication & Connection', powerCrystal: 'Citrine', powerColor: '#FFDC00',
    overview: 'Mercury ignites your already brilliant mind this month, Gemini. Exceptional opportunities arise through conversations, writing, and networking. The first half of the month is perfect for pitching ideas and forging new connections. Mid-month brings a brief pause for processing. The final weeks see your most inspired ideas reach receptive audiences.',
    weeks: [
      { title: 'Week 1: Spark', focus: 'Ideas and initial connections', advice: 'Share your vision widely — it resonates more than you know.' },
      { title: 'Week 2: Network', focus: 'Strategic relationship building', advice: 'The most valuable contact appears unexpectedly.' },
      { title: 'Week 3: Process', focus: 'Integration and reflection', advice: 'Slow down briefly to absorb all you\'ve received.' },
      { title: 'Week 4: Broadcast', focus: 'Sharing your best ideas', advice: 'Publish, present, or pitch — your timing is perfect.' },
    ],
    scores: { love: 79, career: 93, health: 72, finance: 81 },
    transits: [
      { planet: 'Mercury', effect: 'Electrifies communication and intellectual gifts', date: 'Week 1-2' },
      { planet: 'Sun', effect: 'Illuminates your authentic self and voice', date: 'Week 2-3' },
      { planet: 'Jupiter', effect: 'Expands reach and opens publishing doors', date: 'Week 4' },
    ],
    intentions: ['I communicate my truth with clarity', 'I connect and I inspire', 'My words create positive change'],
  },
  Cancer: {
    theme: 'Nurturing & Intuition', powerCrystal: 'Moonstone', powerColor: '#00BFFF',
    overview: 'The Moon heightens your extraordinary intuition to new peaks this month, Cancer. Home, family, and emotional foundations take center stage in beautiful ways. The first weeks bring domestic harmony and family connections that nourish your soul. Mid-month, your psychic insights guide an important decision with perfect accuracy. The final weeks call for honoring your own emotional needs as a sacred priority.',
    weeks: [
      { title: 'Week 1: Nest', focus: 'Home, family, and emotional foundations', advice: 'Create beauty in your sanctuary — it directly affects your power.' },
      { title: 'Week 2: Nurture', focus: 'Caring for self and loved ones', advice: 'Balance giving and receiving — your wellbeing matters equally.' },
      { title: 'Week 3: Intuit', focus: 'Psychic insights and inner knowing', advice: 'Trust the feeling that keeps returning — it is accurate.' },
      { title: 'Week 4: Honor', focus: 'Self-care and emotional truth', advice: 'Your needs are not burdens. Honor them as sacred.' },
    ],
    scores: { love: 94, career: 77, health: 82, finance: 76 },
    transits: [
      { planet: 'Moon', effect: 'Amplifies intuition and emotional intelligence', date: 'All month' },
      { planet: 'Venus', effect: 'Blesses family relationships with warmth', date: 'Week 1-2' },
      { planet: 'Neptune', effect: 'Deepens psychic sensitivity and creative vision', date: 'Week 3' },
    ],
    intentions: ['I trust my intuition completely', 'I create safety for myself and those I love', 'My sensitivity is my superpower'],
  },
  Leo: {
    theme: 'Radiance & Recognition', powerCrystal: 'Sunstone', powerColor: '#FF851B',
    overview: 'The Sun blazes through your chart this month, Leo, amplifying your natural radiance to extraordinary levels. Creative projects, leadership opportunities, and romantic adventures all flourish. The first two weeks are your time to shine most brilliantly in professional settings. Mid-month sparks a beautiful creative breakthrough. The final weeks bring well-deserved recognition and celebration.',
    weeks: [
      { title: 'Week 1: Perform', focus: 'Professional visibility and leadership', advice: 'Step forward boldly — the spotlight is yours and you deserve it.' },
      { title: 'Week 2: Create', focus: 'Artistic and expressive projects', advice: 'Your creativity is at its most magnetic peak. Create freely.' },
      { title: 'Week 3: Breakthrough', focus: 'Creative and personal breakthrough', advice: 'One inspired idea this week changes your trajectory significantly.' },
      { title: 'Week 4: Celebrate', focus: 'Recognition and joy', advice: 'Receive praise with genuine grace. You have earned every bit of it.' },
    ],
    scores: { love: 87, career: 95, health: 89, finance: 82 },
    transits: [
      { planet: 'Sun', effect: 'Maximizes your radiance, confidence, and appeal', date: 'All month' },
      { planet: 'Mars', effect: 'Fuels creative fire and competitive drive', date: 'Week 1-2' },
      { planet: 'Jupiter', effect: 'Brings abundant recognition and opportunity', date: 'Week 4' },
    ],
    intentions: ['I shine my light for all to see', 'I create with joy and bold confidence', 'I am worthy of celebration'],
  },
  Virgo: {
    theme: 'Precision & Mastery', powerCrystal: 'Jade', powerColor: '#01FF70',
    overview: 'Mercury sharpens your analytical genius to a perfect edge this month, Virgo. Systems you improve, details you catch, and processes you refine create remarkable outcomes. The first half rewards meticulous work with significant recognition. Mid-month brings an opportunity to demonstrate your expertise in an important setting. The final weeks deliver the satisfying results of your careful, dedicated efforts.',
    weeks: [
      { title: 'Week 1: Analyze', focus: 'Problem-solving and process improvement', advice: 'The system flaw you identify and fix this week saves enormous resources.' },
      { title: 'Week 2: Refine', focus: 'Perfecting and optimizing', advice: 'Your attention to detail elevates everything it touches.' },
      { title: 'Week 3: Demonstrate', focus: 'Showcasing expertise', advice: 'Share your knowledge — your mastery deserves an audience.' },
      { title: 'Week 4: Deliver', focus: 'Completing and celebrating results', advice: 'The work is done. Accept the praise it earns with humility and pride.' },
    ],
    scores: { love: 76, career: 94, health: 90, finance: 85 },
    transits: [
      { planet: 'Mercury', effect: 'Amplifies analytical thinking and precision', date: 'All month' },
      { planet: 'Saturn', effect: 'Rewards systematic effort with lasting achievement', date: 'Week 2-3' },
      { planet: 'Chiron', effect: 'Heals perfectionism, invites compassionate standards', date: 'Week 4' },
    ],
    intentions: ['I achieve excellence through dedication', 'I serve with precision and love', 'My work creates lasting positive impact'],
  },
  Libra: {
    theme: 'Balance & Beauty', powerCrystal: 'Rose Quartz', powerColor: '#FF69B4',
    overview: 'Venus graces your entire month with exceptional beauty, harmony, and relationship magic, Libra. Partnerships — both personal and professional — reach meaningful new depth. The first two weeks are ideal for important negotiations and creative collaborations. Mid-month, a heartfelt conversation transforms a key relationship beautifully. The final weeks bring the balanced, harmonious life you have been consciously creating.',
    weeks: [
      { title: 'Week 1: Harmonize', focus: 'Relationship alignment and collaboration', advice: 'The partnership conversation you\'ve been avoiding brings beautiful resolution.' },
      { title: 'Week 2: Negotiate', focus: 'Agreements and contracts', advice: 'Your diplomatic genius creates solutions that honor everyone involved.' },
      { title: 'Week 3: Deepen', focus: 'Emotional intimacy and truth', advice: 'Vulnerability in one key relationship creates unbreakable connection.' },
      { title: 'Week 4: Balance', focus: 'Achieving harmony across all areas', advice: 'You have created beauty. Take a moment to genuinely appreciate it.' },
    ],
    scores: { love: 95, career: 83, health: 79, finance: 80 },
    transits: [
      { planet: 'Venus', effect: 'Blesses relationships and creative work with grace', date: 'All month' },
      { planet: 'Jupiter', effect: 'Expands love, partnership, and social abundance', date: 'Week 1-2' },
      { planet: 'Mercury', effect: 'Facilitates perfect diplomacy and elegant communication', date: 'Week 2-3' },
    ],
    intentions: ['I create harmony in all my relationships', 'I attract beauty and balance effortlessly', 'Love flows freely through my life'],
  },
  Scorpio: {
    theme: 'Transformation & Power', powerCrystal: 'Obsidian', powerColor: '#85144b',
    overview: 'Pluto intensifies your month with powerful transformation and breakthrough energy, Scorpio. Hidden truths surface, outdated patterns dissolve, and your authentic power rises. The first two weeks are potent for strategic moves and research that others miss. Mid-month brings a pivotal revelation that accelerates your transformation. The final weeks reveal the extraordinary version of yourself that was waiting beneath the surface.',
    weeks: [
      { title: 'Week 1: Investigate', focus: 'Research, strategy, and uncovering truth', advice: 'The information you seek is closer than it appears. Look beneath the surface.' },
      { title: 'Week 2: Strategize', focus: 'Power moves and intentional positioning', advice: 'Make your move now — your timing and instincts are perfectly calibrated.' },
      { title: 'Week 3: Transform', focus: 'Releasing old patterns and emerging anew', advice: 'The old story ends here. Step fearlessly into the powerful new chapter.' },
      { title: 'Week 4: Rise', focus: 'Claiming your authentic power', advice: 'You have transformed. Own your power completely and unapologetically.' },
    ],
    scores: { love: 88, career: 90, health: 78, finance: 86 },
    transits: [
      { planet: 'Pluto', effect: 'Catalyzes deep transformation and power awakening', date: 'All month' },
      { planet: 'Mars', effect: 'Provides the courage to act on your deepest truths', date: 'Week 1-2' },
      { planet: 'Neptune', effect: 'Dissolves illusions, revealing authentic reality', date: 'Week 3' },
    ],
    intentions: ['I embrace transformation fearlessly', 'I claim my full authentic power', 'I rise from every challenge stronger'],
  },
  Sagittarius: {
    theme: 'Freedom & Wisdom', powerCrystal: 'Turquoise', powerColor: '#3D9970',
    overview: 'Jupiter expands every horizon in your world this month, Sagittarius. Adventures — physical, intellectual, and spiritual — call your name irresistibly. The first two weeks are exceptional for travel, higher learning, and philosophical exploration. Mid-month brings a wisdom insight that shifts your entire perspective. The final weeks see your expansive vision attracting exactly the opportunities it needs to manifest.',
    weeks: [
      { title: 'Week 1: Explore', focus: 'Adventure, travel, and new horizons', advice: 'Say yes to the unexpected opportunity — it expands your world beautifully.' },
      { title: 'Week 2: Learn', focus: 'Higher education and philosophical growth', advice: 'The teacher or teaching that appears now is exactly what your soul has been seeking.' },
      { title: 'Week 3: Insight', focus: 'Wisdom integration and perspective shift', advice: 'One profound realization this week changes how you see everything.' },
      { title: 'Week 4: Manifest', focus: 'Vision becoming tangible reality', advice: 'Your expanded perspective is now attracting aligned opportunities.' },
    ],
    scores: { love: 81, career: 89, health: 92, finance: 79 },
    transits: [
      { planet: 'Jupiter', effect: 'Maximizes expansion, luck, and philosophical growth', date: 'All month' },
      { planet: 'Sun', effect: 'Illuminates your authentic truth and purpose', date: 'Week 1-2' },
      { planet: 'Uranus', effect: 'Delivers exciting, unexpected breakthroughs', date: 'Week 3' },
    ],
    intentions: ['I embrace adventure and growth fearlessly', 'I seek and share wisdom generously', 'My freedom creates my greatest achievements'],
  },
  Capricorn: {
    theme: 'Achievement & Legacy', powerCrystal: 'Garnet', powerColor: '#AAAAAA',
    overview: 'Saturn rewards your consistent discipline with remarkable recognition this month, Capricorn. Career matters dominate the first two weeks — a major opportunity, promotion, or responsibility arrives that reflects your years of dedicated work. Mid-month calls for grounding your ambition with personal warmth. The final weeks plant the seeds of a new achievement cycle that will define your legacy.',
    weeks: [
      { title: 'Week 1: Ascend', focus: 'Career breakthrough and authority', advice: 'The opportunity that arrives this week is the one you have worked years to deserve.' },
      { title: 'Week 2: Lead', focus: 'Stepping into greater responsibility', advice: 'Accept the expanded role with the confidence your experience has fully earned.' },
      { title: 'Week 3: Balance', focus: 'Integrating ambition with personal life', advice: 'Success means nothing without the people who matter most. Invest in them.' },
      { title: 'Week 4: Plant', focus: 'Sowing seeds for the next achievement cycle', advice: 'One intentional investment now compounds into extraordinary results.' },
    ],
    scores: { love: 75, career: 96, health: 80, finance: 91 },
    transits: [
      { planet: 'Saturn', effect: 'Rewards long-term discipline with career elevation', date: 'All month' },
      { planet: 'Jupiter', effect: 'Brings abundant recognition and material rewards', date: 'Week 1-2' },
      { planet: 'Venus', effect: 'Softens ambition with genuine warmth and connection', date: 'Week 3' },
    ],
    intentions: ['I build my legacy with patience and excellence', 'I master every challenge I face', 'My disciplined efforts create lasting abundance'],
  },
  Aquarius: {
    theme: 'Revolution & Vision', powerCrystal: 'Amethyst', powerColor: '#00B4D8',
    overview: 'Uranus electrifies your month with breakthrough energy and revolutionary insights, Aquarius. Your most unconventional ideas are exactly what the world needs. The early weeks are exceptional for innovation, technology, and community building. Mid-month, a group project or collaborative venture gains unstoppable momentum. The final days bring a meaningful connection that feeds your vision and accelerates your impact.',
    weeks: [
      { title: 'Week 1: Innovate', focus: 'Breakthrough ideas and technology', advice: 'The unconventional solution you\'re hesitating to share is the right one. Share it.' },
      { title: 'Week 2: Connect', focus: 'Community and collaborative energy', advice: 'Your network is your greatest resource this week. Activate it intentionally.' },
      { title: 'Week 3: Build', focus: 'Collaborative momentum and group projects', advice: 'The collective vision gains power when you step fully into your leadership role.' },
      { title: 'Week 4: Vision', focus: 'Future-oriented planning and meaningful connection', advice: 'The person or idea that arrives this week expands your vision of what\'s possible.' },
    ],
    scores: { love: 79, career: 92, health: 81, finance: 83 },
    transits: [
      { planet: 'Uranus', effect: 'Catalyzes innovation, breakthroughs, and liberation', date: 'All month' },
      { planet: 'Saturn', effect: 'Grounds revolutionary ideas into lasting structures', date: 'Week 2-3' },
      { planet: 'Jupiter', effect: 'Expands community influence and humanitarian reach', date: 'Week 4' },
    ],
    intentions: ['I think beyond all conventional limits', 'I innovate for the benefit of all humanity', 'My unique vision creates positive global change'],
  },
  Pisces: {
    theme: 'Surrender & Magic', powerCrystal: 'Amethyst', powerColor: '#74C0FC',
    overview: 'Neptune wraps your entire month in luminous, magical energy, Pisces. Your creative gifts, spiritual sensitivity, and psychic abilities are operating at their absolute peak. The opening weeks are extraordinary for artistic work and spiritual practice. Mid-month, a full moon illuminates a profound emotional truth that sets you free. The final days bring a soul connection or spiritual experience that opens an entirely new chapter.',
    weeks: [
      { title: 'Week 1: Create', focus: 'Artistic expression and spiritual practice', advice: 'Create without judgment this week — your most inspired work emerges from pure flow.' },
      { title: 'Week 2: Flow', focus: 'Intuition and emotional intelligence', advice: 'Follow the current rather than fighting it — the universe knows the best path.' },
      { title: 'Week 3: Illuminate', focus: 'Emotional truth and release', advice: 'The full moon reveals what you\'ve been avoiding. Face it — freedom awaits.' },
      { title: 'Week 4: Connect', focus: 'Soul connections and new chapters', advice: 'The arrival at month\'s end — whether a person or an insight — is profoundly significant.' },
    ],
    scores: { love: 94, career: 79, health: 76, finance: 74 },
    transits: [
      { planet: 'Neptune', effect: 'Maximizes creativity, spirituality, and psychic gifts', date: 'All month' },
      { planet: 'Venus', effect: 'Deepens romantic and spiritual love', date: 'Week 1-2' },
      { planet: 'Full Moon', effect: 'Illuminates emotional truths and enables release', date: 'Week 3' },
    ],
    intentions: ['I surrender to the magic of the universe', 'I trust the wisdom of my deepest feelings', 'I create beauty and healing wherever I flow'],
  },
};

export default function MonthlyHoroscopePage() {
  const { profile } = useAuth();

  // AuthContext guarantees profile.zodiac_sign is correct — no 'Aries' fallback needed
  const sign = (profile?.date_of_birth ? getZodiacSign(profile.date_of_birth) : null)
    || profile?.zodiac_sign
    || 'Aries';
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

      {/* ── 1. MONTH OVERVIEW */}
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

      {/* ── 2. MONTHLY SCORES */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">📊 Monthly Cosmic Scores</h2>
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(data.scores) as [string, number][]).map(([key, val]) => (
            <div key={key} className="p-4 rounded-xl" style={{ background: `${scoreColor(val)}10`, border: `1px solid ${scoreColor(val)}30` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70 capitalize">{key}</span>
                <span className="text-sm font-bold" style={{ color: scoreColor(val) }}>{scoreLabel(val)}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${scoreColor(val)}88, ${scoreColor(val)})` }} />
              </div>
              <span className="text-xs text-white/40 mt-1 block">{val}/100</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. WEEKLY BREAKDOWN */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">📅 Weekly Breakdown</h2>
        <div className="space-y-3">
          {data.weeks.map((week, i) => (
            <div key={i}>
              <button
                onClick={() => setSelectedWeek(selectedWeek === i ? null : i)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{
                  background: selectedWeek === i ? `${data.powerColor}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedWeek === i ? data.powerColor + '44' : 'rgba(255,255,255,0.08)'}`,
                }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{week.title}</span>
                  <span className="text-xs" style={{ color: data.powerColor }}>{week.focus}</span>
                </div>
              </button>
              {selectedWeek === i && (
                <div className="mt-2 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm text-white/80 leading-relaxed">💫 {week.advice}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. CALENDAR VIEW */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">🗓️ {monthName} at a Glance</h2>
        <div className="grid grid-cols-7 gap-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-xs text-white/40 pb-2">{d}</div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
            <div key={day} className="cal-day text-center text-xs rounded-lg p-1.5 cursor-default"
              style={{
                background: day === today ? `${data.powerColor}40` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${day === today ? data.powerColor : 'rgba(255,255,255,0.06)'}`,
                color: day === today ? 'white' : day < today ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                fontWeight: day === today ? 700 : 400,
              }}>
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. PLANETARY TRANSITS */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">🪐 Key Planetary Influences</h2>
        <div className="space-y-3">
          {data.transits.map((transit, i) => (
            <div key={i}>
              <button
                onClick={() => setViewedTransit(viewedTransit === i ? null : i)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-400">{transit.planet}</span>
                  <span className="text-xs text-purple-400">{transit.date}</span>
                </div>
              </button>
              {viewedTransit === i && (
                <div className="mt-2 p-3 rounded-xl" style={{ background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.2)' }}>
                  <p className="text-sm text-white/80">{transit.effect}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. MONTHLY INTENTIONS */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-semibold text-white mb-2">🌱 Monthly Intentions</h2>
        <p className="text-xs text-white/40 mb-4">Set three intentions to align with {monthName}\'s cosmic energy</p>
        <div className="space-y-3 mb-4">
          {intentions.map((val, i) => (
            <input key={i} value={val}
              onChange={e => setIntentions(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
              placeholder={data.intentions[i]}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <button
          onClick={() => { setSavedIntentions(true); setTimeout(() => setSavedIntentions(false), 2000); }}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: `${data.powerColor}25`, color: data.powerColor, border: `1px solid ${data.powerColor}44` }}>
          {savedIntentions ? '✓ Intentions Set!' : '🔖 Set Intentions'}
        </button>
      </div>
    </div>
  );
}