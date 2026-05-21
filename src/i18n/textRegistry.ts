/**
 * Multilingual Text Registry for Vimana
 * 
 * All user-visible strings for Act 1 scenes, formula overlays, and UI text.
 * Languages cycle based on time to create a multilingual journey.
 * 
 * Languages: English, Hindi, Bengali, Urdu, Tamil
 */

export type Language = 'en' | 'hi' | 'bn' | 'ur' | 'ta';

export const LANGUAGES: Language[] = ['en', 'hi', 'bn', 'ur', 'ta'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'ENGLISH',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ur: 'اردو',
  ta: 'தமிழ்',
};

// ─── Scene Narrative Text ────────────────────────────────────────────────

export interface SceneTexts {
  headline: string;
  body: string;
  navLabel: string;
}

/** Scene 0: THE VOID */
export const SCENE_VOID: Record<Language, SceneTexts> = {
  en: { headline: 'BEFORE FORM.', body: 'Before light. Before thought. There was frequency.', navLabel: 'VOID' },
  hi: { headline: 'रूप से पहले।', body: 'प्रकाश से पहले। विचार से पहले। केवल आवृत्ति थी।', navLabel: 'शून्य' },
  bn: { headline: 'রূপের আগে।', body: 'আলোর আগে। চিন্তার আগে। শুধু কম্পাঙ্ক ছিল।', navLabel: 'শূন্য' },
  ur: { headline: 'شکل سے پہلے۔', body: 'روشنی سے پہلے۔ خیال سے پہلے۔ صرف تعدد تھی۔', ur: 'خلا' } as any,
  ta: { headline: 'வடிவத்திற்கு முன்.', body: 'ஒளிக்கு முன். சிந்தனைக்கு முன். அதிர்வெண் மட்டுமே இருந்தது.', navLabel: 'வெறுமை' },
};
// Fix Urdu navLabel
SCENE_VOID.ur.navLabel = 'خلا';

/** Scene 1: THE HUM */
export const SCENE_HUM: Record<Language, SceneTexts> = {
  en: { headline: 'THE HUM', body: 'Not a sound. The potential of all sound.', navLabel: 'HUM' },
  hi: { headline: 'गुंजन', body: 'ध्वनि नहीं। समस्त ध्वनि की संभावना।', navLabel: 'गुंजन' },
  bn: { headline: 'কম্পন', body: 'শব্দ নয়। সমস্ত শব্দের সম্ভাবনা।', navLabel: 'কম্পন' },
  ur: { headline: 'گونج', body: 'آواز نہیں۔ تمام آوازوں کی صلاحیت۔', navLabel: 'گونج' },
  ta: { headline: 'ஓசை', body: 'ஒலி அல்ல. அனைத்து ஒலிகளின் சாத்தியம்.', navLabel: 'ஓசை' },
};

/** Scene 2: THE WORD */
export const SCENE_WORD: Record<Language, SceneTexts> = {
  en: { headline: 'THE WORD', body: 'The hum names itself. VIMĀNA repeats until the point becomes a ring.', navLabel: 'WORD' },
  hi: { headline: 'शब्द', body: 'गुंजन स्वयं को नाम देता है। विमान दोहराता है जब तक बिंदु वृत्त न बन जाए।', navLabel: 'शब्द' },
  bn: { headline: 'শব্দ', body: 'কম্পন নিজেকে নাম দেয়। বিমান পুনরাবৃত্তি করে যতক্ষণ না বিন্দু বৃত্ত হয়।', navLabel: 'শব্দ' },
  ur: { headline: 'لفظ', body: 'گونج اپنے آپ کو نام دیتی ہے۔ وِمان دہراتا ہے جب تک نقطہ حلقہ نہ بن جائے۔', navLabel: 'لفظ' },
  ta: { headline: 'சொல்', body: 'ஓசை தனக்குத்தானே பெயரிடுகிறது. விமானம் மீள்கிறது — புள்ளி வளையமாகும் வரை.', navLabel: 'சொல்' },
};

