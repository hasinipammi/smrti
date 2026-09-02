import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Home, Volume2, VolumeX, Languages, UserRound, Pencil, Maximize, Minimize, Sparkles, SlidersHorizontal, ShieldCheck, ChevronDown } from "lucide-react";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import chestAsset from "@/assets/treasure-chest.png.asset.json";
import coinAsset from "@/assets/gold-coin.png.asset.json";
import clapAudio from "@/assets/clap.wav.asset.json";
import coinAudio from "@/assets/coin.wav.asset.json";
import fruitsIcon from "@/assets/theme-fruits.png.asset.json";
import colorsIcon from "@/assets/theme-colors.png.asset.json";
import festivalsIcon from "@/assets/theme-festivals.png.asset.json";
import dishesIcon from "@/assets/theme-dishes.png.asset.json";
import memoryModeIcon from "@/assets/mode-memory.png.asset.json";
import mcqModeIcon from "@/assets/mode-mcq.png.asset.json";
import smrtiSymbol from "@/assets/smrti-symbol-v6.png.asset.json";
import { DISH_PHOTO_ITEMS } from "@/lib/dish-items";
import {
  QUIZ_BANKS,
  buildFestivalBank,
  FOOD_BANK,
  QUIZ_QUESTIONS_PER_LEVEL,
  QUIZ_PASS_MARK,
  QUIZ_LEVEL_POINTS,
  type BankQ,
} from "@/lib/mcq-data";
import { translateOption, translatePrompt } from "@/lib/quiz-i18n";
import { t as tr, themeLabel, themeSub } from "@/lib/ui-i18n";




export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smṛti — India's first brain game in regional languages" },
      {
        name: "description",
        content:
          "A gentle memory game in regional Indian languages designed to support cognitive stimulation for people living with Alzheimer's.",
      },
      { property: "og:title", content: "Smṛti — India's first brain game in regional languages" },
      {
        property: "og:description",
        content: "A gentle memory game in regional Indian languages designed to support cognitive stimulation for people living with Alzheimer's.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmrtiApp,
});

type Screen = "home" | "name" | "lang" | "mode" | "theme" | "level" | "game";
const PROFILE_KEY = "smrti-profile";
type GameMode = "memory" | "mcq";
type Lang = { code: string; native: string; english: string };
type Theme = { id: string; label: string; sub: string; icon: string };

// SERIF is threaded through inline styles all over this file; pointing it at
// the design token swaps the whole app onto Fraunces + Noto Serif Indic at once.
const SERIF = "var(--font-display)";
const BODY = "var(--font-body)";

const CONFETTI_COLORS = ["#ff8a3d", "#f7d43a", "#4ade80", "#7c9cff", "#e879f9"];

const LANGS: Lang[] = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia" },
];

const FOOD_THEME: Theme = { id: "food", label: "Food", sub: "Fruits, vegetables & Indian dishes", icon: fruitsIcon.url };
const FESTIVALS_THEME: Theme = { id: "festivals", label: "Festivals", sub: "Indian celebrations", icon: festivalsIcon.url };
const COLORS_THEME: Theme = { id: "colors", label: "Colors & Shapes", sub: "Bright and simple", icon: colorsIcon.url };

const DISHES_THEME: Theme = { id: "dishes", label: "Indian Dishes", sub: "Dosa, biryani, sweets & more", icon: dishesIcon.url };
const FRUITSVEG_THEME: Theme = { id: "fruitsveg", label: "Fruits & Veggies", sub: "Everyday fruits and vegetables", icon: fruitsIcon.url };

const MEMORY_THEMES: Theme[] = [FRUITSVEG_THEME, DISHES_THEME, COLORS_THEME];
const MCQ_THEMES: Theme[] = [DISHES_THEME, FESTIVALS_THEME, FRUITSVEG_THEME];



const LEVELS = [
  { n: 1, cards: 4, pts: 100, maxTurns: 5 },
  { n: 2, cards: 6, pts: 200, maxTurns: 8 },
  { n: 3, cards: 8, pts: 250, maxTurns: 10 },
  { n: 4, cards: 10, pts: 300, maxTurns: 15 },
  { n: 5, cards: 12, pts: 500, maxTurns: 18 },
];

const maxTurnsFor = (level: typeof LEVELS[number]) => level.maxTurns;

const bankFor = (themeId: string, langCode?: string) =>
  themeId === "festivals" ? buildFestivalBank(langCode) : (QUIZ_BANKS[themeId] ?? FOOD_BANK);

const levelsFor = (mode: GameMode, theme: Theme, langCode?: string) => {
  if (mode === "memory") return LEVELS;
  const bank = bankFor(theme.id, langCode);
  return LEVELS.filter((lv) => bank[lv.n] && bank[lv.n].length > 0);
};

type Item = { emoji: string; image?: string; english: string; labels: Record<string, string> };

const FOOD_ITEMS: Item[] = [
  { emoji: "🍎", english: "Apple", labels: { en: "Apple", hi: "सेब", te: "ఆపిల్", ta: "ஆப்பிள்", bn: "আপেল", or: "ଆପେଲ" } },
  { emoji: "🍌", english: "Banana", labels: { en: "Banana", hi: "केला", te: "అరటి", ta: "வாழை", bn: "কলা", or: "କଦଳୀ" } },
  { emoji: "🥕", english: "Carrot", labels: { en: "Carrot", hi: "गाजर", te: "క్యారెట్", ta: "கேரட்", bn: "গাজর", or: "ଗାଜର" } },
  { emoji: "🍇", english: "Grapes", labels: { en: "Grapes", hi: "अंगूर", te: "ద్రాక్ష", ta: "திராட்சை", bn: "আঙুর", or: "ଅଙ୍ଗୁର" } },
  { emoji: "🍅", english: "Tomato", labels: { en: "Tomato", hi: "टमाटर", te: "టమాటా", ta: "தக்காளி", bn: "টমেটো", or: "ଟମାଟୋ" } },
  { emoji: "🥭", english: "Mango", labels: { en: "Mango", hi: "आम", te: "మామిడి", ta: "மாம்பழம்", bn: "আম", or: "ଆମ୍ବ" } },
];

// Replacement pool used when a level is repeated
const FOOD_SWAP: Item[] = [
  { emoji: "🍍", english: "Pineapple", labels: { en: "Pineapple", hi: "अनानास", te: "అనాస", ta: "அன்னாசி", bn: "আনারস", or: "ସପୁରି" } },
  { emoji: "🍉", english: "Watermelon", labels: { en: "Watermelon", hi: "तरबूज़", te: "పుచ్చకాయ", ta: "தர்பூசணி", bn: "তরমুজ", or: "ତରଭୁଜ" } },
  { emoji: "🍊", english: "Orange", labels: { en: "Orange", hi: "संतरा", te: "నారింజ", ta: "ஆரஞ்சு", bn: "কমলা", or: "କମଳା" } },
];

