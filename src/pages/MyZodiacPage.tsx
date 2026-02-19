import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getZodiacSign } from '../utils/zodiac';

const ZODIAC_DATA: Record<string, {
  symbol: string; element: string; quality: string; ruler: string;
  dates: string; color: string; stone: string; day: string;
  numbers: number[]; colors: string[];
  traits: string[]; strengths: string[]; weaknesses: string[];
  description: string; love: string; career: string; health: string;
  famous: { name: string; role: string }[];
  compatibility: { sign: string; level: number; emoji: string }[];
  affirmation: string; mantra: string;
}> = {
  Aries: {
    symbol: '♈', element: 'Fire', quality: 'Cardinal', ruler: 'Mars',
    dates: 'Mar 21 – Apr 19', color: '#FF4136', stone: 'Diamond',
    day: 'Tuesday', numbers: [1, 8, 17], colors: ['Red', 'Scarlet', 'Carmine'],
    traits: ['Courageous', 'Energetic', 'Passionate', 'Determined', 'Impulsive'],
    strengths: ['Natural leader', 'Fearless', 'Enthusiastic', 'Honest', 'Optimistic'],
    weaknesses: ['Impatient', 'Short-tempered', 'Aggressive', 'Impulsive', 'Competitive'],
    description: 'Aries is the first sign of the zodiac, and that\'s exactly how those born under this sign see themselves — first. Ruled by Mars, they are full of raw energy, passion, and an unstoppable desire to conquer.',
    love: 'In love, Aries is passionate and direct. They fall fast and hard, and expect the same intensity in return. They love the chase but need a partner who can keep up.',
    career: 'Aries thrives in leadership roles. Entrepreneurship, sports, the military, or any field that rewards boldness and initiative suits them perfectly.',
    health: 'The head, face, and adrenal glands are ruled by Aries. Regular high-intensity exercise is essential. Watch for headaches, fever, and burnout.',
    famous: [{ name: 'Lady Gaga', role: 'Artist' }, { name: 'Elton John', role: 'Musician' }, { name: 'Robert Downey Jr.', role: 'Actor' }],
    compatibility: [
      { sign: 'Leo', level: 95, emoji: '♌' }, { sign: 'Sagittarius', level: 90, emoji: '♐' },
      { sign: 'Gemini', level: 80, emoji: '♊' }, { sign: 'Aquarius', level: 75, emoji: '♒' },
      { sign: 'Cancer', level: 40, emoji: '♋' }, { sign: 'Capricorn', level: 35, emoji: '♑' },
    ],
    affirmation: 'I move forward with courage and ignite the world with my passion.',
    mantra: 'I am. I lead. I conquer.',
  },
  Taurus: {
    symbol: '♉', element: 'Earth', quality: 'Fixed', ruler: 'Venus',
    dates: 'Apr 20 – May 20', color: '#2ECC40', stone: 'Emerald',
    day: 'Friday', numbers: [2, 6, 9], colors: ['Green', 'Pink', 'White'],
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Stubborn'],
    strengths: ['Dependable', 'Persistent', 'Loyal', 'Sensual', 'Grounded'],
    weaknesses: ['Stubborn', 'Possessive', 'Materialistic', 'Resistant to change', 'Indulgent'],
    description: 'Taurus is the anchor of the zodiac. Ruled by Venus, they appreciate beauty, comfort, and the finer things in life. Their patience and determination are legendary.',
    love: 'Taurus loves deeply and loyally. They take time to open up but once committed, they are unwaveringly devoted partners who express love through touch and acts of service.',
    career: 'Finance, real estate, art, and food industries suit Taurus perfectly. They excel in stable environments where their patience and attention to detail are rewarded.',
    health: 'The neck and throat are Taurus\'s sensitive areas. Regular relaxation rituals, good food, and time in nature are essential for their wellbeing.',
    famous: [{ name: 'Adele', role: 'Singer' }, { name: 'Dwayne Johnson', role: 'Actor' }, { name: 'David Beckham', role: 'Athlete' }],
    compatibility: [
      { sign: 'Virgo', level: 95, emoji: '♍' }, { sign: 'Capricorn', level: 92, emoji: '♑' },
      { sign: 'Cancer', level: 85, emoji: '♋' }, { sign: 'Pisces', level: 80, emoji: '♓' },
      { sign: 'Leo', level: 45, emoji: '♌' }, { sign: 'Aquarius', level: 35, emoji: '♒' },
    ],
    affirmation: 'I am grounded, secure, and worthy of all the beauty the universe offers.',
    mantra: 'I have. I build. I endure.',
  },
  Gemini: {
    symbol: '♊', element: 'Air', quality: 'Mutable', ruler: 'Mercury',
    dates: 'May 21 – Jun 20', color: '#FFDC00', stone: 'Agate',
    day: 'Wednesday', numbers: [3, 8, 12], colors: ['Yellow', 'Green', 'Peach'],
    traits: ['Witty', 'Curious', 'Adaptable', 'Communicative', 'Indecisive'],
    strengths: ['Versatile', 'Eloquent', 'Quick learner', 'Charming', 'Open-minded'],
    weaknesses: ['Inconsistent', 'Anxious', 'Indecisive', 'Superficial', 'Easily bored'],
    description: 'Gemini is the social butterfly of the zodiac. Ruled by Mercury, they have quick, agile minds and are gifted communicators with an insatiable curiosity about the world.',
    love: 'Gemini needs mental stimulation in love. They are fun, flirty, and spontaneous. A partner who can match their wit and keep them guessing will hold their heart.',
    career: 'Writing, media, sales, and teaching are ideal for Gemini. They excel in fast-paced environments where they can use their communication skills.',
    health: 'The lungs, arms, and nervous system are Gemini\'s focus. Breathwork, meditation, and avoiding information overload are essential for their mental health.',
    famous: [{ name: 'Angelina Jolie', role: 'Actress' }, { name: 'Kanye West', role: 'Musician' }, { name: 'Marilyn Monroe', role: 'Icon' }],
    compatibility: [
      { sign: 'Libra', level: 92, emoji: '♎' }, { sign: 'Aquarius', level: 90, emoji: '♒' },
      { sign: 'Aries', level: 80, emoji: '♈' }, { sign: 'Leo', level: 78, emoji: '♌' },
      { sign: 'Virgo', level: 45, emoji: '♍' }, { sign: 'Pisces', level: 40, emoji: '♓' },
    ],
    affirmation: 'My mind is a universe of infinite possibilities and I embrace every facet of myself.',
    mantra: 'I think. I connect. I evolve.',
  },
  Cancer: {
    symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon',
    dates: 'Jun 21 – Jul 22', color: '#7FDBFF', stone: 'Ruby',
    day: 'Monday', numbers: [2, 3, 15], colors: ['White', 'Silver', 'Sea green'],
    traits: ['Intuitive', 'Caring', 'Protective', 'Emotional', 'Moody'],
    strengths: ['Empathetic', 'Loyal', 'Imaginative', 'Perseverant', 'Nurturing'],
    weaknesses: ['Moody', 'Clingy', 'Suspicious', 'Manipulative', 'Insecure'],
    description: 'Cancer is the nurturer of the zodiac. Ruled by the Moon, they are deeply emotional, intuitive, and connected to home and family. Their empathy is their superpower.',
    love: 'Cancer loves with fierce devotion. They create warm, safe homes for their partners. They need emotional security and will reciprocate with unwavering loyalty.',
    career: 'Nursing, teaching, real estate, food, and creative arts suit Cancer. They shine in roles where they can care for others or work from home.',
    health: 'The stomach and breasts are Cancer\'s sensitive areas. Emotional health directly impacts physical wellbeing — therapy, journaling, and creative expression are vital.',
    famous: [{ name: 'Meryl Streep', role: 'Actress' }, { name: 'Tom Hanks', role: 'Actor' }, { name: 'Ariana Grande', role: 'Singer' }],
    compatibility: [
      { sign: 'Scorpio', level: 95, emoji: '♏' }, { sign: 'Pisces', level: 92, emoji: '♓' },
      { sign: 'Taurus', level: 85, emoji: '♉' }, { sign: 'Virgo', level: 80, emoji: '♍' },
      { sign: 'Aries', level: 40, emoji: '♈' }, { sign: 'Libra', level: 38, emoji: '♎' },
    ],
    affirmation: 'I honor my feelings and create a sanctuary of love wherever I go.',
    mantra: 'I feel. I protect. I nurture.',
  },
  Leo: {
    symbol: '♌', element: 'Fire', quality: 'Fixed', ruler: 'Sun',
    dates: 'Jul 23 – Aug 22', color: '#FF851B', stone: 'Peridot',
    day: 'Sunday', numbers: [1, 3, 10], colors: ['Gold', 'Orange', 'Red'],
    traits: ['Charismatic', 'Creative', 'Generous', 'Dramatic', 'Proud'],
    strengths: ['Confident', 'Ambitious', 'Loyal', 'Encouraging', 'Natural performer'],
    weaknesses: ['Arrogant', 'Stubborn', 'Self-centered', 'Attention-seeking', 'Domineering'],
    description: 'Leo is the royalty of the zodiac. Ruled by the Sun, they radiate warmth, confidence, and magnetism. Born to lead, Leos light up every room they enter.',
    love: 'Leo loves grandly and passionately. They need admiration and appreciation. In return, they are fiercely loyal and will make their partner feel like the most special person alive.',
    career: 'Performance arts, management, politics, and entrepreneurship are perfect for Leo. They thrive with an audience and in leadership positions.',
    health: 'The heart and spine are Leo\'s domain. Maintaining a healthy ego and managing stress around recognition is key. Yoga and dance keep them vibrant.',
    famous: [{ name: 'Barack Obama', role: 'President' }, { name: 'Coco Chanel', role: 'Designer' }, { name: 'Jennifer Lopez', role: 'Artist' }],
    compatibility: [
      { sign: 'Aries', level: 95, emoji: '♈' }, { sign: 'Sagittarius', level: 90, emoji: '♐' },
      { sign: 'Gemini', level: 82, emoji: '♊' }, { sign: 'Libra', level: 80, emoji: '♎' },
      { sign: 'Scorpio', level: 42, emoji: '♏' }, { sign: 'Taurus', level: 38, emoji: '♉' },
    ],
    affirmation: 'I shine my light boldly, inspiring everyone around me to do the same.',
    mantra: 'I will. I create. I inspire.',
  },
  Virgo: {
    symbol: '♍', element: 'Earth', quality: 'Mutable', ruler: 'Mercury',
    dates: 'Aug 23 – Sep 22', color: '#01FF70', stone: 'Sapphire',
    day: 'Wednesday', numbers: [5, 14, 15], colors: ['Grey', 'Beige', 'Pale yellow'],
    traits: ['Analytical', 'Meticulous', 'Reliable', 'Modest', 'Perfectionist'],
    strengths: ['Hardworking', 'Practical', 'Loyal', 'Kind', 'Detail-oriented'],
    weaknesses: ['Critical', 'Overly cautious', 'Anxious', 'Inflexible', 'Self-critical'],
    description: 'Virgo is the perfectionist of the zodiac. Ruled by Mercury, they have sharp analytical minds and a deep need for order. Their dedication and precision are unmatched.',
    love: 'Virgo shows love through acts of service. They pay attention to every detail about their partner. They need time to open up emotionally but are deeply devoted once committed.',
    career: 'Healthcare, editing, data analysis, accounting, and research are ideal for Virgo. They thrive where precision and systematic thinking are valued.',
    health: 'The digestive system is Virgo\'s sensitive area. A clean diet, routine, and managing anxiety through mindfulness are essential for their wellbeing.',
    famous: [{ name: 'Beyoncé', role: 'Artist' }, { name: 'Keanu Reeves', role: 'Actor' }, { name: 'Mother Teresa', role: 'Humanitarian' }],
    compatibility: [
      { sign: 'Taurus', level: 95, emoji: '♉' }, { sign: 'Capricorn', level: 93, emoji: '♑' },
      { sign: 'Cancer', level: 85, emoji: '♋' }, { sign: 'Scorpio', level: 82, emoji: '♏' },
      { sign: 'Gemini', level: 45, emoji: '♊' }, { sign: 'Sagittarius', level: 38, emoji: '♐' },
    ],
    affirmation: 'I trust my process and embrace the beauty in imperfection.',
    mantra: 'I analyze. I serve. I perfect.',
  },
  Libra: {
    symbol: '♎', element: 'Air', quality: 'Cardinal', ruler: 'Venus',
    dates: 'Sep 23 – Oct 22', color: '#F012BE', stone: 'Opal',
    day: 'Friday', numbers: [4, 6, 13], colors: ['Pink', 'Blue', 'Lavender'],
    traits: ['Diplomatic', 'Gracious', 'Fair-minded', 'Social', 'Indecisive'],
    strengths: ['Charming', 'Just', 'Cooperative', 'Idealistic', 'Peacemaker'],
    weaknesses: ['Indecisive', 'Avoids confrontation', 'Self-pitying', 'Easily influenced', 'Vain'],
    description: 'Libra is the diplomat of the zodiac. Ruled by Venus, they seek harmony, balance, and beauty in all things. Their greatest gift is seeing every side of every situation.',
    love: 'Libra is the ultimate romantic partner — thoughtful, attentive, and devoted to creating a beautiful relationship. They need partnership and flourish with someone who values fairness.',
    career: 'Law, diplomacy, design, fashion, and public relations suit Libra perfectly. They excel in roles that require mediation and aesthetic sensibility.',
    health: 'The kidneys and lower back are Libra\'s sensitive areas. Avoiding excess and maintaining inner balance through yoga and art is key for their health.',
    famous: [{ name: 'Kim Kardashian', role: 'Media personality' }, { name: 'Will Smith', role: 'Actor' }, { name: 'Gandhi', role: 'Leader' }],
    compatibility: [
      { sign: 'Gemini', level: 92, emoji: '♊' }, { sign: 'Aquarius', level: 88, emoji: '♒' },
      { sign: 'Leo', level: 82, emoji: '♌' }, { sign: 'Sagittarius', level: 78, emoji: '♐' },
      { sign: 'Cancer', level: 38, emoji: '♋' }, { sign: 'Capricorn', level: 35, emoji: '♑' },
    ],
    affirmation: 'I create harmony wherever I go, and beauty flows through everything I touch.',
    mantra: 'I balance. I connect. I beautify.',
  },
  Scorpio: {
    symbol: '♏', element: 'Water', quality: 'Fixed', ruler: 'Pluto & Mars',
    dates: 'Oct 23 – Nov 21', color: '#85144b', stone: 'Topaz',
    day: 'Tuesday', numbers: [8, 11, 18], colors: ['Black', 'Crimson', 'Burgundy'],
    traits: ['Intense', 'Passionate', 'Determined', 'Magnetic', 'Secretive'],
    strengths: ['Perceptive', 'Brave', 'Loyal', 'Resourceful', 'Transformative'],
    weaknesses: ['Jealous', 'Controlling', 'Resentful', 'Manipulative', 'Obsessive'],
    description: 'Scorpio is the most intense sign of the zodiac. Ruled by Pluto and Mars, they possess profound depth, magnetic power, and an unwavering will. They see through every facade.',
    love: 'Scorpio loves with volcanic intensity. They are all-or-nothing in love — either completely devoted or completely detached. Trust must be earned; once given, it is absolute.',
    career: 'Psychology, investigation, research, surgery, and finance suit Scorpio perfectly. They excel where depth, secrecy, and transformation are involved.',
    health: 'The reproductive organs and excretory system are Scorpio\'s sensitive areas. Managing obsessive tendencies and practicing emotional release through therapy is vital.',
    famous: [{ name: 'Leonardo DiCaprio', role: 'Actor' }, { name: 'Katy Perry', role: 'Singer' }, { name: 'Pablo Picasso', role: 'Artist' }],
    compatibility: [
      { sign: 'Cancer', level: 95, emoji: '♋' }, { sign: 'Pisces', level: 92, emoji: '♓' },
      { sign: 'Virgo', level: 84, emoji: '♍' }, { sign: 'Capricorn', level: 80, emoji: '♑' },
      { sign: 'Leo', level: 40, emoji: '♌' }, { sign: 'Aquarius', level: 35, emoji: '♒' },
    ],
    affirmation: 'I embrace transformation and rise from every challenge more powerful than before.',
    mantra: 'I desire. I transform. I resurrect.',
  },
  Sagittarius: {
    symbol: '♐', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter',
    dates: 'Nov 22 – Dec 21', color: '#3D9970', stone: 'Turquoise',
    day: 'Thursday', numbers: [3, 7, 9], colors: ['Blue', 'Purple', 'Red'],
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Independent', 'Tactless'],
    strengths: ['Generous', 'Idealistic', 'Funny', 'Enthusiastic', 'Truth-seeker'],
    weaknesses: ['Restless', 'Irresponsible', 'Impatient', 'Overconfident', 'Commitment-averse'],
    description: 'Sagittarius is the explorer of the zodiac. Ruled by Jupiter, they are eternal seekers of truth, wisdom, and adventure. Their optimism and humor are infectious.',
    love: 'Sagittarius needs freedom and adventure in love. They are passionate and honest partners who need a fellow adventurer — someone who grows with them, not holds them back.',
    career: 'Travel, philosophy, teaching, publishing, and entrepreneurship suit Sagittarius. They need roles with variety, freedom, and the ability to expand horizons.',
    health: 'The hips, thighs, and liver are Sagittarius\'s sensitive areas. Outdoor activities, travel, and avoiding excess alcohol are essential for their vitality.',
    famous: [{ name: 'Taylor Swift', role: 'Singer' }, { name: 'Brad Pitt', role: 'Actor' }, { name: 'Walt Disney', role: 'Creator' }],
    compatibility: [
      { sign: 'Aries', level: 92, emoji: '♈' }, { sign: 'Leo', level: 90, emoji: '♌' },
      { sign: 'Libra', level: 80, emoji: '♎' }, { sign: 'Aquarius', level: 78, emoji: '♒' },
      { sign: 'Virgo', level: 38, emoji: '♍' }, { sign: 'Pisces', level: 35, emoji: '♓' },
    ],
    affirmation: 'I am free to roam the universe and find truth in every horizon I chase.',
    mantra: 'I seek. I expand. I discover.',
  },
  Capricorn: {
    symbol: '♑', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn',
    dates: 'Dec 22 – Jan 19', color: '#111111', stone: 'Garnet',
    day: 'Saturday', numbers: [4, 8, 13], colors: ['Brown', 'Black', 'Dark green'],
    traits: ['Disciplined', 'Ambitious', 'Patient', 'Cautious', 'Reserved'],
    strengths: ['Responsible', 'Self-controlled', 'Practical', 'Persistent', 'Masterful'],
    weaknesses: ['Cold', 'Pessimistic', 'Condescending', 'Rigid', 'Workaholic'],
    description: 'Capricorn is the achiever of the zodiac. Ruled by Saturn, they are masters of discipline, ambition, and long-term thinking. They build empires, one determined step at a time.',
    love: 'Capricorn is a serious, committed partner. They take love as seriously as their career. They show affection through stability and providing, and need a partner who respects their ambitions.',
    career: 'Finance, government, architecture, management, and law suit Capricorn perfectly. They excel in structured environments where hard work leads to prestigious results.',
    health: 'The bones, knees, and joints are Capricorn\'s sensitive areas. Avoiding overwork and incorporating rest and play into their routine is essential for longevity.',
    famous: [{ name: 'Michelle Obama', role: 'Former First Lady' }, { name: 'Denzel Washington', role: 'Actor' }, { name: 'Dolly Parton', role: 'Musician' }],
    compatibility: [
      { sign: 'Taurus', level: 92, emoji: '♉' }, { sign: 'Virgo', level: 90, emoji: '♍' },
      { sign: 'Scorpio', level: 82, emoji: '♏' }, { sign: 'Pisces', level: 78, emoji: '♓' },
      { sign: 'Aries', level: 35, emoji: '♈' }, { sign: 'Libra', level: 32, emoji: '♎' },
    ],
    affirmation: 'I am capable of achieving everything I set my disciplined mind to accomplish.',
    mantra: 'I achieve. I build. I master.',
  },
  Aquarius: {
    symbol: '♒', element: 'Air', quality: 'Fixed', ruler: 'Uranus & Saturn',
    dates: 'Jan 20 – Feb 18', color: '#00B4D8', stone: 'Amethyst',
    day: 'Saturday', numbers: [4, 7, 11], colors: ['Blue', 'Silver', 'Turquoise'],
    traits: ['Innovative', 'Independent', 'Humanitarian', 'Eccentric', 'Aloof'],
    strengths: ['Original', 'Progressive', 'Visionary', 'Loyal to ideals', 'Intellectual'],
    weaknesses: ['Detached', 'Stubborn', 'Unpredictable', 'Rebellious', 'Cold'],
    description: 'Aquarius is the visionary of the zodiac. Ruled by Uranus, they are ahead of their time — original thinkers who dream of a better world and march to the beat of their own drum.',
    love: 'Aquarius needs a best friend as a partner. They are loyal but struggle with emotional intimacy. Intellectual connection, shared ideals, and freedom are non-negotiables.',
    career: 'Technology, science, humanitarian work, aviation, and astrology suit Aquarius. They excel in fields where innovation and independent thinking are valued.',
    health: 'The ankles, shins, and circulatory system are Aquarius\'s sensitive areas. Group sports, social activities, and avoiding emotional isolation support their wellbeing.',
    famous: [{ name: 'Oprah Winfrey', role: 'Media mogul' }, { name: 'Harry Styles', role: 'Musician' }, { name: 'Ellen DeGeneres', role: 'Comedian' }],
    compatibility: [
      { sign: 'Gemini', level: 90, emoji: '♊' }, { sign: 'Libra', level: 88, emoji: '♎' },
      { sign: 'Sagittarius', level: 80, emoji: '♐' }, { sign: 'Aries', level: 75, emoji: '♈' },
      { sign: 'Scorpio', level: 35, emoji: '♏' }, { sign: 'Taurus', level: 32, emoji: '♉' },
    ],
    affirmation: 'I am a revolutionary force of light, changing the world through my unique vision.',
    mantra: 'I know. I innovate. I liberate.',
  },
  Pisces: {
    symbol: '♓', element: 'Water', quality: 'Mutable', ruler: 'Neptune & Jupiter',
    dates: 'Feb 19 – Mar 20', color: '#74C0FC', stone: 'Aquamarine',
    day: 'Thursday', numbers: [3, 9, 12], colors: ['Sea green', 'Lavender', 'White'],
    traits: ['Empathetic', 'Intuitive', 'Artistic', 'Gentle', 'Dreamy'],
    strengths: ['Compassionate', 'Selfless', 'Wise', 'Romantic', 'Mystical'],
    weaknesses: ['Escapist', 'Naive', 'Overly trusting', 'Sad', 'Boundary-less'],
    description: 'Pisces is the mystic of the zodiac. Ruled by Neptune, they exist between worlds — deeply intuitive, endlessly compassionate, and connected to the spiritual realm.',
    love: 'Pisces is the ultimate romantic — dreamy, devoted, and deeply loving. They give their whole heart. They need a grounded partner who appreciates their sensitivity and doesn\'t exploit it.',
    career: 'Arts, music, healing, spiritual work, film, and medicine suit Pisces. They thrive where they can use their empathy, intuition, and creative gifts.',
    health: 'The feet and lymphatic system are Pisces\'s sensitive areas. Grounding practices, limiting alcohol, adequate sleep, and spiritual routines are vital for their wellbeing.',
    famous: [{ name: 'Rihanna', role: 'Artist' }, { name: 'Albert Einstein', role: 'Scientist' }, { name: 'Steve Jobs', role: 'Visionary' }],
    compatibility: [
      { sign: 'Scorpio', level: 95, emoji: '♏' }, { sign: 'Cancer', level: 92, emoji: '♋' },
      { sign: 'Taurus', level: 82, emoji: '♉' }, { sign: 'Capricorn', level: 78, emoji: '♑' },
      { sign: 'Gemini', level: 40, emoji: '♊' }, { sign: 'Sagittarius', level: 35, emoji: '♐' },
    ],
    affirmation: 'I trust my intuition and surrender to the magic flow of the universe.',
    mantra: 'I believe. I dream. I transcend.',
  },
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B35', Earth: '#8B7355', Air: '#87CEEB', Water: '#4169E1',
};