/** Scene 3: THE FIELD */
export const SCENE_FIELD: Record<Language, SceneTexts> = {
  en: { headline: 'THE FIELD', body: 'The circle becomes a field. Rings ripple, bodies orbit.', navLabel: 'FIELD' },
  hi: { headline: 'क्षेत्र', body: 'वृत्त क्षेत्र बन जाता है। वलय लहराते हैं, पिंड परिक्रमा करते हैं।', navLabel: 'क्षेत्र' },
  bn: { headline: 'ক্ষেত্র', body: 'বৃত্ত ক্ষেত্র হয়ে যায়। বলয় ঢেউ খেলায়, পিণ্ড প্রদক্ষিণ করে।', navLabel: 'ক্ষেত্র' },
  ur: { headline: 'میدان', body: 'دائرہ میدان بن جاتا ہے۔ حلقے لہراتے ہیں، اجرام گردش کرتے ہیں۔', navLabel: 'میدان' },
  ta: { headline: 'புலம்', body: 'வட்டம் புலமாகிறது. வளையங்கள் அலைகின்றன, பொருட்கள் சுற்றுகின்றன.', navLabel: 'புலம்' },
};

/** Scene 4: BLUEPRINT */
export const SCENE_BLUEPRINT: Record<Language, SceneTexts> = {
  en: { headline: 'GENETIC FRAME.', body: 'The recursive branches coalesce into a double-helix blueprint. Text spirals upwards, writing out genetic code.', navLabel: 'BLUEPRINT' },
  hi: { headline: 'आनुवंशिक ढाँचा।', body: 'पुनरावर्ती शाखाएँ दोहरे-हेलिक्स खाके में विलीन हो जाती हैं। पाठ ऊपर की ओर सर्पिल होता है।', navLabel: 'खाका' },
  bn: { headline: 'জিনগত কাঠামো।', body: 'পুনরাবর্তী শাখাগুলি একটি দ্বৈত-হেলিক্স নকশায় মিলিত হয়।', navLabel: 'নকশা' },
  ur: { headline: 'جینی ڈھانچہ۔', body: 'بار بار شاخیں دوہری ہیلکس خاکے میں ملتی ہیں۔ متن اوپر کی طرف گھومتا ہے۔', navLabel: 'خاکہ' },
  ta: { headline: 'மரபு வடிவம்.', body: 'மீள்கிளைகள் இரட்டை-சுருள் வரைபடத்தில் இணைகின்றன. உரை மேல்நோக்கி சுழல்கிறது.', navLabel: 'வரைபு' },
};

/** Scene 5: FLORA FERN */
export const SCENE_FERN: Record<Language, SceneTexts> = {
  en: { headline: 'FERN', body: 'A fractal fern unfurls from a seed point, its recursive fronds mirroring the geometry of growth itself.', navLabel: '🌿 FERN' },
  hi: { headline: 'फर्न', body: 'एक फ्रैक्टल फर्न बीज बिंदु से खुलता है, इसकी पुनरावर्ती पत्तियाँ विकास की ज्यामिति को दर्शाती हैं।', navLabel: '🌿 फर्न' },
  bn: { headline: 'ফার্ন', body: 'একটি ফ্র্যাক্টাল ফার্ন বীজ বিন্দু থেকে খুলে যায়, এর পুনরাবর্তী পাতা বৃদ্ধির জ্যামিতি প্রতিফলিত করে।', navLabel: '🌿 ফার্ন' },
  ur: { headline: 'فرن', body: 'ایک فریکٹل فرن بیج نقطے سے کھلتا ہے، اس کے دہرائے گئے پتے بڑھوتری کی جیومیٹری کو ظاہر کرتے ہیں۔', navLabel: '🌿 فرن' },
  ta: { headline: 'ஃபெர்ன்', body: 'ஒரு பகுதிப்படி ஃபெர்ன் விதைப் புள்ளியிலிருந்து விரிகிறது — அதன் மீள்கிளைகள் வளர்ச்சியின் வடிவவியலை பிரதிபலிக்கின்றன.', navLabel: '🌿 ஃபெர்ன்' },
};

/** Scene 6: FLORA TREE */
export const SCENE_TREE: Record<Language, SceneTexts> = {
  en: { headline: 'TREE', body: 'An L-system tree branches and rebranches, each iteration writing a new sentence of growth.', navLabel: '🌳 TREE' },
  hi: { headline: 'वृक्ष', body: 'एक L-सिस्टम वृक्ष शाखाएँ और पुनः शाखाएँ, प्रत्येक पुनरावृत्ति विकास का नया वाक्य लिखती है।', navLabel: '🌳 वृक्ष' },
  bn: { headline: 'গাছ', body: 'একটি L-সিস্টেম গাছ শাখা-প্রশাখা করে, প্রতিটি পুনরাবৃত্তি বৃদ্ধির নতুন বাক্য লেখে।', navLabel: '🌳 গাছ' },
  ur: { headline: 'درخت', body: 'ایک L-سسٹم درخت شاخیں اور دوبارہ شاخیں، ہر دہراؤ بڑھوتری کا نیا جملہ لکھتا ہے۔', navLabel: '🌳 درخت' },
  ta: { headline: 'மரம்', body: 'ஒரு L-அமைப்பு மரம் கிளைகளும் மீள்கிளைகளும் கொண்டது — ஒவ்வொரு மீள்முறையும் வளர்ச்சியின் புதிய வாக்கியம்.', navLabel: '🌳 மரம்' },
};