const COLOR_ITEMS: Item[] = [
  { emoji: "🔴", english: "Red", labels: { en: "Red", hi: "लाल", te: "ఎరుపు", ta: "சிவப்பு", bn: "লাল", or: "ଲାଲ" } },
  { emoji: "🟡", english: "Yellow", labels: { en: "Yellow", hi: "पीला", te: "పసుపు", ta: "மஞ்சள்", bn: "হলুদ", or: "ହଳଦିଆ" } },
  { emoji: "🔵", english: "Blue", labels: { en: "Blue", hi: "नीला", te: "నీలం", ta: "நீலம்", bn: "নীল", or: "ନୀଳ" } },
  { emoji: "🟢", english: "Green", labels: { en: "Green", hi: "हरा", te: "ఆకుపచ్చ", ta: "பச்சை", bn: "সবুজ", or: "ସବୁଜ" } },
  { emoji: "🟣", english: "Purple", labels: { en: "Purple", hi: "बैंगनी", te: "ఊదా", ta: "ஊதா", bn: "বেগুনি", or: "ବାଇଗଣି" } },
  { emoji: "🟠", english: "Orange", labels: { en: "Orange", hi: "नारंगी", te: "నారింజ", ta: "ஆரஞ்சு", bn: "কমলা", or: "କମଳା" } },
];

const COLOR_SWAP: Item[] = [
  { emoji: "🟤", english: "Brown", labels: { en: "Brown", hi: "भूरा", te: "గోధుమ", ta: "பழுப்பு", bn: "বাদামি", or: "ବାଦାମୀ" } },
  { emoji: "⚫", english: "Black", labels: { en: "Black", hi: "काला", te: "నలుపు", ta: "கருப்பு", bn: "কালো", or: "କଳା" } },
  { emoji: "⚪", english: "White", labels: { en: "White", hi: "सफ़ेद", te: "తెలుపు", ta: "வெள்ளை", bn: "সাদা", or: "ଧଳା" } },
];

const FESTIVAL_ITEMS: Item[] = [
  { emoji: "🪔", english: "Diya", labels: { en: "Diya", hi: "दीया", te: "దీపం", ta: "தீபம்", bn: "প্রদীপ", or: "ଦୀପ" } },
  { emoji: "🎆", english: "Fireworks", labels: { en: "Fireworks", hi: "आतिशबाज़ी", te: "బాణసంచా", ta: "வானவேடிக்கை", bn: "আতশবাজি", or: "ଆତସବାଜି" } },
  { emoji: "🌸", english: "Rangoli", labels: { en: "Rangoli", hi: "रंगोली", te: "రంగోలి", ta: "கோலம்", bn: "রঙ্গোলি", or: "ରଙ୍ଗୋଲି" } },
  { emoji: "🥁", english: "Drum", labels: { en: "Drum", hi: "ढोल", te: "డోలు", ta: "மேளம்", bn: "ঢোল", or: "ଢୋଲ" } },
  { emoji: "🎁", english: "Gift", labels: { en: "Gift", hi: "उपहार", te: "బహుమతి", ta: "பரிசு", bn: "উপহার", or: "ଉପହାର" } },
  { emoji: "🌺", english: "Garland", labels: { en: "Garland", hi: "माला", te: "మాల", ta: "மாலை", bn: "মালা", or: "ମାଳା" } },
];
const FESTIVAL_SWAP: Item[] = [
  { emoji: "🕯️", english: "Candle", labels: { en: "Candle", hi: "मोमबत्ती", te: "కొవ్వొత్తి", ta: "மெழுகுவர்த்தி", bn: "মোমবাতি", or: "ମହମବତୀ" } },
  { emoji: "🎊", english: "Confetti", labels: { en: "Confetti", hi: "फूल", te: "పుష్పాలు", ta: "மலர்கள்", bn: "ফুল", or: "ଫୁଲ" } },
  { emoji: "🔔", english: "Bell", labels: { en: "Bell", hi: "घंटी", te: "గంట", ta: "மணி", bn: "ঘণ্টা", or: "ଘଣ୍ଟା" } },
];

const DISH_ITEMS: Item[] = [
  { emoji: "🥞", english: "Dosa", labels: { en: "Dosa", hi: "डोसा", te: "దోస", ta: "தோசை", bn: "দোসা", or: "ଦୋସା" } },
  { emoji: "🍛", english: "Curry", labels: { en: "Curry", hi: "करी", te: "కూర", ta: "கறி", bn: "তরকারি", or: "ତରକାରୀ" } },
  { emoji: "🍚", english: "Rice", labels: { en: "Rice", hi: "चावल", te: "అన్నం", ta: "சாதம்", bn: "ভাত", or: "ଭାତ" } },
  { emoji: "🫓", english: "Roti", labels: { en: "Roti", hi: "रोटी", te: "రొట్టె", ta: "ரொட்டி", bn: "রুটি", or: "ରୁଟି" } },
  { emoji: "🍢", english: "Kebab", labels: { en: "Kebab", hi: "कबाब", te: "కబాబ్", ta: "கபாப்", bn: "কাবাব", or: "କବାବ" } },
  { emoji: "🍮", english: "Kheer", labels: { en: "Kheer", hi: "खीर", te: "పాయసం", ta: "பாயசம்", bn: "পায়েস", or: "କ୍ଷୀରି" } },
];
const DISH_SWAP: Item[] = [
  { emoji: "🥘", english: "Biryani", labels: { en: "Biryani", hi: "बिरयानी", te: "బిర్యానీ", ta: "பிரியாணி", bn: "বিরিয়ানি", or: "ବିରିୟାନି" } },
  { emoji: "🍩", english: "Vada", labels: { en: "Vada", hi: "वड़ा", te: "వడ", ta: "வடை", bn: "বড়া", or: "ବଡ଼ା" } },
  { emoji: "🥟", english: "Samosa", labels: { en: "Samosa", hi: "समोसा", te: "సమోసా", ta: "சமோசா", bn: "সিঙ্গাড়া", or: "ସମୋସା" } },
];

type Card = {
  id: number;
  key: string;
  emoji: string;
  image?: string;
  label: string;
  english: string;
  flipped: boolean;
  matched: boolean;
  jitter: boolean;
  wrong: boolean;
};


// Food = fruits, vegetables and Indian dishes together
const FOOD_ALL: Item[] = [
  FOOD_ITEMS[0], DISH_ITEMS[0], FOOD_ITEMS[2], DISH_ITEMS[1], FOOD_ITEMS[1], DISH_ITEMS[3],
  FOOD_ITEMS[4], DISH_ITEMS[2], FOOD_ITEMS[5], DISH_ITEMS[5], FOOD_ITEMS[3], DISH_ITEMS[4],
];
const FOOD_ALL_SWAP: Item[] = [...FOOD_SWAP, ...DISH_SWAP];

