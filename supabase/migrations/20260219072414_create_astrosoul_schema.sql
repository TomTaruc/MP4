/*
  # AstroSoul Database Schema

  ## Overview
  Creates the full schema for AstroSoul horoscope application.

  ## New Tables

  ### `profiles`
  Extends Supabase auth.users with extra user data:
  - `id` - matches auth.users id (uuid)
  - `full_name` - user's full name
  - `gender` - Male / Female / Other
  - `date_of_birth` - date
  - `zodiac_sign` - auto-calculated on registration
  - `role` - 'user' or 'admin'

  ### `zodiac_signs`
  Stores all 12 zodiac signs with horoscope content:
  - `id`, `sign_name`, `date_range`, `element`, `ruling_planet`
  - `symbol` - unicode zodiac symbol
  - `traits` - comma-separated personality traits
  - `compatibility` - compatible signs
  - `description` - full description of the sign
  - `daily_horoscope` - today's horoscope text
  - `monthly_horoscope` - this month's horoscope text
  - `color_hex` - signature color for the sign

  ## Security
  - RLS enabled on both tables
  - Profiles: users can read/update own profile; admin can read all
  - Zodiac signs: publicly readable; only admin can modify
*/

-- ─────────────────────────────────────────────────────────────
-- PROFILES TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  gender text NOT NULL DEFAULT 'Other',
  date_of_birth date,
  zodiac_sign text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- ZODIAC SIGNS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS zodiac_signs (
  id serial PRIMARY KEY,
  sign_name text UNIQUE NOT NULL,
  symbol text NOT NULL DEFAULT '',
  date_range text NOT NULL DEFAULT '',
  element text NOT NULL DEFAULT '',
  ruling_planet text NOT NULL DEFAULT '',
  traits text NOT NULL DEFAULT '',
  compatibility text NOT NULL DEFAULT '',
  color_hex text NOT NULL DEFAULT '#5B2D8E',
  description text NOT NULL DEFAULT '',
  daily_horoscope text NOT NULL DEFAULT '',
  monthly_horoscope text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE zodiac_signs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read zodiac signs"
  ON zodiac_signs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert zodiac signs"
  ON zodiac_signs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admin can update zodiac signs"
  ON zodiac_signs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete zodiac signs"
  ON zodiac_signs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- SEED: 12 ZODIAC SIGNS
-- ─────────────────────────────────────────────────────────────
INSERT INTO zodiac_signs (sign_name, symbol, date_range, element, ruling_planet, traits, compatibility, color_hex, description, daily_horoscope, monthly_horoscope) VALUES

('Aries', '♈', 'March 21 – April 19', 'Fire', 'Mars',
 'Courageous, Determined, Confident, Enthusiastic, Optimistic',
 'Leo, Sagittarius, Gemini',
 '#FF4136',
 'Aries is the first sign of the zodiac, and that is exactly how Aries natives see themselves: first. Born leaders, Aries are bold, ambitious, and fiercely independent. Their ruling planet Mars bestows them with endless energy, passion, and a warrior spirit. Aries dives headfirst into challenges and has the natural drive to conquer any obstacle. They thrive under pressure and shine brightest when pursuing something completely new and exciting.',
 'The cosmic energy today is charged with possibility for you, Aries. A bold idea you have been sitting on deserves to take flight — trust your instincts and make the first move. Mars aligns favorably with your ascendant, giving you magnetic confidence in all social interactions. Financially, a small unexpected opportunity may present itself; stay alert. In love, directness is your greatest asset right now.',
 'This month brings a powerful surge of creative energy, Aries. The early weeks are ideal for starting new projects, launching initiatives, or making that important decision you have been postponing. Midmonth, a full moon illuminates your sector of relationships — be open to deep conversations. The final days bring rewarding results from your consistent efforts. Stay grounded and channel your fire wisely.'),

('Taurus', '♉', 'April 20 – May 20', 'Earth', 'Venus',
 'Reliable, Patient, Practical, Devoted, Responsible',
 'Virgo, Capricorn, Cancer',
 '#2ECC40',
 'Taurus is the second sign of the zodiac and is governed by Venus, the planet of love, beauty, and abundance. Taureans are deeply rooted in the physical world — they appreciate fine food, beautiful surroundings, and the comfort of stability. Known for their incredible patience and determination, they will persist through any challenge once their mind is set. Taurus builds slowly but surely, creating lasting foundations in everything they undertake.',
 'Venus graces your chart with warmth today, Taurus. This is a perfect day to tend to relationships — express appreciation to those you love. A creative endeavor you have been nurturing starts to show tangible results, bringing a deep sense of satisfaction. Financially, resist impulsive spending; your practical instincts will steer you right. The evening hours are ideal for rest, indulgence, and self-care.',
 'April blossoms into a month of abundance and beauty for you, Taurus. Venus, your ruling planet, energizes your personal magnetism — doors open easily and people are drawn to your warmth. Mid-month focus should be on finances and long-term planning; a solid opportunity for investment or savings appears. The final weeks bring romance or rekindled passion. Allow yourself to receive as much as you give.'),

('Gemini', '♊', 'May 21 – June 20', 'Air', 'Mercury',
 'Gentle, Affectionate, Curious, Adaptable, Quick-witted',
 'Libra, Aquarius, Aries',
 '#FFDC00',
 'Gemini, the third sign of the zodiac, is symbolized by the Twins — representing the dual nature inherent in all Geminis. Ruled by Mercury, the planet of communication, Gemini natives are intellectually curious, endlessly adaptable, and masters of conversation. They can move fluidly between social circles, absorbing ideas and perspectives like a sponge. Gemini craves mental stimulation and thrives in environments where learning and communication are constant.',
 'Mercury sparks brilliant ideas in your mind today, Gemini. This is an outstanding day for communication — write that important email, have that conversation you have been avoiding, or pitch your idea. Your quick wit and charm will disarm anyone you encounter. In personal relationships, a light and playful energy surrounds you. Avoid overthinking; your first instinct is likely your best guide right now.',
 'May opens with Mercury direct and fully empowering your natural communication gifts, Gemini. The first two weeks are exceptional for negotiations, contracts, and networking. A new connection made mid-month may evolve into something significant — personal or professional. The full moon highlights your home life; make space for deeper emotional conversations with family. End of month brings clarity and renewed sense of direction.'),

('Cancer', '♋', 'June 21 – July 22', 'Water', 'Moon',
 'Tenacious, Highly Imaginative, Loyal, Emotional, Sympathetic',
 'Scorpio, Pisces, Taurus',
 '#00BFFF',
 'Cancer is the fourth sign of the zodiac, ruled by the Moon — the celestial body governing emotions, instincts, and the subconscious. Cancers are deeply intuitive and sentimental, with a powerful connection to home and family. They are the caregivers of the zodiac, offering nurturing love and fierce loyalty to those they hold dear. Though they can be guarded on the outside, within their protective shell lies one of the most tender and loving hearts in the zodiac.',
 'The Moon moves through a favorable position for you today, Cancer, illuminating your emotional landscape with clarity. Trust your intuition in all matters — your gut feeling is your compass right now. Home and family take center stage; a small act of care for your living space or a loved one will bring profound joy. Avoid letting past wounds surface in current relationships. Healing is available to you today.',
 'June begins with the new moon activating your sign, Cancer — a powerful moment for setting intentions around self-care, home, and relationships. The first half of the month is introspective and deeply creative. Midmonth brings social invitations and opportunities to connect with your community. Financial matters improve steadily. The full moon at the end of June brings emotional breakthroughs and the release of old patterns that no longer serve you.'),

('Leo', '♌', 'July 23 – August 22', 'Fire', 'Sun',
 'Creative, Passionate, Generous, Warm-hearted, Cheerful',
 'Aries, Sagittarius, Libra',
 '#FF851B',
 'Leo, the fifth sign of the zodiac, is ruled by the Sun — the center of our solar system — and Leos wear this solar energy proudly. Born to lead, to love, and to be loved, Leos possess a natural magnetism that draws others toward them like moths to a flame. They are generous, theatrical, and fiercely loyal. A Leo will fight for those they love with the full force of their solar power, and their warmth is capable of lighting up an entire room.',
 'The Sun energizes your spirit magnificently today, Leo. You are at your most radiant — step into the spotlight and let your natural charisma do the work. Creative projects receive cosmic support; if you have been waiting for the right moment to share your art, your voice, or your vision with the world, that moment is now. In love, bold expressions of affection will be met with warmth. Lead from the heart.',
 'July is your season, Leo, and the cosmos celebrate you abundantly. The new moon in your sign sparks a powerful new beginning — this is the month to reinvent, rebrand, and reimagine your path. Career opportunities surface mid-month that align perfectly with your long-held ambitions. Romance is deeply passionate and rewarding. Financial gains are possible through creative pursuits. Embrace your greatness; the universe is your stage.'),

('Virgo', '♍', 'August 23 – September 22', 'Earth', 'Mercury',
 'Loyal, Analytical, Kind, Hardworking, Practical',
 'Taurus, Capricorn, Cancer',
 '#01FF70',
 'Virgo is the sixth sign of the zodiac, and Virgo natives are known for their sharp analytical minds, meticulous attention to detail, and deep commitment to service. Ruled by Mercury, Virgos are gifted communicators who excel at problem-solving and organization. They are the perfectionist of the zodiac — not out of vanity, but out of a genuine desire to improve everything they touch. Beneath their reserved exterior lies a deeply caring soul who gives endlessly to those they love.',
 'Mercury sharpens your already brilliant mind today, Virgo. This is an exceptional day for detail-oriented work, research, or problem-solving. A puzzle you have been working on begins to reveal its solution — trust your analytical process. Health and wellness deserve your attention; even small improvements to your daily routine can shift your energy considerably. In relationships, your practical advice is exactly what someone needs to hear.',
 'September calls you to refine and perfect, Virgo. The first weeks are ideal for tackling projects that require precision and focus — your natural gifts are heightened. Midmonth, a health or wellness breakthrough motivates you to commit to better habits. A new moon in your sign at the end of the month marks a powerful fresh start in one key area of your life. Relationships deepen as you allow yourself to be more vulnerable and open.'),

('Libra', '♎', 'September 23 – October 22', 'Air', 'Venus',
 'Cooperative, Diplomatic, Gracious, Fair-Minded, Social',
 'Gemini, Aquarius, Leo',
 '#FF69B4',
 'Libra is the seventh sign of the zodiac and the only sign represented by an inanimate object — the scales — symbolizing Libra''s eternal quest for balance, justice, and harmony. Ruled by Venus, Libras are deeply aesthetic, charming, and socially gifted. They are natural diplomats with an extraordinary ability to see all sides of a situation. Libra''s greatest gift is their capacity to create beauty and equilibrium in all things — from their appearance to their relationships and their surroundings.',
 'Venus casts a golden light over your day, Libra. Social interactions are especially rewarding — a conversation or connection made today could open unexpected doors. Your natural diplomacy is your greatest asset right now; use it to resolve any lingering tensions. Aesthetic pursuits flourish under today''s energy; make time for beauty, art, or music. In love, balance giving and receiving. You deserve the same love and care you extend to others.',
 'October is your birthday season, Libra, and it arrives with Venus showering you in blessings. A major social or romantic development lights up the first two weeks. Career matters receive a boost mid-month — your ability to collaborate and negotiate shines brightly. The full moon brings financial clarity, helping you see where to invest and where to cut back. The final days promise renewed energy and a powerful sense of who you are becoming.'),

('Scorpio', '♏', 'October 23 – November 21', 'Water', 'Pluto',
 'Resourceful, Brave, Passionate, Stubborn, Focused',
 'Cancer, Pisces, Virgo',
 '#B10DC9',
 'Scorpio is the eighth sign of the zodiac, ruled by Pluto — the planet of transformation, power, and rebirth. Scorpios are among the most intense, magnetic, and deeply complex individuals in the zodiac. They are fearless in their pursuit of truth and are drawn to the mysteries of life, death, and transformation. A Scorpio''s loyalty is legendary and their love is all-consuming. They feel everything at extraordinary depth, and their resilience in the face of adversity is unmatched.',
 'Pluto''s transformative energy moves through your chart today, Scorpio, with particular intensity. Something below the surface is ready to be acknowledged — allow yourself to sit with deeper truths rather than pushing them aside. A power dynamic in a relationship or workplace may require a direct conversation. Your instincts about a person or situation are accurate; trust them. Tonight is ideal for journaling, meditation, or any form of inner alchemy.',
 'November deepens your natural power, Scorpio. The early weeks bring opportunities for profound personal transformation — a chapter closes to make room for something far more aligned with your true self. Midmonth, financial matters improve, especially regarding shared resources or investments. A new moon in your sign is a cosmic rebirth — set intentions around your deepest desires. Love is intense, passionate, and potentially life-changing. Embrace the metamorphosis.'),

('Sagittarius', '♐', 'November 22 – December 21', 'Fire', 'Jupiter',
 'Generous, Idealistic, Great Humor, Freedom-loving, Honest',
 'Aries, Leo, Aquarius',
 '#FF4136',
 'Sagittarius, the ninth sign of the zodiac, is the eternal seeker — a free-spirited explorer ruled by Jupiter, the planet of expansion, abundance, and wisdom. Sagittarians are perpetual students of life, driven by an insatiable thirst for knowledge, adventure, and truth. They are among the most optimistic and philosophical signs, always aiming their arrows toward higher understanding and broader horizons. A Sagittarius will inspire everyone around them simply by being authentically, unapologetically themselves.',
 'Jupiter expands your vision beautifully today, Sagittarius. Your optimism is infectious and highly magnetic — people are drawn to your energy and your ideas. Travel, learning, or a philosophical conversation could shift your perspective in meaningful ways. A long-distance connection or opportunity benefits from your attention. In love, honesty and adventure are your greatest aphrodisiacs. Aim high today; the cosmos are fully aligned with your arrow.',
 'December amplifies your adventurous spirit, Sagittarius. The first weeks open doors to travel, education, or a major philosophical realization. Jupiter in your favor throughout the month means expansion in all areas — especially career and financial growth. Midmonth brings a meaningful romantic or spiritual encounter. A full moon near the end of December illuminates your deepest ambitions and the path forward becomes brilliantly clear. Your best adventure is just beginning.'),

('Capricorn', '♑', 'December 22 – January 19', 'Earth', 'Saturn',
 'Responsible, Disciplined, Self-control, Good Managerial Skills',
 'Taurus, Virgo, Scorpio',
 '#AAAAAA',
 'Capricorn is the tenth sign of the zodiac, ruled by Saturn — the planet of discipline, responsibility, and long-term achievement. Capricorns are the master builders of the zodiac, approaching life with steadfast determination and a clear-eyed understanding of what is required to succeed. They are patient, strategic, and remarkably resilient. Though often perceived as serious or reserved, Capricorn possesses a dry, sophisticated wit and an unwavering loyalty to those they consider worthy of their respect.',
 'Saturn steadies your course today, Capricorn, with the quiet confidence only disciplined effort can bring. A long-term project receives a meaningful breakthrough — your patience is paying off. This is an excellent day for tackling complex tasks requiring sustained focus and strategy. Financially, a conservative approach yields the best results right now. In relationships, showing up consistently matters more than grand gestures. Be the dependable anchor you are.',
 'January rewards your consistent efforts with tangible results, Capricorn. Career matters dominate the first two weeks — a recognition, promotion, or significant responsibility could be offered. Saturn amplifies your natural authority; step into leadership roles with confidence. Midmonth calls for attention to your personal life and emotional needs — balance ambition with warmth. The new moon near the end of January plants seeds for a powerful new cycle of abundance and achievement.'),

('Aquarius', '♒', 'January 20 – February 18', 'Air', 'Uranus',
 'Progressive, Original, Independent, Humanitarian, Inventive',
 'Gemini, Libra, Sagittarius',
 '#7FDBFF',
 'Aquarius is the eleventh sign of the zodiac, ruled by Uranus — the planet of innovation, revolution, and awakening. Aquarians are the visionaries and humanitarians of the zodiac, possessing an extraordinary ability to see the future before it arrives. They are fiercely independent and deeply committed to their unique perspective on life, society, and humanity. An Aquarius will always choose the path less traveled, and in doing so, often creates trails that generations after them will follow.',
 'Uranus sparks a flash of genius in your mind today, Aquarius — an unconventional idea or approach to a problem arrives with sudden clarity. Trust the unusual solution; your most innovative thinking is your greatest gift. Technology, community, and social causes receive favourable cosmic energy. In relationships, intellectual stimulation is what draws you closest to others. An unexpected meeting or message opens an exciting new possibility.',
 'February amplifies your originality, Aquarius. The early weeks are exceptional for innovation, technology-related pursuits, and community involvement. A group project or collaborative effort gains powerful momentum mid-month. The full moon illuminates your financial sector — a smart reorganization of your resources brings long-term security. The final days bring a meaningful connection or conversation that feeds your mind and soul. Your vision for the future is becoming reality.'),

('Pisces', '♓', 'February 19 – March 20', 'Water', 'Neptune',
 'Compassionate, Artistic, Intuitive, Gentle, Wise',
 'Cancer, Scorpio, Taurus',
 '#0074D9',
 'Pisces, the twelfth and final sign of the zodiac, is ruled by Neptune — the planet of dreams, illusion, and spiritual depth. Pisces natives carry within them the wisdom of all eleven signs that came before, making them extraordinarily empathetic, intuitive, and deeply compassionate. They exist comfortably between the world of reality and the realm of dreams, possessing an artistic and spiritual sensitivity that allows them to perceive what others cannot. A Pisces loves with no conditions and forgives with no hesitation.',
 'Neptune wraps your day in a luminous, dreamy glow, Pisces. Your intuition is operating at its highest frequency — listen to the quiet messages your soul is sending you. Creative work receives cosmic inspiration today; make time to write, paint, play music, or engage with any artistic expression. In love, deep emotional attunement creates magical moments. If you have been feeling unclear about a decision, a dream tonight may bring the guidance you seek.',
 'March is your month of rebirth, Pisces. The new moon in your sign early in the month marks one of the most powerful new beginnings of the year — the seeds you plant now will bloom throughout the rest of the year. Creative and spiritual pursuits receive extraordinary cosmic support. Midmonth brings clarity around a relationship or emotional pattern that has been calling for your attention. Financial intuition is sharp; trust your instincts. Your healing journey takes a beautiful new turn.')

ON CONFLICT (sign_name) DO NOTHING;