/** Scene 7: FLORA CRYSTAL */
export const SCENE_CRYSTAL: Record<Language, SceneTexts> = {
  en: { headline: 'CRYSTAL', body: 'Dendritic crystals grow in radial symmetry, each branch a frozen echo of recursive geometry.', navLabel: '❄ CRYSTAL' },
  hi: { headline: 'स्फटिक', body: 'शाखान्वित स्फटिक रेडियल सममिति में बढ़ते हैं, प्रत्येक शाखा पुनरावर्ती ज्यामिति की जमी हुई प्रतिध्वनि।', navLabel: '❄ स्फटिक' },
  bn: { headline: 'স্ফটিক', body: 'শাখাযুক্ত স্ফটিক ব্যাসার্ধ সমমিতিতে বেড়ে ওঠে, প্রতিটি শাখা পুনরাবর্তী জ্যামিতির জমাট প্রতিধ্বনি।', navLabel: '❄ স্ফটিক' },
  ur: { headline: 'بلور', body: 'شاخوں والے بلور شعاعی مماثلت میں بڑھتے ہیں، ہر شاخ دہرائی جانے والی جیومیٹری کی منجمد گونج۔', navLabel: '❄ بلور' },
  ta: { headline: 'படிகம்', body: 'கிளைக்கும் படிகங்கள் ஆர சமச்சீரில் வளர்கின்றன — ஒவ்வொரு கிளையும் மீள்வடிவவியலின் உறைந்த எதிரொலி.', navLabel: '❄ படிகம்' },
};

/** Scene 8: FAUNA BUTTERFLY */
export const SCENE_BUTTERFLY: Record<Language, SceneTexts> = {
  en: { headline: 'BUTTERFLY', body: 'Butterflies trace chaotic attractors, their wings inscribed with the mathematics of flight.', navLabel: '🦋 BUTTERFLY' },
  hi: { headline: 'तितली', body: 'तितलियाँ अव्यवस्थित आकर्षकों का पता लगाती हैं, उनके पंखों पर उड़ान का गणित अंकित है।', navLabel: '🦋 तितली' },
  bn: { headline: 'প্রজাপতি', body: 'প্রজাপতি বিশৃঙ্খল আকর্ষক ট্রেস করে, তাদের ডানায় উড়ানের গণিত খোদাই করা।', navLabel: '🦋 প্রজাপতি' },
  ur: { headline: 'تتلی', body: 'تتلیاً بے ترتیب کشش کا پتا لگاتی ہیں، ان کے پنکھوں پر پرواز کا ریاضی نقش ہے۔', navLabel: '🦋 تتلی' },
  ta: { headline: 'பட்டாம்பூச்சி', body: 'பட்டாம்பூச்சிகள் ஒழுங்கற்ற ஈர்ப்புகளை கண்டறிகின்றன — அவற்றின் சிறகுகளில் பறப்பின் கணிதம் பொறிக்கப்பட்டுள்ளது.', navLabel: '🦋 பட்டாம்பூச்சி' },
};

/** Scene 9: FAUNA WAVE */
export const SCENE_WAVE: Record<Language, SceneTexts> = {
  en: { headline: 'WAVE', body: 'Symmetric waves ripple outward in synchronized patterns, schooling like flocks of birds in flight.', navLabel: '〰 WAVE' },
  hi: { headline: 'तरंग', body: 'सममित तरंगें समकालिक पैटर्न में बाहर की ओर लहराती हैं, पक्षियों के झुंड की तरह तालमेल से बहती हैं।', navLabel: '〰 तरंग' },
  bn: { headline: 'তরঙ্গ', body: 'সমমিত তরঙ্গ সমকালিক প্যাটার্নে বাইরের দিকে ছড়িয়ে পড়ে, পাখির পালের মতো একসাথে বয়ে যায়।', navLabel: '〰 তরঙ্গ' },
  ur: { headline: 'لہر', body: 'مماثت والی لہریں ہم آہنگ پیٹرن میں باہر کی طرف پھیلتی ہیں، پرندوں کے جھنڈ کی طرح اکھٹی بہتی ہیں۔', navLabel: '〰 لہر' },
  ta: { headline: 'அலை', body: 'சமச்சீர் அலைகள் ஒத்திசைவான வடிவங்களில் வெளிநோக்கி பரவுகின்றன — பறவைக் கூட்டம் போல் இணைந்து ஓடுகின்றன.', navLabel: '〰 அலை' },
};

