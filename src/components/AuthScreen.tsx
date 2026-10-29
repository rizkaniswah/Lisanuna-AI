import React, { useState } from 'react';
import {
  Sparkles,
  User,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Volume2,
  Database,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, signInWithAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'admin' | 'google'>('admin');
  const [username, setUsername] = useState('rizkaniswah');
  const [password, setPassword] = useState('riris123');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const result = await signInWithAdmin(username, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Username atau password admin salah.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat login.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Gagal login dengan akun Google. Pastikan popup tidak diblokir browser.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillCredentials = () => {
    setUsername('rizkaniswah');
    setPassword('riris123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100 selection:bg-emerald-500/30">
      {/* Decorative Emerald Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-emerald-600/20 via-teal-600/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 shadow-xl shadow-emerald-500/25 ring-1 ring-white/20 mb-3.5">
            <span className="font-arabic text-2xl font-bold text-white tracking-wider">
              لِسَان
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
            Lisanuna <span className="text-emerald-400">AI</span>
          </h1>
          <p className="font-arabic text-lg text-emerald-300/90 mt-1 font-semibold">
            مَنَصَّةُ تَعَلُّمِ اللُّغَةِ العَرَبِيَّةِ الذَّكِيَّةِ
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Platform Pembelajaran Bahasa Arab Cerdas, Nahwu & Hiwar bertenaga Gemini AI
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {/* Navigation Pill Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Login Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('google');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'google'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google Sign-in
            </button>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: ADMIN LOGIN FORM */}
          {activeTab === 'admin' ? (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="rizkaniswah"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="riris123"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Quick credential filler box */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-emerald-300 block">Kredensial Admin Khusus:</span>
                  <span className="text-slate-400 font-mono text-[11px]">rizkaniswah / riris123</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillCredentials}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-[11px] font-semibold border border-emerald-400/30 transition-all"
                >
                  Isi Cepat
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk sebagai Admin Pengajar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TAB 2: GOOGLE SIGN-IN */
            <div className="space-y-4 py-2">
              <p className="text-xs text-slate-300 text-center leading-relaxed">
                Masuk dengan akun Google Anda untuk menyimpan hafalan mufrodat dan progres belajar bahasa Arab di Firestore.
              </p>

              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-95 text-slate-900 text-sm font-semibold shadow-lg shadow-white/10 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Lanjutkan dengan Google</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-500">
                  Data kuis, kartu kosakata, dan capaian tersimpan aman di Firestore.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Badges */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <BookOpen className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-medium block">Nahwu & Hiwar</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Volume2 className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-medium block">Audio Fushah</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Database className="w-4 h-4 mx-auto text-teal-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-medium block">Firestore Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};
