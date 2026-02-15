
import React from 'react';

export const TAMIL_MONTHS = [
  { en: "Chithirai", ta: "சித்திரை" },
  { en: "Vaikasi", ta: "வைகாசி" },
  { en: "Aani", ta: "ஆனி" },
  { en: "Aadi", ta: "ஆடி" },
  { en: "Avani", ta: "ஆவணி" },
  { en: "Purattasi", ta: "புரட்டாசி" },
  { en: "Aippasi", ta: "ஐப்பசி" },
  { en: "Karthigai", ta: "கார்த்திகை" },
  { en: "Margazhi", ta: "மார்கழி" },
  { en: "Thai", ta: "தை" },
  { en: "Maasi", ta: "மாசி" },
  { en: "Panguni", ta: "பங்குனி" }
];

export const TITHIS = [
  { en: "Prathama", ta: "பிரதமை" },
  { en: "Dwitiya", ta: "துவிதியை" },
  { en: "Tritiya", ta: "திருதியை" },
  { en: "Chaturthi", ta: "சதுர்த்தி" },
  { en: "Panchami", ta: "பஞ்சமி" },
  { en: "Shashti", ta: "சஷ்டி" },
  { en: "Saptami", ta: "சப்தமி" },
  { en: "Ashtami", ta: "அஷ்டமி" },
  { en: "Navami", ta: "நவமி" },
  { en: "Dashami", ta: "தசமி" },
  { en: "Ekadashi", ta: "ஏகாதசி" },
  { en: "Dwadashi", ta: "துவாதசி" },
  { en: "Trayodashi", ta: "திரயோதசி" },
  { en: "Chaturdashi", ta: "சதுர்தசி" },
  { en: "Purnima", ta: "பௌர்ணமி" },
  { en: "Amavasya", ta: "அமாவாசை" }
];

export const NAKSHATRAMS = [
  { en: "Ashwini", ta: "அஸ்வினி" },
  { en: "Bharani", ta: "பரணி" },
  { en: "Krittika", ta: "கிருத்திகை" },
  { en: "Rohini", ta: "ரோகிணி" },
  { en: "Mrigashira", ta: "மிருகசீரிஷம்" },
  { en: "Arudra", ta: "திருவாதிரை" },
  { en: "Punarvasu", ta: "புனர்பூசம்" },
  { en: "Pushya", ta: "பூசம்" },
  { en: "Ashlesha", ta: "ஆயில்யம்" },
  { en: "Magha", ta: "மகம்" },
  { en: "Purva Phalguni", ta: "பூரம்" },
  { en: "Uttara Phalguni", ta: "உத்திரம்" },
  { en: "Hasta", ta: "அஸ்தம்" },
  { en: "Chitra", ta: "சித்திரை" },
  { en: "Swati", ta: "சுவாதி" },
  { en: "Vishaka", ta: "விசாகம்" },
  { en: "Anuradha", ta: "அனுஷம்" },
  { en: "Jyeshtha", ta: "கேட்டை" },
  { en: "Mula", ta: "மூலம்" },
  { en: "Purva Ashadha", ta: "பூராடம்" },
  { en: "Uttara Ashadha", ta: "உத்திராடம்" },
  { en: "Shravana", ta: "திருவோணம்" },
  { en: "Dhanishta", ta: "அவிட்டம்" },
  { en: "Shatabhisha", ta: "சதயம்" },
  { en: "Purva Bhadrapada", ta: "பூரட்டாதி" },
  { en: "Uttara Bhadrapada", ta: "உத்திரட்டாதி" },
  { en: "Revati", ta: "ரேவதி" }
];

export const FESTIVALS: Record<string, { en: string; ta: string }[]> = {
  "01-14": [{ en: "Thai Pongal", ta: "தைப்பொங்கல்" }],
  "01-15": [{ en: "Mattu Pongal", ta: "மாட்டுப்பொங்கல்" }],
  "04-14": [{ en: "Tamil New Year", ta: "தமிழ் புத்தாண்டு" }],
  "05-01": [{ en: "May Day", ta: "மே தினம்" }],
  "08-15": [{ en: "Independence Day", ta: "சுதந்திர தினம்" }],
  "10-02": [{ en: "Gandhi Jayanti", ta: "காந்தி ஜெயந்தி" }],
  "12-25": [{ en: "Christmas", ta: "கிறிஸ்துமஸ்" }],
};

// Vasthu days mapping: monthIndex -> day of Tamil month
export const VASTHU_DAYS: Record<number, { day: number; time: string; taTime: string }> = {
  9: { day: 10, time: "10:48 AM - 11:24 AM", taTime: "காலை 10:48 - 11:24" },  // Thai
  10: { day: 22, time: "10:48 AM - 11:24 AM", taTime: "காலை 10:48 - 11:24" }, // Maasi
  0: { day: 10, time: "9:12 AM - 9:48 AM", taTime: "காலை 09:12 - 09:48" },    // Chithirai
  1: { day: 21, time: "10:12 AM - 10:48 AM", taTime: "காலை 10:12 - 10:48" },  // Vaikasi
  3: { day: 11, time: "7:48 AM - 8:24 AM", taTime: "காலை 07:48 - 08:24" },    // Aadi
  4: { day: 6, time: "3:36 PM - 4:12 PM", taTime: "மாலை 03:36 - 04:12" },     // Avani
  5: { day: 26, time: "10:12 AM - 10:48 AM", taTime: "காலை 10:12 - 10:48" },  // Purattasi
  7: { day: 8, time: "11:24 AM - 12:00 PM", taTime: "மதியம் 11:24 - 12:00" }  // Karthigai
};

export const WEEKDAYS = [
  { en: "Sunday", ta: "ஞாயிறு", shortEn: "Sun", shortTa: "ஞாயி" },
  { en: "Monday", ta: "திங்கள்", shortEn: "Mon", shortTa: "திங்" },
  { en: "Tuesday", ta: "செவ்வாய்", shortEn: "Tue", shortTa: "செவ்" },
  { en: "Wednesday", ta: "புதன்", shortEn: "Wed", shortTa: "புதன்" },
  { en: "Thursday", ta: "வியாழன்", shortEn: "Thu", shortTa: "வியா" },
  { en: "Friday", ta: "வெள்ளி", shortEn: "Fri", shortTa: "வெள்" },
  { en: "Saturday", ta: "சனி", shortEn: "Sat", shortTa: "சனி" }
];
