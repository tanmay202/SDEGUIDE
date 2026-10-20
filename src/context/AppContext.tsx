import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { initializeDatabase, resetToCleanBaseline, loadSampleDevelopmentData } from '../db/dbService';
import {
  getKolkataDateString,
  getKolkataTimeString,
  calculateRoadmapDay,
  calculateRoadmapWeek,
  calculateRoadmapPhase,
} from '../utils/dateUtils';
import type { UserSettings } from '../types';

interface AppContextValue {
  settings?: UserSettings;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isSampleDataMode: boolean;
  switchToBaseline: () => Promise<void>;
  switchToSampleData: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  kolkataDateStr: string;
  kolkataTimeStr: string;
  dayNumber: number;
  weekNumber: number;
  phaseNumber: 1 | 2 | 3;
  // Timer State
  timerBlock: 'dsa' | 'technical' | 'interview' | 'log';
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (block?: 'dsa' | 'technical' | 'interview' | 'log') => void;
  setTimerBlock: (block: 'dsa' | 'technical' | 'interview' | 'log') => void;
}

const BLOCK_DURATIONS: Record<'dsa' | 'technical' | 'interview' | 'log', number> = {
  dsa: 40 * 60,
  technical: 60 * 60,
  interview: 10 * 60,
  log: 10 * 60,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [kolkataDateStr, setKolkataDateStr] = useState<string>(getKolkataDateString());
  const [kolkataTimeStr, setKolkataTimeStr] = useState<string>(getKolkataTimeString());
  
  // Timer state
  const [timerBlock, setTimerBlockState] = useState<'dsa' | 'technical' | 'interview' | 'log'>('dsa');
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(BLOCK_DURATIONS.dsa);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Live Query settings from IndexedDB
  const settings = useLiveQuery(async () => {
    return await db.settings.toCollection().first();
  });

  // Initialize DB on boot
  useEffect(() => {
    initializeDatabase().catch(console.error);
  }, []);

  // Sync theme with system / settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('sde_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    } else {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('sde_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Live clock ticker in Asia/Kolkata
  useEffect(() => {
    const interval = setInterval(() => {
      setKolkataDateStr(getKolkataDateString());
      setKolkataTimeStr(getKolkataTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer ticker
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      timer = setInterval(() => {
        setTimerSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerSecondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Optional sound chime or notification
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch {
        // AudioContext not permitted without user gesture, ignored
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timerSecondsRemaining]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = (block: 'dsa' | 'technical' | 'interview' | 'log' = timerBlock) => {
    setIsTimerRunning(false);
    setTimerBlockState(block);
    setTimerSecondsRemaining(BLOCK_DURATIONS[block]);
  };
  const setTimerBlock = (block: 'dsa' | 'technical' | 'interview' | 'log') => {
    resetTimer(block);
  };

  const dayNumber = calculateRoadmapDay(kolkataDateStr, settings?.startDate);
  const weekNumber = calculateRoadmapWeek(dayNumber);
  const phaseNumber = calculateRoadmapPhase(weekNumber);

  const switchToBaseline = async () => {
    await resetToCleanBaseline();
  };

  const switchToSampleData = async () => {
    await loadSampleDevelopmentData();
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (settings && settings.id) {
      await db.settings.update(settings.id, updates);
    }
  };

  const isSampleDataMode = settings?.isSampleDataMode ?? false;

  return (
    <AppContext.Provider
      value={{
        settings,
        theme,
        setTheme,
        toggleTheme,
        isSampleDataMode,
        switchToBaseline,
        switchToSampleData,
        updateSettings,
        kolkataDateStr,
        kolkataTimeStr,
        dayNumber,
        weekNumber,
        phaseNumber,
        timerBlock,
        timerSecondsRemaining,
        isTimerRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimerBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
