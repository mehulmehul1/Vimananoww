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

/** Scene 12: EMERGENCE / THE FIRING */
export const SCENE_EMERGENCE: Record<Language, SceneTexts> = {
  en: { headline: 'EMERGENCE', body: 'Neurons fire in dendritic patterns. The network awakens — not as one, but as many becoming one.', navLabel: '🧬 EMERGENCE' },
  hi: { headline: 'उद्भव', body: 'तंत्रिकाएँ शाखान्वित प्रतिमानों में जलती हैं। जाल जागता है — एक के रूप में नहीं, बल्कि अनेक एक बनते हैं।', navLabel: '🧬 उद्भव' },
  bn: { headline: 'উদ্ভব', body: 'স্নায়ু শাখাযুক্ত প্যাটার্নে জ্বলে ওঠে। নেটওয়ার্ক জেগে ওঠে — এক হিসেবে নয়, অনেক এক হয়ে যায়।', navLabel: '🧬 উদ্ভব' },
  ur: { headline: 'ابھراؤ', body: 'اعصاب شاخوں والے پیٹرن میں جلتے ہیں۔ نیٹ ورک بیدار ہوتا ہے — ایک کے طور پر نہیں، بلکہ بہت سے ایک بنتے ہیں۔', navLabel: '🧬 ابھراؤ' },
  ta: { headline: 'தோற்றம்', body: 'நரம்புகள் கிளைக்கும் வடிவங்களில் எரிகின்றன. வலையமைப்பு விழிக்கிறது — ஒன்றாக அல்ல, பல ஒன்றாகும்.', navLabel: '🧬 தோற்றம்' },
};

/** Scene 13: CONVERGENCE / THE MIND */
export const SCENE_CONVERGENCE: Record<Language, SceneTexts> = {
  en: { headline: 'CONVERGENCE', body: 'Left brain meets right. Geometry meets organics. The hemispheres converge — and consciousness sparks.', navLabel: '🧠 CONVERGENCE' },
  hi: { headline: 'अभिसरण', body: 'बायाँ मस्तिष्क दाएँ से मिलता है। ज्यामिति जैविकता से मिलती है। गोलार्ध अभिसरित होते हैं — और चेतना चमकती है।', navLabel: '🧠 अभिसरण' },
  bn: { headline: 'অভিসরণ', body: 'বাম মস্তিষ্ক ডানের সাথে মিলিত হয়। জ্যামিতি জৈবিকতার সাথে মিলিত হয়। গোলার্ধ অভিসরিত হয় — আর চেতনা জ্বলে ওঠে।', navLabel: '🧠 অভিসরণ' },
  ur: { headline: 'اجتماع', body: 'بائیں دماغ دائیں سے ملتا ہے۔ جیومیٹری نامیاتیت سے ملتی ہے۔ نصف کرہ ملتے ہیں — اور شعور جلتا ہے۔', navLabel: '🧠 اجتماع' },
  ta: { headline: 'ஒருங்கிணைவு', body: 'இடது மூளை வலதுடன் சந்திக்கிறது. வடிவியல் இயற்கையுடன் சந்திக்கிறது. அரைக்கோளங்கள் ஒருங்கிணைகின்றன — உணர்வு ஒளிர்கிறது.', navLabel: '🧠 ஒருங்கிணைவு' },
};

/** Scene 11: NETWORK */
export const SCENE_NETWORK: Record<Language, SceneTexts> = {
  en: { headline: 'MYCELIUM.', body: 'Beneath the surface, billions of hyphae weave the earth\'s original internet. A silent web of nutrient exchange and chemical signals.', navLabel: 'NETWORK' },
  hi: { headline: 'माइसिलियम।', body: 'सतह के नीचे, अरबों हाइफ़ा पृथ्वी के मूल इंटरनेट को बुनते हैं। पोषण आदान-प्रदान और रासायनिक संकेतों का मौन जाल।', navLabel: 'जाल' },
  bn: { headline: 'মাইসিলিয়াম।', body: 'পৃষ্ঠতলের নিচে, কোটি কোটি হাইফা পৃথবীর আদিম ইন্টারনেট বুনে। পুষ্টি আদানপ্রদান ও রাসায়নিক সংকেতের নীরব জাল।', navLabel: 'জাল' },
  ur: { headline: 'مائسیلیم۔', body: 'سطح کے نیچے، اربوں ہائیفا زمین کے اصل انٹرنیٹ کو بنتے ہیں۔ غذائی تبادلہ اور کیمیکی اشاروں کا خاموش جال۔', navLabel: 'جال' },
  ta: { headline: 'மைசீலியம்.', body: 'மேற்பரப்பின் கீழ், பில்லியன் நூல்கள் பூமியின் அசல் இணையத்தை நெய்கின்றன. ஊட்டச்சத்து பரிமாற்றம் மற்றும் வேதியியல் சமிக்ஞைகளின் அமைதியான வலை.', navLabel: 'வலை' },
};

