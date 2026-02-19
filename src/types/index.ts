export interface Profile {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string | null;
  zodiac_sign: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface ZodiacSign {
  id: number;
  sign_name: string;
  symbol: string;
  date_range: string;
  element: string;
  ruling_planet: string;
  traits: string;
  compatibility: string;
  color_hex: string;
  description: string;
  daily_horoscope: string;
  monthly_horoscope: string;
  created_at: string;
}

export type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'my-zodiac'
  | 'daily'
  | 'monthly'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-signs'
  | 'admin-users';
