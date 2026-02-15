
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Moon, 
  Sun, 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Sparkles, 
  Zap, 
  Star, 
  ShieldAlert, 
  CalendarCheck,
  WifiOff,
  CloudDownload,
  Image as ImageIcon,
  Home,
  Info,
  Award,
  Play,
  Square,
  Wind,
  Edit3,
  Keyboard,
  Copy,
  Check,
  Share2,
  Book
} from 'lucide-react';
import { format, addMonths, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { getDayInfo, getTamilDate, getAllVasthuDaysForYear } from './utils/tamilDateHelper';
import { Language, DayInfo } from './types';
import { TAMIL_MONTHS, WEEKDAYS, FESTIVALS } from './constants';
import PanchangamItem from './components/PanchangamItem';
import { getSpiritualInsight, generateDeityImage } from './services/geminiService';
import { playOmMantra, stopMantra } from './services/audioService';
import TamilKeyboard from './components/TamilKeyboard';

type Tab = 'today' | 'calendar' | 'journal' | 'meditation';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('tc_language') as Language) || 'ta';
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('tc_dark_mode');
    return saved === 'true';
  });

  const [insight, setInsight] = useState<string | null>(null);
  const [deityImage, setDeityImage] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showVasthuSchedule, setShowVasthuSchedule] = useState(false);
  
  const [isMantraPlaying, setIsMantraPlaying] = useState(false);
  const [loadingMantra, setLoadingMantra] = useState(false);

  const [journalText, setJournalText] = useState(() => localStorage.getItem('tc_journal') || '');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [copied, setCopied] = useState(false);
  const journalRef = useRef<HTMLTextAreaElement>(null);

  const dayInfo = useMemo(() => getDayInfo(selectedDate), [selectedDate]);
  
  const vasthuDaysList = useMemo(() => {
    return getAllVasthuDaysForYear(selectedDate.getFullYear());
  }, [selectedDate.getFullYear()]);

  const monthDays = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  useEffect(() => {
    localStorage.setItem('tc_journal', journalText);
  }, [journalText]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tc_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('tc_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const dateStr = format(selectedDate, 'yyyyMMdd');
    const insightKey = `insight_${dateStr}_${language}`;
    const imageKey = `deity_image_${dateStr}`;
    
    const cachedInsight = localStorage.getItem(insightKey);
    const cachedImage = localStorage.getItem(imageKey);

    if (cachedInsight) {
      setInsight(cachedInsight);
      setIsCached(true);
    } else {
      setInsight(null);
      setIsCached(false);
    }

    if (cachedImage) {
      setDeityImage(cachedImage);
    } else {
      setDeityImage(null);
      if (isOnline && isToday(selectedDate)) {
        fetchDeityImage();
      }
    }
  }, [selectedDate, language]);

  const vibrate = (pattern: number | number[] = 15) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  };

  const shareDay = async () => {
    vibrate();
    const title = t("Tamil Calendar Pro", "தமிழ் கேலெண்டர் ப்ரோ");
    const text = `${t(dayInfo.tamilDate.monthName, dayInfo.tamilDate.taMonthName)} ${dayInfo.tamilDate.day} - ${t("Tithi", "திதி")}: ${t(dayInfo.panchangam.tithi, dayInfo.panchangam.taTithi)}, ${t("Nakshatram", "நட்சத்திரம்")}: ${t(dayInfo.panchangam.nakshatram, dayInfo.panchangam.taNakshatram)}.`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard();
      alert(t("Details copied to clipboard!", "விவரங்கள் நகலெடுக்கப்பட்டன!"));
    }
  };

  const fetchInsight = async () => {
    if (!isOnline) return;
    vibrate();
    setLoadingInsight(true);
    try {
      const data = await getSpiritualInsight(dayInfo.panchangam.tithi, dayInfo.panchangam.nakshatram, language);
      if (data) {
        setInsight(data);
        setIsCached(false);
        const cacheKey = `insight_${format(selectedDate, 'yyyyMMdd')}_${language}`;
        localStorage.setItem(cacheKey, data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsight(false);
    }
  };

  const fetchDeityImage = async () => {
    if (!isOnline) return;
    setLoadingImage(true);
    try {
      const img = await generateDeityImage("Lord Ganesha with traditional Tamil ornaments");
      if (img) {
        setDeityImage(img);
        localStorage.setItem(`deity_image_${format(selectedDate, 'yyyyMMdd')}`, img);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImage(false);
    }
  };

  const toggleMantra = async () => {
    vibrate(30);
    if (isMantraPlaying) {
      stopMantra();
      setIsMantraPlaying(false);
    } else {
      setLoadingMantra(true);
      const success = await playOmMantra(() => setIsMantraPlaying(false));
      setLoadingMantra(false);
      if (success) setIsMantraPlaying(true);
    }
  };

  const copyToClipboard = () => {
    vibrate();
    navigator.clipboard.writeText(journalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = (en: string, ta: string) => language === 'ta' ? ta : en;

  return (
    <div className={`min-h-screen pb-24 transition-all duration-300 ${language === 'ta' ? 'tamil-font' : ''} bg-slate-50 dark:bg-slate-950`} lang={language}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
              {t("Tamil Calendar Pro", "தமிழ் கேலெண்டர்")}
            </h1>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:hidden">
              {t("TC Pro", "தமிழ் கேலெண்டர்")}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOnline && <WifiOff className="w-4 h-4 text-red-500 mr-2" />}
            <button onClick={() => {vibrate(); setIsDarkMode(!isDarkMode);}} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => {vibrate(); setLanguage(language === 'ta' ? 'en' : 'ta');}} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">
              {language === 'ta' ? 'EN' : 'தமிழ்'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6">
        
        {/* Today Tab */}
        {activeTab === 'today' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative group bg-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[400px] flex flex-col justify-end">
              {deityImage ? (
                <img src={deityImage} alt="Divine" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              <div className="relative z-10 p-8 text-white">
                <button onClick={shareDay} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/20 active:scale-90 transition-transform">
                  <Share2 className="w-5 h-5" />
                </button>
                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">
                  {format(selectedDate, 'EEEE, MMM d')}
                </p>
                <h3 className="text-5xl font-extrabold mb-1">
                  {t(dayInfo.tamilDate.monthName, dayInfo.tamilDate.taMonthName)} {dayInfo.tamilDate.day}
                </h3>
                <p className="text-slate-300 font-bold">{dayInfo.tamilDate.year}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {dayInfo.panchangam.festivals.length > 0 && dayInfo.panchangam[language === 'ta' ? 'taFestivals' : 'festivals'].map(f => (
                    <span key={f} className="bg-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-400/50">{f}</span>
                  ))}
                  {dayInfo.panchangam.isAuspicious && <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/50">{t("Auspicious", "சுப முகூர்த்தம்")}</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <PanchangamItem label={t("Tithi", "திதி")} value={t(dayInfo.panchangam.tithi, dayInfo.panchangam.taTithi)} icon={<Moon className="w-5 h-5" />} colorClass="bg-indigo-50 text-indigo-600" />
               <PanchangamItem label={t("Nakshatram", "நட்சத்திரம்")} value={t(dayInfo.panchangam.nakshatram, dayInfo.panchangam.taNakshatram)} icon={<Star className="w-5 h-5" />} colorClass="bg-purple-50 text-purple-600" />
               <PanchangamItem label={t("Rahu", "ராகு")} value={dayInfo.panchangam.rahuKalam} icon={<ShieldAlert className="w-5 h-5" />} colorClass="bg-red-50 text-red-600" />
               <PanchangamItem label={t("Gulikai", "குளிகை")} value={dayInfo.panchangam.gulikai} icon={<Clock className="w-5 h-5" />} colorClass="bg-blue-50 text-blue-600" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold dark:text-white">{t("Spiritual Insight", "ஆன்மீக விளக்கம்")}</h4>
              </div>
              {insight ? (
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">"{insight}"</p>
              ) : (
                <button onClick={fetchInsight} disabled={!isOnline} className="w-full py-4 bg-slate-900 dark:bg-orange-600 text-white font-bold rounded-2xl active:scale-95 transition-all">
                  {loadingInsight ? t("Calculating...", "கணக்கிடப்படுகிறது...") : t("Reveal Significance", "சிறப்புகளை அறி")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
              <div className="p-6 flex items-center justify-between border-b dark:border-slate-800">
                <button onClick={() => {vibrate(); setCurrentMonth(addMonths(currentMonth, -1));}} className="p-2"><ChevronLeft /></button>
                <div className="text-center">
                  <h2 className="font-bold text-lg dark:text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
                  <p className="text-xs text-orange-600 font-bold">{t("Tamil Month Calendar", "தமிழ் மாத நாட்காட்டி")}</p>
                </div>
                <button onClick={() => {vibrate(); setCurrentMonth(addMonths(currentMonth, 1));}} className="p-2"><ChevronRight /></button>
              </div>
              <div className="p-4 grid grid-cols-7 gap-1">
                {WEEKDAYS.map(day => <div key={day.en} className="text-center py-2 text-[10px] font-bold text-slate-400 uppercase">{t(day.shortEn, day.shortTa)}</div>)}
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={i} />)}
                {monthDays.map(date => {
                  const isSel = isSameDay(date, selectedDate);
                  const isTod = isToday(date);
                  const info = getDayInfo(date);
                  return (
                    <button key={date.toISOString()} onClick={() => {vibrate(); setSelectedDate(date);}} className={`h-14 flex flex-col items-center justify-center rounded-xl border ${isSel ? 'bg-orange-600 text-white border-orange-600' : isTod ? 'border-orange-200 dark:border-orange-800' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      <span className="text-sm font-bold">{format(date, 'd')}</span>
                      <span className="text-[10px] opacity-60">{info.tamilDate.day}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button onClick={() => setShowVasthuSchedule(!showVasthuSchedule)} className="w-full p-5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-3xl font-bold flex justify-between items-center shadow-md">
              <div className="flex items-center"><Home className="w-5 h-5 mr-3" /> {t("Vasthu Schedule", "வாஸ்து அட்டவணை")}</div>
              <ChevronRight className={`transition-transform ${showVasthuSchedule ? 'rotate-90' : ''}`} />
            </button>
            {showVasthuSchedule && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                {vasthuDaysList.map((vd, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl flex justify-between">
                    <span className="font-bold dark:text-white">{t(vd.tamilMonth, vd.taTamilMonth)} {vd.tamilDay}</span>
                    <span className="text-xs text-slate-500">{format(vd.date, 'MMM d')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 shadow-xl overflow-hidden">
               <div className="p-5 border-b dark:border-slate-800 flex justify-between items-center bg-indigo-50/20">
                 <div className="flex items-center"><Book className="w-5 h-5 text-indigo-600 mr-2" /> <h3 className="font-bold dark:text-white">{t("Personal Journal", "ஆன்மீகக் குறிப்பேடு")}</h3></div>
                 <div className="flex space-x-2">
                   <button onClick={copyToClipboard} className="p-2 text-slate-400">{copied ? <Check className="text-emerald-500" /> : <Copy />}</button>
                   <button onClick={() => {vibrate(); setShowKeyboard(!showKeyboard);}} className={`p-2 rounded-lg ${showKeyboard ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}><Keyboard /></button>
                 </div>
               </div>
               <div className="p-4 space-y-4">
                 <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder={t("Type your thoughts...", "உங்கள் சிந்தனைகளை எழுதவும்...")} className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 tamil-font resize-none" />
                 {showKeyboard && <TamilKeyboard onKeyClick={(c) => setJournalText(prev => prev + c)} onBackspace={() => setJournalText(prev => prev.slice(0, -1))} onEnter={() => setJournalText(prev => prev + '\n')} onSpace={() => setJournalText(prev => prev + ' ')} />}
               </div>
             </div>
          </div>
        )}

        {/* Meditation Tab */}
        {activeTab === 'meditation' && (activeTab === 'meditation' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-br from-indigo-700 to-violet-900 rounded-[40px] p-10 text-center text-white shadow-2xl relative overflow-hidden">
              <Wind className="absolute -right-10 -top-10 w-48 h-48 opacity-10" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl">
                  <Wind className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold mb-4">{t("Dhyana Hall", "தியான மண்டபம்")}</h2>
                <p className="text-indigo-100 mb-10 text-sm leading-relaxed">{t("Experience the vibrations of the cosmos with the sacred Om chant.", "பிரபஞ்ச அதிர்வுகளை உணர 'ஓம்' மந்திரத்தைக் கேட்டு தியானிக்கவும்.")}</p>
                <button 
                  onClick={toggleMantra}
                  disabled={loadingMantra || !isOnline}
                  className={`w-full py-6 rounded-3xl flex items-center justify-center space-x-4 shadow-xl active:scale-95 transition-all ${isMantraPlaying ? 'bg-rose-500' : 'bg-white text-indigo-700'}`}
                >
                  {loadingMantra ? <div className="animate-spin h-6 w-6 border-b-2 border-current rounded-full" /> : isMantraPlaying ? <><Square className="fill-current" /> <span className="font-bold uppercase tracking-widest">{t("Stop", "நிறுத்து")}</span></> : <><Play className="fill-current" /> <span className="font-bold uppercase tracking-widest">{t("Om Mantra", "ஓம் மந்திரம்")}</span></>}
                </button>
              </div>
            </div>
          </div>
        ))}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t dark:border-slate-800 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          <BottomNavItem active={activeTab === 'today'} onClick={() => {vibrate(); setActiveTab('today');}} icon={<Home />} label={t("Today", "இன்று")} />
          <BottomNavItem active={activeTab === 'calendar'} onClick={() => {vibrate(); setActiveTab('calendar');}} icon={<CalendarIcon />} label={t("Calendar", "நாள்")} />
          <BottomNavItem active={activeTab === 'journal'} onClick={() => {vibrate(); setActiveTab('journal');}} icon={<Book />} label={t("Journal", "குறிப்பு")} />
          <BottomNavItem active={activeTab === 'meditation'} onClick={() => {vibrate(); setActiveTab('meditation');}} icon={<Wind />} label={t("Zen", "தியானம்")} />
        </div>
      </nav>
    </div>
  );
};

const BottomNavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all ${active ? 'text-orange-600 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
    <div className={`p-1.5 rounded-xl ${active ? 'bg-orange-50 dark:bg-orange-950/20' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
