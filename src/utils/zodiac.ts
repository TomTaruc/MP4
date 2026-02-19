export function getZodiacSign(dob: string): string {
  if (!dob) return '';

  // Splitting the date string manually prevents timezone shift bugs
  const parts = dob.split('-');
  if (parts.length === 3) {
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  }

  return 'Aries'; // Fallback for invalid formats
}

export const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const ZODIAC_COLORS: Record<string, string> = {
  Aries: '#FF4136', Taurus: '#2ECC40', Gemini: '#FFDC00', Cancer: '#00BFFF',
  Leo: '#FF851B', Virgo: '#01FF70', Libra: '#FF69B4', Scorpio: '#B10DC9',
  Sagittarius: '#FF4136', Capricorn: '#AAAAAA', Aquarius: '#7FDBFF', Pisces: '#0074D9',
};