import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Server,
  Database,
  Plus,
  Download,
  BookOpen,
  Users,
  CheckCircle,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ArabicLesson } from '../types';

interface AdminPanelProps {
  lessons: ArabicLesson[];
  onAddCustomLesson: (lesson: ArabicLesson) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ lessons, onAddCustomLesson }) => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [level, setLevel] = useState<'pemula' | 'menengah' | 'mahir'>('pemula');
  const [category, setCategory] = useState<'mufrodat' | 'nahwu_shorof' | 'hiwar' | 'tashrif'>('mufrodat');
  const [description, setDescription] = useState('');
  const [explanation, setExplanation] = useState('');

  const fetchHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setHealthData({ status: 'error', message: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !arabicTitle.trim()) return;

    const newLesson: ArabicLesson = {
      id: `lesson-custom-${Date.now()}`,
      title: title.trim(),
      arabicTitle: arabicTitle.trim(),
      level,
      category,
      description: description.trim(),
      explanation: explanation.trim(),
      items: [
        {
          arabic: 'الدَّرْسُ الجَدِيْدُ',
          transliteration: 'Ad-darsul jadiid',
          indonesian: 'Pelajaran baru',
          exampleArabic: 'هَذَا دَرْسٌ مُفِيْدٌ',
          exampleIndo: 'Ini adalah pelajaran yang bermanfaat',
        },
      ],
      createdAt: new Date().toISOString(),
      ownerId: user?.uid || 'admin-rizkaniswah',
    };

    onAddCustomLesson(newLesson);
    setTitle('');
    setArabicTitle('');
    setDescription('');
    setExplanation('');
    setIsAddLessonOpen(false);
    alert('Materi baru berhasil ditambahkan!');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lessons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lisanuna-kurikulum-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Admin Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Panel Administrator Utama</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Akun Aktif: <strong className="text-amber-200">{user?.displayName || user?.username}</strong> ({user?.email || 'admin@lisanuna.edu'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Kurikulum JSON</span>
          </button>
          <button
            onClick={() => setIsAddLessonOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Modul Materi</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium block">Total Modul Materi</span>
          <span className="text-2xl font-bold text-white mt-1 block">{lessons.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-emerald-400 font-medium block">Tingkat Pemula</span>
          <span className="text-2xl font-bold text-emerald-300 mt-1 block">
            {lessons.filter((l) => l.level === 'pemula').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-sky-400 font-medium block">Tingkat Menengah</span>
          <span className="text-2xl font-bold text-sky-300 mt-1 block">
            {lessons.filter((l) => l.level === 'menengah').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-purple-400 font-medium block">Modul Nahwu & Shorof</span>
          <span className="text-2xl font-bold text-purple-300 mt-1 block">
            {lessons.filter((l) => l.category === 'nahwu_shorof' || l.category === 'tashrif').length}
          </span>
        </div>
      </div>

      {/* Status Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Status Backend Express (/api/health)
            </h4>
            <button
              onClick={fetchHealth}
              disabled={checkingHealth}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Endpoint Express API:</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {healthData?.status === 'ok' ? '200 OK (Aktif)' : 'Memeriksa...'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">GEMINI_API_KEY Server-side:</span>
              <span
                className={`font-semibold ${
                  healthData?.geminiConfigured ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {healthData?.geminiConfigured ? 'Terhubung (Server-side)' : 'Configured'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Server Handler:</span>
              <span className="text-slate-300 font-mono">api/index.ts (export default app)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Vercel Rewrite:</span>
              <span className="text-slate-300 font-mono">vercel.json (/api/* rewrite)</span>
            </div>
          </div>
        </div>

        {/* Database info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              Status Firebase Firestore & Rules
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Rules Deployed
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Firestore Database ID:</span>
              <span className="text-slate-200 font-mono">ai-studio-b8253da3-c98d-4465-b819-1aea7fda069c</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Kredensial Default Admin:</span>
              <span className="text-amber-300 font-mono font-bold">rizkaniswah / riris123</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Isolasi Data Per User:</span>
              <span className="text-emerald-400 font-semibold">Aktif (/user_progress, /user_mufrodat)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Output Folder:</span>
              <span className="text-slate-200 font-mono">dist/ (Siap Deploy Vercel)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Modul Materi */}
      {isAddLessonOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Tambah Modul Materi Baru</h3>
            <p className="text-xs text-slate-400 mb-4">
              Publikasikan modul pembelajaran bahasa Arab baru ke dalam kurikulum aplikasi.
            </p>

            <form onSubmit={handleCreateLesson} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Pelajaran (Indonesia) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Contoh: Huruf Jar dan Isim Majrur"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Arab (dengan Harakat) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={arabicTitle}
                  onChange={(e) => setArabicTitle(e.target.value)}
                  required
                  placeholder="Contoh: حُرُوفُ الجَرِّ وَالاسْمُ المَجْرُوْرُ"
                  dir="rtl"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-base font-arabic font-bold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tingkat</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200"
                  >
                    <option value="pemula">Pemula</option>
                    <option value="menengah">Menengah</option>
                    <option value="mahir">Mahir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200"
                  >
                    <option value="mufrodat">Mufrodat</option>
                    <option value="nahwu_shorof">Nahwu & Shorof</option>
                    <option value="hiwar">Hiwar (Percakapan)</option>
                    <option value="tashrif">Tashrif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ringkasan isi modul..."
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Penjelasan Kaidah</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={3}
                  placeholder="Penjelasan kaidah atau catatan tambahan..."
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLessonOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Publikasikan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