function buildDeck(theme: Theme, lang: Lang, cardCount: number, attempt: number): Card[] {
  const pools: Record<string, { base: Item[]; swap: Item[] }> = {
    food: { base: FOOD_ALL, swap: FOOD_ALL_SWAP },
    fruitsveg: { base: FOOD_ITEMS, swap: FOOD_SWAP },
    dishes: { base: DISH_PHOTO_ITEMS, swap: DISH_PHOTO_ITEMS },
    colors: { base: COLOR_ITEMS, swap: COLOR_SWAP },
    festivals: { base: FESTIVAL_ITEMS, swap: FESTIVAL_SWAP },
  };
  const { base: basePool, swap: swapPool } = pools[theme.id] ?? pools.food;
  const pairs = cardCount / 2;
  let chosen: Item[];
  if (theme.id === "dishes") {
    // Each level gets its own set of dish photos: L1 0-1, L2 2-4, L3 5-8, L4 9-13, L5 14-19
    const start = ((pairs - 2) * (pairs + 1)) / 2; // 0, 2, 5, 9, 14
    chosen = Array.from({ length: pairs }, (_, i) => basePool[(start + i) % basePool.length]);
  } else {
    chosen = basePool.slice(0, pairs);
  }
  // On repeats, swap one item and rotate the set slightly for a fresh arrangement
  if (attempt > 0) {
    const replaceIdx = attempt % chosen.length;
    const used = new Set(chosen.map((c) => c.english));
    const candidates = swapPool.filter((s) => !used.has(s.english));
    const swap = candidates.length
      ? candidates[(attempt - 1) % candidates.length]
      : swapPool[(attempt - 1) % swapPool.length];
    chosen = chosen.map((c, i) => (i === replaceIdx ? swap : c));
  }
  const cards: Card[] = [];
  let id = 0;
  for (const c of chosen) {
    for (let k = 0; k < 2; k++) {
      cards.push({
        id: id++,
        key: c.english,
        emoji: c.emoji,
        image: c.image,
        english: c.english,
        label: c.labels[lang.code] ?? c.labels.en,
        flipped: false,
        matched: false,
        jitter: false,
        wrong: false,
      });
    }

  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/* ============================ MOTION HELPERS ============================
   Smṛti is built for people living with Alzheimer's, so motion is opt-out
   at the OS level: prefers-reduced-motion suppresses confetti and the
   scroll-reveal transitions as well as the CSS animations. */

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Arm the reveal before the browser paints, so the element never flashes in
// at full opacity and then jumps back to hidden.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reveals an element the first time it scrolls into view.
 *
 * Fails open: the element is visible unless this hook has successfully
 * attached an observer, and a watchdog un-hides it anyway if the observer
 * somehow never fires. Content is never left stranded at opacity 0.
 */
function useReveal<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      return; // leave it plainly visible
    }
    el.style.transitionDelay = `${delay}ms`;
    el.classList.add("reveal-armed");

    const show = () => el.classList.add("is-visible");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    const watchdog = setTimeout(show, 3000);
    return () => { clearTimeout(watchdog); io.disconnect(); };
  }, [delay]);
  return ref;
}

/** Eases a number up to `value` so the coin total never jumps. */
function useCountUp(value: number, duration = 700) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    if (prefersReducedMotion()) { setShown(value); return; }
    const from = fromRef.current;
    if (from === value) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  useEffect(() => { fromRef.current = shown; }, [shown]);
  return shown;
}

/** Fires only when `value` grows, for the coin-counter pop. */
function useBumpOnIncrease(value: number, ms = 500) {
  const [bumping, setBumping] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (value > prev.current) {
      setBumping(true);
      const t = setTimeout(() => setBumping(false), ms);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value, ms]);
  return bumping;
}

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
export function setSoundEnabled(v: boolean) { soundEnabled = v; }
export function isSoundEnabled() { return soundEnabled; }

function playMatchSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx!;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      o.type = "sine";
      g.gain.setValueAtTime(0.0001, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.3);
    });
  } catch {}
}

function playBuzzSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx!;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(220, now);
    o.frequency.exponentialRampToValueAtTime(110, now + 0.35);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.42);
  } catch {}
}

// Short "click / select" jitter sound — soft blip for UI feedback
function playClickSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx!;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(880, now);
    o.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.14);
  } catch {}
}

// Play a clip with a smooth fade-out instead of an abrupt cutoff
function playAudioClip(url: string, maxSeconds?: number, volume = 0.3, fadeSeconds = 0.8) {
  if (!soundEnabled) return null;
  try {
    const a = new Audio(url);
    a.volume = volume;
    a.play().catch(() => {});
    if (maxSeconds) {
      const fadeMs = Math.min(fadeSeconds, maxSeconds) * 1000;
      const startFadeAt = Math.max(0, maxSeconds * 1000 - fadeMs);
      const steps = 20;
      setTimeout(() => {
        const startVol = a.volume;
        let step = 0;
        const interval = setInterval(() => {
          step++;
          const next = startVol * (1 - step / steps);
          a.volume = Math.max(0, next);
          if (step >= steps) {
            clearInterval(interval);
            try { a.pause(); } catch {}
          }
        }, fadeMs / steps);
      }, startFadeAt);
    }
    return a;
  } catch { return null; }
}






function SmrtiApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [coins, setCoins] = useState(0);
  const [lang, setLang] = useState<Lang | null>(null);
  const [mode, setMode] = useState<GameMode>("memory");
  const [theme, setTheme] = useState<Theme | null>(null);
  const [level, setLevel] = useState<(typeof LEVELS)[number] | null>(null);
  const [attempt, setAttempt] = useState(0);
  const chestRef = useRef<HTMLDivElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [userName, setUserName] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [startedOn, setStartedOn] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => { setSoundEnabled(soundOn); }, [soundOn]);

  // Track browser/OS fullscreen state (incl. exits via Esc) for the fullscreen toggle button
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Restore a saved profile — name + language are only asked once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { name?: string; langCode?: string; startedOn?: string };
      const l = LANGS.find((x) => x.code === saved.langCode);
      if (saved.name && l) {
        setUserName(saved.name);
        setLang(l);
        setSignedIn(true);
        setStartedOn(saved.startedOn ?? null);
      }
    } catch {}
  }, []);

  const saveProfile = (name: string, l: Lang) => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const existing = raw ? (JSON.parse(raw) as { startedOn?: string }) : undefined;
      const nextStartedOn = existing?.startedOn ?? new Date().toISOString();
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, langCode: l.code, startedOn: nextStartedOn }));
      setStartedOn(nextStartedOn);
    } catch {}
    setSignedIn(true);
  };

  // Lets the Account panel rename the profile without touching language/start date
  const updateName = (name: string) => {
    setUserName(name);
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...existing, name }));
    } catch {}
  };

  const openAccount = () => {
    playClickSound();
    setNameDraft(userName);
    setEditingName(false);
    setAccountOpen(true);
  };

  const startFlow = () => setScreen(signedIn ? "mode" : "name");
  const goGames = () => setScreen(signedIn ? "mode" : "home");

  const back = () => {
    if (screen === "name") setScreen("home");
    else if (screen === "lang") setScreen("name");
    else if (screen === "mode") setScreen(signedIn ? "home" : "lang");
    else if (screen === "theme") setScreen("mode");
    else if (screen === "level") setScreen("theme");
    else if (screen === "game") setScreen("level");
  };

  const goToLevel = (n: number) => {
    const lv = LEVELS.find((l) => l.n === n);
    if (lv) {
      setLevel(lv);
      setAttempt(0);
      setScreen("game");
    } else {
      setScreen("level");
    }
  };

  const retrySameLevel = () => {
    setAttempt((a) => a + 1);
    setScreen("game");
  };

  // Coins ease up to their new total and the chest gives a single pop, so
  // earning is legible without a distracting flourish.
  const coinsShown = useCountUp(coins);
  const coinsBumping = useBumpOnIncrease(coins);

  return (
    <div
      className={`grain min-h-screen flex flex-col relative ${screen === "home" ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{
        fontFamily: SERIF,
        background:
          "linear-gradient(175deg, #fdecc3 0%, #fbdcc6 26%, #f9cbd6 52%, #ecc8f1 78%, #d9bdf7 100%)",
      }}
    >
      {/* Ambient aurora. Three blobs on long, offset cycles (34s base) so the
          backdrop breathes without ever drawing the eye away from the game. */}
      <div aria-hidden className="aurora absolute pointer-events-none" style={{ top: "-12%", left: "-10%", width: "62%", height: "62%", background: "radial-gradient(circle, rgba(253,235,190,0.62) 0%, rgba(253,235,190,0) 66%)" }} />
      <div aria-hidden className="aurora absolute pointer-events-none" style={{ bottom: "-16%", right: "-10%", width: "66%", height: "72%", background: "radial-gradient(circle, rgba(226,196,245,0.55) 0%, rgba(226,196,245,0) 66%)", animationDuration: "46s", animationDirection: "reverse" }} />
      <div aria-hidden className="aurora absolute pointer-events-none" style={{ top: "28%", right: "18%", width: "44%", height: "48%", background: "radial-gradient(circle, rgba(255,196,170,0.34) 0%, rgba(255,196,170,0) 68%)", animationDuration: "58s", animationDelay: "-12s" }} />


      <header className="anim-fade-in relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <button onClick={goGames} className="tappable group flex items-center gap-2.5 rounded-2xl px-2 py-1 text-neutral-900">
          <img src={smrtiSymbol.url} alt="" className="float-soft w-10 h-10 rounded-lg object-contain" />
          <span className="text-3xl font-bold tracking-tight" style={{ fontFamily: SERIF }}>Smṛti</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSoundOn((s) => !s); }}
            aria-label={soundOn ? tr(lang?.code, "muteSounds") : tr(lang?.code, "unmuteSounds")}
            className="tappable glass grid place-items-center w-11 h-11 rounded-full text-neutral-900"
          >
            {soundOn
              ? <Volume2 key="on" className="anim-pop w-5 h-5" />
              : <VolumeX key="off" className="anim-pop w-5 h-5 text-neutral-500" />}
          </button>
          <div ref={chestRef} className="glass flex items-center gap-2 rounded-full pl-2 pr-5 py-2">
            <img
              src={chestAsset.url}
              alt="Treasure chest"
              className={`w-11 h-11 object-contain ${coinsBumping ? "coin-pop" : ""}`}
            />
            <span className="font-bold text-neutral-900 text-2xl tabular-nums">{coinsShown}</span>
            <span className="text-base text-neutral-600" style={{ fontFamily: BODY }}>{tr(lang?.code, "coins")}</span>
          </div>
        </div>

      </header>


      {/* Language + Account sit leftmost on every screen, per design notes; Home/Back (when shown) sit right. */}
      <div className="relative z-20 px-6 sm:px-10 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => { playClickSound(); setLangMenuOpen((o) => !o); }}
            aria-expanded={langMenuOpen}
            className="tappable glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-neutral-900"
            style={{ fontFamily: BODY }}
          >
            <Languages className={`w-4 h-4 transition-transform duration-300 ${langMenuOpen ? "rotate-12" : ""}`} />
            {tr(lang?.code, "language")}
            {lang && <span className="text-neutral-500">· {lang.native}</span>}
          </button>
          {langMenuOpen && (
            <div className="anim-fade-up absolute left-0 mt-2 w-52 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-black/5 p-2 z-30 origin-top-left">
              {LANGS.map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => {
                    playClickSound();
                    setLang(l);
                    setLangMenuOpen(false);
                    if (signedIn) saveProfile(userName, l);
                  }}
                  style={{ animationDelay: `${i * 35}ms` }}
                  className={`anim-fade-up w-full text-left rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-neutral-100 ${lang?.code === l.code ? "bg-neutral-100 ring-1 ring-[#5B2A8C]/25" : ""}`}
                >
                  <div className="text-base font-semibold text-neutral-900">{l.native}</div>
                  <div className="text-xs text-neutral-500" style={{ fontFamily: BODY }}>{l.english}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={openAccount}
          className="tappable glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-neutral-900"
          style={{ fontFamily: BODY }}
        >
          <UserRound className="w-4 h-4" />
          {tr(lang?.code, "account")}
        </button>

        {screen !== "home" && (
          <div className="anim-fade-in ml-auto flex items-center gap-2">
            <button onClick={goGames} className="tappable glass group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-neutral-800" style={{ fontFamily: BODY }}>
              <Home className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" /> {tr(lang?.code, "home")}
            </button>
            <button onClick={back} className="tappable glass group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-neutral-800" style={{ fontFamily: BODY }}>
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" /> {tr(lang?.code, "back")}
            </button>
          </div>
        )}
      </div>


      <main className={`relative z-10 flex-1 flex px-6 py-10 ${screen === "home" ? "flex-col items-center justify-start" : "items-center justify-center"}`}>
        {/* Keyed on `screen`, so React remounts on every navigation and the
            entrance animation replays — a soft cross-fade between steps. */}
        <div key={screen} className="anim-fade-up w-full flex flex-col items-center">
        {screen === "home" && <HomeScreen langCode={lang?.code} onBegin={() => { playClickSound(); startFlow(); }} />}
        {screen === "name" && (
          <NameScreen
            langCode={lang?.code}
            initial={userName}
            onSubmit={(n) => { playClickSound(); setUserName(n); setScreen("lang"); }}
          />
        )}
        {screen === "lang" && (
          <Step title={tr(lang?.code, "chooseLanguage")} step={1} langCode={lang?.code}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              {LANGS.map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => { playClickSound(); setLang(l); saveProfile(userName, l); setScreen("mode"); }}
                  style={{ animationDelay: `${i * 55}ms` }}
                  className="anim-pop tappable glass rounded-2xl px-5 py-6 hover:bg-white"
                >
                  <div className="text-2xl font-bold text-neutral-900">{l.native}</div>
                  <div className="text-sm text-neutral-600 mt-1" style={{ fontFamily: BODY }}>{l.english}</div>
                </button>
              ))}

            </div>
          </Step>
        )}
        {screen === "mode" && (
          <Step title={tr(lang?.code, "games")} step={2} langCode={lang?.code}>
            <div className="grid sm:grid-cols-2 gap-5 w-full max-w-3xl">
              <button
                onClick={() => { playClickSound(); setMode("memory"); setScreen("theme"); }}
                style={{ animationDelay: "0ms" }}
                className="anim-pop tappable glass rounded-2xl p-8 text-left hover:bg-white flex items-center gap-5"
              >
                <span className="rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={memoryModeIcon.url} alt="" className="zoomable block w-20 h-20 object-cover" />
                </span>
                <span>
                  <span className="block text-2xl font-bold text-neutral-900">{tr(lang?.code, "memoryMatch")}</span>
                  <span className="block text-base text-neutral-600 mt-1" style={{ fontFamily: BODY }}>{tr(lang?.code, "memoryMatchSub")}</span>
                </span>
              </button>
              <button
                onClick={() => { playClickSound(); setMode("mcq"); setScreen("theme"); }}
                style={{ animationDelay: "90ms" }}
                className="anim-pop tappable glass rounded-2xl p-8 text-left hover:bg-white flex items-center gap-5"
              >
                <span className="rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={mcqModeIcon.url} alt="" className="zoomable block w-20 h-20 object-cover" />
                </span>
                <span>
                  <span className="block text-2xl font-bold text-neutral-900">{tr(lang?.code, "quiz")}</span>
                  <span className="block text-base text-neutral-600 mt-1" style={{ fontFamily: BODY }}>{tr(lang?.code, "quizSub")}</span>
                </span>
              </button>
            </div>
          </Step>
        )}
        {screen === "theme" && (
          <Step title={tr(lang?.code, "pickTheme")} step={3} langCode={lang?.code}>
            <div className="grid sm:grid-cols-2 gap-5 w-full max-w-3xl">
              {(mode === "mcq" ? MCQ_THEMES : MEMORY_THEMES).map((t: Theme, i) => (
                <button
                  key={t.id}
                  onClick={() => { playClickSound(); setTheme(t); setScreen("level"); }}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="anim-pop tappable glass rounded-2xl p-6 text-left hover:bg-white flex items-center gap-4"
                >
                  <span className="rounded-xl overflow-hidden flex-shrink-0">
                    <img src={t.icon} alt="" className="zoomable block w-20 h-20 object-contain" />
                  </span>
                  <div>
                    <div className="text-xl font-bold text-neutral-900">{themeLabel(t.id, lang?.code, t.label)}</div>
                    <div className="text-sm text-neutral-600 mt-1" style={{ fontFamily: BODY }}>{themeSub(t.id, lang?.code, t.sub)}</div>
                  </div>
                </button>
              ))}
            </div>

          </Step>
        )}
        {screen === "level" && theme && (
          <Step title={tr(lang?.code, "chooseLevel")} step={4} langCode={lang?.code}>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {levelsFor(mode, theme, lang?.code).map((lv, i) => (
                <button
                  key={lv.n}
                  onClick={() => { playClickSound(); setLevel(lv); setAttempt(0); setScreen("game"); }}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="anim-pop tappable glass group rounded-2xl p-5 text-left hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-bold text-neutral-900">{tr(lang?.code, "level", lv.n)}</div>
                    <div
                      className="text-xs font-semibold text-white rounded-full px-2.5 py-1 whitespace-nowrap transition-colors duration-300 group-hover:bg-[#5B2A8C]"
                      style={{ backgroundColor: "#171717", fontFamily: BODY }}
                    >
                      {mode === "mcq" ? QUIZ_LEVEL_POINTS[lv.n] : lv.pts} {tr(lang?.code, "coins")}
                    </div>
                  </div>
                  <div className="text-sm text-neutral-600 mt-1" style={{ fontFamily: BODY }}>{mode === "mcq" ? tr(lang?.code, "questions", QUIZ_QUESTIONS_PER_LEVEL) : tr(lang?.code, "cards", lv.cards)}</div>
                </button>
              ))}
            </div>
          </Step>
        )}
        {screen === "game" && lang && theme && level && mode === "memory" && (
          <Game
            key={`${level.n}-${theme.id}-${lang.code}-${attempt}`}
            lang={lang}
            theme={theme}
            level={level}
            attempt={attempt}
            chestRef={chestRef}
            onCoins={(pts) => setCoins((c) => c + pts)}
            onContinueNext={goToLevel}
            onRetry={retrySameLevel}
            onHome={goGames}
          />
        )}
        {screen === "game" && lang && theme && level && mode === "mcq" && (
          <Quiz
            key={`q-${level.n}-${theme.id}-${lang.code}-${attempt}`}
            lang={lang}
            theme={theme}
            level={level}
            attempt={attempt}
            chestRef={chestRef}
            onCoins={(pts) => setCoins((c) => c + pts)}
            onContinueNext={goToLevel}
            onRetry={retrySameLevel}
            onHome={goGames}
          />
        )}
        </div>
      </main>

      {/* EXTRA: circular fullscreen toggle, always available at the bottom of the screen */}
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? tr(lang?.code, "fullscreenExit") : tr(lang?.code, "fullscreenEnter")}
        className="tappable glass fixed bottom-6 right-6 z-30 grid place-items-center w-12 h-12 rounded-full text-neutral-900"
      >
        {isFullscreen
          ? <Minimize key="min" className="anim-pop w-5 h-5" />
          : <Maximize key="max" className="anim-pop w-5 h-5" />}
      </button>

      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="sm:max-w-md" style={{ fontFamily: SERIF }}>
          <DialogHeader>
            <DialogTitle>{tr(lang?.code, "account")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{tr(lang?.code, "accountFullName")}</div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const trimmed = nameDraft.trim();
                      if (trimmed) updateName(trimmed);
                      setEditingName(false);
                    }}
                    className="tappable rounded-full bg-neutral-900 hover:bg-black text-white px-4 py-2 text-sm font-medium"
                  >
                    {tr(lang?.code, "accountSave")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-neutral-900">{userName || "—"}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    aria-label={tr(lang?.code, "accountEdit")}
                    className="rounded-full p-1.5 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 hover:rotate-12"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{tr(lang?.code, "language")}</div>
              <span className="text-lg font-medium text-neutral-900">{lang?.native ?? "—"}</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{tr(lang?.code, "accountStartedOn")}</div>
              <span className="text-lg font-medium text-neutral-900">
                {startedOn ? format(new Date(startedOn), "d MMM yyyy") : "—"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="tappable rounded-full bg-neutral-100 hover:bg-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900">
                {tr(lang?.code, "accountClose")}
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes jitter {
          0%,100% { transform: translate(0,0) rotate(0); }
          20% { transform: translate(-3px,-2px) rotate(-3deg); }
          40% { transform: translate(3px,-1px) rotate(3deg); }
          60% { transform: translate(-2px,2px) rotate(-2deg); }
          80% { transform: translate(2px,1px) rotate(2deg); }
        }
        .jitter { animation: jitter 0.55s ease-in-out; }
        @keyframes type-in {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        .type-in { animation: type-in 1.4s steps(20, end) forwards; }
        @keyframes bounce-in {
          0% { transform: scale(0.4) translateY(-40px); opacity: 0; }
          55% { transform: scale(1.15) translateY(0); opacity: 1; }
          75% { transform: scale(0.95) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }
        .bounce-in { animation: bounce-in 0.9s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>
    </div>
  );
}

function NameScreen({ initial, onSubmit, langCode }: { initial: string; onSubmit: (n: string) => void; langCode?: string }) {
  const [value, setValue] = useState(initial);
  const trimmed = value.trim();
  return (
    <div className="w-full max-w-xl flex flex-col items-center text-center" style={{ fontFamily: SERIF }}>
      <h2 className="anim-fade-up text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">{tr(langCode, "enterName")}</h2>
      <form
        className="w-full flex flex-col items-center gap-6"
        onSubmit={(e) => { e.preventDefault(); if (trimmed) onSubmit(trimmed); }}
      >
        <input
          autoFocus
          value={value}
          maxLength={40}
          onChange={(e) => setValue(e.target.value)}
          placeholder={tr(langCode, "enterName")}
          style={{ fontFamily: SERIF, animationDelay: "90ms" }}
          className="anim-fade-up w-full rounded-2xl bg-white/90 border border-black/10 shadow-sm px-6 py-5 text-2xl text-center text-neutral-900 outline-none transition-all duration-300 focus:border-[#5B2A8C] focus:bg-white focus:shadow-[0_0_0_6px_rgba(91,42,140,0.10)]"
        />
        <button
          type="submit"
          disabled={!trimmed}
          style={{ animationDelay: "180ms" }}
          className="anim-fade-up sheen tappable group inline-flex items-center gap-2 rounded-full bg-neutral-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-5 text-xl font-medium shadow-lg"
        >
          {tr(langCode, "continueWord")}
          <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
}

function HomeScreen({ onBegin, langCode }: { onBegin: () => void; langCode?: string }) {
  const factsRef = useReveal<HTMLElement>();
  const trustRef = useReveal<HTMLElement>();
  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-2xl text-center">
        <div className="anim-fade-up mx-auto mb-6 flex items-center justify-center gap-3">
          <div className="glass float-soft grid place-items-center w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
            <img src={smrtiSymbol.url} alt="Smṛti symbol" className="w-11 h-11 object-contain" />
          </div>
          <span className="text-2xl font-bold text-neutral-900" style={{ fontFamily: SERIF }}>Smṛti</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 tracking-tight leading-tight type-in inline-block" style={{ fontFamily: SERIF }}>
          {tr(langCode, "heroHeadline")}
        </h1>
        <p
          className="anim-fade-up mt-6 text-lg sm:text-xl text-neutral-800 leading-relaxed max-w-xl mx-auto"
          style={{ fontFamily: BODY, animationDelay: "1.2s" }}
        >
          {tr(langCode, "heroSubtag")}
        </p>
        <button
          onClick={onBegin}
          style={{ fontFamily: SERIF, animationDelay: "1.4s" }}
          className="anim-fade-up sheen tappable group mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#F2662E] hover:bg-[#df551f] text-white px-10 py-5 text-xl font-medium shadow-[0_10px_30px_-8px_rgba(242,102,46,0.65)]"
        >
          {tr(langCode, "getStarted")}
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Quiet affordance that there is more below the fold. */}
        <div aria-hidden className="anim-fade-in mt-14 flex justify-center" style={{ animationDelay: "1.9s" }}>
          <ChevronDown className="float-soft w-7 h-7 text-neutral-500/70" />
        </div>
      </div>

      {/* Scroll-down facts section — "Cognitive support that feels familiar" */}
      <section ref={factsRef} className="reveal mt-24 w-full max-w-5xl px-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center" style={{ fontFamily: SERIF }}>
          {tr(langCode, "cognitiveHeading")}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-700 text-center max-w-2xl mx-auto" style={{ fontFamily: BODY }}>
          {tr(langCode, "cognitiveSub")}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Languages className="w-6 h-6" />}
            title={tr(langCode, "feature1Title")}
            body={tr(langCode, "feature1Body")}
            accent="#5B2A8C"
            delay={0}
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title={tr(langCode, "feature2Title")}
            body={tr(langCode, "feature2Body")}
            accent="#E08A2C"
            delay={120}
          />
          <FeatureCard
            icon={<SlidersHorizontal className="w-6 h-6" />}
            title={tr(langCode, "feature3Title")}
            body={tr(langCode, "feature3Body")}
            accent="#5B2A8C"
            delay={240}
          />
        </div>
      </section>

      {/* Trust section — placeholder copy until there's a real claim/attribution to cite */}
      <section ref={trustRef} className="reveal glass mt-16 mb-12 w-full max-w-3xl rounded-3xl px-8 py-10 text-center">
        <div className="float-soft mx-auto grid place-items-center w-14 h-14 rounded-full bg-[#5B2A8C]/10 text-[#5B2A8C]">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-neutral-900" style={{ fontFamily: SERIF }}>
          {tr(langCode, "verifiedHeading")}
        </h3>
        <p className="mt-2 text-neutral-600" style={{ fontFamily: BODY }}>{tr(langCode, "verifiedSub")}</p>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body, accent, delay = 0 }: { icon: React.ReactNode; title: string; body: string; accent: string; delay?: number }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="reveal tappable glass group rounded-2xl px-6 py-8 text-center">
      <div
        className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-neutral-900" style={{ fontFamily: SERIF }}>{title}</h3>
      <p className="mt-2 text-sm text-neutral-600 leading-relaxed" style={{ fontFamily: BODY }}>{body}</p>
    </div>
  );
}

function Step({ step, title, children, langCode }: { step: number; title: string; children: React.ReactNode; langCode?: string }) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="anim-fade-in text-xs tracking-[0.2em] text-neutral-700 uppercase mb-2" style={{ fontFamily: BODY }}>
        {tr(langCode, "stepOf", step)}
      </div>
      <h2
        className="anim-fade-up text-3xl sm:text-4xl font-bold text-neutral-900 mb-8 text-center"
        style={{ fontFamily: SERIF, animationDelay: "70ms" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Game({
  lang, theme, level, attempt, chestRef, onCoins, onContinueNext, onRetry, onHome,
}: {
  lang: Lang;
  theme: Theme;
  level: (typeof LEVELS)[number];
  attempt: number;
  chestRef: React.RefObject<HTMLDivElement | null>;
  onCoins: (pts: number) => void;
  onContinueNext: (n: number) => void;
  onRetry: () => void;
  onHome: () => void;
}) {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(theme, lang, level.cards, attempt));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const pairs = level.cards / 2;
  const matched = deck.filter((c) => c.matched).length / 2;
  const done = matched === pairs;
  const maxTurns = maxTurnsFor(level);

  useEffect(() => {
    if (!done || finished) return;
    setFinished(true);
    const isWin = turns <= maxTurns;
    setWon(isWin);
    if (isWin) {
      onCoins(level.pts);
      if (!prefersReducedMotion()) {
        const end = Date.now() + 1400;
        (function frame() {
          confetti({ particleCount: 5, angle: 60, spread: 65, origin: { x: 0 }, colors: CONFETTI_COLORS });
          confetti({ particleCount: 5, angle: 120, spread: 65, origin: { x: 1 }, colors: CONFETTI_COLORS });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const flip = (id: number) => {
    if (flipped.length === 2) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    playClickSound();
    const newDeck = deck.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const newFlipped = [...flipped, id];
    setDeck(newDeck);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setTurns((t) => t + 1);
      const [a, b] = newFlipped;
      const ca = newDeck.find((c) => c.id === a)!;
      const cb = newDeck.find((c) => c.id === b)!;
      if (ca.key === cb.key) {
        playMatchSound();
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, matched: true, jitter: true } : c)));
          setFlipped([]);
          setTimeout(() => {
            setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, jitter: false } : c)));
          }, 600);
        }, 350);
      } else {
        // wrong match: jitter + red + buzz
        playBuzzSound();
        setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, jitter: true, wrong: true } : c)));
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false, jitter: false, wrong: false } : c)));
          setFlipped([]);
        }, 900);
      }

    }
  };

  const cols = level.cards <= 4 ? 2 : level.cards <= 6 ? 3 : 4;

  if (finished) {
    return (
      <FinalScreen
        langCode={lang.code}
        won={won}
        pts={level.pts}
        levelN={level.n}
        nextLevel={levelsFor("memory", theme).find((l) => l.n === level.n + 1)?.n}
        chestRef={chestRef}
        onContinueNext={onContinueNext}
        onRetry={onRetry}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="anim-fade-in text-xs tracking-[0.2em] text-neutral-700 uppercase mb-2" style={{ fontFamily: BODY }}>
        {tr(lang.code, "level", level.n)} · {themeLabel(theme.id, lang.code, theme.label)}
      </div>
      <h2
        className="anim-fade-up text-4xl font-bold text-neutral-900 mb-8"
        style={{ fontFamily: SERIF, animationDelay: "70ms" }}
      >
        {tr(lang.code, "matchPairs")}
      </h2>
      <div className="grid gap-4 w-full" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {deck.map((c, i) => {
          const revealed = c.flipped || c.matched;
          // Both faces are always rendered; only the parent's rotateY changes,
          // so the card turns over in 3D instead of swapping its contents.
          const faceUpBackground = c.wrong
            ? "linear-gradient(160deg, #fecaca, #fca5a5)"
            : c.matched
            ? "linear-gradient(160deg, #bbf7d0, #86efac)"
            : "#ffffff";
          const faceUpBorder = c.wrong ? "#dc2626" : c.matched ? "#16a34a" : "rgba(0,0,0,0.08)";
          return (
            <button
              key={c.id}
              onClick={() => flip(c.id)}
              style={{ fontFamily: SERIF, animationDelay: `${i * 45}ms` }}
              className={`anim-pop flip tappable aspect-square rounded-2xl shadow-md ${revealed ? "is-flipped" : ""} ${c.jitter ? "jitter" : ""} ${c.matched ? "glow-correct" : ""}`}
            >
              <span className="flip-inner">
                {/* face down */}
                <span
                  className="flip-face"
                  style={{
                    background: "linear-gradient(160deg, #fff2df, #ffe1c9)",
                    border: "2px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <img src={smrtiSymbol.url} alt="" className="w-20 h-20 object-contain rounded-xl opacity-90" />
                </span>
                {/* face up */}
                <span
                  className="flip-face flip-back"
                  style={{ background: faceUpBackground, border: `2px solid ${faceUpBorder}` }}
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.english}
                      className="w-full flex-1 min-h-0 object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-6xl sm:text-7xl leading-none">{c.emoji}</span>
                  )}
                  <span className="mt-1 text-lg sm:text-xl font-semibold text-neutral-800 text-center px-1 leading-tight">
                    {c.label}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="anim-fade-in mt-8 text-lg text-neutral-700" style={{ fontFamily: BODY, animationDelay: "400ms" }}>
        {tr(lang.code, "tapTwoCards")}
      </p>
    </div>

  );
}

function FinalScreen({
  won, pts, levelN, nextLevel, chestRef, onContinueNext, onRetry, onHome, langCode,
}: {
  langCode?: string;
  won: boolean;
  pts: number;
  levelN: number;
  nextLevel: number | undefined;
  chestRef: React.RefObject<HTMLDivElement | null>;
  onContinueNext: (n: number) => void;
  onRetry: () => void;
  onHome: () => void;
}) {
  const coinOriginRef = useRef<HTMLDivElement>(null);
  // Hold the reward at 0 until the card has popped in, then count up to it.
  const [ptsTarget, setPtsTarget] = useState(0);
  const ptsShown = useCountUp(ptsTarget, 900);
  const [flights, setFlights] = useState<{ id: number; from: { x: number; y: number }; to: { x: number; y: number } }[]>([]);
  const [countdown, setCountdown] = useState(5);
  const autoTriggeredRef = useRef(false);

  const goNext = () => {
    if (autoTriggeredRef.current) return;
    autoTriggeredRef.current = true;
    if (won && nextLevel) onContinueNext(nextLevel);
    else onRetry();
  };

  useEffect(() => {
    if (!won) return;
    // Cue clap + coin sounds together the moment the congrats screen mounts
    playAudioClip(clapAudio.url, 3, 0.25);
    playAudioClip(coinAudio.url, 3, 0.25);
    const t = setTimeout(() => setPtsTarget(pts), 550);
    return () => clearTimeout(t);
  }, [won, pts]);

  useEffect(() => {
    if (!won) return;
    // slight delay so bounce-in plays first
    const t = setTimeout(() => {
      const chest = chestRef.current?.getBoundingClientRect();
      const origin = coinOriginRef.current?.getBoundingClientRect();
      if (!chest || !origin) return;
      const to = { x: chest.left + chest.width / 2, y: chest.top + chest.height / 2 };
      const from = { x: origin.left + origin.width / 2, y: origin.top + origin.height / 2 };
      const list = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        from: { x: from.x + (Math.random() - 0.5) * 80, y: from.y + (Math.random() - 0.5) * 40 },
        to,
      }));
      setFlights(list);
      setTimeout(() => setFlights([]), 1800);
    }, 500);
    return () => clearTimeout(t);
  }, [won, chestRef]);

  // 5-second auto-continue countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          goNext();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct = ((5 - countdown) / 5) * 100;

  return (
    <div className="w-full max-w-2xl text-center" style={{ fontFamily: SERIF }}>
      <h1 className="bounce-in text-6xl sm:text-7xl font-bold tracking-tight text-neutral-900">
        <span className={won ? "text-shimmer" : ""}>
          {won ? tr(langCode, "congratulations") : tr(langCode, "soClose")}
        </span>
      </h1>
      {won && (
        <p
          className="anim-fade-up mt-6 text-xl text-neutral-700"
          style={{ fontFamily: BODY, animationDelay: "300ms" }}
        >
          {tr(langCode, "youCleared", levelN)}
        </p>
      )}


      {won && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div
            ref={coinOriginRef}
            className="anim-pop glass flex items-center gap-3 rounded-full px-8 py-5"
            style={{ animationDelay: "450ms" }}
          >
            <img src={coinAsset.url} alt="Gold coin" className="float-soft w-12 h-12 object-contain" />
            <span className="text-4xl font-bold text-neutral-900 tabular-nums">+{ptsShown}</span>
            <span className="text-lg text-neutral-600" style={{ fontFamily: BODY }}>{tr(langCode, "coins")}</span>
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={goNext}
          className="tappable relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-neutral-900 hover:bg-black text-white px-10 py-5 text-xl font-medium shadow-lg"
        >
          {/* The fill doubles as the auto-continue countdown. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-white/25"
            style={{ width: `${progressPct}%`, transition: "width 1s linear" }}
          />
          <span className="relative">{won ? tr(langCode, "continueIn", countdown) : tr(langCode, "retryIn", countdown)}</span>
          <ArrowRight className="relative w-6 h-6" />
        </button>
        <button
          onClick={onHome}
          className="text-base text-neutral-700 transition-colors duration-200 hover:text-neutral-900 hover:underline underline-offset-4"
          style={{ fontFamily: BODY }}
        >
          {tr(langCode, "home")}
        </button>
      </div>


      {flights.map((f) => (
        <CoinFly key={f.id} from={f.from} to={f.to} />
      ))}
    </div>
  );
}

function CoinFly({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const [pos, setPos] = useState(from);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setPos(to);
      setScale(0.3);
    });
    return () => cancelAnimationFrame(id);
  }, [to]);
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${pos.x - 18}px, ${pos.y - 18}px) scale(${scale})`,
        transition: "transform 1.3s cubic-bezier(.5,-0.2,.7,1)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <img src={coinAsset.url} alt="" style={{ width: 36, height: 36, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }} />
    </div>
  );
}