/** Scene 14: THE BRUSH */
export const SCENE_BRUSH: Record<Language, SceneTexts> = {
  en: { headline: 'THE BRUSH', body: 'Consciousness makes its first mark. Ink meets paper. The gesture becomes form.', navLabel: '🖌 BRUSH' },
  hi: { headline: 'ब्रश', body: 'चेतना अपना पहला निशान बनाती है। स्याही कागज़ से मिलती है। हावभाव रूप बन जाता है।', navLabel: '🖌 ब्रश' },
  bn: { headline: 'ব্রাশ', body: 'চেতনা তার প্রথম চিহ্ন তৈরি করে। কালি কাগজের সাথে মিলিত হয়। ভাব আকৃতি হয়ে ওঠে।', navLabel: '🖌 ব্রাশ' },
  ur: { headline: 'برش', body: 'شعور اپنا پہلا نشان بناتا ہے۔ سیاہی کاغذ سے ملتی ہے۔ انداز شکل بن جاتا ہے۔', navLabel: '🖌 برش' },
  ta: { headline: 'தூரிகை', body: 'உணர்வு தனது முதல் குறியை உருவாக்குகிறது. மை காகிதத்தை சந்திக்கிறது. சைகை வடிவமாகிறது.', navLabel: '🖌 தூரிகை' },
};

/** Scene 15: THE CHISEL */
export const SCENE_CHISEL: Record<Language, SceneTexts> = {
  en: { headline: 'THE CHISEL', body: 'Three architectures. One language of form.', navLabel: '🔪 CHISEL' },
  hi: { headline: 'छेनी', body: 'तीन वास्तुकलाएँ। रूप की एक भाषा।', navLabel: '🔪 छेनी' },
  bn: { headline: 'খঁচি', body: 'তিনটি স্থাপত্য। একটি আকৃতির ভাষা।', navLabel: '🔪 খঁচি' },
  ur: { headline: 'چھینی', body: 'تین فن تعمیر۔ شکل کی ایک زبان۔', navLabel: '🔪 چھینی' },
  ta: { headline: 'உளி', body: 'மூன்று கட்டிடக்கலை. ஒரு வடிவ மொழி.', navLabel: '🔪 உளி' },
};

/** Scene 16: THE KNITTING */
export const SCENE_KNITTING: Record<Language, SceneTexts> = {
  en: { headline: 'THE KNITTING', body: 'Thread becomes fabric. Each loop holds the memory of the last, each stitch a promise to the next.', navLabel: '🧶 KNITTING' },
  hi: { headline: 'बुनाई', body: 'धागा कपड़ा बन जाता है। हर लूप पिछले की याद रखता है, हर टाँका अगले का वादा।', navLabel: '🧶 बुनाई' },
  bn: { headline: 'বুনন', body: 'সুতো কাপড় হয়ে ওঠে। প্রতিটি লুপ গতটির স্মৃতি ধরে রাখে, প্রতিটি সেলাই পরবর্তীটির প্রতিশ্রুতি।', navLabel: '🧶 বুনন' },
  ur: { headline: 'بُنائی', body: 'دھاگا کپڑا بن جاتا ہے۔ ہر لوپ پچھلے کی یاد رکھتا ہے، ہر ٹانکا اگلے کا وعدہ۔', navLabel: '🧶 بُنائی' },
  ta: { headline: 'நெசவு', body: 'நூல் துணியாகிறது. ஒவ்வொரு லூப்பும் முந்தையதை நினைவுகொள்கிறது, ஒவ்வொரு தைப்பும் அடுத்ததுக்கு வாக்குறுதி.', navLabel: '🧶 நெசவு' },
};