/** Scene 10: FAUNA CREATURE */
export const SCENE_CREATURE: Record<Language, SceneTexts> = {
  en: { headline: 'CREATURE', body: 'A slimy creature emerges from the depths, its organic paths pulsing with emergent life.', navLabel: '🫧 CREATURE' },
  hi: { headline: 'जीव', body: 'एक चिपचिपा जीव गहराइयों से प्रकट होता है, इसके जैविक पथ उभरते जीवन से धड़कते हैं।', navLabel: '🫧 जीव' },
  bn: { headline: 'প্রাণী', body: 'একটি শ্লেষ্মাযুক্ত প্রাণী গভীর থেকে আবির্ভূত হয়, এর জৈবিক পথ উদীয়মান জীবনে স্পন্দিত।', navLabel: '🫧 প্রাণী' },
  ur: { headline: 'مخلوق', body: 'ایک چپچپا مخلوق گہرائیوں سے ظاہر ہوتا ہے، اس کے نامیاتی راستے ابھرتی زندگی سے دھڑکتے ہیں۔', navLabel: '🫧 مخلوق' },
  ta: { headline: 'உயிரினம்', body: 'ஒரு ஒட்டும் உயிரினம் ஆழத்திலிருந்து தோன்றுகிறது — அதன் இயற்கைப் பாதைகள் தோன்றும் உயிருடன் துடிக்கின்றன.', navLabel: '🫧 உயிரினம்' },
};

/** Scene 7: NETWORK */
export const SCENE_NETWORK: Record<Language, SceneTexts> = {
  en: { headline: 'GLOBAL MIND.', body: 'The biosphere becomes a single integrated circuit. Synapses snap at tree tips in a global flash of neural awakening.', navLabel: 'NETWORK' },
  hi: { headline: 'वैश्विक मन।', body: 'जैवमंडल एकल एकीकृत परिपथ बन जाता है। तंत्रिका जागरण की वैश्विक चमक में स्नायु जुड़ते हैं।', navLabel: 'जाल' },
  bn: { headline: 'বিশ্ব মন।', body: 'জীবমণ্ডল একটি অবিচ্ছিন্ন সার্কিট হয়ে ওঠে। স্নায়ু জাগরণের বিশ্বব্যাপী আলোয় সিনাপস জ্বলে ওঠে।', navLabel: 'জাল' },
  ur: { headline: 'عالمی ذہن۔', body: 'حیاتی کرہ ایک مربوط سرکٹ بن جاتا ہے۔ عصبی بیداری کی عالمی چمک میں سیناپس جھڑتے ہیں۔', navLabel: 'جال' },
  ta: { headline: 'உலக மனம்.', body: 'உயிர்க்கோளம் ஒரு ஒருங்கிணைந்த சுற்று ஆகிறது. நரம்பு விழிப்பின் உலகளாவிய ஒளியில் நரம்பு முனைகள் ஒளிர்கின்றன.', navLabel: 'வலை' },
};

