import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ArabicLesson, UserProgress, UserMufrodat } from '../types';

export const INITIAL_LESSONS: ArabicLesson[] = [
  {
    id: 'lesson-1',
    title: 'Perkenalan & Ucapan Salam',
    arabicTitle: 'التَّعَارُفُ وَالتَّحِيَّاتُ',
    level: 'pemula',
    category: 'mufrodat',
    description: 'Kosakata dasar dan ungkapan sopan santun untuk menyapa dan berkenalan dalam bahasa Arab fushah.',
    items: [
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ',
        transliteration: 'Assalamu \'alaikum',
        indonesian: 'Semoga keselamatan tercurah atasmu (Salam pembuka)',
        exampleArabic: 'السَّلَامُ عَلَيْكُمْ يَا أَخِي',
        exampleIndo: 'Salam bagimu wahai saudaraku',
      },
      {
        arabic: 'صَبَاحَ الخَيْرِ',
        transliteration: 'Shabaahal khoir',
        indonesian: 'Selamat pagi',
        exampleArabic: 'صَبَاحَ الخَيْرِ يَا أُسْتَاذُ',
        exampleIndo: 'Selamat pagi wahai guru',
      },
      {
        arabic: 'صَبَاحَ النُّوْرِ',
        transliteration: 'Shabaahan nuur',
        indonesian: 'Selamat pagi (jawaban salam pagi)',
        exampleArabic: 'صَبَاحَ النُّوْرِ وَالسُّرُوْرِ',
        exampleIndo: 'Selamat pagi yang bercahaya dan berbahagia',
      },
      {
        arabic: 'مَسَاءَ الخَيْرِ',
        transliteration: 'Masaa-al khoir',
        indonesian: 'Selamat sore / malam',
        exampleArabic: 'مَسَاءَ الخَيْرِ يَا صَدِيْقِي',
        exampleIndo: 'Selamat sore wahai sahabatku',
      },
      {
        arabic: 'كَيْفَ حَالُكَ؟',
        transliteration: 'Kaifa haaluka?',
        indonesian: 'Bagaimana kabarmu? (pria)',
        exampleArabic: 'كَيْفَ حَالُكَ اليَوْمَ؟',
        exampleIndo: 'Bagaimana kabarmu hari ini?',
      },
      {
        arabic: 'أَنَا بِخَيْرٍ، الحَمْدُ للهِ',
        transliteration: 'Ana bikhoirin, alhamdulillah',
        indonesian: 'Saya baik-baik saja, segala puji bagi Allah',
        exampleArabic: 'الحَمْدُ للهِ أَنَا بِخَيْرٍ وَعَافِيَةٍ',
        exampleIndo: 'Alhamdulillah saya dalam keadaan baik dan sehat',
      },
      {
        arabic: 'مَا اسْمُكَ؟',
        transliteration: 'Mas-muka?',
        indonesian: 'Siapa namamu? (pria)',
        exampleArabic: 'مَا اسْمُكَ الكَرِيْمُ؟',
        exampleIndo: 'Siapa nama lengkapmu yang mulia?',
      },
      {
        arabic: 'اسْمِي...',
        transliteration: 'Ismii...',
        indonesian: 'Nama saya adalah...',
        exampleArabic: 'اسْمِي رِضْوَانُ، وَأَنَا طَالِبٌ',
        exampleIndo: 'Nama saya Ridwan, dan saya seorang pelajar',
      },
      {
        arabic: 'شُكْرًا جَزِيْلًا',
        transliteration: 'Syukran jaziilan',
        indonesian: 'Terima kasih banyak',
        exampleArabic: 'شُكْرًا جَزِيْلًا عَلَى مُسَاعَدَتِكَ',
        exampleIndo: 'Terima kasih banyak atas bantuanmu',
      },
      {
        arabic: 'عَفْوًا',
        transliteration: '\'Afwan',
        indonesian: 'Sama-sama / Maaf',
        exampleArabic: 'عَفْوًا، لَا شُكْرَ عَلَى وَاجِبٍ',
        exampleIndo: 'Sama-sama, tidak perlu berterima kasih untuk suatu kewajiban',
      },
    ],
    dialogue: [
      {
        speaker: 'Ahmad',
        arabic: 'السَّلَامُ عَلَيْكُمْ، أَنَا أَحْمَدُ، مَا اسْمُكَ؟',
        transliteration: 'Assalamu \'alaikum, ana Ahmad, masmuka?',
        indonesian: 'Assalamu \'alaikum, saya Ahmad, siapa namamu?',
      },
      {
        speaker: 'Zaid',
        arabic: 'وَعَلَيْكُمُ السَّلَامُ، اسْمِي زَيْدٌ. فُرْصَةٌ سَعِيْدَةٌ!',
        transliteration: 'Wa \'alaikumussalam, ismi Zaid. Furshah sa\'idah!',
        indonesian: 'Wa \'alaikumussalam, nama saya Zaid. Senang bertemu denganmu!',
      },
      {
        speaker: 'Ahmad',
        arabic: 'تَشَرَّفْنَا يَا زَيْدُ، كَيْفَ حَالُكَ؟',
        transliteration: 'Tasyarrafna ya Zaid, kaifa haaluk?',
        indonesian: 'Sebuah kehormatan wahai Zaid, bagaimana kabarmu?',
      },
      {
        speaker: 'Zaid',
        arabic: 'بِخَيْرٍ وَالحَمْدُ للهِ، وَأَنْتَ؟',
        transliteration: 'Bikhoirin walhamdulillah, wa anta?',
        indonesian: 'Baik, alhamdulillah, dan kamu?',
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Pembagian Kata: Isim, Fi\'il, & Harf',
    arabicTitle: 'أَقْسَامُ الكَلَامِ: الاِسْمُ، الفِعْلُ، الحَرْفُ',
    level: 'pemula',
    category: 'nahwu_shorof',
    description: 'Pondasi utama tata bahasa Arab (Nahwu). Memahami ciri-ciri isim (kata benda/sifat), fi\'il (kata kerja), dan harf (huruf/kata tugas).',
    explanation: 'Dalam bahasa Arab, seluruh kalimat tersusun dari 3 jenis kata:\n1. Isim (الِاسْمُ): Kata yang menunjukkan benda, orang, sifat, atau tempat tanpa terikat waktu. Cirinya: berharakat tanwin, diawali Alif Lam (ال), atau diawali huruf jer.\n2. Fi\'il (الفِعْلُ): Kata kerja yang terikat dengan waktu (Madhi = lampau, Mudhari\' = sekarang/akan datang, Amr = perintah).\n3. Harf (الحَرْفُ): Kata yang tidak memiliki arti sempurna kecuali bersambung dengan kata lain (seperti مِنْ, إِلَى, فِي, عَلَى).',
    items: [
      {
        arabic: 'كِتَابٌ',
        transliteration: 'Kitaabun',
        indonesian: 'Buku (Contoh Isim: berharakat tanwin)',
        exampleArabic: 'هَذَا كِتَابٌ مُفِيْدٌ',
        exampleIndo: 'Ini adalah buku yang bermanfaat',
      },
      {
        arabic: 'قَرَأَ - يَقْرَأُ',
        transliteration: 'Qara-a - yaqra-u',
        indonesian: 'Telah membaca - Sedang membaca (Contoh Fi\'il)',
        exampleArabic: 'قَرَأَ مُحَمَّدٌ القُرْآنَ',
        exampleIndo: 'Muhammad telah membaca Al-Qur\'an',
      },
      {
        arabic: 'فِي',
        transliteration: 'Fii',
        indonesian: 'Di dalam (Contoh Harf / Kata Tugas)',
        exampleArabic: 'القَلَمُ فِي الحَقِيْبَةِ',
        exampleIndo: 'Pena itu ada di dalam tas',
      },
      {
        arabic: 'مَسْجِدٌ',
        transliteration: 'Masjidun',
        indonesian: 'Masjid (Isim tempat)',
        exampleArabic: 'ذَهَبَ عَلِيٌّ إِلَى المَسْجِدِ',
        exampleIndo: 'Ali pergi ke masjid',
      },
      {
        arabic: 'كَتَبَ - يَكْتُبُ',
        transliteration: 'Kataba - yaktubu',
        indonesian: 'Telah menulis - Sedang menulis (Fi\'il)',
        exampleArabic: 'يَكْتُبُ التِّلْمِيْذُ الدَّرْسَ',
        exampleIndo: 'Murid itu sedang menulis pelajaran',
      },
    ],
  },
  {
    id: 'lesson-3',
    title: 'Jumlah Ismiyyah: Mubtada\' & Khabar',
    arabicTitle: 'الجُمْلَةُ الاِسْمِيَّةُ (المُبْتَدَأُ وَالخَبَرُ)',
    level: 'pemula',
    category: 'nahwu_shorof',
    description: 'Kalimat yang diawali dengan Isim. Terdiri dari Mubtada\' (pokok kalimat/subjek) dan Khabar (keterangan/predikat). Keduanya berharakat akhir Dhammah (Marfu\').',
    explanation: 'Rumus Jumlah Ismiyyah:\n[ Mubtada\' (Subjek Ber-Alif Lam) ] + [ Khabar (Predikat Tanpa Alif Lam ber-Tanwin) ]\nKeduanya harus marfu\' (umumnya diakhiri harakat dhammah) dan selaras dalam jenis (mudzakkar/muannats).',
    items: [
      {
        arabic: 'البَيْتُ نَظِيْفٌ',
        transliteration: 'Al-baitu nazhiifun',
        indonesian: 'Rumah itu bersih (البَيْتُ = Mubtada\', نَظِيْفٌ = Khabar)',
        exampleArabic: 'البَيْتُ نَظِيْفٌ وَجَمِيْلٌ',
        exampleIndo: 'Rumah itu bersih dan indah',
      },
      {
        arabic: 'العِلْمُ نُوْرٌ',
        transliteration: 'Al-\'ilmu nuurun',
        indonesian: 'Ilmu itu adalah cahaya',
        exampleArabic: 'العِلْمُ نُوْرٌ يَهْدِي القُلُوْبَ',
        exampleIndo: 'Ilmu itu cahaya yang memberi petunjuk hati',
      },
      {
        arabic: 'المَدْرَسَةُ كَبِيْرَةٌ',
        transliteration: 'Al-m मदrasatu kabiiratun',
        indonesian: 'Sekolah itu besar (Bentuk Muannats/feminin)',
        exampleArabic: 'المَدْرَسَةُ كَبِيْرَةٌ وَوَاسِعَةٌ',
        exampleIndo: 'Sekolah itu besar dan luas',
      },
      {
        arabic: 'الطَّالِبُ مُجْتَهِدٌ',
        transliteration: 'Ath-thaalibu mujtahidun',
        indonesian: 'Siswa itu rajin',
        exampleArabic: 'الطَّالِبُ مُجْتَهِدٌ فِي دِرَاسَتِهِ',
        exampleIndo: 'Siswa itu rajin dalam belajarnya',
      },
    ],
  },
  {
    id: 'lesson-4',
    title: 'Percakapan di Perpustakaan (Hiwar)',
    arabicTitle: 'حِوَارٌ فِي المَكْتَبَةِ',
    level: 'menengah',
    category: 'hiwar',
    description: 'Praktik percakapan situasional saat mencari buku, meminjam, dan berinteraksi dengan pustakawan.',
    items: [
      {
        arabic: 'مَكْتَبَةٌ',
        transliteration: 'Maktabatun',
        indonesian: 'Perpustakaan / Toko buku',
      },
      {
        arabic: 'مُعْجَمٌ / قَامُوْسٌ',
        transliteration: 'Mu\'jamun / Qoomuusun',
        indonesian: 'Kamus bahasa',
      },
      {
        arabic: 'أَبْحَثُ عَنْ...',
        transliteration: 'Abhatsu \'an...',
        indonesian: 'Saya sedang mencari...',
      },
      {
        arabic: 'أَسْتَعِيْرُ',
        transliteration: 'Asta\'iiru',
        indonesian: 'Saya meminjam',
      },
    ],
    dialogue: [
      {
        speaker: 'Pelajar',
        arabic: 'مَرْحَبًا يَا أُمَيْنَةَ المَكْتَبَةِ، أَبْحَثُ عَنْ مُعْجَمِ اللُّغَةِ العَرَبِيَّةِ.',
        transliteration: 'Marhaban ya aminatal maktabah, abhatsu \'an mu\'jamil lughatil \'arabiyyah.',
        indonesian: 'Halo wahai penjaga perpustakaan, saya sedang mencari kamus bahasa Arab.',
      },
      {
        speaker: 'Petugas',
        arabic: 'أَهْلًا بِكَ! المُعْجَمُ مَوْجُوْدٌ فِي الرَّفِّ الثَّالِثِ هُنَاكَ.',
        transliteration: 'Ahlan bika! Al-mu\'jamu maujuudun fir-raffits tsalits hunaak.',
        indonesian: 'Selamat datang! Kamus itu ada di rak ketiga di sebelah sana.',
      },
      {
        speaker: 'Pelajar',
        arabic: 'هَلْ يُمْكِنُنِي أَنْ أَسْتَعِيْرَهُ لِمُدَّةِ أُسْبُوْعٍ؟',
        transliteration: 'Hal yumkinuni an asta\'iirahu limuddati usbuu\'?',
        indonesian: 'Apakah saya boleh meminjamnya selama satu minggu?',
      },
      {
        speaker: 'Petugas',
        arabic: 'نَعَمْ بِالتَّأْكِيْدِ، قَدِّمْ بِطَاقَتَكَ الجَامِعِيَّةَ مِنْ فَضْلِكَ.',
        transliteration: 'Na\'am bitta\'kiid, qaddim bithaaqatakal jaami\'iyyata min fadlik.',
        indonesian: 'Ya tentu saja, tolong tunjukkan kartu mahasiswamu.',
      },
    ],
  },
  {
    id: 'lesson-5',
    title: 'Tashrif Fi\'il Tsulatsi (Shorof)',
    arabicTitle: 'تَصْرِيْفُ الفِعْلِ الثُّلَاثِيِّ المُجَرَّدِ',
    level: 'menengah',
    category: 'tashrif',
    description: 'Memahami perubahan bentuk kata kerja dari Madhi, Mudhari\', Mashdar, Isim Fa\'il, hingga Fi\'il Amr.',
    items: [
      {
        arabic: 'نَصَرَ - يَنْصُرُ - نَصْرًا',
        transliteration: 'Nashara - Yanshuru - Nashran',
        indonesian: 'Menolong (Wazan فَعَلَ - يَفْعُلُ)',
        exampleArabic: 'نَصَرَ المُسْلِمُ أَخَاهُ',
        exampleIndo: 'Seorang muslim telah menolong saudaranya',
      },
      {
        arabic: 'فَتَحَ - يَفْتَحُ - فَتْحًا',
        transliteration: 'Fataha - Yaftahu - Fathan',
        indonesian: 'Membuka (Wazan فَعَلَ - يَفْعَلُ)',
        exampleArabic: 'فَتَحَ الوَلَدُ البَابَ',
        exampleIndo: 'Anak itu telah membuka pintu',
      },
      {
        arabic: 'ضَرَبَ - يَضْرِبُ - ضَرْبًا',
        transliteration: 'Dharaba - Yadhribu - Dharban',
        indonesian: 'Memukul / Memberi permisalan (Wazan فَعَلَ - يَفْعِلُ)',
        exampleArabic: 'ضَرَبَ اللهُ مَثَلًا',
        exampleIndo: 'Allah telah membuat suatu perumpamaan',
      },
      {
        arabic: 'عَلِمَ - يَعْلَمُ - عِلْمًا',
        transliteration: '\'Alima - Ya\'lamu - \'Ilman',
        indonesian: 'Mengetahui / Memahami (Wazan فَعِلَ - يَفْعَلُ)',
        exampleArabic: 'عَلِمَ الإِنْسَانُ مَا لَمْ يَعْلَمْ',
        exampleIndo: 'Manusia mengetahui apa yang belum diketahuinya',
      },
    ],
  },
];

// Audio Speech Synthesizer for Native Arabic Voice
export function speakArabic(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85; // slightly slower for better Arabic pronunciation clarity
  utterance.pitch = 1.0;

  // Try to pick an Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// ---------------------------------------------------------------------------
// Firestore: User Progress Management
// ---------------------------------------------------------------------------
const PROGRESS_COLLECTION = 'user_progress';

export function subscribeUserProgress(
  userId: string,
  onUpdate: (progress: UserProgress) => void,
  onError?: (err: any) => void
) {
  const defaultProgress: UserProgress = {
    ownerId: userId,
    completedLessonIds: [],
    xp: 50,
    streakDays: 1,
    quizzesTaken: 0,
    lastStudiedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, PROGRESS_COLLECTION, userId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as UserProgress);
        } else {
          // Initialize user progress
          setDoc(docRef, defaultProgress).catch(() => {});
          onUpdate(defaultProgress);
        }
      },
      (error) => {
        console.warn('User progress listener notice, using local cache:', error.message);
        const cached = localStorage.getItem(`progress_${userId}`);
        if (cached) {
          onUpdate(JSON.parse(cached));
        } else {
          onUpdate(defaultProgress);
        }
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${PROGRESS_COLLECTION}/${userId}`);
    return () => {};
  }
}

export async function saveUserProgress(userId: string, updates: Partial<UserProgress>) {
  try {
    const docRef = doc(db, PROGRESS_COLLECTION, userId);
    await setDoc(
      docRef,
      {
        ...updates,
        ownerId: userId,
        lastStudiedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Saving progress locally:', error);
  }
  // Also save to localStorage
  const key = `progress_${userId}`;
  const existing = localStorage.getItem(key);
  const data = existing ? { ...JSON.parse(existing), ...updates } : updates;
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// Firestore: User Custom Mufrodat (Vocabulary Cards per User)
// ---------------------------------------------------------------------------
const MUFRODAT_COLLECTION = 'user_mufrodat';

export function subscribeUserMufrodat(
  userId: string,
  onUpdate: (vocabList: UserMufrodat[]) => void
) {
  try {
    const q = query(
      collection(db, MUFRODAT_COLLECTION),
      where('ownerId', '==', userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const list: UserMufrodat[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<UserMufrodat, 'id'>) });
        });

        if (list.length === 0) {
          const local = localStorage.getItem(`mufrodat_${userId}`);
          if (local) {
            try {
              onUpdate(JSON.parse(local));
              return;
            } catch (e) {}
          }
        }
        onUpdate(list);
      },
      (error) => {
        console.warn('Mufrodat listener fallback to local:', error.message);
        const local = localStorage.getItem(`mufrodat_${userId}`);
        if (local) {
          try {
            onUpdate(JSON.parse(local));
            return;
          } catch (e) {}
        }
        onUpdate([]);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, MUFRODAT_COLLECTION);
    return () => {};
  }
}

export async function addUserMufrodat(
  userId: string,
  vocab: Omit<UserMufrodat, 'id' | 'ownerId' | 'createdAt'>
): Promise<string> {
  const payload = {
    ...vocab,
    ownerId: userId,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, MUFRODAT_COLLECTION), payload);
    return docRef.id;
  } catch (error) {
    console.warn('Saving vocab locally:', error);
    const key = `mufrodat_${userId}`;
    const local = localStorage.getItem(key);
    const existing: UserMufrodat[] = local ? JSON.parse(local) : [];
    const newId = `local-vocab-${Date.now()}`;
    existing.unshift({ id: newId, ...payload });
    localStorage.setItem(key, JSON.stringify(existing));
    return newId;
  }
}

export async function toggleMufrodatStatus(
  userId: string,
  vocabId: string,
  currentStatus: 'hafalan' | 'dikuasai'
) {
  const newStatus = currentStatus === 'hafalan' ? 'dikuasai' : 'hafalan';
  try {
    if (!vocabId.startsWith('local-')) {
      const docRef = doc(db, MUFRODAT_COLLECTION, vocabId);
      await updateDoc(docRef, { status: newStatus });
      return;
    }
  } catch (e) {
    console.warn('Update vocab local fallback:', e);
  }

  const key = `mufrodat_${userId}`;
  const local = localStorage.getItem(key);
  if (local) {
    const list: UserMufrodat[] = JSON.parse(local);
    const item = list.find((v) => v.id === vocabId);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(key, JSON.stringify(list));
    }
  }
}

export async function deleteUserMufrodat(userId: string, vocabId: string) {
  try {
    if (!vocabId.startsWith('local-')) {
      await deleteDoc(doc(db, MUFRODAT_COLLECTION, vocabId));
      return;
    }
  } catch (e) {
    console.warn('Delete vocab local fallback:', e);
  }

  const key = `mufrodat_${userId}`;
  const local = localStorage.getItem(key);
  if (local) {
    const list: UserMufrodat[] = JSON.parse(local);
    localStorage.setItem(key, JSON.stringify(list.filter((v) => v.id !== vocabId)));
  }
}
