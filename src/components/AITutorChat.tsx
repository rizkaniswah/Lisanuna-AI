import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Volume2,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { speakArabic } from '../services/arabicService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  arabicSnippet?: string;
  timestamp: string;
}

const ARABIC_PROMPTS = [
  'Ayo kita latihan percakapan (Hiwar) perkenalan dalam bahasa Arab!',
  'Jelaskan perbedaan Isim Mufrad, Mutsanna, dan Jamak beserta contohnya.',
  'Bagaimana rumus menyusun Jumlah Ismiyyah yang benar?',
  'Apa saja macam-macam huruf Jer dan bagaimana contoh kalimatnya?',
];

export const AITutorChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'أَهْلًا وَسَهْلًا بِكَ يَا طَالِبَ العِلْمِ!\n(Selamat datang wahai penuntut ilmu!)\n\nSaya **Ustadz AI Lisanuna**, tutor bahasa Arab virtual Anda. Anda dapat berlatih percakapan (Hiwar), menanyakan kaidah Nahwu & Shorof, atau meminta contoh kalimat berharakat. Silakan tanyakan apa saja!',
      arabicSnippet: 'أَهْلًا وَسَهْلًا بِكَ يَا طَالِبَ العِلْمِ',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const res = await response.json();
      if (response.ok && res.success && res.reply) {
        // Extract Arabic snippets if present for quick audio playback
        const arabicMatch = res.reply.match(/[\u0600-\u06FF\s،؛؟!]+/);

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.reply,
            arabicSnippet: arabicMatch ? arabicMatch[0].trim() : undefined,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Maaf, terjadi kendala: ${res.error || 'Gagal memproses pesan'}`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Koneksi ke tutor AI terputus. Silakan coba sesaat lagi.',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[750px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-1 ring-white/20">
            <span className="font-arabic font-bold text-lg">أ</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Ustadz AI Lisanuna</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Tutor Fushah Real-time
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Teman latihan percakapan, tanya kaidah Nahwu, dan koreksi tata bahasa
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shrink-0 mt-0.5 font-arabic font-bold text-sm">
                ل
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {/* Play audio button if message has Arabic text */}
              {m.role === 'assistant' && m.arabicSnippet && (
                <div className="mb-2 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    Lafaz Arab Terdeteksi
                  </span>
                  <button
                    onClick={() => speakArabic(m.arabicSnippet!)}
                    className="p-1 rounded bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 text-[11px] flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan Audio</span>
                  </button>
                </div>
              )}

              <div className="font-sans leading-relaxed">{m.content}</div>

              <div
                className={`text-[10px] mt-2 font-mono ${
                  m.role === 'user' ? 'text-emerald-200 text-right' : 'text-slate-500 text-left'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 shrink-0 mt-0.5 font-bold text-xs">
                {(user?.displayName || user?.username || 'S')[0].toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 pl-11">
            <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            <span>Ustadz AI sedang menyiapkan penjelasan...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/80 flex flex-wrap gap-1.5">
        {ARABIC_PROMPTS.map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSend(promptText)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-emerald-200 border border-slate-700/60 transition-all text-left truncate max-w-xs"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan kaidah Nahwu, terjemahkan kalimat, atau sapa dalam bahasa Arab..."
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white disabled:opacity-40 transition-all shadow-md shadow-emerald-500/25 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
