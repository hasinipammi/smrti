// Per-language festival dataset (from the supplied specifics sheet).
// Each language shows only its own festivals in the quiz, with its own photo.

export type Fest = {
  name: string;
  /** asset key inside src/assets/fest3 */
  key: string;
  when: string;
  where: string;
};

const TE: Fest[] = [
  { name: "Dussehra", key: "telugu-dussehra", when: "September–October", where: "Telangana" },
  { name: "Diwali", key: "telugu-diwali", when: "October–November", where: "Telangana" },
  { name: "Pongal", key: "telugu-pongal", when: "January", where: "Andhra Pradesh" },
  { name: "Ganesh Chaturthi", key: "telugu-ganesh-chaturthi", when: "August–September", where: "Telangana" },
  { name: "Ugadi", key: "telugu-ugadi", when: "March–April", where: "Andhra Pradesh" },
  { name: "Holi", key: "telugu-holi", when: "March", where: "Telangana" },
  { name: "Bathukamma", key: "telugu-bathukamma", when: "September–October", where: "Telangana" },
  { name: "Bonalu", key: "telugu-bonalu", when: "July–August", where: "Telangana" },
  { name: "Sankranti", key: "telugu-sankranti", when: "January", where: "Andhra Pradesh" },
  { name: "Sri Rama Navami", key: "telugu-sri-rama-navami", when: "March–April", where: "Andhra Pradesh" },
];

const HI: Fest[] = [
  { name: "Navratri", key: "hindi-navratri", when: "September–October", where: "Delhi" },
  { name: "Holi", key: "hindi-holi", when: "March", where: "Uttar Pradesh" },
  { name: "Diwali", key: "hindi-diwali", when: "October–November", where: "Delhi" },
  { name: "Janmashtami", key: "hindi-janmashtami", when: "August", where: "Uttar Pradesh" },
  { name: "Ganesh Chaturthi", key: "hindi-ganesh-chaturthi", when: "August–September", where: "Madhya Pradesh" },
  { name: "Raksha Bandhan", key: "hindi-raksha-bandhan", when: "August", where: "Rajasthan" },
  { name: "Chhath Puja", key: "hindi-chhath-puja", when: "October–November", where: "Bihar" },
  { name: "Basant Panchami", key: "hindi-basant-panchami", when: "January–February", where: "Delhi" },
  { name: "Ram Navami", key: "hindi-ram-navami", when: "March–April", where: "Uttar Pradesh" },
  { name: "Bhai Dooj", key: "hindi-bhai-dooj", when: "October–November", where: "Delhi" },
  { name: "Teej", key: "hindi-teej", when: "July–August", where: "Rajasthan" },
  { name: "Karva Chauth", key: "hindi-karva-chauth", when: "October–November", where: "Punjab" },
];

const TA: Fest[] = [
  { name: "Puthandu", key: "tamil-puthandu", when: "April", where: "Tamil Nadu" },
  { name: "Pongal", key: "tamil-pongal", when: "January", where: "Tamil Nadu" },
  { name: "Thaipusam", key: "tamil-thaipusam", when: "January–February", where: "Tamil Nadu" },
  { name: "Karthigai Deepam", key: "tamil-karthigai-deepam", when: "November–December", where: "Tamil Nadu" },
  { name: "Chithirai Festival", key: "tamil-chithirai-festival", when: "April–May", where: "Madurai, Tamil Nadu" },
  { name: "Vinayagar Chaturthi", key: "tamil-vinayagar-chaturthi", when: "August–September", where: "Tamil Nadu" },
  { name: "Deepavali", key: "tamil-deepavali", when: "October–November", where: "Tamil Nadu" },
];

const BN: Fest[] = [
  { name: "Durga Puja", key: "bengali-durga-puja", when: "September–October", where: "West Bengal" },
  { name: "Pohela Boishakh", key: "bengali-pohela-boishakh", when: "April", where: "West Bengal" },
  { name: "Kali Puja", key: "bengali-kali-puja", when: "October–November", where: "West Bengal" },
  { name: "Saraswati Puja", key: "bengali-saraswati-puja", when: "January–February", where: "West Bengal" },
  { name: "Dol Jatra", key: "bengali-dol-jatra", when: "March", where: "West Bengal" },
  { name: "Jamai Shashthi", key: "bengali-jamai-shashthi", when: "May–June", where: "West Bengal" },
  { name: "Nabanna", key: "bengali-nabanna", when: "November", where: "West Bengal" },
];

const OR: Fest[] = [
  { name: "Rath Yatra", key: "odia-rath-yatra", when: "June–July", where: "Puri, Odisha" },
  { name: "Nuakhai", key: "odia-nuakhai", when: "August–September", where: "Western Odisha" },
  { name: "Kali Puja", key: "odia-kali-puja", when: "October–November", where: "Odisha" },
  { name: "Durga Puja", key: "odia-durga-puja", when: "September–October", where: "Cuttack, Odisha" },
  { name: "Snana Yatra", key: "odia-snana-yatra", when: "May–June", where: "Puri, Odisha" },
  { name: "Raja Parba", key: "odia-raja-parba", when: "June", where: "Odisha" },
];

/** English plays with a mixed pan-India set (one entry per festival name). */
const EN: Fest[] = (() => {
  const seen = new Set<string>();
  const out: Fest[] = [];
  for (const f of [...HI, ...TE, ...TA, ...BN, ...OR]) {
    if (seen.has(f.name)) continue;
    seen.add(f.name);
    out.push(f);
  }
  return out;
})();

export const FESTIVALS_BY_LANG: Record<string, Fest[]> = {
  en: EN,
  hi: HI,
  te: TE,
  ta: TA,
  bn: BN,
  or: OR,
};

export const festivalsFor = (langCode?: string): Fest[] =>
  FESTIVALS_BY_LANG[langCode ?? "en"] ?? EN;

export const ALL_PLACES = Array.from(new Set(EN.concat(HI, TE, TA, BN, OR).map((f) => f.where)));
export const ALL_WHENS = Array.from(new Set(EN.concat(HI, TE, TA, BN, OR).map((f) => f.when)));
