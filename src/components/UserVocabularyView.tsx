import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Volume2,
  CheckCircle,
  Clock,
  Trash2,
  Sparkles,
  BookOpen,
  Search,
  Filter,
} from 'lucide-react';
import { UserMufrodat } from '../types';
import { speakArabic } from '../services/arabicService';

interface UserVocabularyViewProps {
  vocabularyList: UserMufrodat[];
  onAddVocab: (vocab: Omit<UserMufrodat, 'id' | 'ownerId' | 'createdAt'>) => Promise<void>;
  onToggleStatus: (vocabId: string, currentStatus: 'hafalan' | 'dikuasai') => Promise<void>;
  onDeleteVocab: (vocabId: string) => Promise<void>;
}

export const UserVocabularyView: React.FC<UserVocabularyViewProps> = ({
  vocabularyList,
  onAddVocab,
  onToggleStatus,
  onDeleteVocab,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'hafalan' | 'dikuasai'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for manual add
  const [arabic, setArabic] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [indonesian, setIndonesian] = useState('');
  const [category, setCategory] = useState('Umum');
  const [submitting, setSubmitting] = useState(false);

  const filtered = vocabularyList.filter((v) => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch =
      v.arabic.includes(searchQuery) ||
      v.indonesian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.transliteration || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabic.trim() || !indonesian.trim()) return;

    setSubmitting(true);
    try {
      await onAddVocab({
        arabic: arabic.trim(),
        transliteration: transliteration.trim(),
        indonesian: indonesian.trim(),
        category: category.trim(),
        status: 'hafalan',
      });
      setArabic('');
      setTransliteration('');
      setIndonesian('');
      setIsAddModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const masteredCount = vocabularyList.filter((v) => v.status === 'dikuasai').length;
  const learningCount = vocabularyList.filter((v) => v.status === 'hafalan').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-arabic text-2xl font-bold text-emerald-400">
              مُفْرَدَاتِي
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
              Bank Kosakata Pribadi (Firestore)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Kartu Mufrodat & Hafalan Anda</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Kosakata yang Anda simpan tersinkronisasi otomatis ke database Firestore. Latih hafalan
            Anda setiap hari untuk memperkuat perbendaharaan bahasa Arab.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kosakata</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-400 font-medium block">Total Tersimpan</span>
          <span className="text-2xl font-bold text-white mt-1 block">
            {vocabularyList.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-xs text-amber-400 font-medium block">Sedang Dihafal</span>
          <span className="text-2xl font-bold text-amber-300 mt-1 block">
            {learningCount}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-xs text-emerald-400 font-medium block">Sudah Dikuasai</span>
          <span className="text-2xl font-bold text-emerald-300 mt-1 block">
            {masteredCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata Arab atau terjemahan..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({vocabularyList.length})
          </button>
          <button
            onClick={() => setFilterStatus('hafalan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'hafalan'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hafalan ({learningCount})
          </button>
          <button
            onClick={() => setFilterStatus('dikuasai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'dikuasai'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dikuasai ({masteredCount})
          </button>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">Belum ada mufrodat</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Buka tab <strong>Materi & Hiwar</strong> dan klik tanda <strong>+</strong> pada kata,
            atau tambahkan kosakata baru secara manual.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md inline-flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Kosakata Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((vocab) => {
            const isMastered = vocab.status === 'dikuasai';

            return (
              <div
                key={vocab.id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {vocab.category || 'Mufrodat'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isMastered
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                      }`}
                    >
                      {isMastered ? 'Dikuasai ✓' : 'Sedang Dihafal'}
                    </span>
                  </div>

                  {/* Arabic Text & Sound */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-arabic text-3xl font-bold text-emerald-300">
                      {vocab.arabic}
                    </span>
                    <button
                      onClick={() => speakArabic(vocab.arabic)}
                      title="Dengarkan pelafalan Arab"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {vocab.transliteration && (
                    <p className="text-xs text-slate-400 italic font-mono mb-1">
                      {vocab.transliteration}
                    </p>
                  )}

                  <p className="text-sm font-semibold text-slate-100 mt-1">
                    {vocab.indonesian}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onToggleStatus(vocab.id!, vocab.status)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isMastered
                        ? 'bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300'
                        : 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300'
                    }`}
                  >
                    {isMastered ? (
                      <>
                        <Clock className="w-3.5 h-3.5" /> Ulangi Hafalan
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Tandai Dikuasai
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus mufrodat "${vocab.arabic}" dari simpanan Anda?`)) {
                        onDeleteVocab(vocab.id!);
                      }
                    }}
                    title="Hapus dari daftar"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tambah Kosakata Manual */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Tambah Kosakata ke Firestore</h3>
            <p className="text-xs text-slate-400 mb-4">
              Simpan kata bahasa Arab baru beserta terjemahannya untuk dihafal.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Teks Arab (dengan harakat) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={arabic}
                  onChange={(e) => setArabic(e.target.value)}
                  required
                  placeholder="Contoh: جَامِعَةٌ"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-lg font-arabic font-bold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Transliterasi Latin
                </label>
                <input
                  type="text"
                  value={transliteration}
                  onChange={(e) => setTransliteration(e.target.value)}
                  placeholder="Contoh: Jaami'atun"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Arti Bahasa Indonesia <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={indonesian}
                  onChange={(e) => setIndonesian(e.target.value)}
                  required
                  placeholder="Contoh: Universitas / Kampus"
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Contoh: Pendidikan, Rumah, Makanan..."
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !arabic.trim() || !indonesian.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Mufrodat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