/** All scene texts indexed by scene number (12 scenes) */
export const SCENE_TEXTS: Record<Language, SceneTexts[]> = {
  en: [SCENE_VOID, SCENE_HUM, SCENE_WORD, SCENE_FIELD, SCENE_BLUEPRINT, SCENE_FERN, SCENE_TREE, SCENE_CRYSTAL, SCENE_BUTTERFLY, SCENE_WAVE, SCENE_CREATURE, SCENE_NETWORK],
  hi: [SCENE_VOID, SCENE_HUM, SCENE_WORD, SCENE_FIELD, SCENE_BLUEPRINT, SCENE_FERN, SCENE_TREE, SCENE_CRYSTAL, SCENE_BUTTERFLY, SCENE_WAVE, SCENE_CREATURE, SCENE_NETWORK],
  bn: [SCENE_VOID, SCENE_HUM, SCENE_WORD, SCENE_FIELD, SCENE_BLUEPRINT, SCENE_FERN, SCENE_TREE, SCENE_CRYSTAL, SCENE_BUTTERFLY, SCENE_WAVE, SCENE_CREATURE, SCENE_NETWORK],
  ur: [SCENE_VOID, SCENE_HUM, SCENE_WORD, SCENE_FIELD, SCENE_BLUEPRINT, SCENE_FERN, SCENE_TREE, SCENE_CRYSTAL, SCENE_BUTTERFLY, SCENE_WAVE, SCENE_CREATURE, SCENE_NETWORK],
  ta: [SCENE_VOID, SCENE_HUM, SCENE_WORD, SCENE_FIELD, SCENE_BLUEPRINT, SCENE_FERN, SCENE_TREE, SCENE_CRYSTAL, SCENE_BUTTERFLY, SCENE_WAVE, SCENE_CREATURE, SCENE_NETWORK],
};

// ─── Formula Overlay Text ────────────────────────────────────────────────
// These are the words laid ON the mathematical curves via pretext.
// They must be short, evocative, and flow naturally on geometric shapes.

