import React, { useState } from 'react';
import {
  X,
  Volume2,
  CheckCircle,
  Plus,
  BookOpen,
  MessageSquare,
  Sparkles,
  Award,
  Check,
} from 'lucide-react';
import { ArabicLesson, UserProgress } from '../types';
import { speakArabic } from '../services/arabicService';

interface LessonDetailModalProps {
  lesson: ArabicLesson;
  onClose: () => void;
  isCompleted: boolean;
  onMarkComplete: (lessonId: string) => Promise<void>;
  onSaveVocab: (vocab: {
    arabic: string;
    transliteration?: string;
    indonesian: string;
    category: string;
  }) => Promise<void>;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  onClose,
  isCompleted,
  onMarkComplete,
  onSaveVocab,
}) => {
  const [marking, setMarking] = useState(false);
  const [savedItems, setSavedItems] = useState<Record<number, boolean>>({});

  const handleSaveItem = async (
    item: { arabic: string; transliteration?: string; indonesian: string },
    index: number
  ) => {
    try {
      await onSaveVocab({
        arabic: item.arabic,
        transliteration: item.transliteration,
        indonesian: item.indonesian,
        category: lesson.category,
      });
      setSavedItems((prev) => ({ ...prev, [index]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async () => {
    setMarking(true);
    try {
      await onMarkComplete(lesson.id);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
              <span className="font-arabic">اقْرَأْ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase">
                  {lesson.level}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {lesson.category}
                </span>
              </div>
              <p className="font-arabic text-xl font-bold text-emerald-400/90 mt-0.5">
                {lesson.arabicTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              disabled={marking || isCompleted}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
                isCompleted
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Sudah Selesai (+25 XP)' : 'Selesaikan Materi'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Explanation Box */}
          {lesson.explanation && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Kaidah & Penjelasan Materi
              </h4>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {lesson.explanation}
              </p>
            </div>
          )}

          {/* Vocabulary Items Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Daftar Kosakata & Contoh Kalimat</span>
                <span className="text-xs font-normal text-slate-400">
                  ({lesson.items.length} kosakata)
                </span>
              </h4>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Klik ikon 🔊 untuk mendengarkan lafaz Arab asli
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {lesson.items.map((item, idx) => {
                const isSaved = savedItems[idx];

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Arabic Script & Sound Button */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-arabic text-2xl font-bold text-emerald-300 tracking-wide">
                          {item.arabic}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => speakArabic(item.arabic)}
                            title="Dengarkan pengucapan fushah"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 transition-all"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleSaveItem(item, idx)}
                            disabled={isSaved}
                            title="Simpan ke daftar kosakataku"
                            className={`p-2 rounded-xl text-xs transition-all ${
                              isSaved
                                ? 'bg-emerald-600/20 text-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Transliteration */}
                      {item.transliteration && (
                        <p className="text-xs text-slate-400 italic font-mono mb-1">
                          {item.transliteration}
                        </p>
                      )}

                      {/* Indonesian Meaning */}
                      <p className="text-xs font-semibold text-slate-200">
                        {item.indonesian}
                      </p>
                    </div>

                    {/* Example Sentence */}
                    {item.exampleArabic && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/60">
                        <div className="flex items-center justify-between text-right">
                          <span className="font-arabic text-base font-semibold text-emerald-400/90">
                            {item.exampleArabic}
                          </span>
                          <button
                            onClick={() => speakArabic(item.exampleArabic!)}
                            className="p-1 rounded text-slate-500 hover:text-emerald-400"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        {item.exampleIndo && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            "{item.exampleIndo}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dialogue Section (Hiwar) */}
          {lesson.dialogue && lesson.dialogue.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Naskah Percakapan (الحِوَارُ)</span>
              </h4>

              <div className="space-y-3">
                {lesson.dialogue.map((diag, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-amber-400 block">
                        {diag.speaker}:
                      </span>
                      <p className="font-arabic text-lg font-bold text-white">
                        {diag.arabic}
                      </p>
                      {diag.transliteration && (
                        <p className="text-xs text-slate-400 italic font-mono">
                          {diag.transliteration}
                        </p>
                      )}
                      <p className="text-xs text-slate-300">{diag.indonesian}</p>
                    </div>

                    <button
                      onClick={() => speakArabic(diag.arabic)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 shrink-0 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