// ============================ MCQ QUIZ ============================
// Question banks, images and rules all come from the MCQs document.



type QuizOption = { id: string; text: string; image?: string; correct: boolean };
type QuizQuestion = {
  prompt: string;
  image?: string;
  images: string[];
  multi: boolean;
  hideOptionLabels?: boolean;
  options: QuizOption[];
};

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 7 questions per level; each repeat of a level serves a fresh set.
function buildQuiz(theme: Theme, lang: Lang, levelN: number, attempt: number): QuizQuestion[] {
  const bank = bankFor(theme.id, lang.code);
  const raw = bank[levelN] ?? bank[1];
  const seed = levelN * 31 + attempt * 7 + theme.id.length;
  const ordered = shuffle(raw, seed);
  const start = (attempt * QUIZ_QUESTIONS_PER_LEVEL) % Math.max(ordered.length, 1);
  const picked: BankQ[] = [];
  for (let i = 0; i < QUIZ_QUESTIONS_PER_LEVEL; i++) picked.push(ordered[(start + i) % ordered.length]);
  const code = lang.code;
  return picked.map((q, i) => ({
    prompt: translatePrompt(q.prompt, code),
    image: q.image,
    images: q.images ?? [],
    multi: !!q.multi,
    hideOptionLabels: !!q.hideOptionLabels,
    options: shuffle(
      [
        ...q.correct.map((t) => ({ id: t, text: translateOption(t, code), image: q.optionImages?.[t], correct: true })),
        ...q.wrong.map((t) => ({ id: t, text: translateOption(t, code), image: q.optionImages?.[t], correct: false })),
      ],
      seed + i * 13,
    ),
  }));
}




