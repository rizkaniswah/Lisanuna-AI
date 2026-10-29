export type ArabicLevel = 'pemula' | 'menengah' | 'mahir';
export type ArabicCategory = 'mufrodat' | 'nahwu_shorof' | 'hiwar' | 'tashrif';

export interface VocabularyItem {
  arabic: string;
  transliteration?: string;
  indonesian: string;
  exampleArabic?: string;
  exampleIndo?: string;
}

export interface ArabicLesson {
  id: string;
  title: string;
  arabicTitle: string;
  level: ArabicLevel;
  category: ArabicCategory;
  description: string;
  items: VocabularyItem[];
  dialogue?: {
    speaker: string;
    arabic: string;
    transliteration?: string;
    indonesian: string;
  }[];
  explanation?: string;
  ownerId?: string;
  createdAt?: string;
}

export interface UserProgress {
  id?: string;
  ownerId: string;
  ownerEmail?: string;
  completedLessonIds: string[];
  xp: number;
  streakDays: number;
  quizzesTaken: number;
  lastStudiedAt: string;
}

export interface UserMufrodat {
  id?: string;
  ownerId: string;
  arabic: string;
  transliteration?: string;
  indonesian: string;
  category: string;
  status: 'hafalan' | 'dikuasai';
  notes?: string;
  createdAt: string;
}

export interface NahwuAnalysisResult {
  vocalized: string;
  translation: string;
  words: {
    word: string;
    type: string;
    irab: string;
    sign: string;
    explanation: string;
  }[];
  summary: string;
}

export interface TashrifResult {
  root: string;
  bab: string;
  meaning: string;
  forms: {
    madhi: string;
    mudhari: string;
    mashdar: string;
    isimFail: string;
    isimMaful: string;
    fiilAmr: string;
    fiilNahy: string;
    isimMakanZaman?: string;
    isimAlat?: string;
  };
  exampleSentence: string;
}

export interface QuizQuestion {
  question: string;
  arabicSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAdmin?: boolean;
  username?: string;
  role?: string;
  provider?: 'google' | 'admin-credentials';
}