export default function MyZodiacPage() {
  const { profile } = useAuth();
  
  const calculatedSign = profile?.date_of_birth ? getZodiacSign(profile.date_of_birth) : null;
  const userSign = calculatedSign || profile?.zodiac_sign || 'Aries';
  
  const sign = ZODIAC_DATA[userSign] ? userSign : 'Aries';
  const data = ZODIAC_DATA[sign];
  
  const [activeTab, setActiveTab] = useState<'overview' | 'love' | 'career' | 'health'>('overview');
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [savedAffirmation, setSavedAffirmation] = useState(false);

  const cardBase = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
  };

  return (
    <div className="p-6 space-y-6 relative z-10 max-w-4xl mx-auto pb-16">
      <style>{`
        @keyframes orbit { from{transform:rotate(0deg) translateX(60px) rotate(0deg)} to{transform:rotate(360deg) translateX(60px) rotate(-360deg)} }
        @keyframes pulse-ring { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.05)} }
        @keyframes shimmer { 0%{opacity:.5} 50%{opacity:1} 100%{opacity:.5} }
        .compat-bar { transition: width 1s ease; }
        .tab-active { background: rgba(123,97,255,0.3); border-color: rgba(123,97,255,0.6) !important; }
      `}</style>

      {/* ── 1. HERO SIGN CARD */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-center" style={{
        background: `radial-gradient(ellipse at top, ${data.color}22, rgba(10,1,24,0.95))`,
        border: `1px solid ${data.color}44`,
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(123,97,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,191,255,0.3) 0%, transparent 50%)',
        }} />
        {/* Orbiting dot */}
        <div className="absolute left-1/2 top-1/2 w-0 h-0" style={{ marginLeft: '-1px', marginTop: '-1px' }}>
          <div className="w-2 h-2 rounded-full" style={{
            background: data.color, boxShadow: `0 0 8px ${data.color}`,
            animation: 'orbit 6s linear infinite',
          }} />
        </div>
        <div className="relative z-10">
          <div className="text-8xl mb-3" style={{ textShadow: `0 0 30px ${data.color}` }}>{data.symbol}</div>
          <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{sign}</h1>
          <p className="text-sm mb-4" style={{ color: data.color }}>{data.dates}</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { label: 'Element', value: data.element, color: ELEMENT_COLORS[data.element] },
              { label: 'Quality', value: data.quality, color: '#a78bfa' },
              { label: 'Ruler', value: data.ruler, color: '#67e8f9' },
              { label: 'Stone', value: data.stone, color: '#86efac' },
            ].map(b => (
              <div key={b.label} className="px-4 py-2 rounded-xl text-sm" style={{
                background: 'rgba(255,255,255,0.07)', border: `1px solid ${b.color}44`,
              }}>
                <span className="text-white/50 text-xs block">{b.label}</span>
                <span className="font-semibold" style={{ color: b.color }}>{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. PERSONALITY TRAITS */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>✨</span> Core Traits
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.traits.map(t => (
            <span key={t} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{
              background: `${data.color}20`, border: `1px solid ${data.color}40`, color: data.color,
            }}>{t}</span>
          ))}
        </div>
        {/* Mini personality radar using bars */}
        <div className="mt-5 space-y-2">
          {[
            { label: 'Emotional Depth', value: data.element === 'Water' ? 90 : data.element === 'Fire' ? 65 : 55 },
            { label: 'Intellectual Drive', value: data.element === 'Air' ? 90 : data.quality === 'Fixed' ? 70 : 60 },
            { label: 'Creative Energy', value: data.element === 'Fire' ? 88 : data.ruler.includes('Venus') ? 85 : 60 },
            { label: 'Social Magnetism', value: data.quality === 'Cardinal' ? 80 : data.element === 'Air' ? 85 : 60 },
            { label: 'Spiritual Depth', value: data.element === 'Water' ? 92 : data.ruler.includes('Neptune') ? 95 : 55 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-white/50 w-36 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full compat-bar" style={{
                  width: `${item.value}%`,
                  background: `linear-gradient(90deg, ${data.color}88, ${data.color})`,
                }} />
              </div>
              <span className="text-xs font-mono" style={{ color: data.color, width: '30px' }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. LUCKY ELEMENTS */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🍀</span> Your Lucky Elements
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-2xl mb-2">🔢</div>
            <div className="text-xs text-white/50 mb-1">Lucky Numbers</div>
            <div className="flex justify-center gap-2">
              {data.numbers.map(n => (
                <span key={n} className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{
                  background: `${data.color}30`, color: data.color, border: `1px solid ${data.color}60`,
                }}>{n}</span>
              ))}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-2xl mb-2">🎨</div>
            <div className="text-xs text-white/50 mb-1">Power Colors</div>
            <div className="flex flex-col gap-1">
              {data.colors.map(c => (
                <span key={c} className="text-xs text-purple-200">{c}</span>
              ))}
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-2xl mb-2">📅</div>
            <div className="text-xs text-white/50 mb-1">Power Day</div>
            <div className="text-white font-semibold mt-2" style={{ color: data.color }}>{data.day}</div>
          </div>
        </div>
      </div>

      {/* ── 4. STRENGTHS & WEAKNESSES TABS */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <div className="flex gap-3 mb-5">
          {(['overview', 'love', 'career', 'health'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${activeTab === t ? 'tab-active text-white' : 'text-white/50 border-transparent hover:text-white/80'}`}
              style={{ border: '1px solid transparent' }}>
              {t === 'overview' ? '🌟 Overview' : t === 'love' ? '❤️ Love' : t === 'career' ? '💼 Career' : '🌿 Health'}
            </button>
          ))}
        </div>
        <p className="text-white/75 text-sm leading-relaxed">
          {activeTab === 'overview' ? data.description : activeTab === 'love' ? data.love : activeTab === 'career' ? data.career : data.health}
        </p>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <div className="text-xs text-green-400 uppercase tracking-wider mb-2">✅ Strengths</div>
              {data.strengths.map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-white/75 py-1">
                  <span className="text-green-400 text-xs">▸</span>{s}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-red-400 uppercase tracking-wider mb-2">⚠️ Challenges</div>
              {data.weaknesses.map(w => (
                <div key={w} className="flex items-center gap-2 text-sm text-white/75 py-1">
                  <span className="text-red-400 text-xs">▸</span>{w}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. COMPATIBILITY */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>💞</span> Compatibility
          </h2>
          <button onClick={() => setShowCompatibility(!showCompatibility)}
            className="text-xs px-3 py-1 rounded-lg" style={{
              background: 'rgba(123,97,255,0.2)', color: '#a78bfa',
              border: '1px solid rgba(123,97,255,0.3)',
            }}>
            {showCompatibility ? 'Hide' : 'See All'}
          </button>
        </div>
        <div className="space-y-3">
          {(showCompatibility ? data.compatibility : data.compatibility.slice(0, 3)).map(c => (
            <div key={c.sign} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center">{c.emoji}</span>
              <span className="text-sm text-white/80 w-24">{c.sign}</span>
              <div className="flex-1 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full compat-bar" style={{
                  width: `${c.level}%`,
                  background: c.level >= 80 ? 'linear-gradient(90deg, #22c55e, #86efac)' :
                    c.level >= 60 ? 'linear-gradient(90deg, #f59e0b, #fcd34d)' :
                    'linear-gradient(90deg, #ef4444, #fca5a5)',
                }} />
              </div>
              <span className="text-xs font-mono text-white/60 w-10 text-right">{c.level}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. FAMOUS PEOPLE */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>⭐</span> Famous {sign}s
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {data.famous.map(f => (
            <div key={f.name} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold" style={{
                background: `${data.color}30`, border: `1px solid ${data.color}60`, color: data.color,
              }}>{f.name[0]}</div>
              <div className="text-sm text-white font-medium">{f.name}</div>
              <div className="text-xs text-white/40">{f.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. DAILY AFFIRMATION */}
      <div className="rounded-2xl p-6 text-center" style={{
        background: `radial-gradient(ellipse, ${data.color}15, rgba(10,1,24,0.8))`,
        border: `1px solid ${data.color}30`,
      }}>
        <div className="text-3xl mb-3" style={{ animation: 'shimmer 3s ease infinite' }}>✦</div>
        <h2 className="text-sm uppercase tracking-widest text-white/50 mb-3">Today's Affirmation</h2>
        <p className="text-white text-lg leading-relaxed mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          "{data.affirmation}"
        </p>
        <p className="text-sm italic mb-4" style={{ color: data.color }}>{data.mantra}</p>
        <button onClick={() => setSavedAffirmation(!savedAffirmation)}
          className="px-5 py-2 rounded-xl text-sm font-medium transition-all" style={{
            background: savedAffirmation ? `${data.color}40` : 'rgba(255,255,255,0.08)',
            border: `1px solid ${savedAffirmation ? data.color : 'rgba(255,255,255,0.15)'}`,
            color: savedAffirmation ? data.color : 'rgba(255,255,255,0.7)',
          }}>
          {savedAffirmation ? '✓ Affirmation Saved' : '+ Save to Journal'}
        </button>
      </div>
    </div>
  );
}