function Quiz({
  lang, theme, level, attempt, chestRef, onCoins, onContinueNext, onRetry, onHome,
}: {
  lang: Lang;
  theme: Theme;
  level: (typeof LEVELS)[number];
  attempt: number;
  chestRef: React.RefObject<HTMLDivElement | null>;
  onCoins: (pts: number) => void;
  onContinueNext: (n: number) => void;
  onRetry: () => void;
  onHome: () => void;
}) {
  const [questions] = useState<QuizQuestion[]>(() => buildQuiz(theme, lang, level.n, attempt));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);

  const q = questions[idx];
  const needed = QUIZ_PASS_MARK;
  const levelCoins = QUIZ_LEVEL_POINTS[level.n] ?? level.pts;

  const finish = (finalScore: number) => {
    const isWin = finalScore >= needed;
    setWon(isWin);
    setFinished(true);
    if (isWin) {
      onCoins(levelCoins);
      if (!prefersReducedMotion()) {
        const end = Date.now() + 1400;
        (function frame() {
          confetti({ particleCount: 5, angle: 60, spread: 65, origin: { x: 0 }, colors: CONFETTI_COLORS });
          confetti({ particleCount: 5, angle: 120, spread: 65, origin: { x: 1 }, colors: CONFETTI_COLORS });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }
    }
  };

  const advance = (gotIt: boolean) => {
    const newScore = score + (gotIt ? 1 : 0);
    setScore(newScore);
    setTimeout(() => {
      if (idx + 1 >= questions.length) finish(newScore);
      else {
        setIdx((i) => i + 1);
        setPicked([]);
        setRevealed(false);
      }
    }, 1300);
  };

  const choose = (opt: QuizOption) => {
    if (revealed) return;
    playClickSound();
    if (q.multi) {
      setPicked((p) => (p.includes(opt.id) ? p.filter((x) => x !== opt.id) : [...p, opt.id]));
      return;
    }
    setPicked([opt.id]);
    setRevealed(true);
    if (opt.correct) playMatchSound();
    else playBuzzSound();
    advance(opt.correct);
  };

  const submitMulti = () => {
    if (revealed) return;
    setRevealed(true);
    const correctIds = q.options.filter((o) => o.correct).map((o) => o.id);
    const gotIt = correctIds.length === picked.length && correctIds.every((c) => picked.includes(c));
    if (gotIt) playMatchSound();
    else playBuzzSound();
    advance(gotIt);
  };

  if (finished) {
    return (
      <FinalScreen
        langCode={lang.code}
        won={won}
        pts={levelCoins}
        levelN={level.n}
        nextLevel={levelsFor("mcq", theme, lang.code).find((l) => l.n === level.n + 1)?.n}
        chestRef={chestRef}
        onContinueNext={onContinueNext}
        onRetry={onRetry}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center" style={{ fontFamily: SERIF }}>
      <div className="anim-fade-in text-xs tracking-[0.2em] text-neutral-700 uppercase mb-2" style={{ fontFamily: BODY }}>
        {tr(lang.code, "level", level.n)} · {themeLabel(theme.id, lang.code, theme.label)}
      </div>
      {/* Keyed on the question index so each new question animates in. */}
      <h2 key={`p-${idx}`} className="anim-fade-up text-3xl sm:text-4xl font-bold text-neutral-900 mb-8 text-center">
        {q.prompt}
      </h2>

      {q.image && (
        <div key={`i-${idx}`} className="anim-pop rounded-3xl overflow-hidden glass mb-8 max-w-2xl">
          <img src={q.image} alt="" className="w-full h-auto object-contain" />
        </div>
      )}

      {q.images.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 w-full">
          {q.images.map((src, i) => (
            <img
              key={`${idx}-${i}`}
              src={src}
              alt=""
              style={{ animationDelay: `${i * 90}ms` }}
              className="anim-pop rounded-3xl border border-black/5 shadow-md object-cover w-64 sm:w-80 aspect-[7/5]"
            />
          ))}
        </div>
      )}

      <div className="grid gap-4 w-full sm:grid-cols-2">
        {q.options.map((o, i) => {
          const isPicked = picked.includes(o.id);
          const showRight = revealed && o.correct;
          const showWrong = revealed && isPicked && !o.correct;
          return (
            <button
              key={`${idx}-${o.id}`}
              onClick={() => choose(o)}
              style={{
                background: showRight
                  ? "linear-gradient(160deg, #bbf7d0, #86efac)"
                  : showWrong
                  ? "linear-gradient(160deg, #fecaca, #fca5a5)"
                  : isPicked
                  ? "#ffffff"
                  : "rgba(255,255,255,0.85)",
                borderColor: showRight ? "#16a34a" : showWrong ? "#dc2626" : isPicked ? "#111111" : "rgba(0,0,0,0.08)",
                animationDelay: `${i * 70}ms`,
              }}
              className={`anim-pop tappable rounded-2xl border-2 shadow-sm px-5 py-5 text-center overflow-hidden ${showWrong ? "jitter" : ""} ${showRight ? "glow-correct" : ""}`}
            >
              {o.image && (
                <span className={`block overflow-hidden rounded-xl ${q.hideOptionLabels ? "" : "mb-3"}`}>
                  {/* aspect-[7/5] matches the 420x300 assets exactly, so the
                      option art is never re-cropped by the card. */}
                  <img src={o.image} alt="" className="zoomable block w-full aspect-[7/5] object-cover" />
                </span>
              )}
              {!q.hideOptionLabels && (
                <span className="block text-xl sm:text-2xl font-semibold text-neutral-900">{o.text}</span>
              )}
            </button>


          );
        })}
      </div>

      {q.multi && (
        <button
          onClick={submitMulti}
          disabled={picked.length === 0 || revealed}
          className="sheen tappable group mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-4 text-lg font-medium shadow-lg"
        >
          {tr(lang.code, "checkAnswer")}
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      )}

      <div className="mt-10 flex items-center justify-center gap-3">
        {questions.map((_, i) => {
          const done = i < idx || (i === idx && revealed);
          const current = i === idx && !revealed;
          return (
            <span
              key={i}
              className="rounded-full border-2"
              style={{
                width: 18,
                height: 18,
                background: done ? "#7c3aed" : "transparent",
                borderColor: "#7c3aed",
                transform: current ? "scale(1.35)" : done ? "scale(1.1)" : "scale(1)",
                boxShadow: current ? "0 0 0 5px rgba(124,58,237,0.16)" : "none",
                transition: "transform 0.4s var(--ease-spring), background-color 0.4s ease, box-shadow 0.4s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
