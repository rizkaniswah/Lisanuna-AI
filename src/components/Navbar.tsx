import React from 'react';
import {
  BookOpen,
  Sparkles,
  LogOut,
  Layers,
  Search,
  MessageSquare,
  ShieldCheck,
  Award,
  Flame,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProgress } from '../types';

interface NavbarProps {
  currentTab: 'lessons' | 'mufrodat' | 'nahwu' | 'quiz' | 'chat' | 'admin';
  setCurrentTab: (tab: 'lessons' | 'mufrodat' | 'nahwu' | 'quiz' | 'chat' | 'admin') => void;
  progress: UserProgress | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  progress,
}) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Calligraphy Emblem */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <span className="font-arabic font-bold text-lg text-white">ل</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                  Lisanuna <span className="text-emerald-400 font-black">AI</span>
                </span>
                <span className="font-arabic text-xs text-emerald-400/90 hidden sm:inline">
                  (لِسَانُنَا)
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Pembelajaran Bahasa Arab, Nahwu, Hiwar & Gemini AI
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setCurrentTab('lessons')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'lessons'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Materi & Hiwar
            </button>

            <button
              onClick={() => setCurrentTab('mufrodat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'mufrodat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Kosakataku
            </button>

            <button
              onClick={() => setCurrentTab('nahwu')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'nahwu'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
              I'rab & Tashrif AI
            </button>

            <button
              onClick={() => setCurrentTab('quiz')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Kuis Latihan
            </button>

            <button
              onClick={() => setCurrentTab('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Tutor AI
            </button>

            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-500/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Panel Admin
              </button>
            )}
          </nav>

          {/* User Progress Stats & Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* XP Points */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{progress?.xp || 50} XP</span>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{progress?.streakDays || 1} Hari</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 max-w-[130px] truncate">
                  {user?.displayName || user?.username || 'Santri'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user?.role || (isAdmin ? 'Admin' : 'Pelajar')}
                </span>
              </div>

              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="w-8 h-8 rounded-full ring-2 ring-emerald-500/40 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {(user?.displayName || user?.username || 'S')[0].toUpperCase()}
                </div>
              )}

              {/* TOMBOL LOGOUT RESMI */}
              <button
                onClick={logout}
                title="Keluar dari akun"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-xs font-medium transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto gap-1">
          <button
            onClick={() => setCurrentTab('lessons')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              currentTab === 'lessons' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Materi
          </button>
          <button
            onClick={() => setCurrentTab('mufrodat')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              currentTab === 'mufrodat' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Kosakata
          </button>
          <button
            onClick={() => setCurrentTab('nahwu')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              currentTab === 'nahwu' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> I'rab AI
          </button>
          <button
            onClick={() => setCurrentTab('quiz')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              currentTab === 'quiz' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Kuis
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              currentTab === 'chat' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Tutor AI
          </button>
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
                currentTab === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-400/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
