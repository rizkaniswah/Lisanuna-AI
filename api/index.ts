import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// CORS & Preflight handling
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    appName: 'Lisanuna AI - Arabic Learning API',
  });
});

// Admin Authentication endpoint for rizkaniswah / riris123
app.post('/api/auth/admin-login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  }

  if (username === 'rizkaniswah' && password === 'riris123') {
    return res.json({
      success: true,
      message: 'Login Admin Berhasil',
      user: {
        uid: 'admin-rizkaniswah',
        email: 'rizkaniswah@lisanuna.edu',
        displayName: 'Ustadzah Rizka Niswah',
        username: 'rizkaniswah',
        isAdmin: true,
        role: 'Super Administrator & Pengajar Utama',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
      token: `admin-token-${Date.now()}`,
    });
  }

  return res.status(401).json({
    error: 'Username atau password admin tidak valid. Silakan periksa kembali.',
  });
});

// Gemini AI: Analisis Nahwu & I'rab Kalimat
app.post('/api/gemini/analyze-nahwu', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;
    if (!sentence) {
      return res.status(400).json({ error: 'Kalimat bahasa Arab wajib diisi' });
    }

    const ai = getGeminiClient();

    const prompt = `Sebagai pakar ilmu Nahwu dan Shorof bahasa Arab, analisislah kalimat/frasa berikut secara mendalam:
Kalimat: "${sentence}"

Berikan analisis dalam format JSON terstruktur dengan bidang:
- "vocalized": Kalimat dengan harakat lengkap dan sempurna.
- "translation": Terjemahan bahasa Indonesia yang tepat.
- "words": Array analisis setiap kata dalam kalimat, masing-masing berisi:
  - "word": Kata dalam aksara Arab berharakat.
  - "type": Jenis kata ("Isim" / "Fi'il" / "Harf").
  - "irab": Kedudukan I'rab (contoh: "Marfu' sebagai Mubtada", "Manshub sebagai Maf'ul Bih", "Majrur bi Harfi Jarr", dll).
  - "sign": Tanda I'rab (contoh: "Dhammah zhahirah", "Fathah", "Kasrah", "Tsubutun Nun", dll).
  - "explanation": Penjelasan ringkas kaidah nahwunya dalam bahasa Indonesia.
- "summary": Ringkasan kaidah nahwu yang terkandung dalam kalimat ini (1-2 kalimat).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vocalized: { type: Type.STRING },
            translation: { type: Type.STRING },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  type: { type: Type.STRING },
                  irab: { type: Type.STRING },
                  sign: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['word', 'type', 'irab', 'sign', 'explanation'],
              },
            },
            summary: { type: Type.STRING },
          },
          required: ['vocalized', 'translation', 'words', 'summary'],
        },
      },
    });

    const text = response.text || '{}';
    return res.json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Nahwu analysis error:', error);
    return res.status(500).json({
      error: error.message || 'Gagal menganalisis kalimat Nahwu dengan Gemini AI',
    });
  }
});

// Gemini AI: Tabel Tashrif Shorof Otomatis
app.post('/api/gemini/tashrif', async (req: Request, res: Response) => {
  try {
    const { rootWord } = req.body;
    if (!rootWord) {
      return res.status(400).json({ error: 'Kata dasar (Fi\'il) wajib diisi' });
    }

    const ai = getGeminiClient();

    const prompt = `Sebagai pakar ilmu Shorof, buatkan tabel Tashrif Istilahi lengkap untuk kata dasar: "${rootWord}".
Format JSON yang dihasilkan harus memiliki:
- "root": Kata dasar berharakat
- "bab": Wazan atau Bab (contoh: فَعَلَ - يَفْعُلُ Bab 1)
- "meaning": Arti kata dasar dalam bahasa Indonesia
- "forms":
  - "madhi": Fi'il Madhi berharakat (contoh: كَتَبَ)
  - "mudhari": Fi'il Mudhari' berharakat (contoh: يَكْتُبُ)
  - "mashdar": Mashdar (contoh: كِتَابَةً)
  - "isimFail": Isim Fa'il (contoh: كَاتِبٌ)
  - "isimMaful": Isim Maf'ul (contoh: مَكْتُوْبٌ)
  - "fiilAmr": Fi'il Amr (contoh: اُكْتُبْ)
  - "fiilNahy": Fi'il Nahy (contoh: لَا تَكْتُبْ)
  - "isimMakanZaman": Isim Makan/Zaman (contoh: مَكْتَبٌ)
  - "isimAlat": Isim Alat (jika ada, contoh: مِكْتَبٌ)
- "exampleSentence": Contoh kalimat menggunakan fi'il ini dengan harakat dan artinya.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            root: { type: Type.STRING },
            bab: { type: Type.STRING },
            meaning: { type: Type.STRING },
            forms: {
              type: Type.OBJECT,
              properties: {
                madhi: { type: Type.STRING },
                mudhari: { type: Type.STRING },
                mashdar: { type: Type.STRING },
                isimFail: { type: Type.STRING },
                isimMaful: { type: Type.STRING },
                fiilAmr: { type: Type.STRING },
                fiilNahy: { type: Type.STRING },
                isimMakanZaman: { type: Type.STRING },
                isimAlat: { type: Type.STRING },
              },
              required: ['madhi', 'mudhari', 'mashdar', 'isimFail', 'isimMaful', 'fiilAmr', 'fiilNahy'],
            },
            exampleSentence: { type: Type.STRING },
          },
          required: ['root', 'bab', 'meaning', 'forms', 'exampleSentence'],
        },
      },
    });

    const text = response.text || '{}';
    return res.json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Tashrif error:', error);
    return res.status(500).json({
      error: error.message || 'Gagal menghasilkan tabel Tashrif',
    });
  }
});

