import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DAILY_READINGS: Record<string, {
  overall: string; love: string; career: string; health: string; spiritual: string;
  warning: string; tip: string;
  scores: { overall: number; love: number; career: number; health: number; energy: number };
  lucky: { number: number; color: string; time: string; direction: string; crystal: string };
  planet: string; planetEffect: string;
}> = {
  Aries: {
    overall: 'The cosmic fire burns bright in your chart today, Aries. Mars, your ruling planet, forms a powerful trine with Jupiter, amplifying your natural boldness and drive. This is a day to initiate, to lead, and to take decisive action on projects you\'ve been contemplating. Your energy is electric — channel it wisely.',
    love: 'A magnetic energy surrounds you today. Singles may encounter someone intriguing through unexpected channels — perhaps a mutual friend or work setting. Couples should plan something spontaneous and adventurous. Your passion is contagious, but remember to slow down and listen.',
    career: 'Mercury aligns favorably with your sun today, sharpening your communication. A bold presentation or proposal could turn heads. Don\'t second-guess your instincts — your first idea is likely your best. A mentor or senior figure may offer valuable guidance.',
    health: 'Your physical energy is peaking today. An intense workout session, martial arts, or any competitive sport will feel exhilarating. Watch your head — the body part ruled by Aries — and avoid risky physical activities after 6 PM when energy may dip.',
    spiritual: 'The universe is aligning your desires with your path. Take 10 minutes today to visualize your goals as already achieved. Your manifestation power is amplified under today\'s planetary configuration.',
    warning: 'Impulsiveness may lead you to burn bridges unnecessarily. Pause before sending that message in anger — wait 24 hours.',
    tip: 'Red garments or accessories boost your confidence and attract positive energy today.',
    scores: { overall: 85, love: 78, career: 90, health: 82, energy: 95 },
    lucky: { number: 8, color: 'Crimson Red', time: '2:00 PM – 4:00 PM', direction: 'East', crystal: 'Bloodstone' },
    planet: 'Mars ♂', planetEffect: 'Mars empowers your ambition and courage today. Use this energy to initiate, not react.',
  },
  Taurus: {
    overall: 'Venus, your ruling planet, casts a warm golden glow over your chart today. There\'s a beautiful harmony between your desire for comfort and the universe\'s offerings. Financial matters look favorable, and creative projects are especially blessed. Allow yourself to indulge in beauty and pleasure without guilt.',
    love: 'Romance is in the air for Taurus today. Venus\'s influence makes you irresistibly attractive. A long-established relationship deepens beautifully today — share a meal, a walk, or a tender conversation. Singles may meet someone with shared tastes and values.',
    career: 'Your practical nature serves you well today. A financial decision you\'ve been deliberating becomes clearer. Trust your instinct for value — you can spot a good deal or a bad investment better than anyone. A creative project gets the green light.',
    health: 'Your body craves nourishment and beauty today. A healthy, indulgent meal, aromatherapy, or a massage would do wonders. Neck and throat exercises are beneficial. Avoid rushing — let your body move at its natural, grounded pace.',
    spiritual: 'Nature is calling you today. Even 20 minutes barefoot on grass or soil will dramatically shift your energy. You\'re a child of the Earth — reconnect with her today.',
    warning: 'Stubbornness could cost you an opportunity. Be willing to adapt your plans when new information arrives.',
    tip: 'Surround yourself with fresh flowers or plants today to elevate your vibration and attract abundance.',
    scores: { overall: 82, love: 90, career: 78, health: 85, energy: 75 },
    lucky: { number: 6, color: 'Emerald Green', time: '10:00 AM – 12:00 PM', direction: 'South', crystal: 'Rose Quartz' },
    planet: 'Venus ♀', planetEffect: 'Venus amplifies beauty, love, and material abundance. Open your hands to receive.',
  },
  Gemini: {
    overall: 'Mercury, your cosmic ruler, stations direct today, clearing communication fog that has been affecting your wit and clarity. Ideas that were stuck begin flowing freely again. Your natural brilliance is on full display — engage with people, share your thoughts, and let your curiosity lead the way.',
    love: 'Your charm is at its peak today, Gemini. Conversations flow beautifully and your humor is magnetic. Plan something intellectually stimulating with a partner or potential love interest — a museum, a debate, or a thought-provoking film. Authenticity is more attractive than performance today.',
    career: 'Writing, presenting, negotiating — any Mercury-ruled activity is supercharged today. Send the pitch, make the call, schedule the meeting. Your words carry unusual persuasive power. A creative collaboration with a colleague could yield surprising results.',
    health: 'The lungs and nervous system need attention today. Deep breathing exercises, a short meditation, or a walk in fresh air will recalibrate your mental chatter. Avoid overstimulation from screens and social media after 8 PM.',
    spiritual: 'The universe is sending you messages through synchronicities today — repeated numbers, overheard conversations, and dreams. Pay attention to these cosmic whispers.',
    warning: 'Your tendency to say yes to everything may overload your schedule. Practice the art of graceful refusal.',
    tip: 'Carry or wear yellow today to sharpen your intellect and attract fortunate conversations.',
    scores: { overall: 88, love: 82, career: 95, health: 72, energy: 88 },
    lucky: { number: 5, color: 'Sunlit Yellow', time: '8:00 AM – 10:00 AM', direction: 'West', crystal: 'Clear Quartz' },
    planet: 'Mercury ☿', planetEffect: 'Mercury sharpens your mind and tongue. Your words today have the power to open doors.',
  },
  Cancer: {
    overall: 'The Moon, your celestial ruler, forms a rare and powerful conjunction with Neptune today, deepening your already extraordinary intuition to near-psychic levels. You may sense things before they happen. Trust these impressions completely. Emotional intelligence is your greatest asset today — use it.',
    love: 'Your nurturing energy is radiant today and deeply felt by those around you. Partners will feel unusually seen and held. Take the lead in creating an intimate, cozy atmosphere — cook together, light candles, share memories. Singles may connect with someone who sees their depth.',
    career: 'Your intuition in professional matters is uncannily accurate today. Trust that gut feeling about a colleague\'s true intentions or a project\'s viability. Creative and empathetic roles shine especially bright. A conversation with a client or patient could be deeply meaningful.',
    health: 'The stomach and digestive system need gentle attention today. Warm, nourishing foods, herbal teas, and minimal processed food will support your wellbeing. Emotional stress manifests physically for Cancer — a short journaling session releases tension.',
    spiritual: 'Water holds special medicine for you today. A bath, ocean, lake, or even holding a glass of water mindfully will cleanse your energy field and restore your sense of peace.',
    warning: 'Your sensitivity may cause you to misread a neutral comment as criticism. Pause before withdrawing into your shell — ask for clarification first.',
    tip: 'A white or silver accessory today amplifies your lunar connection and offers emotional protection.',
    scores: { overall: 80, love: 95, career: 72, health: 78, energy: 70 },
    lucky: { number: 2, color: 'Moonlit Silver', time: '6:00 PM – 8:00 PM', direction: 'North', crystal: 'Moonstone' },
    planet: 'Moon ☽', planetEffect: 'The Moon heightens emotion and intuition. Your inner world is your superpower today.',
  },
  Leo: {
    overall: 'The Sun, your magnificent ruler, makes an auspicious aspect to Jupiter today, expanding your natural radiance to fill every room you enter. This is your moment to shine without apology. Opportunities for recognition, creative expression, and leadership are abundant. Claim your throne.',
    love: 'Romance burns gloriously for Leo today. Your warmth and confidence are irresistible. Plan something grand and memorable with your partner — Leo deserves the theatrical. Singles may find someone drawn to their light like a moth to a flame. Be generous with your affection.',
    career: 'A leadership moment arrives today — seize it with both hands. Your ability to inspire and galvanize a team is at its absolute peak. Creative projects, presentations, and pitches are blessed. Don\'t understate your contributions in meetings — your ideas deserve the spotlight.',
    health: 'The heart and spine are energized today. Vigorous exercise, especially dance or sports with an audience element, will elevate your mood spectacularly. Avoid caffeine overload — your energy is already abundant and may tip into anxiety.',
    spiritual: 'You are being called to step into your spiritual authority. What gifts has the universe given you that you\'ve been hiding? Today, offer them to the world without fear.',
    warning: 'Pride may close a door that generosity would open. Acknowledge others\' contributions genuinely before taking the stage.',
    tip: 'Gold jewelry or accents today amplify your solar energy and attract admiration and opportunity.',
    scores: { overall: 92, love: 88, career: 95, health: 85, energy: 98 },
    lucky: { number: 1, color: 'Radiant Gold', time: '12:00 PM – 2:00 PM', direction: 'East', crystal: 'Citrine' },
    planet: 'Sun ☀️', planetEffect: 'The Sun illuminates your gifts and amplifies your natural magnetism. Shine boldly.',
  },
  Virgo: {
    overall: 'Mercury, your meticulous ruler, forms a precise sextile with Saturn today, creating the perfect cosmic conditions for organized, disciplined, highly productive work. Your analytical powers are sharper than ever. Complex problems that have stumped others yield to your systematic approach. This is your day.',
    love: 'Your thoughtfulness in love is deeply appreciated today. Small, carefully considered gestures — a note, a favorite snack, remembering something they mentioned weeks ago — mean everything to your partner. Singles may meet someone through shared intellectual interest or a health-related activity.',
    career: 'Detail-oriented work is powerfully favored today. Editing, analysis, health-related tasks, and systematic problem-solving all yield excellent results. A review or audit you\'ve been anxious about turns out better than expected. Your thoroughness will be noted and rewarded.',
    health: 'The digestive system responds beautifully to a clean, nutritious diet today. Try fermented foods or probiotics. A mindful eating practice — eating without screens or distractions — will transform your relationship with food. Your body is speaking; listen carefully.',
    spiritual: 'Service is your spiritual path, Virgo. Volunteering, helping a neighbor, or simply lending your skills to someone in need will fill your soul in ways no meditation can. Your spiritual growth happens through daily acts of humble service.',
    warning: 'Perfectionism may paralyze progress today. Done and improved is better than perfect and unfinished. Submit the work.',
    tip: 'Green vegetables and herbal teas are especially powerful allies today for your body and mind.',
    scores: { overall: 85, love: 72, career: 92, health: 90, energy: 80 },
    lucky: { number: 5, color: 'Sage Green', time: '7:00 AM – 9:00 AM', direction: 'North', crystal: 'Jasper' },
    planet: 'Mercury ☿', planetEffect: 'Mercury empowers your analytical mind. Precision and attention to detail bring breakthroughs today.',
  },
  Libra: {
    overall: 'Venus, your gracious ruler, makes a beautiful trine to Jupiter today, expanding your already considerable charm to almost irresistible levels. Beauty, harmony, and justice are the themes of your day. Relationships flourish, creative projects blossom, and you\'ll find yourself naturally mediating conflicts that others can\'t navigate.',
    love: 'This is one of your most romantically blessed days of the season. Make a move if you\'ve been hesitating — the cosmos fully support it. Couples should plan something beautiful together — an art gallery, a fine dinner, or dressing up for no reason. Your love life is your greatest work of art.',
    career: 'Your ability to see multiple perspectives and craft elegant solutions is in highest demand today. Legal matters, negotiations, and partnership agreements are all favored. A creative collaboration you\'ve been pursuing gains momentum. Your aesthetic sensibility solves a practical problem.',
    health: 'The kidneys and lower back need love today. Plenty of water, avoiding excess sugar, and a gentle yoga or stretching session support your balance. Your health is directly tied to relational harmony — resolve any simmering conflicts for a physical boost.',
    spiritual: 'Beauty is your spiritual language. Create something beautiful today — arrange flowers, write poetry, curate a playlist. When you create beauty, you channel the divine directly.',
    warning: 'People-pleasing could lead you to overcommit. One sincere "no" today is worth ten grudging "yeses".',
    tip: 'Pink or lavender clothing today amplifies your Venusian energy and makes you utterly magnetic.',
    scores: { overall: 88, love: 98, career: 82, health: 78, energy: 85 },
    lucky: { number: 6, color: 'Rose Pink', time: '3:00 PM – 5:00 PM', direction: 'West', crystal: 'Opal' },
    planet: 'Venus ♀', planetEffect: 'Venus and Jupiter unite to make today one of your most fortunate days of the month.',
  },
  Scorpio: {
    overall: 'Pluto, your transformational ruler, is in an intense mutual reception with Mars today, creating a day of profound power and psychological insight. You see through facades effortlessly. Deep truths that others have been hiding reveal themselves to your penetrating perception. Use this power with integrity — it\'s formidable.',
    love: 'Emotional intimacy reaches extraordinary depths today. A vulnerable conversation with your partner could permanently strengthen your bond. Singles may encounter someone with an unusual, magnetic quality that seems almost fated. Don\'t dismiss what feels inevitable.',
    career: 'Research, investigation, psychology, finance, and crisis management are all powerfully favored today. Your ability to find hidden information and unearth buried truths is unmatched. A secret you\'ve suspected in the workplace reveals itself — proceed with discretion.',
    health: 'The reproductive and excretory systems need attention today. Detox practices — a sauna, eliminating sugar or alcohol, or a fasting window — are especially effective. Sexual energy is high; channel it into creative or athletic endeavors if you need focus.',
    spiritual: 'The veil between worlds is thin for you today. Ancestor work, tarot reading, meditation on death and rebirth, or simply sitting with deep music will take you to powerful places within yourself.',
    warning: 'The urge to control outcomes may push important people away. Practice radical trust today.',
    tip: 'Black tourmaline or obsidian in your pocket today provides psychic protection and amplifies your power.',
    scores: { overall: 90, love: 85, career: 88, health: 75, energy: 92 },
    lucky: { number: 9, color: 'Midnight Black', time: '9:00 PM – 11:00 PM', direction: 'North', crystal: 'Obsidian' },
    planet: 'Pluto ♇', planetEffect: 'Pluto deepens your perception and empowers transformation. See beyond the surface today.',
  },
  Sagittarius: {
    overall: 'Jupiter, your abundant ruler, stations direct today after a period of retrograde — and you feel it immediately. Expansion is available on every front. Opportunities that seemed stalled begin moving again. Your natural optimism returns in force. This is the beginning of one of your most fortunate cycles in years.',
    love: 'Adventure is the love language today, Sagittarius. Plan something unexpected with your partner — a spontaneous trip, an outdoor experience, or a new cuisine. Singles may find a connection through travel, a philosophy class, or a meaningful discussion about life\'s big questions.',
    career: 'International matters, publishing, higher education, and long-distance projects all receive powerful cosmic support today. Your vision for the future is clearer than it\'s been in months. Present that big idea — Jupiter is amplifying your persuasive optimism to irresistible levels.',
    health: 'The hips and thighs are energized — an outdoor run, hike, or yoga flow would be exhilarating. Your metabolism is strong today; fuel it with wholesome, colorful foods from various cultures. Avoid overindulging in alcohol, which Jupiter\'s influence can amplify.',
    spiritual: 'Your higher mind is wide open today. Reading philosophy, listening to a spiritual teacher, or spending time in wide-open natural spaces expands your consciousness profoundly.',
    warning: 'Overconfidence may lead you to skip important steps or promise more than you can deliver. Ground your enthusiasm with a practical plan.',
    tip: 'Book that trip, take that class, send that application. Jupiter has opened the door — walk through it.',
    scores: { overall: 95, love: 80, career: 92, health: 85, energy: 95 },
    lucky: { number: 3, color: 'Royal Purple', time: '11:00 AM – 1:00 PM', direction: 'East', crystal: 'Turquoise' },
    planet: 'Jupiter ♃', planetEffect: 'Jupiter stations direct, unleashing a wave of expansion, opportunity, and optimism.',
  },
  Capricorn: {
    overall: 'Saturn, your disciplined ruler, forms a powerful conjunction with the North Node today, aligning your ambitions with your soul\'s purpose. The hard work you\'ve been doing behind the scenes is being recorded in the cosmic ledger. Recognition may not come today, but the seeds planted now will yield extraordinary harvests.',
    love: 'Security and commitment are the themes of your love life today. A conversation about the future of your relationship could bring much-needed clarity and solidity. Singles may be drawn to someone mature, established, and serious — someone who shares their long-term vision.',
    career: 'This is one of your most professionally powerful days of the season. Saturn rewards consistent effort with concrete results. A project milestone is reached, or recognition for previous work arrives. Authority figures and mentors are especially supportive.',
    health: 'Bones, teeth, and joints are your focus today. Weight-bearing exercises, calcium-rich foods, and ensuring adequate Vitamin D are beneficial. Your discipline makes you excellent at maintaining healthy routines — start one today that you can sustain for years.',
    spiritual: 'For Capricorn, spiritual practice is the long game. Begin or recommit to a meditation practice today with the intention of doing it every day for 30 days. The mountain climber\'s patience applies to spiritual ascent too.',
    warning: 'Emotional coldness may close a door that vulnerability would open. Allow yourself to feel — and even show — your feelings today.',
    tip: 'Dark green or black today conveys authority and attracts the respect and serious attention you deserve.',
    scores: { overall: 82, love: 70, career: 95, health: 85, energy: 78 },
    lucky: { number: 8, color: 'Forest Green', time: '6:00 AM – 8:00 AM', direction: 'South', crystal: 'Garnet' },
    planet: 'Saturn ♄', planetEffect: 'Saturn rewards your discipline and aligns your ambition with your highest purpose today.',
  },
  Aquarius: {
    overall: 'Uranus, your revolutionary ruler, makes an exact trine to your sun today, delivering a sudden flash of insight that could change your trajectory. Lightning-bolt ideas, unexpected encounters, and thrilling breaks from routine are all possible. The universe is conspiring to liberate you from what no longer serves your evolution.',
    love: 'Unconventional and exciting — that\'s the love energy today. Break the routine with your partner; try something neither of you has done before. Singles may find someone through technology, a progressive community, or a humanitarian cause. Authenticity is your most attractive quality.',
    career: 'Innovation is your superpower today. The strange, counterintuitive idea you\'ve been hesitant to voice is exactly what\'s needed. Technology, social change, and group projects are especially favored. A collaborative effort with like-minded visionaries could spark something world-changing.',
    health: 'The ankles and circulatory system need attention. Get your blood moving — dancing, cycling, or jumping rope are excellent. Electric and unexpected social interactions boost your wellbeing as powerfully as any supplement. Isolation is your enemy today.',
    spiritual: 'You are a channel for cosmic downloads today. Keep a voice memo app or notebook close — ideas will arrive fully formed and brilliant. These aren\'t random thoughts; they\'re transmissions.',
    warning: 'Emotional detachment could wound someone you care about. Remember that your logical explanations can feel cold to emotional signs. Soften your delivery.',
    tip: 'Electric blue or turquoise today amplifies your Uranian frequency and attracts synchronicities.',
    scores: { overall: 90, love: 78, career: 88, health: 80, energy: 92 },
    lucky: { number: 11, color: 'Electric Blue', time: '4:00 PM – 6:00 PM', direction: 'West', crystal: 'Labradorite' },
    planet: 'Uranus ♅', planetEffect: 'Uranus delivers breakthroughs and liberating insights. Embrace the unexpected today.',
  },
  Pisces: {
    overall: 'Neptune, your mystical ruler, makes a rare exact conjunction with the Moon today, creating the most spiritually potent 24 hours Pisces will experience this season. Your intuition, empathy, and creative vision are operating at divine levels. Trust every impression that arises — you are receiving cosmic transmissions.',
    love: 'Love today transcends the ordinary for Pisces. A connection that feels fated, a conversation that goes soul-deep, or a moment of pure wordless understanding with someone you love — these are the gifts available to you. Open your heart completely and let the cosmic love flow through you.',
    career: 'Creative, healing, and spiritual work are powerfully blessed today. If your career involves art, music, therapy, medicine, or spiritual guidance, you are operating with divine assistance. A creative project that has felt stalled suddenly opens into inspired flow. Say yes to the muse.',
    health: 'The feet and lymphatic system need gentle care. A foot massage, warm bath with sea salt, or barefoot walk on natural ground will be profoundly restorative. Dreams tonight will be especially vivid and meaningful — keep a journal by your bed.',
    spiritual: 'You are the closest to the divine of all signs today, and today is even more amplified than usual. Meditation, prayer, channel writing, or any form of spiritual practice will yield profound experiences. The veil is gossamer thin.',
    warning: 'Your boundaries may dissolve completely today, leaving you vulnerable to energy vampires. Protect your energy with intention and physical symbols like crystals or salt.',
    tip: 'Ocean imagery, sea sounds, or any water element near you today activates your most powerful spiritual gifts.',
    scores: { overall: 85, love: 95, career: 80, health: 75, energy: 80 },
    lucky: { number: 12, color: 'Sea Foam', time: '7:00 PM – 9:00 PM', direction: 'North', crystal: 'Amethyst' },
    planet: 'Neptune ♆', planetEffect: 'Neptune dissolves boundaries between worlds, opening you to divine inspiration and love.',
  },
};