export const FORMULA_TEXTS: Record<Language, {
  /** textCircle: The Hum */
  humCircle: string;
  /** textCircle: Concentric rings */
  wordRings: string;
  /** cymaticRing: The Field */
  fieldCymatic: string;
  /** fractalTree: The Tree/Blueprint */
  treeRecursion: string;
  /** DNA Helix */
  dnaHelix: string;
  /** Fractal Fern */
  floraFern: string;
  /** L-System Tree */
  floraTree: string;
  /** Dendritic Crystal */
  floraCrystal: string;
  /** Butterfly */
  faunaButterfly: string;
  /** Symmetric Wave */
  faunaWave: string;
  /** Slimy Creature */
  faunaCreature: string;
  /** Network L-System */
  networkNeural: string;
  /** Golden Spiral */
  floraSpiral: string;
  /** Hexagonal Fractal */
  floraHex: string;
  /** Mycelium Roots */
  floraMycelium: string;
}> = {
  en: {
    humCircle: 'VIMANA',
    wordRings: 'VIMANA',
    fieldCymatic: 'STAND WAVE FIELDS SHIFT ORBITS ROTATE HARMONY GEOMETRY',
    treeRecursion: 'RECURSION BRANCH FLOWS MEMORY SHAPE EVOLVES LIFE IN CODES',
    dnaHelix: 'VMNA',
    floraFern: 'FRACTAL BOTANICAL NATURE LEAF EMERALD GOLD GROW GARDEN',
    floraTree: 'STRUCTURE L-SYSTEM TREE BRANCH SYMMETRY ORGANIC GROWTH EVOLUTION',
    floraCrystal: 'DENDRITIC CRYSTAL SNOW FLAKE AXIS RECURSIVE ICE GEOMETRY',
    faunaButterfly: 'BUTTERFLY FLIGHT CHAOTIC LORENZ ATTRACTOR SWARM FLUTTER LIFE',
    faunaWave: 'SYMMETRIC RESONANCE WAVEFLOCK AQUATIC HARMONIC SOUND RESONATOR',
    faunaCreature: 'AMINO SLIMY CREATURE ORGANISM PRIMORDIAL SOUP GOLD CHAOS',
    networkNeural: 'NEURAL SYNAPSE AWAKENING Awareness mind biosphere connected tree thinking snaps',
    floraSpiral: 'FIBONACCI PHI PERFECT GOLD ratio spiraling shell evolution design space',
    floraHex: 'STRUCTURE HEX LATTICE COOPERATIVE SYMMETRY HIVE MIND ASSEMBLY',
    floraMycelium: 'MYCELIAL WEB NETWORKS dendritic transferring resources underground information',
  },
  hi: {
    humCircle: 'विमान',
    wordRings: 'विमान',
    fieldCymatic: 'स्थिर तरंग क्षेत्र परिवर्तन कक्षा घूमती है सामंजस्य ज्यामिति',
    treeRecursion: 'पुनरावृत्ति शाखा प्रवाह स्मृति आकार विकसित जीवन कोड',
    dnaHelix: 'विमा',
    floraFern: 'फ्रैक्टल वनस्पति प्रकृति पत्ता पन्ना स्वर्ण उगो बगीचा',
    floraTree: 'संरचना L-प्रणाली वृक्ष शाखा समरूपता जैविक विकास',
    floraCrystal: 'शाखान्वित स्फटिक हिम कण अक्ष पुनरावर्ती बर्फ ज्यामिति',
    faunaButterfly: 'तितली उड़ान अव्यवस्थित आकर्षक झुंड फड़फड़ाहट जीवन',
    faunaWave: 'सममित अनुनाद तरंग जलीय सामंजस्य ध्वनि',
    faunaCreature: 'अमीनो जीव जीवाणु आदिम सूप स्वर्ण अव्यवस्था',
    networkNeural: 'तंत्रिका संधि जागरण चेतना मन जैवमंडल जुड़ा वृक्ष',
    floraSpiral: 'फाइबोनैची स्वर्ण अनुपात सर्पिल शंख विकास डिज़ाइन',
    floraHex: 'संरचना षट्कोण जालक सहकारी सममिति मधुमक्खी मन',
    floraMycelium: 'माइसीलियल जाल नेटवर्क शाखान्वित संसाधन भूमिगत सूचना',
  },
  bn: {
    humCircle: 'বিমান',
    wordRings: 'বিমান',
    fieldCymatic: 'স্থির তরঙ্গ ক্ষেত্র পরিবর্তন কক্ষপথ ঘোরে সঙ্গতি জ্যামিতি',
    treeRecursion: 'পুনরাবর্তন শাখা প্রবাহ স্মৃতি আকৃতি বিবর্তন জীবন কোড',
    dnaHelix: 'বিমা',
    floraFern: 'ফ্র্যাক্টাল উদ্ভিজ্জ প্রকৃতি পাতা পান্না স্বর্ণ বৃদ্ধি',
    floraTree: 'কাঠামো L-পদ্ধতি গাছ শাখা সমমিতি জৈবিক বিবর্তন',
    floraCrystal: 'শাখাযুক্ত স্ফটিক তুষার কণা অক্ষ পুনরাবর্তী বরফ',
    faunaButterfly: 'প্রজাপতি উড়ান বিশৃঙ্খল আকর্ষক ঝাঁক প্রাণ',
    faunaWave: 'সমমিত অনুনাদ তরঙ্গ জলীয় সঙ্গতি ধ্বনি',
    faunaCreature: 'অ্যামিনো প্রাণী জীবাণু আদিম স্যুপ স্বর্ণ বিশৃঙ্খলা',
    networkNeural: 'স্নায়ু সংযোগ জাগরণ সচেতনতা মন জীবমণ্ডল',
    floraSpiral: 'ফিবোনাচ্চি স্বর্ণ অনুপাত সর্পিল শঙ্খ বিবর্তন',
    floraHex: 'কাঠামো ষড়ভুজ জালক সমবায়ী সমমিতি মৌমাছি',
    floraMycelium: 'মাইসিলিয়াল জাল নেটওয়ার্ক শাখাযুক্ত সম্পদ ভূগর্ভ',
  },
  ur: {
    humCircle: 'وِمان',
    wordRings: 'وِمان',
    fieldCymatic: 'مستقل لہر میدان تبدیلی مدار گھومتی ہے ہم آہنگی جیومیٹری',
    treeRecursion: 'تکرار شاخ بہاؤ یاد شکل ارتقا زندگی کوڈ',
    dnaHelix: 'وِما',
    floraFern: 'فریکٹل نباتات فطرت پتا زمرد سنہری باغ',
    floraTree: 'ڈھانچہ L-نظام درخت شاخ مماثلت نامیاتی ارتقا',
    floraCrystal: 'شاخوں والا بلور برف کا دانہ محور دہرائی جانے والی برف',
    faunaButterfly: 'تتلی اڑاؤ بے ترتیب کشش جھنڈ پھڑپھڑاؤ زندگی',
    faunaWave: 'مماثت انقاذ لہر ابھراؤ آبی ہم آہنگی آواز',
    faunaCreature: 'ایمینو مخلوق جرثومہ ابتدائی سوپ سنہری بے ترتیبی',
    networkNeural: 'عصبی ربط بیداری شعور ذہن حیاتی کرہ',
    floraSpiral: 'فبونچی سنہری تناسب مارپیچ شیل ارتقا ڈیزائن',
    floraHex: 'ڈھانچہ شش ضلعی جال تعاونی مماثت شہد کی مکھی',
    floraMycelium: 'مائسیلیل جال نیٹ ورک شاخوں والا وسائل زیر زمین',
  },
  ta: {
    humCircle: 'விமானம்',
    wordRings: 'விமானம்',
    fieldCymatic: 'நிலை அலை புலம் மாற்றம் சுற்றுப்பாதை சுழல் இணக்கம் வடிவியல்',
    treeRecursion: 'மீள்வு கிளை ஓட்டம் நினைவு வடிவம் பரிணாமம் வாழ்வு குறியீடு',
    dnaHelix: 'விமா',
    floraFern: 'பகுதிப்படி தாவரம் இயற்கை இலை மரகதம் தங்கம் வளர்',
    floraTree: 'கட்டமைப்பு L-அமைப்பு மரம் கிளை சீரொருமை உயிர் பரிணாமம்',
    floraCrystal: 'கிளைக்கும் படிகம் பனித்துகள் அச்சு மீள் பனி வடிவியல்',
    faunaButterfly: 'பட்டாம்பூச்சி பறப்பு ஒழுங்கற்ற ஈர்ப்பு கூட்டம் சிறகு வாழ்வு',
    faunaWave: 'சீரொருமை அதிர்வு அலை நீர் இணக்கம் ஒலி',
    faunaCreature: 'அமினோ உயிரி நுண்ணுயிர் தொன்மை நீர்மம் தங்கம் குழப்பம்',
    networkNeural: 'நரம்பு முனை விழிப்பு உணர்வு மனம் உயிர்க்கோளம்',
    floraSpiral: 'பிபொனாச்சி தங்க விகிதம் சுருள் சிப்பி பரிணாமம் வடிவமைப்பு',
    floraHex: 'கட்டமைப்பு அறுகோண வலை கூட்டுறவு சீரொருமை தேனீ மனம்',
    floraMycelium: 'பூஞ்சை வலை வலையமைப்பு கிளைக்கும் வளங்கள் நிலத்தடி தகவல்',
  },
};

