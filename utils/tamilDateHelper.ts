
import { TAMIL_MONTHS, TITHIS, NAKSHATRAMS, FESTIVALS, VASTHU_DAYS } from '../constants';
import { TamilDate, PanchangamData, DayInfo } from '../types';

/**
 * Approximation logic for Tamil dates.
 * Tamil months usually start around the 14th-17th of Gregorian months.
 */
const TAMIL_MONTH_STARTS = [
  { month: 3, day: 14 }, // Chithirai (Apr 14)
  { month: 4, day: 15 }, // Vaikasi (May 15)
  { month: 5, day: 15 }, // Aani (Jun 15)
  { month: 6, day: 16 }, // Aadi (Jul 16)
  { month: 7, day: 17 }, // Avani (Aug 17)
  { month: 8, day: 17 }, // Purattasi (Sep 17)
  { month: 9, day: 18 }, // Aippasi (Oct 18)
  { month: 10, day: 17 }, // Karthigai (Nov 17)
  { month: 11, day: 16 }, // Margazhi (Dec 16)
  { month: 0, day: 14 }, // Thai (Jan 14)
  { month: 1, day: 13 }, // Maasi (Feb 13)
  { month: 2, day: 14 }  // Panguni (Mar 14)
];

export const getTamilDate = (date: Date): TamilDate => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Find which Tamil month we are in
  let tamilMonthIndex = 0;
  for (let i = 0; i < TAMIL_MONTH_STARTS.length; i++) {
    const start = TAMIL_MONTH_STARTS[i];
    if (month > start.month || (month === start.month && day >= start.day)) {
      tamilMonthIndex = i;
    }
  }
  
  // Special case for Jan before Thai starts
  if (month === 0 && day < TAMIL_MONTH_STARTS[9].day) {
    tamilMonthIndex = 8; // Still Margazhi
  }

  const startInfo = TAMIL_MONTH_STARTS[tamilMonthIndex];
  
  // Simple calculation for day within month
  const startDate = new Date(year, startInfo.month, startInfo.day);
  const diffTime = Math.abs(date.getTime() - startDate.getTime());
  const tamilDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Approximate Tamil Year
  // Tamil year changes at Chithirai (April)
  const tamilYear = (month < 3 || (month === 3 && day < 14)) ? year - 79 : year - 78;

  return {
    day: tamilDay,
    monthName: TAMIL_MONTHS[tamilMonthIndex].en,
    taMonthName: TAMIL_MONTHS[tamilMonthIndex].ta,
    monthIndex: tamilMonthIndex,
    year: tamilYear
  };
};

export const getPanchangamData = (date: Date): PanchangamData => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const tamilDate = getTamilDate(date);
  
  // Deterministic but mock calculations for Tithi and Nakshatram
  const tithiIndex = (dayOfYear + 5) % TITHIS.length;
  const nakshatramIndex = (dayOfYear + 12) % NAKSHATRAMS.length;
  
  const weekday = date.getDay();
  
  // Deterministic Rahu Kalam (Standard values for weekdays)
  const rahuKalamTable = [
    "4:30 PM - 6:00 PM", // Sun
    "7:30 AM - 9:00 AM", // Mon
    "3:00 PM - 4:30 PM", // Tue
    "12:00 PM - 1:30 PM", // Wed
    "1:30 PM - 3:00 PM", // Thu
    "10:30 AM - 12:00 PM", // Fri
    "9:00 AM - 10:30 AM"  // Sat
  ];

  const yamagandamTable = [
    "12:00 PM - 1:30 PM", // Sun
    "10:30 AM - 12:00 PM", // Mon
    "9:00 AM - 10:30 AM", // Tue
    "7:30 AM - 9:00 AM", // Wed
    "6:00 AM - 7:30 AM", // Thu
    "3:00 PM - 4:30 PM", // Fri
    "1:30 PM - 3:00 PM"  // Sat
  ];

  const gulikaiTable = [
    "3:00 PM - 4:30 PM", // Sun
    "1:30 PM - 3:00 PM", // Mon
    "12:00 PM - 1:30 PM", // Tue
    "10:30 AM - 12:00 PM", // Wed
    "9:00 AM - 10:30 AM", // Tue
    "7:30 AM - 9:00 AM", // Wed
    "6:00 AM - 7:30 AM"  // Sat
  ];

  const dateKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const todayFestivals = FESTIVALS[dateKey] || [];

  // Check for Vasthu Day
  const vasthuInfo = VASTHU_DAYS[tamilDate.monthIndex];
  const isVasthuDay = vasthuInfo?.day === tamilDate.day;

  // Simplified Auspicious (Subha Muhurtham) logic
  // Typically Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, etc.
  // And specific Tithis
  const auspiciousNakshatrams = [3, 4, 11, 12, 14, 16, 20, 21, 25];
  const isAuspicious = auspiciousNakshatrams.includes(nakshatramIndex) && tithiIndex % 4 !== 0;

  return {
    tithi: TITHIS[tithiIndex].en,
    taTithi: TITHIS[tithiIndex].ta,
    nakshatram: NAKSHATRAMS[nakshatramIndex].en,
    taNakshatram: NAKSHATRAMS[nakshatramIndex].ta,
    yogam: "Siddha",
    karanam: "Bava",
    rahuKalam: rahuKalamTable[weekday],
    yamagandam: yamagandamTable[weekday],
    gulikai: gulikaiTable[weekday],
    festivals: todayFestivals.map(f => f.en),
    taFestivals: todayFestivals.map(f => f.ta),
    isVasthuDay,
    isAuspicious,
    vasthuTime: isVasthuDay ? vasthuInfo.time : undefined,
    taVasthuTime: isVasthuDay ? vasthuInfo.taTime : undefined
  };
};

export const getDayInfo = (date: Date): DayInfo => {
  return {
    gregorianDate: date,
    tamilDate: getTamilDate(date),
    panchangam: getPanchangamData(date)
  };
};

/**
 * Gets all Vasthu days for the current year.
 * Since Tamil months span Gregorian years, we search +/- 1 year to be safe.
 */
export const getAllVasthuDaysForYear = (year: number) => {
  const vasthuDays: { date: Date; tamilMonth: string; taTamilMonth: string; tamilDay: number; time: string; taTime: string }[] = [];
  
  // Scan everyday of the year
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const current = new Date(d);
    const info = getDayInfo(current);
    if (info.panchangam.isVasthuDay) {
      vasthuDays.push({
        date: current,
        tamilMonth: info.tamilDate.monthName,
        taTamilMonth: info.tamilDate.taMonthName,
        tamilDay: info.tamilDate.day,
        time: info.panchangam.vasthuTime || "",
        taTime: info.panchangam.taVasthuTime || ""
      });
    }
  }
  return vasthuDays;
};
