import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { speakArabic } from '../services/arabicService';

interface QuizViewProps {
  onAwardXP: (points: number) => Promise<void>;
}

export const QuizView: React.FC<QuizViewProps> = ({ onAwardXP }) => {
  const [topic, setTopic] = useState('Mufrodat Sehari-hari & Makna');
  const [level, setLevel] = useState('pemula');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<{
    quizTitle: string;
    questions: QuizQuestion[];
  } | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSelectedAnswers({});
    setShowResults(false);
    try {
      const response = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level }),
      });

      const res = await response.json();
      if (response.ok && res.success && res.data) {
        setQuizData(res.data);
      } else {
        setErrorMsg(res.error || 'Gagal membuat soal kuis');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Koneksi ke server AI gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let correct = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmitQuiz = async () => {
    setShowResults(true);
    const score = calculateScore();
    const pointsWon = score * 10;
    if (pointsWon > 0) {
      await onAwardXP(pointsWon);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-arabic text-2xl font-bold text-amber-400">
              الاِخْتِبَارُ
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
              Kuis Adaptif Gemini 3.8 Flash
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Uji Pemahaman Bahasa Arab Anda</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Hasilkan 5 butir soal pilihan ganda dinamis tentang mufrodat, nahwu, atau percakapan. Dapatkan +10 XP untuk setiap jawaban benar!
          </p>
        </div>

        {/* Generator Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Mufrodat Sehari-hari & Makna">Mufrodat Sehari-hari</option>
            <option value="Kaidah Nahwu: Jumlah Ismiyyah & Fi'liyyah">Kaidah Nahwu Dasar</option>
            <option value="Hiwar & Percakapan Praktis">Hiwar & Percakapan</option>
            <option value="Tashrif Fi'il Tsulatsi Mujarrad">Tashrif Shorof</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="pemula">Tingkat Pemula</option>
            <option value="menengah">Tingkat Menengah</option>
          </select>

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Menyusun Soal...' : 'Buat Kuis Baru'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Default placeholder if no quiz active */}
      {!quizData && !loading && (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">Siap Menguji Kemampuan?</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Pilih topik materi di atas lalu klik <strong>"Buat Kuis Baru"</strong> untuk memulai latihan interaktif bertenaga AI.
          </p>
          <button
            onClick={handleGenerateQuiz}
            className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Mulai Kuis Sekarang
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <div className="inline-block w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-200">
            Gemini AI sedang meracik 5 soal kuis bahasa Arab...
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Topik: {topic} ({level})
          </p>
        </div>
      )}

      {/* Active Quiz List */}
      {quizData && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{quizData.quizTitle}</span>
              <span className="text-xs text-slate-400">
                ({Object.keys(selectedAnswers).length}/{quizData.questions.length} terjawab)
              </span>
            </h3>

            {showResults && (
              <div className="px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Skor: {calculateScore()} / {quizData.questions.length} Benar (+{calculateScore() * 10} XP)</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {quizData.questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className={`bg-slate-900 border rounded-3xl p-6 transition-all ${
                    showResults
                      ? isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-rose-500/40 bg-rose-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-relaxed">
                          {q.question}
                        </h4>
                        {q.arabicSnippet && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-arabic text-xl font-bold text-emerald-300">
                              {q.arabicSnippet}
                            </span>
                            <button
                              onClick={() => speakArabic(q.arabicSnippet!)}
                              className="p-1 rounded text-slate-500 hover:text-emerald-400"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {showResults && (
                      <div>
                        {isCorrect ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Benar (+10 XP)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Salah
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isSelected && !showResults) {
                        optionStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-semibold';
                      }

                      if (showResults) {
                        if (optIdx === q.correctIndex) {
                          optionStyle = 'bg-emerald-600/25 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-rose-600/25 border-rose-500 text-rose-200';
                        } else {
                          optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          disabled={showResults}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-slate-800/80 text-[11px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="font-arabic text-base sm:text-sm">{opt}</span>
                          </div>
                          {showResults && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {showResults && q.explanation && (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300">Penjelasan Kaidah: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Reset Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {!showResults ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md disabled:opacity-40 transition-all"
              >
                Kumpulkan Jawaban & Lihat Skor
              </button>
            ) : (
              <button
                onClick={handleGenerateQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Latihan Soal Lainnya
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