// ─── Ghost Words (Cymatic ring markers) ─────────────────────────────────

export const VIMANA_WORD: Record<Language, string> = {
  en: 'VIMANA',
  hi: 'विमान',
  bn: 'বিমান',
  ur: 'وِمان',
  ta: 'விமானம்',
};

export const GHOST_WORDS: Record<Language, string[]> = {
  en: ['VIMĀNA', 'SHIVA', 'AUM', 'NĀDA'],
  hi: ['विमान', 'शिव', 'ॐ', 'नाद'],
  bn: ['বিমান', 'শিব', 'ওঁ', 'নাদ'],
  ur: ['وِمان', 'شِوا', 'اوم', 'ناد'],
  ta: ['விமானம்', 'சிவன்', 'ஓம்', 'நாதம்'],
};

// ─── Deep Text (DNA / Flora rich text) ───────────────────────────────────

export const DNA_DEEP_TEXT: Record<Language, string> = {
  en: 'ADENINE THYMINE GUANINE CYTOSINE GENETIC BLUEPRINT DOUBLE HELIX OF LIFE CODE ENCODED IN EACH CELL NUCLEUS SPIRAL MATRICES MUTATE EVOLVE COMBINE REPLICATE GENERATE SYMMETRY',
  hi: 'एडेनिन थाइमिन ग्वानिन साइटोसिन आनुवंशिक खाका जीवन का दोहरा हेलिक्स कोड प्रत्येक कोशिका में एन्कोडेड सर्पिल मैट्रिक्स उत्परिवर्तन विकसित',
  bn: 'অ্যাডেনিন থাইমিন গুয়ানিন সাইটোসিন জিনগত নকশা জীবনের দ্বৈত হেলিক্স কোড প্রতিটি কোষে এনকোডেড সর্পিল',
  ur: 'ایڈینین تھائیمین گوانین سائٹوسین جینی خاکہ زندگی کا دوہرا ہیلکس کوڈ ہر خلیے میں',
  ta: 'அடினின் தைமின் குவானின் சைட்டோசின் மரபு வரைபு வாழ்வின் இரட்டை சுருள் குறியீடு ஒவ்வொரு செல்லிலும்',
};

