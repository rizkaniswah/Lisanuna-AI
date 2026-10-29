import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { LessonDetailModal } from './components/LessonDetailModal';
import { UserVocabularyView } from './components/UserVocabularyView';
import { NahwuTashrifTool } from './components/NahwuTashrifTool';
import { QuizView } from './components/QuizView';
import { AITutorChat } from './components/AITutorChat';
import { AdminPanel } from './components/AdminPanel';
import {
  INITIAL_LESSONS,
  subscribeUserProgress,
  saveUserProgress,
  subscribeUserMufrodat,
  addUserMufrodat,
  toggleMufrodatStatus,
  deleteUserMufrodat,
  speakArabic,
} from './services/arabicService';
import { ArabicLesson, ArabicLevel, ArabicCategory, UserProgress, UserMufrodat } from './types';
import {
  BookOpen,
  Volume2,
  CheckCircle,
  Sparkles,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Flame,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

function MainApp() {
  const { user, isAdmin } = useAuth();

  // Tab State
  const [currentTab, setCurrentTab] = useState<'lessons' | 'mufrodat' | 'nahwu' | 'quiz' | 'chat' | 'admin'>('lessons');

  // Lessons and Filter
  const [lessons, setLessons] = useState<ArabicLesson[]>(INITIAL_LESSONS);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Lesson Modal
  const [activeLesson, setActiveLesson] = useState<ArabicLesson | null>(null);

  // Firestore Per-User Data
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [vocabularyList, setVocabularyList] = useState<UserMufrodat[]>([]);

  // Subscribe to user Firestore data
  useEffect(() => {
    if (!user) return;

    // Listen to user progress
    const unsubProgress = subscribeUserProgress(user.uid, (p) => {
      setProgress(p);
    });

    // Listen to user mufrodat in Firestore
    const unsubMufrodat = subscribeUserMufrodat(user.uid, (v) => {
      setVocabularyList(v);
    });

    return () => {
      if (typeof unsubProgress === 'function') unsubProgress();
      if (typeof unsubMufrodat === 'function') unsubMufrodat();
    };
  }, [user]);

  // Handle Mark Lesson Complete
  const handleMarkComplete = async (lessonId: string) => {
    if (!user || !progress) return;
    const completed = progress.completedLessonIds || [];
    if (!completed.includes(lessonId)) {
      const updated = [...completed, lessonId];
      const newXP = (progress.xp || 50) + 25;
      await saveUserProgress(user.uid, {
        completedLessonIds: updated,
        xp: newXP,
      });
      setProgress((prev) => (prev ? { ...prev, completedLessonIds: updated, xp: newXP } : null));
    }
  };

  // Handle Award XP from Quizzes
  const handleAwardXP = async (points: number) => {
    if (!user || !progress) return;
    const newXP = (progress.xp || 50) + points;
    const count = (progress.quizzesTaken || 0) + 1;
    await saveUserProgress(user.uid, {
      xp: newXP,
      quizzesTaken: count,
    });
    setProgress((prev) => (prev ? { ...prev, xp: newXP, quizzesTaken: count } : null));
  };

  // Handle Add to personal Mufrodat
  const handleSaveVocab = async (vocab: {
    arabic: string;
    transliteration?: string;
    indonesian: string;
    category: string;
  }) => {
    if (!user) return;
    await addUserMufrodat(user.uid, {
      ...vocab,
      status: 'hafalan',
    });
  };

  // Handle Toggle status
  const handleToggleStatus = async (vocabId: string, currentStatus: 'hafalan' | 'dikuasai') => {
    if (!user) return;
    await toggleMufrodatStatus(user.uid, vocabId, currentStatus);
  };

  // Handle Delete Mufrodat
  const handleDeleteVocab = async (vocabId: string) => {
    if (!user) return;
    await deleteUserMufrodat(user.uid, vocabId);
  };

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    const matchesLevel = selectedLevel === 'all' || l.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.arabicTitle.includes(searchQuery) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        progress={progress}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: MODUL MATERI & HIWAR */}
        {currentTab === 'lessons' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-arabic text-2xl font-bold text-emerald-400">
                    دُرُوْسُ اللُّغَةِ العَرَبِيَّةِ
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Kurikulum Lengkap
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Modul Pembelajaran Bahasa Arab Terpadu
                </h1>
                <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                  Pelajari mufrodat tematik, kaidah nahwu & shorof, serta percakapan (hiwar) situasional. Setiap kosakata dilengkapi audio pengucapan fushah.
                </p>
              </div>

              {/* Progress Summary Card */}
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shrink-0">
                <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Modul Diselesaikan</span>
                  <span className="text-xl font-bold text-white">
                    {progress?.completedLessonIds?.length || 0} / {lessons.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari materi atau topik Arab..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="all">Semua Tingkat</option>
                    <option value="pemula">Pemula</option>
                    <option value="menengah">Menengah</option>
                    <option value="mahir">Mahir</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="mufrodat">Mufrodat</option>
                    <option value="nahwu_shorof">Nahwu & Shorof</option>
                    <option value="hiwar">Hiwar Percakapan</option>
                    <option value="tashrif">Tashrif Shorof</option>
                  </select>
                </div>

                <div className="text-xs text-slate-400 pl-2">
                  Menampilkan <strong className="text-white">{filteredLessons.length}</strong> modul
                </div>
              </div>
            </div>

            {/* Lessons Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLessons.map((lesson) => {
                const isCompleted = progress?.completedLessonIds?.includes(lesson.id) || false;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer transition-all group"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase">
                          {lesson.level}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isCompleted && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-400" /> Selesai
                            </span>
                          )}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {lesson.category}
                          </span>
                        </div>
                      </div>

                      {/* Title Latin & Arabic */}
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors mb-1">
                        {lesson.title}
                      </h3>
                      <p className="font-arabic text-xl font-bold text-emerald-400/90 mb-2">
                        {lesson.arabicTitle}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>{lesson.items.length} kosakata</span>
                        {lesson.dialogue && <span>&bull; Ada Hiwar</span>}
                      </div>

                      <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Buka Materi</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: KOSAKATAKU (FIRESTORE USER VOCABULARY) */}
        {currentTab === 'mufrodat' && (
          <UserVocabularyView
            vocabularyList={vocabularyList}
            onAddVocab={handleSaveVocab}
            onToggleStatus={handleToggleStatus}
            onDeleteVocab={handleDeleteVocab}
          />
        )}

        {/* TAB 3: ANALIS I'RAB & TASHRIF AI */}
        {currentTab === 'nahwu' && <NahwuTashrifTool />}

        {/* TAB 4: LATIHAN KUIS GEMINI AI */}
        {currentTab === 'quiz' && <QuizView onAwardXP={handleAwardXP} />}

        {/* TAB 5: TUTOR AI PERCAKAPAN */}
        {currentTab === 'chat' && <AITutorChat />}

        {/* TAB 6: ADMIN PANEL (SUPER ADMIN RIZKANISWAH) */}
        {currentTab === 'admin' && isAdmin && (
          <AdminPanel
            lessons={lessons}
            onAddCustomLesson={(newLesson) => setLessons((prev) => [newLesson, ...prev])}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lisanuna AI &bull; Platform Pembelajaran Bahasa Arab & Gemini 3.8 Flash</span>
          <span>Firestore & Auth &bull; Siap Deploy Vercel &bull; Admin: rizkaniswah</span>
        </div>
      </footer>

      {/* Active Lesson Modal */}
      {activeLesson && (
        <LessonDetailModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          isCompleted={progress?.completedLessonIds?.includes(activeLesson.id) || false}
          onMarkComplete={handleMarkComplete}
          onSaveVocab={handleSaveVocab}
        />
      )}
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-spin mb-4 font-arabic font-bold text-2xl">
          ل
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Memuat Lisanuna AI...
        </p>
      </div>
    );
  }

  // Strict Login Gate ("halaman wajib login")
  if (!user) {
    return <AuthScreen />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