// Gemini AI: Generator Kuis Interaktif
app.post('/api/gemini/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic, level } = req.body;
    const ai = getGeminiClient();

    const prompt = `Buatlah 5 soal latihan pilihan ganda berkualitas tinggi untuk pembelajaran Bahasa Arab:
Topik: "${topic || 'Mufrodat dan Nahwu Dasar'}"
Tingkat: "${level || 'pemula'}"

Setiap soal harus memiliki:
- "question": Pertanyaan dalam Bahasa Indonesia atau Arab (contoh: Apa jamak dari kata كِتَابٌ? atau Manakah susunan Jumlah Fi'liyyah yang benar?)
- "arabicSnippet": Cuplikan teks Arab berharakat terkait soal (opsional/jika relevan).
- "options": 4 pilihan jawaban (A, B, C, D) dengan teks Arab/Indonesia yang jelas.
- "correctIndex": Angka indeks jawaban yang benar (0, 1, 2, atau 3).
- "explanation": Penjelasan mengapa jawaban tersebut benar dalam Bahasa Indonesia.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  arabicSnippet: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['quizTitle', 'questions'],
        },
      },
    });

    const text = response.text || '{}';
    return res.json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return res.status(500).json({
      error: error.message || 'Gagal membuat kuis latihan bahasa Arab',
    });
  }
});

// Gemini AI: Tutor Percakapan Interaktif (Hiwar & Tanya Jawab)
app.post('/api/gemini/tutor-chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Pesan wajib diisi' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah "Ustadz AI Lisanuna", tutor pembelajaran bahasa Arab yang ramah, berilmu, dan fasih.
Aturan respon:
1. Jika pengguna menyapa atau mengajak mengobrol dalam bahasa Arab (Hiwar), jawablah dengan bahasa Arab fushah berharakat lengkap, lalu sertakan terjemahan bahasa Indonesia dan kosakata kunci di bawahnya.
2. Jika ada kesalahan tata bahasa (nahwu/shorof/mufrodat) pada kalimat pengguna, berikan koreksi secara santun dan jelaskan alasannya dengan ringkas.
3. Jika pengguna bertanya tentang kaidah nahwu, shorof, atau mufrodat, jelaskan dengan contoh nyata yang berharakat.
4. Gunakan gaya mengajar yang menyemangati, mudah dipahami santri/pelajar pemula hingga menengah.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Pesan Pelajar: "${message}"`,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      reply: response.text || 'عَفْوًا، حَدَثَ خَطَأٌ فِي الْاِتِّصَالِ. (Maaf, terjadi gangguan koneksi)',
    });
  } catch (error: any) {
    console.error('Tutor chat error:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses percakapan dengan tutor AI',
    });
  }
});

// Gemini AI: Beri Harakat & Terjemahkan Teks Arab Gundul
app.post('/api/gemini/vocalize', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Teks bahasa Arab wajib diisi' });
    }

    const ai = getGeminiClient();

    const prompt = `Berikan harakat lengkap (tasykil) dan terjemahan bahasa Indonesia untuk teks Arab berikut:
Teks: "${text}"

Format JSON:
- "vocalized": Teks Arab dengan harakat lengkap yang benar sesuai kaidah Nahwu.
- "translation": Terjemahan bahasa Indonesia.
- "vocabularyList": Daftar kata penting beserta artinya.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vocalized: { type: Type.STRING },
            translation: { type: Type.STRING },
            vocabularyList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  indonesian: { type: Type.STRING },
                },
                required: ['arabic', 'indonesian'],
              },
            },
          },
          required: ['vocalized', 'translation'],
        },
      },
    });

    return res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Vocalize error:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memberi harakat pada teks Arab',
    });
  }
});

// Export default app tanpa app.listen (sesuai instruksi Vercel dan Prompt Pengguna)
export default app;