export const FLORA_DEEP_TEXT: Record<Language, string> = {
  en: 'BOTANICAL LIFE GARDEN FLORA VARIETY EMERGED BRUSH FRACTAL FERNS MULTIPLY RECURSIVE PATTERNS L SYSTEM BRANCHES UNFOLD TO SUNLIGHT AND AIR DENDRITIC ROOT NETWORKS',
  hi: 'वनस्पति जीवन बगीचा विविधता प्रकट फ्रैक्टल फर्न पुनरावर्ती पैटर्न L-प्रणाली शाखाएँ धूप और हवा में खुलती हैं शाखान्वित जड़ नेटवर्क',
  bn: 'উদ্ভিজ্জ জীবন বাগান বৈচিত্র্য আবির্ভূত ফ্র্যাক্টাল ফার্ন পুনরাবর্তী প্যাটার্ন L-পদ্ধতি শাখা সূর্যালোকে খোলে',
  ur: 'نباتاتی زندگی باغ تنوع ظاہر فریکٹل فرن بار بار پیٹرن L-نظام شاخیں دھوپ میں کھلتی ہیں',
  ta: 'தாவர வாழ்வு தோட்டம் வகை தோன்றியது பகுதிப்படி மரக்கன்று மீள் வடிவங்கள் L-அமைப்பு கிளைகள் சூரிய ஒளியில் திறக்கின்றன',
};

// ─── Ornamental Border Text ──────────────────────────────────────────────

export const ORNAMENTAL_TEXT: Record<Language, string> = {
  en: 'VIMANAVIMANAVIMANAVIMANA❋',
  hi: 'विमानविमानविमानविमान❋',
  bn: 'বিমানবিমানবিমানবিমান❋',
  ur: 'وِمانوِمانوِمانوِمان❋',
  ta: 'விமானம்விமானம்விமானம்விமானம்❋',
};

// ─── UI / HUD Text ──────────────────────────────────────────────────────

export const UI_TEXTS: Record<Language, {
  singularity: string;
  phase0: string;
  scroll: string;
  manual: string;
  mode: string;
}> = {
  en: { singularity: 'SINGULARITY', phase0: 'Phase 0.0 — 136.1Hz', scroll: 'SCROLL', manual: 'MANUAL', mode: 'MODE' },
  hi: { singularity: 'एकत्व', phase0: 'चरण 0.0 — 136.1Hz', scroll: 'स्क्रॉल', manual: 'मैनुअल', mode: 'मोड' },
  bn: { singularity: 'একত্ব', phase0: 'পর্যায় 0.0 — 136.1Hz', scroll: 'স্ক্রল', manual: 'ম্যানুয়াল', mode: 'মোড' },
  ur: { singularity: 'وحدت', phase0: 'مرحلہ 0.0 — 136.1Hz', scroll: 'اسکرول', manual: 'دستی', mode: 'موڈ' },
  ta: { singularity: 'ஒருமை', phase0: 'நிலை 0.0 — 136.1Hz', scroll: 'உருட்டு', manual: 'கையேடு', mode: 'பயன்முறை' },
};

// ─── ConnectedNarrative-specific Texts ───────────────────────────────────

export const NARRATIVE_TEXTS: Record<Language, {
  voidLabel: string;
  frequencyVoid: string;
  bioAmino: string;
}> = {
  en: {
    voidLabel: 'Singularity / A dot of light',
    frequencyVoid: 'FREQUENCY VOID',
    bioAmino: 'BIO AMINO ACID primodial cell replication pools divided undulates golden heat',
  },
  hi: {
    voidLabel: 'एकत्व / प्रकाश का एक बिंदु',
    frequencyVoid: 'आवृत्ति शून्य',
    bioAmino: 'जैव अमीनो अम्ल आदिम कोशिका प्रतिकृति पूल विभाजित लहराता स्वर्ण ताप',
  },
  bn: {
    voidLabel: 'একত্ব / আলোর একটি বিন্দু',
    frequencyVoid: 'কম্পাঙ্ক শূন্য',
    bioAmino: 'জৈব অ্যামিনো অ্যাসিড আদিম কোষ প্রতিলিপি পুল বিভক্ত স্বর্ণ তাপ',
  },
  ur: {
    voidLabel: 'وحدت / روشنی کا اک نقطہ',
    frequencyVoid: 'تعدد خلا',
    bioAmino: 'نقطۂ حیاتی ایمینو تیزاب ابتدائی خلیہ نقل پول سنہری گرمی',
  },
  ta: {
    voidLabel: 'ஒருமை / ஒளியின் ஒரு புள்ளி',
    frequencyVoid: 'அதிர்வெண் வெறுமை',
    bioAmino: 'உயிர் அமினோ அமிலம் தொன்மை செல் நகல் நீர்த்தேக்கம் தங்க வெப்பம்',
  },
};
