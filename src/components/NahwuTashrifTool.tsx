import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  BookOpen,
  Volume2,
  Table,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
} from 'lucide-react';
import { NahwuAnalysisResult, TashrifResult } from '../types';
import { speakArabic } from '../services/arabicService';

const SAMPLE_SENTENCES = [
  'يَقْرَأُ الطَّالِبُ الكِتَابَ فِي المَسْجِدِ',
  'العِلْمُ نُوْرٌ وَالجَهْلُ ظَلَامٌ',
  'ذَهَبَ أَحْمَدُ إِلَى السُّوْقِ صَبَاحًا',
  'إِنَّ اللهَ مَعَ الصَّابِرِيْنَ',
];

const SAMPLE_ROOTS = ['كَتَبَ', 'فَتَحَ', 'نَصَرَ', 'عَلِمَ', 'غَفَرَ', 'جَلَسَ'];

export const NahwuTashrifTool: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'nahwu' | 'tashrif' | 'vocalize'>('nahwu');

  // Nahwu states
  const [sentenceInput, setSentenceInput] = useState('يَقْرَأُ الطَّالِبُ الكِتَابَ فِي المَسْجِدِ');
  const [nahwuLoading, setNahwuLoading] = useState(false);
  const [nahwuResult, setNahwuResult] = useState<NahwuAnalysisResult | null>(null);
  const [nahwuError, setNahwuError] = useState<string | null>(null);

  // Tashrif states
  const [rootInput, setRootInput] = useState('كَتَبَ');
  const [tashrifLoading, setTashrifLoading] = useState(false);
  const [tashrifResult, setTashrifResult] = useState<TashrifResult | null>(null);
  const [tashrifError, setTashrifError] = useState<string | null>(null);

  // Vocalize states
  const [gundulInput, setGundulInput] = useState('ذهب الطالب الى المدرسة صباحا');
  const [vocalizeLoading, setVocalizeLoading] = useState(false);
  const [vocalizeResult, setVocalizeResult] = useState<any>(null);
  const [vocalizeError, setVocalizeError] = useState<string | null>(null);

  // Handle Nahwu analysis
  const handleAnalyzeNahwu = async (sentenceOverride?: string) => {
    const text = (sentenceOverride || sentenceInput).trim();
    if (!text) return;

    setNahwuLoading(true);
    setNahwuError(null);
    try {
      const response = await fetch('/api/gemini/analyze-nahwu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text }),
      });

      const res = await response.json();
      if (response.ok && res.success && res.data) {
        setNahwuResult(res.data);
      } else {
        setNahwuError(res.error || 'Gagal menganalisis I\'rab kalimat');
      }
    } catch (err: any) {
      setNahwuError(err.message || 'Koneksi ke server AI gagal');
    } finally {
      setNahwuLoading(false);
    }
  };

  // Handle Tashrif generation
  const handleGenerateTashrif = async (rootOverride?: string) => {
    const root = (rootOverride || rootInput).trim();
    if (!root) return;

    setTashrifLoading(true);
    setTashrifError(null);
    try {
      const response = await fetch('/api/gemini/tashrif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rootWord: root }),
      });

      const res = await response.json();
      if (response.ok && res.success && res.data) {
        setTashrifResult(res.data);
      } else {
        setTashrifError(res.error || 'Gagal menghasilkan tabel tashrif');
      }
    } catch (err: any) {
      setTashrifError(err.message || 'Koneksi ke server AI gagal');
    } finally {
      setTashrifLoading(false);
    }
  };

  // Handle Vocalize
  const handleVocalize = async () => {
    if (!gundulInput.trim()) return;
    setVocalizeLoading(true);
    setVocalizeError(null);
    try {
      const response = await fetch('/api/gemini/vocalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: gundulInput.trim() }),
      });
      const res = await response.json();
      if (response.ok && res.success && res.data) {
        setVocalizeResult(res.data);
      } else {
        setVocalizeError(res.error || 'Gagal memberi harakat');
      }
    } catch (err: any) {
      setVocalizeError(err.message || 'Koneksi AI gagal');
    } finally {
      setVocalizeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Navigation Pill */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-emerald-400" />
            Mesin Analis Nahwu & Shorof Gemini AI
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Bedah I'rab kalimat, tabel konjugasi fi'il lengkap, dan harakat teks Arab gundul secara otomatis
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('nahwu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'nahwu'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pembedah I'rab Nahwu
          </button>
          <button
            onClick={() => setActiveSubTab('tashrif')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'tashrif'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tabel Tashrif Shorof
          </button>
          <button
            onClick={() => setActiveSubTab('vocalize')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'vocalize'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pemberi Harakat Teks
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ANALIS I'RAB NAHWU */}
      {activeSubTab === 'nahwu' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Masukkan Kalimat Bahasa Arab untuk Dianalisis I'rabnya:
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="Contoh: يَقْرَأُ الطَّالِبُ الكِتَابَ فِي المَسْجِدِ"
                dir="rtl"
                className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-lg font-arabic font-bold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />

              <button
                onClick={() => handleAnalyzeNahwu()}
                disabled={nahwuLoading || !sentenceInput.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{nahwuLoading ? 'Menganalisis I\'rab...' : 'Bedah I\'rab Sekarang'}</span>
              </button>
            </div>

            {/* Sample Sentences Pills */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium">Contoh Cepat:</span>
              {SAMPLE_SENTENCES.map((samp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSentenceInput(samp);
                    handleAnalyzeNahwu(samp);
                  }}
                  className="text-xs font-arabic px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/60 transition-all"
                  dir="rtl"
                >
                  {samp}
                </button>
              ))}
            </div>
          </div>

          {nahwuError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{nahwuError}</span>
            </div>
          )}

          {/* Nahwu Analysis Output */}
          {nahwuResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Header result box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Kalimat Sempurna (مَضْبُوْطٌ بِالشَّكْلِ)
                  </span>
                  <p className="font-arabic text-2xl font-bold text-white mt-0.5">
                    {nahwuResult.vocalized}
                  </p>
                  <p className="text-xs text-slate-300 italic mt-1">
                    "{nahwuResult.translation}"
                  </p>
                </div>

                <button
                  onClick={() => speakArabic(nahwuResult.vocalized)}
                  title="Dengarkan pengucapan kalimat"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Audio</span>
                </button>
              </div>

              {/* Table of words breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold text-right font-arabic">الكَلِمَةُ (Kata)</th>
                      <th className="py-3 px-4 font-semibold">Jenis Kata</th>
                      <th className="py-3 px-4 font-semibold">Kedudukan I'rab</th>
                      <th className="py-3 px-4 font-semibold">Tanda I'rab</th>
                      <th className="py-3 px-4 font-semibold">Penjelasan Kaidah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {nahwuResult.words.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3.5 px-4 font-arabic text-xl font-bold text-emerald-300 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => speakArabic(row.word)}
                              className="p-1 rounded text-slate-500 hover:text-emerald-400"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span>{row.word}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              row.type.toLowerCase().includes('isim')
                                ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                                : row.type.toLowerCase().includes('fi')
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">{row.irab}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-mono">{row.sign}</td>
                        <td className="py-3.5 px-4 text-slate-300 leading-relaxed">
                          {row.explanation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary note */}
              {nahwuResult.summary && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Kesimpulan Kaidah: </strong>
                    {nahwuResult.summary}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: TABEL TASHRIF SHOROF */}
      {activeSubTab === 'tashrif' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Ketik Kata Kerja Dasar (Fi'il Madhi):
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={rootInput}
                onChange={(e) => setRootInput(e.target.value)}
                placeholder="Contoh: كَتَبَ / فَتَحَ / نَصَرَ"
                dir="rtl"
                className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xl font-arabic font-bold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />

              <button
                onClick={() => handleGenerateTashrif()}
                disabled={tashrifLoading || !rootInput.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all shrink-0"
              >
                <Table className="w-4 h-4" />
                <span>{tashrifLoading ? 'Menyusun Tabel...' : 'Buat Tabel Tashrif'}</span>
              </button>
            </div>

            {/* Quick Roots */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium">Contoh Kata:</span>
              {SAMPLE_ROOTS.map((root, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setRootInput(root);
                    handleGenerateTashrif(root);
                  }}
                  className="text-xs font-arabic px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/60 transition-all"
                  dir="rtl"
                >
                  {root}
                </button>
              ))}
            </div>
          </div>

          {tashrifError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{tashrifError}</span>
            </div>
          )}

          {tashrifResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-3xl font-bold text-emerald-300">
                      {tashrifResult.root}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {tashrifResult.bab}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Arti: <strong className="text-white">{tashrifResult.meaning}</strong>
                  </p>
                </div>
                <button
                  onClick={() => speakArabic(tashrifResult.root)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-300"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* 8-Box Tashrif Istilahi Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    الفِعْلُ المَاضِي (Madhi)
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.madhi}
                  </span>
                  <span className="text-[10px] text-slate-500">Telah dilakukan</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    الفِعْلُ المُضَارِعُ (Mudhari')
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.mudhari}
                  </span>
                  <span className="text-[10px] text-slate-500">Sedang/akan dilakukan</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    المَصْدَرُ (Mashdar)
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.mashdar}
                  </span>
                  <span className="text-[10px] text-slate-500">Kata benda tindakan</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    اسْمُ الفَاعِلِ (Fa'il)
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.isimFail}
                  </span>
                  <span className="text-[10px] text-slate-500">Pelaku tindakan</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    اسْمُ المَفْعُوْلِ (Maf'ul)
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.isimMaful}
                  </span>
                  <span className="text-[10px] text-slate-500">Objek penderita</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    فِعْلُ الأَمْرِ (Amr)
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.fiilAmr}
                  </span>
                  <span className="text-[10px] text-slate-500">Kata kerja perintah</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    فِعْلُ النَّهْيِ (Nahy)
                  </span>
                  <span className="font-arabic text-2xl font-bold text-rose-300 block my-1">
                    {tashrifResult.forms.fiilNahy}
                  </span>
                  <span className="text-[10px] text-slate-500">Larangan (Janganlah)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    اسْمُ المَكَانِ / الزَّمَانِ
                  </span>
                  <span className="font-arabic text-2xl font-bold text-emerald-300 block my-1">
                    {tashrifResult.forms.isimMakanZaman || '-'}
                  </span>
                  <span className="text-[10px] text-slate-500">Tempat/waktu perbuatan</span>
                </div>
              </div>

              {/* Example sentence */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Contoh Penerapan Kalimat:
                  </span>
                  <p className="font-arabic text-lg font-bold text-white mt-1">
                    {tashrifResult.exampleSentence}
                  </p>
                </div>
                <button
                  onClick={() => speakArabic(tashrifResult.exampleSentence)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-400"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: VOCALIZE GUNDUL */}
      {activeSubTab === 'vocalize' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Ketik Teks Arab Gundul (Tanpa Harakat):
            </label>
            <textarea
              value={gundulInput}
              onChange={(e) => setGundulInput(e.target.value)}
              rows={3}
              placeholder="Contoh: كتب الطالب الدرس في الفصل ثم رجع الى بيته"
              dir="rtl"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-lg font-arabic font-semibold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right leading-loose"
            />

            <div className="mt-3 flex items-center justify-end">
              <button
                onClick={handleVocalize}
                disabled={vocalizeLoading || !gundulInput.trim()}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{vocalizeLoading ? 'Memberi Harakat...' : 'Beri Harakat & Terjemahkan'}</span>
              </button>
            </div>
          </div>

          {vocalizeError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{vocalizeError}</span>
            </div>
          )}

          {vocalizeResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Hasil Teks Berharakat Penuh:
                  </span>
                  <button
                    onClick={() => speakArabic(vocalizeResult.vocalized)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-400 text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan</span>
                  </button>
                </div>
                <p className="font-arabic text-2xl font-bold text-white leading-loose text-right" dir="rtl">
                  {vocalizeResult.vocalized}
                </p>
                <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800">
                  <strong>Terjemahan: </strong>
                  {vocalizeResult.translation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
