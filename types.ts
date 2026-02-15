
export type Language = 'en' | 'ta';

export interface TamilDate {
  day: number;
  monthName: string;
  monthIndex: number;
  year: number;
  taMonthName: string;
}

export interface PanchangamData {
  tithi: string;
  taTithi: string;
  nakshatram: string;
  taNakshatram: string;
  yogam: string;
  karanam: string;
  rahuKalam: string;
  yamagandam: string;
  gulikai: string;
  festivals: string[];
  taFestivals: string[];
  isVasthuDay: boolean;
  isAuspicious: boolean; // Added for Subha Muhurtham
  vasthuTime?: string;
  taVasthuTime?: string;
}

export interface DayInfo {
  gregorianDate: Date;
  tamilDate: TamilDate;
  panchangam: PanchangamData;
}
