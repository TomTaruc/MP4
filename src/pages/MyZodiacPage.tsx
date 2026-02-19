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
    famous: [{ name: 'Marilyn Monroe', role: 'Actress' }, { name: 'Kanye West', role: 'Artist' }, { name: 'Angelina Jolie', role: 'Actress' }],
    compatibility: [
      { sign: 'Libra', level: 95, emoji: '♎' }, { sign: 'Aquarius', level: 90, emoji: '♒' },
      { sign: 'Aries', level: 82, emoji: '♈' }, { sign: 'Leo', level: 78, emoji: '♌' },
      { sign: 'Pisces', level: 38, emoji: '♓' }, { sign: 'Virgo', level: 35, emoji: '♍' },
    ],
    affirmation: 'I embrace all parts of myself and communicate my truth with clarity and grace.',
    mantra: 'I think. I connect. I adapt.',
  },
  Cancer: {
    symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon',
    dates: 'Jun 21 – Jul 22', color: '#00BFFF', stone: 'Pearl',
    day: 'Monday', numbers: [2, 3, 15], colors: ['White', 'Silver', 'Sea green'],
    traits: ['Intuitive', 'Emotional', 'Nurturing', 'Protective', 'Moody'],
    strengths: ['Compassionate', 'Loyal', 'Intuitive', 'Imaginative', 'Persuasive'],
    weaknesses: ['Moody', 'Pessimistic', 'Suspicious', 'Manipulative', 'Insecure'],
    description: 'Cancer is the nurturer of the zodiac. Ruled by the Moon, they are deeply intuitive and sentimental, valuing home, family, and emotional security above all else.',
    love: 'Cancer loves with their whole heart. They are incredibly devoted and nurturing partners who create a warm, loving home. They need emotional security and deep loyalty in return.',
    career: 'Healthcare, education, real estate, and hospitality suit Cancer. They thrive in roles where they can care for others and build lasting emotional connections.',
    health: 'The chest, breasts, and stomach are Cancer\'s sensitive areas. Emotional wellbeing directly affects their physical health — journaling and therapy are highly beneficial.',
    famous: [{ name: 'Princess Diana', role: 'Royalty' }, { name: 'Ariana Grande', role: 'Singer' }, { name: 'Elon Musk', role: 'Entrepreneur' }],
    compatibility: [
      { sign: 'Scorpio', level: 97, emoji: '♏' }, { sign: 'Pisces', level: 92, emoji: '♓' },
      { sign: 'Taurus', level: 84, emoji: '♉' }, { sign: 'Virgo', level: 79, emoji: '♍' },
      { sign: 'Aries', level: 38, emoji: '♈' }, { sign: 'Libra', level: 33, emoji: '♎' },
    ],
    affirmation: 'I honor my emotions as my greatest strength and create safe spaces for love to grow.',
    mantra: 'I feel. I nurture. I protect.',
  },
  Leo: {
    symbol: '♌', element: 'Fire', quality: 'Fixed', ruler: 'Sun',
    dates: 'Jul 23 – Aug 22', color: '#FF851B', stone: 'Ruby',
    day: 'Sunday', numbers: [1, 3, 10], colors: ['Gold', 'Orange', 'Purple'],
    traits: ['Generous', 'Warm-hearted', 'Cheerful', 'Humorous', 'Arrogant'],
    strengths: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
    weaknesses: ['Arrogant', 'Stubborn', 'Self-centered', 'Lazy', 'Inflexible'],
    description: 'Leo is the royalty of the zodiac. Ruled by the Sun, Leos radiate warmth, confidence, and charisma wherever they go. They are natural performers who light up every room.',
    love: 'Leo loves grandly and dramatically. They are generous, loyal partners who shower their loved ones with affection and expect the same devotion in return.',
    career: 'Entertainment, leadership, politics, and entrepreneurship suit Leo. They shine in roles where they can lead, inspire, and receive recognition for their talents.',
    health: 'The heart, spine, and back are Leo\'s sensitive areas. Regular exercise and creative outlets are essential to channel their abundant energy and maintain vitality.',
    famous: [{ name: 'Barack Obama', role: 'Politician' }, { name: 'Madonna', role: 'Artist' }, { name: 'Jennifer Lopez', role: 'Entertainer' }],
    compatibility: [
      { sign: 'Aries', level: 95, emoji: '♈' }, { sign: 'Sagittarius', level: 92, emoji: '♐' },
      { sign: 'Gemini', level: 83, emoji: '♊' }, { sign: 'Libra', level: 79, emoji: '♎' },
      { sign: 'Scorpio', level: 40, emoji: '♏' }, { sign: 'Taurus', level: 36, emoji: '♉' },
    ],
    affirmation: 'I shine my light boldly and generously, inspiring everyone I meet.',
    mantra: 'I will. I create. I shine.',
  },
  Virgo: {
    symbol: '♍', element: 'Earth', quality: 'Mutable', ruler: 'Mercury',
    dates: 'Aug 23 – Sep 22', color: '#01FF70', stone: 'Sapphire',
    day: 'Wednesday', numbers: [5, 14, 23], colors: ['Green', 'White', 'Yellow'],
    traits: ['Analytical', 'Hardworking', 'Practical', 'Diligent', 'Critical'],
    strengths: ['Loyal', 'Analytical', 'Kind', 'Hardworking', 'Practical'],
    weaknesses: ['Shyness', 'Worry', 'Overly critical', 'All work no play', 'Perfectionist'],
    description: 'Virgo is the perfectionist of the zodiac. Ruled by Mercury, they are precise, methodical, and deeply service-oriented — always striving to improve themselves and the world around them.',
    love: 'Virgo expresses love through acts of service and attention to detail. They are devoted partners who show care through practical gestures and genuine interest in their partner\'s wellbeing.',
    career: 'Healthcare, research, writing, data analysis, and accounting suit Virgo. They excel in environments that reward precision, critical thinking, and systematic approaches.',
    health: 'The digestive system and intestines are Virgo\'s sensitive areas. A clean diet, regular routines, and mindfulness practices are essential for their health.',
    famous: [{ name: 'Beyoncé', role: 'Artist' }, { name: 'Keanu Reeves', role: 'Actor' }, { name: 'Mother Teresa', role: 'Humanitarian' }],
    compatibility: [
      { sign: 'Taurus', level: 95, emoji: '♉' }, { sign: 'Capricorn', level: 92, emoji: '♑' },
      { sign: 'Cancer', level: 85, emoji: '♋' }, { sign: 'Scorpio', level: 80, emoji: '♏' },
      { sign: 'Sagittarius', level: 38, emoji: '♐' }, { sign: 'Gemini', level: 34, emoji: '♊' },
    ],
    affirmation: 'I trust my process, embrace imperfection, and find beauty in the details of life.',
    mantra: 'I analyze. I serve. I perfect.',
  },
  Libra: {
    symbol: '♎', element: 'Air', quality: 'Cardinal', ruler: 'Venus',
    dates: 'Sep 23 – Oct 22', color: '#FF69B4', stone: 'Opal',
    day: 'Friday', numbers: [4, 6, 13], colors: ['Pink', 'Blue', 'Green'],
    traits: ['Diplomatic', 'Fair-minded', 'Social', 'Idealistic', 'Indecisive'],
    strengths: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded', 'Social'],
    weaknesses: ['Indecisive', 'Avoids confrontation', 'Self-pitying', 'Grudge-holder', 'People-pleaser'],
    description: 'Libra is the diplomat of the zodiac. Ruled by Venus, they are charming, gracious, and deeply committed to justice and harmony in all areas of life.',
    love: 'Libra is a natural romantic who thrives in partnership. They are attentive, charming partners who create beautiful relationships built on mutual respect and intellectual connection.',
    career: 'Law, diplomacy, design, counseling, and the arts suit Libra. They excel in roles requiring negotiation, aesthetic judgment, and the ability to see all sides.',
    health: 'The kidneys and lower back are Libra\'s sensitive areas. Balance is key — avoiding excess in all things, from diet to work, maintains their health and harmony.',
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
    dates: 'Dec 22 – Jan 19', color: '#AAAAAA', stone: 'Garnet',
    day: 'Saturday', numbers: [4, 8, 13], colors: ['Brown', 'Black', 'Dark green'],
    traits: ['Disciplined', 'Ambitious', 'Patient', 'Cautious', 'Reserved'],
    strengths: ['Responsible', 'Self-controlled', 'Practical', 'Persistent', 'Masterful'],
    weaknesses: ['Cold', 'Pessimistic', 'Condescending', 'Rigid', 'Workaholic'],
    description: 'Capricorn is the achiever of the zodiac. Ruled by Saturn, they are masters of discipline, ambition, and long-term thinking. They build empires, one determined step at a time.',
    love: 'Capricorn is a serious, committed partner. They take love as seriously as their career. They show affection through stability and providing, and need a partner who respects their ambitions.',
    career: 'Finance, government, architecture, management, and law suit Capricorn perfectly. They excel in structured environments where hard work leads to prestigious results.',
    health: 'The bones, knees, and joints are Capricorn\'s sensitive areas. Regular exercise, calcium-rich diet, and work-life balance are essential for their longevity.',
    famous: [{ name: 'Michelle Obama', role: 'Former First Lady' }, { name: 'LeBron James', role: 'Athlete' }, { name: 'Jeff Bezos', role: 'Entrepreneur' }],
    compatibility: [
      { sign: 'Taurus', level: 94, emoji: '♉' }, { sign: 'Virgo', level: 91, emoji: '♍' },
      { sign: 'Scorpio', level: 83, emoji: '♏' }, { sign: 'Pisces', level: 77, emoji: '♓' },
      { sign: 'Aries', level: 37, emoji: '♈' }, { sign: 'Libra', level: 33, emoji: '♎' },
    ],
    affirmation: 'I climb with patience and intention, knowing that every step leads to my destiny.',
    mantra: 'I use. I master. I achieve.',
  },
  Aquarius: {
    symbol: '♒', element: 'Air', quality: 'Fixed', ruler: 'Uranus',
    dates: 'Jan 20 – Feb 18', color: '#7FDBFF', stone: 'Amethyst',
    day: 'Saturday', numbers: [4, 7, 11], colors: ['Blue', 'Silver', 'Turquoise'],
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Inventive'],
    strengths: ['Visionary', 'Intellectual', 'Original', 'Humanitarian', 'Independent'],
    weaknesses: ['Emotionally detached', 'Unpredictable', 'Stubborn', 'Aloof', 'Extremist'],
    description: 'Aquarius is the visionary of the zodiac. Ruled by Uranus, they are progressive, independent thinkers who are deeply committed to humanity and the future. They march to their own cosmic beat.',
    love: 'Aquarius needs intellectual connection above all in love. They are loyal but need space and freedom. A partner who respects their individuality and shares their vision will win their heart.',
    career: 'Technology, science, humanitarian work, activism, and innovation suit Aquarius. They thrive in roles where they can challenge the status quo and create positive change.',
    health: 'The ankles, calves, and circulatory system are Aquarius\'s sensitive areas. Group sports, unique fitness regimens, and staying socially active support their wellbeing.',
    famous: [{ name: 'Oprah Winfrey', role: 'Media mogul' }, { name: 'Ellen DeGeneres', role: 'Entertainer' }, { name: 'Cristiano Ronaldo', role: 'Athlete' }],
    compatibility: [
      { sign: 'Gemini', level: 93, emoji: '♊' }, { sign: 'Libra', level: 89, emoji: '♎' },
      { sign: 'Sagittarius', level: 82, emoji: '♐' }, { sign: 'Aries', level: 76, emoji: '♈' },
      { sign: 'Taurus', level: 37, emoji: '♉' }, { sign: 'Scorpio', level: 33, emoji: '♏' },
    ],
    affirmation: 'I embrace my uniqueness and use my vision to create a better world for all.',
    mantra: 'I know. I innovate. I liberate.',
  },
  Pisces: {
    symbol: '♓', element: 'Water', quality: 'Mutable', ruler: 'Neptune',
    dates: 'Feb 19 – Mar 20', color: '#0074D9', stone: 'Aquamarine',
    day: 'Thursday', numbers: [3, 9, 12], colors: ['Sea green', 'Lavender', 'Purple'],
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
    strengths: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
    weaknesses: ['Fearful', 'Overly trusting', 'Sad', 'Desire to escape reality', 'Victim mentality'],
    description: 'Pisces is the dreamer of the zodiac. Ruled by Neptune, they are deeply compassionate, artistic, and intuitive souls who experience life through an emotional and spiritual lens.',
    love: 'Pisces loves unconditionally and with their entire soul. They are romantic, empathetic partners who will sacrifice greatly for the ones they love. They need deep emotional connection and loyalty.',
    career: 'Arts, music, healing professions, spirituality, and charity work suit Pisces. They thrive when their work has deep meaning and allows them to express their creativity and compassion.',
    health: 'The feet and lymphatic system are Pisces\'s sensitive areas. Swimming, yoga, and creative outlets are healing. They must guard against escapism and be mindful of substance use.',
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

  const sign = (profile?.date_of_birth ? getZodiacSign(profile.date_of_birth) : null)
    || profile?.zodiac_sign
    || 'Aries';
  const data = ZODIAC_DATA[sign] || ZODIAC_DATA['Aries'];

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
        <div className="mt-5 space-y-2">
          {[
            { label: 'Emotional Depth',    value: data.element === 'Water' ? 90 : data.element === 'Fire' ? 65 : 55 },
            { label: 'Intellectual Drive', value: data.element === 'Air'   ? 90 : data.quality === 'Fixed' ? 70 : 60 },
            { label: 'Physical Energy',    value: data.element === 'Fire'  ? 92 : data.element === 'Earth' ? 70 : 65 },
            { label: 'Social Magnetism',   value: data.element === 'Air'   ? 88 : data.element === 'Fire'  ? 82 : 60 },
          ].map(bar => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-xs text-white/50 w-36 shrink-0">{bar.label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${bar.value}%`, background: `linear-gradient(90deg, ${data.color}88, ${data.color})` }} />
              </div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: data.color }}>{bar.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. STRENGTHS & WEAKNESSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={cardBase}>
          <h3 className="text-sm font-semibold text-green-400 mb-3">💪 Strengths</h3>
          <ul className="space-y-2">
            {data.strengths.map(s => (
              <li key={s} className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-5" style={cardBase}>
          <h3 className="text-sm font-semibold text-red-400 mb-3">⚠️ Weaknesses</h3>
          <ul className="space-y-2">
            {data.weaknesses.map(w => (
              <li key={w} className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />{w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 4. TABBED DEEP DIVE */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <div className="flex gap-2 mb-5 flex-wrap">
          {(['overview', 'love', 'career', 'health'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border capitalize transition-all ${activeTab === tab ? 'tab-active text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}>
              {tab === 'overview' ? '🌟' : tab === 'love' ? '❤️' : tab === 'career' ? '💼' : '🌿'} {tab}
            </button>
          ))}
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          {activeTab === 'overview' ? data.description
            : activeTab === 'love'     ? data.love
            : activeTab === 'career'   ? data.career
            :                            data.health}
        </p>
      </div>

      {/* ── 5. COMPATIBILITY */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">💞 Compatibility</h2>
          <button onClick={() => setShowCompatibility(!showCompatibility)}
            className="text-xs text-purple-400 hover:text-purple-300">
            {showCompatibility ? 'Hide' : 'Show all'}
          </button>
        </div>
        <div className="space-y-3">
          {data.compatibility.slice(0, showCompatibility ? data.compatibility.length : 3).map(c => (
            <div key={c.sign} className="flex items-center gap-3">
              <span className="text-xl w-8">{c.emoji}</span>
              <span className="text-sm text-white/70 w-24">{c.sign}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="compat-bar h-full rounded-full" style={{
                  width: `${c.level}%`,
                  background: c.level >= 80 ? 'linear-gradient(90deg,#22c55e88,#22c55e)' : c.level >= 60 ? 'linear-gradient(90deg,#f59e0b88,#f59e0b)' : 'linear-gradient(90deg,#ef444488,#ef4444)',
                }} />
              </div>
              <span className="text-xs font-bold w-10 text-right" style={{ color: c.level >= 80 ? '#22c55e' : c.level >= 60 ? '#f59e0b' : '#ef4444' }}>{c.level}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. LUCKY DETAILS */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <h2 className="text-lg font-semibold text-white mb-4">🍀 Lucky Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Lucky Day',     value: data.day },
            { label: 'Lucky Stone',   value: data.stone },
            { label: 'Lucky Numbers', value: data.numbers.join(', ') },
            { label: 'Lucky Colors',  value: data.colors.join(', ') },
            { label: 'Element',       value: data.element },
            { label: 'Ruling Planet', value: data.ruler },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${data.color}22` }}>
              <span className="text-xs text-white/40 block mb-1">{item.label}</span>
              <span className="text-sm font-medium" style={{ color: data.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. FAMOUS PEOPLE */}
      <div className="rounded-2xl p-6" style={cardBase}>
        <h2 className="text-lg font-semibold text-white mb-4">⭐ Famous {sign}s</h2>
        <div className="flex flex-wrap gap-3">
          {data.famous.map(f => (
            <div key={f.name} className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: `${data.color}15`, border: `1px solid ${data.color}33` }}>
              <div>
                <p className="text-sm font-medium text-white">{f.name}</p>
                <p className="text-xs text-white/50">{f.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. AFFIRMATION */}
      <div className="rounded-2xl p-6 text-center" style={{
        background: `radial-gradient(ellipse at center, ${data.color}15, rgba(10,1,24,0.9))`,
        border: `1px solid ${data.color}33`,
      }}>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Daily Affirmation</p>
        <p className="text-white text-lg font-medium italic mb-2">"{data.affirmation}"</p>
        <p className="text-sm font-bold" style={{ color: data.color }}>{data.mantra}</p>
        <button
          onClick={() => { setSavedAffirmation(true); setTimeout(() => setSavedAffirmation(false), 2000); }}
          className="mt-4 px-5 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: `${data.color}25`, color: data.color, border: `1px solid ${data.color}44` }}>
          {savedAffirmation ? '✓ Saved!' : '🔖 Save Affirmation'}
        </button>
      </div>
    </div>
  );
}