/** All multilingual scene objects in order */
const ALL_SCENES = [SCENE_VOID, SCENE_HUM, SCENE_WORD, SCENE_FIELD, SCENE_BLUEPRINT, SCENE_FERN, SCENE_TREE, SCENE_CRYSTAL, SCENE_BUTTERFLY, SCENE_WAVE, SCENE_CREATURE, SCENE_NETWORK, SCENE_EMERGENCE, SCENE_CONVERGENCE, SCENE_BRUSH, SCENE_CHISEL, SCENE_KNITTING];

/** All scene texts indexed by scene number (12 scenes) */
export const SCENE_TEXTS: Record<Language, SceneTexts[]> = {
  en: ALL_SCENES.map(s => s.en),
  hi: ALL_SCENES.map(s => s.hi),
  bn: ALL_SCENES.map(s => s.bn),
  ur: ALL_SCENES.map(s => s.ur),
  ta: ALL_SCENES.map(s => s.ta),
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
  /** Firing / Dendritic cascade */
  firingDendritic: string;
  /** Convergence / Sierpinski + Spiral */
  convergenceSpiral: string;
  /** Mycelial Web */
  mycelialWeb: string;
  /** Cortical Fold */
  corticalFold: string;
  /** 3D Brain Mesh */
  brainMesh: string;
  /** Global Circuit */
  globalCircuit: string;
  /** Mycelium Network */
  myceliumNetwork: string;
  /** Brush Stroke */
  brushStroke: string;
  /** Arch Carving / Jaali Tiling */
  archCarving: string;
  /** Knitting Stitch */
  knitting: string;
}> = {
  en: {
    humCircle: 'VIMANA',
    wordRings: 'VIMANA',
    fieldCymatic: 'VIMANA VIMANA VIMANA VIMANA VIMANA VIMANA VIMANA VIMANA',
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
    firingDendritic: 'FIRING NEURON CASCADE DENDRITE ELECTRIC PULSE IGNITION SPARK CHAIN REACTION AWAKENING',
    convergenceSpiral: 'CONVERGENCE SPIRAL SIERPINSKI GOLDEN FIBONACCI LEFT RIGHT BRAIN HEMISPHERE UNITY',
    mycelialWeb: 'MYCELIUM ROOT NETWORK HYPHA CONNECT RECONNECT NUTRIENT FLOW UNDERGROUND WEB LIFE',
    corticalFold: 'CORTEX FOLD WRINKLE GYRUS SULCUS TURING PATTERN REACTION DIFFUSION AWARENESS MIND',
    brainMesh: 'NEURON SYNAPSE CORTEX SULCUS GYRUS FOLD MIND BRAIN CONSCIOUSNESS AWARENESS THOUGHT PULSE',
    globalCircuit: 'BIOSPHERE CIRCUIT GLOBE SYNAPSE NETWORK NODE CONNECTION PULSE AWARENESS GLOBAL MIND EARTH',
    myceliumNetwork: 'MYCELIUM HYPHA BRANCH RECONNECT NUTRIENT FLOW UNDERGROUND WEB THREAD SIGNAL EXCHANGE SPORE LIFE',
    brushStroke: 'FLOW CURRENT WAVE INK BRUSH MOTION CALLIGRAPHY WATER STREAM SILK CREST RIPPLE GESTURE',
    archCarving: 'THE CHISEL CARVES PATTERNS ONE LINE AT A TIME EACH GROOVE TELLS A STORY OF FORM AND RHYTHM',
    knitting: 'WOVEN KNITTED LOOPED STITCHED THREAD YARN FABRIC TEXTURE PATTERN CABLE RIB INTERLOCK CROSS PURL KNIT WARP WEFT TAPESTRY LOOM SHUTTLE',
  },
  hi: {
    humCircle: 'विमान',
    wordRings: 'विमान',
    fieldCymatic: 'विमान विमान विमान विमान विमान विमान विमान विमान',
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
    firingDendritic: 'जलती तंत्रिका प्रपात शाखान्वित विद्युत स्पंदन प्रज्वलन चेन प्रतिक्रिया जागरण',
    convergenceSpiral: 'अभिसरण सर्पिल सियरपिंस्की स्वर्ण फाइबोनैची बायाँ दायाँ मस्तिष्क एकता',
    mycelialWeb: 'माइसिलियम जड़ जाल हाइफा जोड़ना पुनः जोड़ना पोषण प्रवाह भूमिगत जाल जीवन',
    corticalFold: 'प्रांतस्था सिलवट मोड़ गाइरस सल्कस ट्यूरिंग प्रतिमान प्रतिक्रिया विसरण चेतना मन',
    brainMesh: 'तंत्रिका संबंध प्रांतस्था सल्कस गाइरस मोड़ मन मस्तिष्क चेतना जागरूकता विचार स्पंदन',
    globalCircuit: 'जैवमंडल परिपथ ग्लोब संबंध जाल नोड जुड़ाव स्पंदन जागरूकता वैश्विक मन पृथ्वी',
    myceliumNetwork: 'माइसिलियम हाइफ़ा शाखा पुनः जोड़ना पोषण प्रवाह भूमिगत जाल धागा संकेत आदान-प्रदान बीजाणु जीवन',
    brushStroke: 'ब्रश स्याही हावभाव निशान कागज़ रेशा रंग स्वरूपक लिपि हाथ दबाव ब्रिस्टल बनावट गीला',
    archCarving: 'छेनी एक बार में एक रेखा पैटर्न बनाती है हर खांचा आकार और लय की कहानी कहता है',
    knitting: 'बुना हुआ बुनाई लूप वाला टाँका वाला धागा यार्न कपड़ा बनावट पैटर्न केबल रिब अंतर्ग्रथन',
  },
  bn: {
    humCircle: 'বিমান',
    wordRings: 'বিমান',
    fieldCymatic: 'বিমান বিমান বিমান বিমান বিমান বিমান বিমান বিমান',
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
    firingDendritic: 'জ্বলন্ত স্নায়ু জলপ্রপাত শাখাযুক্ত বিদ্যুৎ স্পন্দন জ্বালানি শৃঙ্খল প্রতিক্রিয়া',
    convergenceSpiral: 'অভিসরণ সর্পিল সিয়ারপিনস্কি স্বর্ণ ফিবোনাচ্চি বাম ডান মস্তিষ্ক ঐক্য',
    mycelialWeb: 'মাইসিলিয়াম মূল জাল হাইফা সংযোগ পুনঃসংযোগ পুষ্টি প্রবাহ ভূগর্ভস্থ জাল জীবন',
    corticalFold: 'কর্টেক্স ভাঁজ কুঁচকি গাইরাস সালকাস টিউরিং প্যাটার্ন বিক্রিয়া বিসরণ সচেতনতা',
    brainMesh: 'স্নায়ু সংযোগ কর্টেক্স সালকাস গাইরাস ভাঁজ মন মস্তিষ্ক সচেতনতা চিন্তা স্পন্দন',
    globalCircuit: 'জীবমণ্ডল বৃত্ত গ্লোব সংযোগ জাল নোড সংযোগ স্পন্দন সচেতনতা বিশ্ব মন পৃথিবী',
    myceliumNetwork: 'মাইসিলিয়াম হাইফা শাখা পুনঃসংযোগ পুষ্টি প্রবাহ ভূগর্ভস্থ জাল সুতা সংকেত আদানপ্রদান বীজাণু জীবন',
    brushStroke: 'ব্রাশ কালি ভাব চিহ্ন কাগজ আঁশ পিগমেন্ট স্বাক্ষর হাত চাপ ব্রিস্টল বনাম ভেজা',
    archCarving: 'ছেনি একবারে এক লাইন প্যাটার্ন তৈরি করে প্রতিটি খাঁজ আকার এবং ছন্দের গল্প বলে',
    knitting: 'বোনা বোনাই লুপ সেলাই সুতো কাপড় বনাম প্যাটার্ন কেবল রিব অন্তর্গত',
  },
  ur: {
    humCircle: 'وِمان',
    wordRings: 'وِمان',
    fieldCymatic: 'وِمان وِمان وِمان وِمان وِمان وِمان وِمان وِمان',
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
    firingDendritic: 'جلتی عصبی آبشار شاخوں والی بجلی موج اور شعلہ زنجیر رد عمل بیداری',
    convergenceSpiral: 'اجتماع مارپیچ سیرپنسکی سنہری فبونچی بائیں دائیں دماغ اتحاد',
    mycelialWeb: 'مائسیلیم جڑ جال ہائیفا جوڑنا دوبارہ جوڑنا غذائی سیراب زیر زمین جال زندگی',
    corticalFold: 'دیماغی پرت سلوٹ گائرس سلکس ٹیورنگ پیٹرن رد عمل پھیلاؤ شعور ذہن',
    brainMesh: 'عصب ربط دماغی پرت سلکس گائرس سلوٹ ذہن دماغ شعور سوچ دھڑکن',
    globalCircuit: 'حیاتی کورہ مدار گلوب ربط جال نوڑا جوڑ دھڑکن شعور عالمی ذہن زمین',
    myceliumNetwork: 'مائسیلیم ہائیفا شاخ دوبارہ جوڑنا غذائی سیراب زیر زمین جال دھاگہ اشارہ تبادلہ بیج زندگی',
    brushStroke: 'برش سیاہی انداز نشان کاغذ تار رنگ خطاطی ہاتھ دباؤ برسل بافت',
    archCarving: 'چھینی ایک وقت میں ایک لائن پیٹرن بناتی ہے ہر داغ شکل اور تال کی کہانی کہتا ہے',
    knitting: 'بنا ہوا بنائی لوپ ٹانکا دھاگہ کپڑا بناوٹ پیٹرن کیبل ریب',
  },
  ta: {
    humCircle: 'விமானம்',
    wordRings: 'விமானம்',
    fieldCymatic: 'விமானம் விமானம் விமானம் விமானம் விமானம் விமானம் விமானம் விமானம்',
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
    firingDendritic: 'எரியும் நரம்பு நீர்வீழ்ச்சி கிளைக்கும் மின்சாரம் தூண்டுதல் தொடர் எதிர்வினை விழிப்பு',
    convergenceSpiral: 'ஒருங்கிணைவு சுருள் சியர்பின்ஸ்கி தங்கம் பிபொனாச்சி இடது வலது மூளை ஒற்றுமை',
    mycelialWeb: 'பூஞ்சை வேர் வலை நூல் இணைப்பு மீண்டும் இணைப்பு ஊட்டச்சத்து ஓட்டம் நிலத்தடி வலை வாழ்க்கை',
    corticalFold: 'புறணி மடிப்பு சுருக்கம் கைரஸ் சல்கஸ் டூரிங் வடிவம் வினை பரவல் உணர்வு மனம்',
    brainMesh: 'நரம்பு இணைப்பு புறணி சல்கஸ் கைரஸ் மடிப்பு மனம் மூளை உணர்வு சிந்தனை துடிப்பு',
    globalCircuit: 'உயிர்க்கோளம் சுற்று உலகம் இணைப்பு வலை முனை இணைப்பு துடிப்பு உணர்வு உலக மனம் பூமி',
    myceliumNetwork: 'மைசீலியம் நூல் கிளை மீண்டும் இணைப்பு ஊட்டச்சத்து ஓட்டம் நிலத்தடி வலை நூல் சமிக்ஞை பரிமாற்றம் விதை வாழ்க்கை',
    brushStroke: 'தூரிகை மை சைகை குறி காகிதம் நார் நிறம் எழுத்து கை அழுத்தம் முடி அமைப்பு ஈரம்',
    archCarving: 'உளி ஒரு வரியில் வடிவங்களைச் செதுக்குகிறது ஒவ்வொரு கோடும் வடிவம் மற்றும் தாளத்தின் கதையைச் சொல்கிறது',
    knitting: 'நெசவு பின்னல் லூப் தைப்பு நூல் துணி வடிவம் கேபிள் ரிப் இணைப்பு',
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