const MOODS = ['✨ Inspired', '🔥 Energized', '😌 Peaceful', '💪 Determined', '🌊 Emotional', '😴 Low Energy', '🌟 Grateful', '😤 Frustrated'];

export default function DailyHoroscopePage() {
  const { profile } = useAuth();
  const sign = profile?.zodiac_sign || 'Aries';
  const reading = DAILY_READINGS[sign] || DAILY_READINGS['Aries'];
  const [activeSection, setActiveSection] = useState<'overall' | 'love' | 'career' | 'health' | 'spiritual'>('overall');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showLucky, setShowLucky] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const sectionText: Record<string, string> = {
    overall: reading.overall, love: reading.love, career: reading.career,
    health: reading.health, spiritual: reading.spiritual,
  };

  const scoreColor = (n: number) =>
    n >= 85 ? '#22c55e' : n >= 70 ? '#f59e0b' : '#ef4444';

  const handleShare = () => {
    const text = `My ${sign} horoscope today: "${reading.overall.slice(0, 120)}..." — Powered by AstroSoul ✨`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto pb-16 relative z-10">
      <style>{`
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 15px rgba(123,97,255,0.3)} 50%{box-shadow:0 0 30px rgba(123,97,255,0.6)} }
        @keyframes score-fill { from{width:0} to{width:var(--target)} }
        .score-bar { animation: score-fill 1.2s ease forwards; }
        .section-btn { transition: all .2s; }
      `}</style>

      {/* ── 1. DATE + SIGN BANNER */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(45,27,105,0.9), rgba(10,1,24,0.95))',
        border: '1px solid rgba(123,97,255,0.3)',
        animation: 'glow-pulse 4s ease infinite',
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{
          background: 'radial-gradient(circle, #7B61FF, transparent)',
          borderRadius: '50%', transform: 'translate(30%, -30%)',
        }} />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">{today}</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>Daily Reading</h1>
            <p className="text-purple-300 mt-1">for <span className="text-white font-semibold">{sign}</span> ·{' '}
              <span className="text-yellow-400 text-sm">{reading.planet}</span></p>
          </div>
          <div className="text-right">
            <div className="text-5xl" style={{ filter: 'drop-shadow(0 0 15px rgba(123,97,255,0.8))' }}>
              {sign === 'Aries' ? '♈' : sign === 'Taurus' ? '♉' : sign === 'Gemini' ? '♊' : sign === 'Cancer' ? '♋' :
               sign === 'Leo' ? '♌' : sign === 'Virgo' ? '♍' : sign === 'Libra' ? '♎' : sign === 'Scorpio' ? '♏' :
               sign === 'Sagittarius' ? '♐' : sign === 'Capricorn' ? '♑' : sign === 'Aquarius' ? '♒' : '♓'}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl relative z-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-sm text-purple-200 italic">⚡ {reading.planetEffect}</p>
        </div>
      </div>

      {/* ── 2. ENERGY SCORES (5 categories) */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
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

      {/* ── 3. SECTION READER (Overall, Love, Career, Health, Spiritual) */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
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

      {/* ── 4. LUCKY ELEMENTS REVEAL */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">🍀 Lucky Elements</h2>
          <button onClick={() => setShowLucky(!showLucky)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: showLucky ? 'rgba(123,97,255,0.3)' : 'rgba(255,255,255,0.08)', color: '#a78bfa', border: '1px solid rgba(123,97,255,0.3)' }}>
            {showLucky ? 'Hide' : 'Reveal ✨'}
          </button>
        </div>
        {showLucky && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🔢', label: 'Lucky Number', value: reading.lucky.number.toString() },
              { icon: '🎨', label: 'Power Color', value: reading.lucky.color },
              { icon: '⏰', label: 'Power Hour', value: reading.lucky.time },
              { icon: '🧭', label: 'Direction', value: reading.lucky.direction },
              { icon: '💎', label: 'Crystal Ally', value: reading.lucky.crystal },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-xs text-white/40">{item.label}</div>
                  <div className="text-sm font-semibold text-purple-200">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. COSMIC WARNING + TIP */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl p-5" style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px',
        }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <h3 className="text-sm font-semibold text-red-300">Cosmic Caution</h3>
          </div>
          <p className="text-sm text-white/70">{reading.warning}</p>
        </div>
        <div className="rounded-2xl p-5" style={{
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px',
        }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <h3 className="text-sm font-semibold text-green-300">Today's Cosmic Tip</h3>
          </div>
          <p className="text-sm text-white/70">{reading.tip}</p>
        </div>
      </div>

      {/* ── 6. MOOD TRACKER */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold text-white mb-2">🌡️ How Are You Feeling?</h2>
        <p className="text-xs text-white/40 mb-4">Track your cosmic mood today</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(mood => (
            <button key={mood} onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
              className="px-3 py-2 rounded-xl text-sm transition-all" style={{
                background: selectedMood === mood ? 'rgba(123,97,255,0.4)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedMood === mood ? 'rgba(123,97,255,0.7)' : 'rgba(255,255,255,0.1)'}`,
                color: selectedMood === mood ? '#e0d7ff' : 'rgba(255,255,255,0.6)',
                transform: selectedMood === mood ? 'scale(1.05)' : 'scale(1)',
              }}>
              {mood}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="mt-4 text-sm text-purple-300 italic">
            ✨ Your {selectedMood.split(' ')[1]} energy is noted in the stars. The universe honors all of your feelings today.
          </p>
        )}
      </div>

      {/* ── 7. SHARE YOUR READING */}
      <div className="rounded-2xl p-6 text-center" style={{
        background: 'linear-gradient(135deg, rgba(45,27,105,0.5), rgba(10,1,24,0.8))',
        border: '1px solid rgba(123,97,255,0.25)', borderRadius: '16px',
      }}>
        <div className="text-3xl mb-2">✦</div>
        <h2 className="text-white font-semibold mb-1">Share Your Cosmic Reading</h2>
        <p className="text-white/50 text-sm mb-4">Let the universe speak through you to others</p>
        <button onClick={handleShare}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{
            background: copiedShare ? 'rgba(34,197,94,0.3)' : 'linear-gradient(135deg, #5B2D8E, #2D1B69)',
            border: `1px solid ${copiedShare ? 'rgba(34,197,94,0.5)' : 'rgba(123,97,255,0.4)'}`,
            color: 'white',
          }}>
          {copiedShare ? '✓ Copied to Clipboard!' : '📋 Copy Reading'}
        </button>
      </div>
    </div>
  );
}