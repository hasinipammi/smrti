// Question banks built directly from the MCQs document.
// Images are the pictures supplied in that document (cropped + CDN hosted).

import { festivalsFor, ALL_PLACES, ALL_WHENS, type Fest } from "./festival-data";

const modules = import.meta.glob<{ url: string }>("../assets/mcq2/*.asset.json", { eager: true });

const IMG: Record<string, string> = {};
for (const [path, mod] of Object.entries(modules)) {
  const key = path.split("/").pop()!.replace(".jpg.asset.json", "");
  IMG[key] = (mod as { url: string } & { default?: { url: string } }).url ?? (mod as any).default.url;
}

export const img = (key: string) => IMG[key];


/** Dataset 3: exactly one picture per festival. */
const festImages = (key: string) => [img(key)].filter(Boolean);


export type BankQ = {
  prompt: string;
  image?: string;
  images?: string[];
  multi?: boolean;
  correct: string[];
  wrong: string[];
  /** option text -> image url (renders picture options) */
  optionImages?: Record<string, string>;
  /** hide the text under picture options (picture-only choices) */
  hideOptionLabels?: boolean;
};

/* ------------------------------------------------------------------ */
/* FESTIVALS                                                           */
/* ------------------------------------------------------------------ */

const FESTIVALS = [
  { name: "Navratri", key: "fest-navratri", when: "September–October", where: "North, West & South India" },
  { name: "Holi", key: "fest-holi", when: "February–March", where: "North India, now international" },
  { name: "Diwali", key: "fest-diwali", when: "October–November", where: "Pan-India & international" },
  { name: "Sankranti", key: "fest-sankranti", when: "January", where: "North & South India" },
  { name: "Eid", key: "fest-eid", when: "Changes every year", where: "International & pan-India" },
  { name: "Ganesh Chaturthi", key: "fest-ganesh-chaturthi", when: "August–September", where: "West & South India, especially Maharashtra" },
  { name: "Onam", key: "fest-onam", when: "August–September", where: "South India, especially Kerala" },
  { name: "Baisakhi", key: "fest-baisakhi", when: "April", where: "North India, especially Punjab" },
  { name: "New Year", key: "fest-new-year", when: "January 1", where: "Worldwide" },
  { name: "Christmas", key: "fest-christmas", when: "December 25", where: "Worldwide" },
  { name: "Lohri", key: "fest-lohri", when: "January", where: "North India, especially Punjab" },
  { name: "Pongal", key: "fest-pongal", when: "January", where: "South India, especially Tamil Nadu" },
  { name: "Vishu", key: "fest-vishu", when: "April", where: "South India, especially Kerala" },
  { name: "Ugadi", key: "fest-ugadi", when: "March–April", where: "South India" },
];


const FEST_L1: BankQ[] = FESTIVALS.map((f, i) => ({
  prompt: "What festival is this?",
  images: festImages(f.key),
  correct: [f.name],
  wrong: FESTIVALS.filter((x) => x.name !== f.name)
    .map((x) => x.name)
    .filter((_, j) => (j + i) % 3 === 0)
    .slice(0, 3),
}));

const FEST_L2: BankQ[] = FESTIVALS.map((f, i) => {
  const others = FESTIVALS.filter((x) => x.name !== f.name).filter((_, j) => (j + i) % 3 === 0).slice(0, 3);
  const optionImages: Record<string, string> = { [f.name]: img(f.key) };
  others.forEach((o) => (optionImages[o.name] = img(o.key)));
  return {
    prompt: `Which image is ${f.name}?`,
    correct: [f.name],
    wrong: others.map((o) => o.name),
    optionImages,
    hideOptionLabels: true,
  };
});

const FEST_L3: BankQ[] = [
  ...FESTIVALS.map((f, i) => ({
    prompt: `Where is ${f.name} celebrated?`,
    images: festImages(f.key),
    correct: [f.where],
    wrong: FESTIVALS.filter((x) => x.where !== f.where)
      .map((x) => x.where)
      .filter((_, j) => (j + i) % 3 === 0)
      .slice(0, 3),
  })),
  ...FESTIVALS.map((f, i) => ({
    prompt: `When is ${f.name} celebrated?`,
    images: festImages(f.key),
    correct: [f.when],
    wrong: FESTIVALS.filter((x) => x.when !== f.when)
      .map((x) => x.when)
      .filter((_, j) => (j + i) % 2 === 0)
      .slice(0, 3),
  })),
];

const FEST_L4: BankQ[] = FESTIVALS.map((f, i) => {
  const wrong = FESTIVALS.filter((x) => x.name !== f.name)
    .filter((_, j) => (j + i) % 3 === 0)
    .slice(0, 3);
  const optionImages: Record<string, string> = {};
  [f, ...wrong].forEach((x) => {
    if (img(x.key)) optionImages[x.name] = img(x.key);
  });
  return {
    prompt: `Which festival is celebrated in ${f.when}, in ${f.where}?`,
    correct: [f.name],
    wrong: wrong.map((x) => x.name),
    optionImages,
  };
});


const oddGroups = (groups: [string[], string][]): BankQ[] =>
  groups.map(([items, odd]) => ({
    prompt: "Choose the odd one out",
    correct: [odd],
    wrong: items.filter((x) => x !== odd),
  }));

export const FESTIVAL_BANK: Record<number, BankQ[]> = {
  1: FEST_L1,
  2: FEST_L2,
  3: FEST_L3,
  4: FEST_L4,
};

/* --- language-specific festivals (Dataset: specifics sheet) --------- */

const fest3Modules = import.meta.glob<{ url: string }>("../assets/fest3/*.asset.json", { eager: true });
const FIMG: Record<string, string> = {};
for (const [path, mod] of Object.entries(fest3Modules)) {
  const key = path.split("/").pop()!.replace(".jpg.asset.json", "");
  FIMG[key] = (mod as any).url ?? (mod as any).default?.url;
}
export const festImg = (key: string) => FIMG[key];

const pick = <T,>(pool: T[], skip: (x: T) => boolean, offset: number, n: number): T[] => {
  const src = pool.filter((x) => !skip(x));
  const out: T[] = [];
  for (let i = 0; i < src.length && out.length < n; i++) out.push(src[(i * 3 + offset) % src.length]);
  return Array.from(new Set(out)).slice(0, n);
};

export function buildFestivalBank(langCode?: string): Record<number, BankQ[]> {
  const list = festivalsFor(langCode);
  const names = list.map((f) => f.name);

  const L1: BankQ[] = list.map((f, i) => ({
    prompt: "What festival is this?",
    images: [festImg(f.key)].filter(Boolean),
    correct: [f.name],
    wrong: pick(names, (n) => n === f.name, i, 3),
  }));

  const L2: BankQ[] = list.map((f, i) => {
    const others = pick(list, (x) => x.name === f.name, i, 3);
    const optionImages: Record<string, string> = { [f.name]: festImg(f.key) };
    others.forEach((o) => (optionImages[o.name] = festImg(o.key)));
    return {
      prompt: `Which image is ${f.name}?`,
      correct: [f.name],
      wrong: others.map((o) => o.name),
      optionImages,
      hideOptionLabels: true,
    };
  });

  const L3: BankQ[] = [
    ...list.map((f, i) => ({
      prompt: `Where is ${f.name} celebrated?`,
      images: [festImg(f.key)].filter(Boolean),
      correct: [f.where],
      wrong: pick(ALL_PLACES, (p) => p === f.where, i, 3),
    })),
    ...list.map((f, i) => ({
      prompt: `When is ${f.name} celebrated?`,
      images: [festImg(f.key)].filter(Boolean),
      correct: [f.when],
      wrong: pick(ALL_WHENS, (w) => w === f.when, i, 3),
    })),
  ];

  const L4: BankQ[] = list.map((f, i) => {
    const wrong = pick(list, (x) => x.name === f.name, i, 3);
    const optionImages: Record<string, string> = {};
    [f, ...wrong].forEach((x) => {
      if (festImg(x.key)) optionImages[x.name] = festImg(x.key);
    });
    return {
      prompt: `Which festival is celebrated in ${f.when}, in ${f.where}?`,
      correct: [f.name],
      wrong: wrong.map((x) => x.name),
      optionImages,
    };
  });

  return { 1: L1, 2: L2, 3: L3, 4: L4 };
}


/* ------------------------------------------------------------------ */
/* INDIAN DISHES                                                       */
/* ------------------------------------------------------------------ */

const DISHES: { name: string; key: string }[] = [
  { name: "Gulab Jamun", key: "dish-gulab-jamun" },
  { name: "Jalebi", key: "dish-jalebi" },
  { name: "Rasgulla", key: "dish-rasgulla" },
  { name: "Pani Puri", key: "dish-pani-puri" },
  { name: "Pav Bhaji", key: "dish-pav-bhaji" },
  { name: "Samosa", key: "dish-samosa" },
  { name: "Basmati Rice", key: "dish-basmati-rice" },
  { name: "Sambar", key: "dish-sambar" },
  { name: "Dosa", key: "dish-dosa" },
  { name: "Idli", key: "dish-idli" },
  { name: "Vada", key: "dish-vada" },
  { name: "Naan", key: "dish-naan" },
  { name: "Roti", key: "dish-roti" },
  { name: "Paneer Tikka", key: "dish-paneer-tikka" },
  { name: "Palak Paneer", key: "dish-palak-paneer" },
  { name: "Chicken Biryani", key: "dish-chicken-biryani" },
  { name: "Rogan Josh", key: "dish-rogan-josh" },
  { name: "Kheer", key: "dish-kheer" },
  { name: "Mirchi Bhujji", key: "dish-mirchi-bhujji" },
  { name: "Chole Bhatura", key: "dish-chole-bhatura" },
  { name: "Rajma Chawal", key: "dish-rajma-chawal" },
  { name: "Dal Makhni", key: "dish-dal-makhni" },
];

const dishImg = (name: string) => img(DISHES.find((d) => d.name === name)!.key);

const DISH_L1: BankQ[] = DISHES.map((d, i) => ({
  prompt: "What Indian dish is this?",
  image: img(d.key),
  correct: [d.name],
  wrong: DISHES.filter((x) => x.name !== d.name)
    .map((x) => x.name)
    .filter((_, j) => (j + i) % 5 === 0)
    .slice(0, 3),
}));

const DISH_PAIRS: [string, string][] = [
  ["Dosa", "Idli"],
  ["Naan", "Roti"],
  ["Gulab Jamun", "Jalebi"],
  ["Samosa", "Pav Bhaji"],
  ["Rasgulla", "Kheer"],
  ["Paneer Tikka", "Palak Paneer"],
  ["Chicken Biryani", "Rogan Josh"],
  ["Sambar", "Vada"],
  ["Rajma Chawal", "Dal Makhni"],
  ["Pani Puri", "Mirchi Bhujji"],
];

const DISH_L2: BankQ[] = DISH_PAIRS.map(([a, b], i) => {
  const others = DISH_PAIRS.filter((_, j) => j !== i).slice(0, 3).map(([x, y]) => `${x} & ${y}`);
  return {
    prompt: "What dishes are shown?",
    images: [dishImg(a), dishImg(b)],
    correct: [`${a} & ${b}`],
    wrong: others,
  };
});

const DISH_L3: BankQ[] = [
  { prompt: "Which dish is most likely to be classified as a sweet?", correct: ["Gulab Jamun"], wrong: ["Samosa", "Sambar", "Paneer Tikka"] },
  { prompt: "Which of these is generally the spiciest choice?", correct: ["Mirchi Bhujji"], wrong: ["Kheer", "Rasgulla", "Gulab Jamun"] },
  { prompt: "Which dish is a South Indian food?", correct: ["Dosa"], wrong: ["Rajma Chawal", "Rogan Josh", "Chole Bhatura"] },
  { prompt: "Which is generally considered the healthier option?", correct: ["Idli"], wrong: ["Jalebi", "Samosa", "Gulab Jamun"] },
  { prompt: "Which dish is NOT a sweet?", correct: ["Pav Bhaji"], wrong: ["Kheer", "Jalebi", "Rasgulla"] },
  { prompt: "Which combination contains only sweets?", correct: ["Gulab Jamun, Jalebi, Rasgulla, Kheer"], wrong: ["Samosa, Jalebi, Kheer, Dosa", "Gulab Jamun, Samosa, Rasgulla, Vada", "Kheer, Paneer Tikka, Jalebi, Rasgulla"] },
  { prompt: "Which dish is primarily made from lentils and is generally considered nutritious?", correct: ["Dal Makhni"], wrong: ["Jalebi", "Samosa", "Gulab Jamun"] },
  { prompt: "Which of these is a fried snack?", correct: ["Samosa"], wrong: ["Kheer", "Rajma Chawal", "Palak Paneer"] },
  { prompt: "Which dish contains spinach and paneer?", correct: ["Palak Paneer"], wrong: ["Rogan Josh", "Rajma Chawal", "Sambar"] },
  { prompt: "Which option contains a sweet and a spicy dish?", correct: ["Jalebi + Mirchi Bhujji"], wrong: ["Kheer + Rasgulla", "Dosa + Idli", "Rajma Chawal + Dal Makhni"] },
  { prompt: "Which is most likely to be considered a healthier meal?", correct: ["Rajma Chawal"], wrong: ["Jalebi", "Gulab Jamun", "Samosa"] },
  { prompt: "Which dish is made primarily from chickpeas and is commonly eaten with bhatura?", correct: ["Chole Bhatura"], wrong: ["Dal Makhni", "Palak Paneer", "Rogan Josh"] },
  { prompt: "Which one is the odd one out based on being a dessert?", correct: ["Paneer Tikka"], wrong: ["Jalebi", "Kheer", "Rasgulla"] },
  { prompt: "Which food is made from fermented rice and lentil batter?", correct: ["Dosa"], wrong: ["Naan", "Roti", "Samosa"] },
  { prompt: "Which dish is generally considered less healthy because it is deep-fried and sweetened with syrup?", correct: ["Jalebi"], wrong: ["Idli", "Sambar", "Rajma Chawal"] },
  { prompt: "Which of these is a combination of rice and a protein-rich legume?", correct: ["Rajma Chawal"], wrong: ["Jalebi", "Paneer Tikka", "Naan"] },
  { prompt: "Which dish is most likely to be spicy rather than sweet?", correct: ["Mirchi Bhujji"], wrong: ["Gulab Jamun", "Kheer", "Rasgulla"] },
  { prompt: "Which option contains ONLY generally savory foods?", correct: ["Paneer Tikka, Samosa, Dosa, Rajma Chawal"], wrong: ["Jalebi, Kheer, Rasgulla, Dosa", "Gulab Jamun, Samosa, Kheer, Vada", "Jalebi, Rasgulla, Gulab Jamun, Kheer"] },
  { prompt: "Which is generally the better choice for a balanced meal?", correct: ["Basmati Rice + Palak Paneer"], wrong: ["Jalebi + Gulab Jamun", "Samosa + Jalebi", "Rasgulla + Kheer"] },
  { prompt: "Which dish is served with dosa or idli?", correct: ["Sambar"], wrong: ["Rogan Josh", "Rajma Chawal", "Kheer"] },
  { prompt: "Which of these is most clearly a dessert?", correct: ["Kheer"], wrong: ["Paneer Tikka", "Vada", "Samosa"] },
  { prompt: "Which group contains foods that are generally considered healthier choices?", correct: ["Idli, Sambar, Rajma Chawal"], wrong: ["Jalebi, Gulab Jamun, Rasgulla", "Samosa, Jalebi, Gulab Jamun", "Bhatura, Jalebi, Samosa"] },
].map((q) => {
  // Level 3: show a photo alongside every option that names a single dish.
  const optionImages: Record<string, string> = {};
  [...q.correct, ...q.wrong].forEach((opt) => {
    const d = DISHES.find((x) => x.name === opt);
    if (d) optionImages[opt] = img(d.key);
  });
  return Object.keys(optionImages).length === q.correct.length + q.wrong.length
    ? { ...q, optionImages }
    : q;
});



const DISH_ODD: [string[], string][] = [
  [["Dosa", "Idli", "Vada", "Gulab Jamun"], "Gulab Jamun"],
  [["Rajma Chawal", "Dal Makhni", "Palak Paneer", "Jalebi"], "Jalebi"],
  [["Gulab Jamun", "Jalebi", "Rasgulla", "Samosa"], "Samosa"],
  [["Chicken Biryani", "Rogan Josh", "Paneer Tikka", "Kheer"], "Kheer"],
  [["Naan", "Roti", "Basmati Rice", "Samosa"], "Samosa"],
  [["Sambar", "Dal Makhni", "Rajma Chawal", "Jalebi"], "Jalebi"],
  [["Pani Puri", "Samosa", "Pav Bhaji", "Kheer"], "Kheer"],
  [["Palak Paneer", "Paneer Tikka", "Dal Makhni", "Chicken Biryani"], "Chicken Biryani"],
  [["Chole Bhatura", "Rajma Chawal", "Dal Makhni", "Dosa"], "Dosa"],
  [["Dosa", "Idli", "Vada", "Naan"], "Naan"],
  [["Chicken Biryani", "Rogan Josh", "Paneer Tikka", "Idli"], "Idli"],
  [["Gulab Jamun", "Jalebi", "Rasgulla", "Pani Puri"], "Pani Puri"],
  [["Mirchi Bhujji", "Samosa", "Pani Puri", "Kheer"], "Kheer"],
  [["Naan", "Roti", "Dosa", "Jalebi"], "Jalebi"],
  [["Basmati Rice", "Rajma Chawal", "Chicken Biryani", "Vada"], "Vada"],
  [["Chole Bhatura", "Samosa", "Mirchi Bhujji", "Idli"], "Idli"],
  [["Palak Paneer", "Rajma Chawal", "Chole Bhatura", "Dosa"], "Dosa"],
  [["Sambar", "Dosa", "Idli", "Rogan Josh"], "Rogan Josh"],
  [["Pav Bhaji", "Pani Puri", "Samosa", "Rasgulla"], "Rasgulla"],
  [["Rogan Josh", "Chicken Biryani", "Chole Bhatura", "Idli"], "Idli"],
  [["Kheer", "Gulab Jamun", "Jalebi", "Paneer Tikka"], "Paneer Tikka"],
];

const DISH_L4: BankQ[] = DISH_ODD.map(([items, odd]) => {
  const optionImages: Record<string, string> = {};
  items.forEach((n) => (optionImages[n] = dishImg(n)));
  return {
    prompt: "Choose the odd one out",
    correct: [odd],
    wrong: items.filter((x) => x !== odd),
    optionImages,
  };
});

const COMBOS: string[][] = [
  ["Chicken Biryani", "Curd", "Naan", "Paneer Tikka"],
  ["Rajma Chawal", "Curd", "Roti", "Paneer Tikka"],
  ["Dal Makhni", "Naan", "Palak Paneer", "Basmati Rice"],
  ["Chole Bhatura", "Curd", "Samosa", "Jalebi"],
  ["Rogan Josh", "Naan", "Basmati Rice", "Curd"],
  ["Paneer Tikka", "Roti", "Dal Makhni", "Curd"],
  ["Palak Paneer", "Roti", "Dal Makhni", "Basmati Rice"],
  ["Samosa", "Chole Bhatura", "Curd", "Jalebi"],
  ["Pav Bhaji", "Samosa", "Pani Puri", "Jalebi"],
  ["Dosa", "Sambar", "Idli", "Vada"],
  ["Dosa", "Sambar", "Vada", "Curd"],
  ["Idli", "Vada", "Sambar", "Curd"],
  ["Pani Puri", "Samosa", "Pav Bhaji", "Jalebi"],
  ["Mirchi Bhujji", "Samosa", "Curd", "Pav Bhaji"],
  ["Paneer Tikka", "Naan", "Palak Paneer", "Curd"],
  ["Chicken Biryani", "Paneer Tikka", "Curd", "Naan"],
  ["Rogan Josh", "Dal Makhni", "Roti", "Curd"],
  ["Chole Bhatura", "Paneer Tikka", "Curd", "Gulab Jamun"],
  ["Rajma Chawal", "Dal Makhni", "Roti", "Curd"],
  ["Basmati Rice", "Sambar", "Dosa", "Vada"],
  ["Gulab Jamun", "Jalebi", "Rasgulla", "Kheer"],
];

const ALL_DISH_NAMES = DISHES.map((d) => d.name);

const DISH_L5: BankQ[] = COMBOS.map((items, i) => {
  const extras = ALL_DISH_NAMES.filter((n) => !items.includes(n));
  return {
    prompt: "Which dishes are present in this picture? Pick all of them.",
    image: img(`combo-${i + 1}`),
    multi: true,
    correct: items,
    wrong: [extras[(i * 3) % extras.length], extras[(i * 7 + 5) % extras.length]].filter(
      (v, idx, arr) => v && arr.indexOf(v) === idx,
    ),
  };
});

/* ------------------------------------------------------------------ */
/* FRUITS AND VEGETABLES                                               */
/* ------------------------------------------------------------------ */

// The 21 real-life pictures: [items visible / options, right answer (the fruit)]
const SCENES: { options: string[]; answer: string; duo: [string, string] }[] = [
  { options: ["Orange", "Tomato", "Carrot", "Broccoli", "Cucumber"], answer: "Orange", duo: ["Orange", "Tomato"] },
  { options: ["Apple", "Carrot", "Cucumber", "Broccoli", "Spinach"], answer: "Apple", duo: ["Apple", "Carrot"] },
  { options: ["Banana", "Cucumber", "Apple", "Carrot", "Broccoli"], answer: "Banana", duo: ["Banana", "Cucumber"] },
  { options: ["Strawberry", "Broccoli", "Orange", "Carrot", "Cucumber"], answer: "Strawberry", duo: ["Strawberry", "Broccoli"] },
  { options: ["Grapes", "Corn", "Apple", "Carrot", "Broccoli"], answer: "Grapes", duo: ["Grapes", "Corn"] },
  { options: ["Mango", "Spinach", "Banana", "Carrot", "Cucumber"], answer: "Mango", duo: ["Mango", "Spinach"] },
  { options: ["Watermelon", "Bell pepper", "Cucumber", "Carrot", "Broccoli"], answer: "Watermelon", duo: ["Watermelon", "Bell pepper"] },
  { options: ["Pineapple", "Potato", "Onion", "Carrot", "Broccoli"], answer: "Pineapple", duo: ["Pineapple", "Potato"] },
  { options: ["Pear", "Apple", "Onion", "Carrot", "Cucumber"], answer: "Pear", duo: ["Pear", "Onion"] },
  { options: ["Watermelon", "Carrot", "Bell pepper", "Cucumber", "Potato"], answer: "Watermelon", duo: ["Watermelon", "Carrot"] },
  { options: ["Pineapple", "Lettuce", "Orange", "Carrot", "Broccoli"], answer: "Pineapple", duo: ["Pineapple", "Lettuce"] },
  { options: ["Mango", "Peas", "Cucumber", "Carrot", "Spinach"], answer: "Mango", duo: ["Mango", "Peas"] },
  { options: ["Lemon", "Cabbage", "Carrot", "Onion", "Cauliflower"], answer: "Lemon", duo: ["Lemon", "Cabbage"] },
  { options: ["Strawberry", "Potato", "Cucumber", "Carrot", "Zucchini"], answer: "Strawberry", duo: ["Strawberry", "Potato"] },
  { options: ["Coconut", "Cauliflower", "Carrot", "Potato", "Cabbage"], answer: "Coconut", duo: ["Coconut", "Cauliflower"] },
  { options: ["Pear", "Corn", "Apple", "Carrot", "Bell pepper"], answer: "Pear", duo: ["Pear", "Corn"] },
  { options: ["Green apple", "Green bell pepper", "Cucumber", "Broccoli", "Zucchini"], answer: "Green apple", duo: ["Green apple", "Green bell pepper"] },
  { options: ["Kiwi", "Orange", "Red onion", "Carrot", "Cucumber"], answer: "Kiwi", duo: ["Kiwi", "Red onion"] },
  { options: ["Red apple", "Red onion", "Carrot", "Potato", "Broccoli"], answer: "Red apple", duo: ["Red apple", "Red onion"] },
  { options: ["Papaya", "Zucchini", "Tomato", "Carrot", "Bell pepper"], answer: "Papaya", duo: ["Papaya", "Zucchini"] },
  { options: ["Black grapes", "Sweet potato", "Carrot", "Green bell pepper", "Cucumber"], answer: "Black grapes", duo: ["Black grapes", "Sweet potato"] },
];

const FV_L2: BankQ[] = SCENES.map((s, i) => ({
  prompt: "Which one of these is the fruit in the picture?",
  image: img(`scene-${i + 1}`),
  correct: [s.duo[0]],
  wrong: [s.duo[1], ...s.options.filter((o) => o !== s.duo[0] && o !== s.duo[1]).slice(0, 2)],
}));

const FV_L3: BankQ[] = [
  { prompt: "Which fruit is commonly used to make juice?", correct: ["Orange"], wrong: ["Potato", "Onion"] },
  { prompt: "Which vegetable is commonly used to make French fries?", correct: ["Potato"], wrong: ["Apple", "Mango"] },
  { prompt: "Which fruit is commonly eaten after lunch?", correct: ["Banana"], wrong: ["Onion", "Potato"] },
  { prompt: "Which vegetable is commonly used in salad?", correct: ["Cucumber"], wrong: ["Banana", "Mango"] },
  { prompt: "Which fruit is commonly used to make lemonade?", correct: ["Lemon"], wrong: ["Potato", "Carrot"] },
  { prompt: "Which vegetable is commonly used to make sabzi?", correct: ["Potato"], wrong: ["Apple", "Orange"] },
  { prompt: "Which fruit is commonly eaten with salt or chaat masala?", correct: ["Guava"], wrong: ["Potato", "Spinach"] },
  { prompt: "Which vegetable is commonly used to make sambar?", correct: ["Carrot"], wrong: ["Banana", "Apple"] },
  { prompt: "Which vegetable is commonly used to make palak sabzi?", correct: ["Spinach"], wrong: ["Mango", "Grapes"] },
  { prompt: "Which vegetable is commonly added to poha?", correct: ["Peas"], wrong: ["Banana", "Watermelon"] },
  { prompt: "Which fruit is commonly used to make pickle?", correct: ["Mango"], wrong: ["Potato", "Spinach"] },
  { prompt: "Which vegetable is commonly used in aloo gobi?", correct: ["Cauliflower"], wrong: ["Apple", "Orange"] },
  { prompt: "Which fruit is commonly served with breakfast?", correct: ["Banana"], wrong: ["Onion", "Brinjal"] },
  { prompt: "Which fruit is commonly used to make fresh juice?", correct: ["Mosambi"], wrong: ["Potato", "Cabbage"] },
  { prompt: "Which vegetable is commonly added to dal?", correct: ["Tomato"], wrong: ["Banana", "Grapes"] },
  { prompt: "Which fruit is commonly used to make a banana shake?", correct: ["Banana"], wrong: ["Carrot", "Onion"] },
  { prompt: "Which vegetable is commonly used in paratha?", correct: ["Potato"], wrong: ["Orange", "Watermelon"] },
  { prompt: "Which fruit is commonly eaten by peeling it first?", correct: ["Banana"], wrong: ["Tomato", "Cucumber"] },
];

const FV_L4: BankQ[] = oddGroups([
  [["Apple", "Mango", "Banana", "Carrot"], "Carrot"],
  [["Potato", "Onion", "Tomato", "Orange"], "Orange"],
  [["Mango", "Papaya", "Guava", "Potato"], "Potato"],
  [["Carrot", "Radish", "Potato", "Banana"], "Banana"],
  [["Spinach", "Cabbage", "Cauliflower", "Apple"], "Apple"],
  [["Orange", "Lemon", "Mosambi", "Brinjal"], "Brinjal"],
  [["Banana", "Mango", "Papaya", "Cucumber"], "Cucumber"],
  [["Tomato", "Potato", "Brinjal", "Watermelon"], "Watermelon"],
  [["Guava", "Apple", "Orange", "Onion"], "Onion"],
  [["Peas", "Beans", "Carrot", "Grapes"], "Grapes"],
  [["Mango", "Lemon", "Orange", "Potato"], "Potato"],
  [["Cabbage", "Spinach", "Coriander", "Banana"], "Banana"],
  [["Apple", "Guava", "Pear", "Tomato"], "Tomato"],
  [["Potato", "Carrot", "Radish", "Mango"], "Mango"],
  [["Brinjal", "Cauliflower", "Cabbage", "Papaya"], "Papaya"],
  [["Banana", "Orange", "Grapes", "Onion"], "Onion"],
  [["Tomato", "Cucumber", "Carrot", "Mango"], "Mango"],
  [["Pineapple", "Watermelon", "Papaya", "Spinach"], "Spinach"],
  [["Onion", "Garlic", "Potato", "Apple"], "Apple"],
  [["Peas", "Beans", "Cabbage", "Mango"], "Mango"],
  [["Lemon", "Orange", "Mosambi", "Potato"], "Potato"],
]);

const FV_L5: BankQ[] = SCENES.map((s, i) => ({
  prompt: "Which of these is present in the picture?",
  image: img(`scene-${i + 1}`),
  correct: [s.answer],
  wrong: s.options.filter((o) => o !== s.answer),
}));

/* Indian dishes on their own */
export const DISHES_BANK: Record<number, BankQ[]> = {
  1: DISH_L1,
  2: DISH_L2,
  3: DISH_L3,
  4: DISH_L4,
  5: DISH_L5,
};

/* ------------------------------------------------------------------ */
/* FRUITS & VEGETABLES — dataset 2 (single item photos)                */
/* ------------------------------------------------------------------ */

const ds2Modules = import.meta.glob<{ url: string }>("../assets/ds2/*.asset.json", { eager: true });
const DS2: Record<string, string> = {};
for (const [path, mod] of Object.entries(ds2Modules)) {
  const key = path.split("/").pop()!.replace(".jpg.asset.json", "");
  DS2[key] = (mod as { url: string } & { default?: { url: string } }).url ?? (mod as any).default.url;
}

const FRUITS2: { name: string; key: string }[] = [
  { name: "Apple", key: "fruit-apple" },
  { name: "Banana", key: "fruit-banana" },
  { name: "Grapes", key: "fruit-grapes" },
  { name: "Orange", key: "fruit-orange" },
  { name: "Mango", key: "fruit-mango" },
  { name: "Pineapple", key: "fruit-pineapple" },
  { name: "Watermelon", key: "fruit-watermelon" },
  { name: "Pear", key: "fruit-pear" },
  { name: "Pomegranate", key: "fruit-pomegranate" },
  { name: "Papaya", key: "fruit-papaya" },
  { name: "Guava", key: "fruit-guava" },
  { name: "Dragon Fruit", key: "fruit-dragon-fruit" },
  { name: "Red Grapes", key: "fruit-red-grapes" },
  { name: "Avocado", key: "fruit-avocado" },
  { name: "Pomegranate Seeds", key: "fruit-pomegranate-seeds" },
];

const VEGS2: { name: string; key: string }[] = [
  { name: "Carrot", key: "veg-carrot" },
  { name: "Broccoli", key: "veg-broccoli" },
  { name: "Spinach", key: "veg-spinach" },
  { name: "Cauliflower", key: "veg-cauliflower" },
  { name: "Potato", key: "veg-potato" },
  { name: "Tomato", key: "veg-tomato" },
  { name: "Cucumber", key: "veg-cucumber" },
  { name: "Bell Pepper", key: "veg-bell-pepper" },
  { name: "Onion", key: "veg-onion" },
  { name: "Garlic", key: "veg-garlic" },
  { name: "Beans", key: "veg-beans" },
  { name: "Peas", key: "veg-peas" },
  { name: "Cabbage", key: "veg-cabbage" },
  { name: "Brinjal", key: "veg-brinjal" },
  { name: "Lettuce", key: "veg-lettuce" },
];

const DS2_BY_NAME: Record<string, string> = {};
[...FRUITS2, ...VEGS2].forEach((x) => (DS2_BY_NAME[x.name] = DS2[x.key]));
/** loose lookup so scene item names map onto dataset-2 photos */
const ds2Img = (name: string): string | undefined => {
  if (DS2_BY_NAME[name]) return DS2_BY_NAME[name];
  const alias: Record<string, string> = {
    "Green apple": "Apple",
    "Red apple": "Apple",
    "Black grapes": "Red Grapes",
    "Red onion": "Onion",
    "Green bell pepper": "Bell Pepper",
    "Bell pepper": "Bell Pepper",
  };
  return alias[name] ? DS2_BY_NAME[alias[name]] : undefined;
};
const FRUIT_NAMES2 = FRUITS2.map((f) => f.name);
const withOptionImages = (q: BankQ): BankQ => {
  const optionImages: Record<string, string> = { ...(q.optionImages ?? {}) };
  [...q.correct, ...q.wrong].forEach((n) => {
    const u = ds2Img(n);
    if (u) optionImages[n] = u;
  });
  return { ...q, optionImages };
};

/* Level 1 — name the single item in the picture */
const FV2_L1: BankQ[] = [
  ...FRUITS2.map((f, i) => ({
    prompt: "What fruit is shown in the picture?",
    image: DS2[f.key],
    correct: [f.name],
    wrong: FRUITS2.filter((x) => x.name !== f.name).map((x) => x.name).filter((_, j) => (j + i) % 4 === 0).slice(0, 3),
  })),
  ...VEGS2.map((v, i) => ({
    prompt: "What vegetable is shown in the picture?",
    image: DS2[v.key],
    correct: [v.name],
    wrong: VEGS2.filter((x) => x.name !== v.name).map((x) => x.name).filter((_, j) => (j + i) % 4 === 0).slice(0, 3),
  })),
];

/* Level 2 — two pictures at a time */
const FV2_PAIRS: [string, string][] = FRUITS2.map((f, i) => [f.name, VEGS2[i % VEGS2.length].name] as [string, string]);
const FV2_SAME: [string, string][] = [
  ["Apple", "Banana"], ["Mango", "Orange"], ["Grapes", "Pear"], ["Papaya", "Guava"],
  ["Carrot", "Potato"], ["Cabbage", "Cauliflower"], ["Peas", "Beans"], ["Onion", "Garlic"],
];

const FV2_L2: BankQ[] = [
  ...FV2_PAIRS.map(([f, v], i) => {
    const extras = FRUIT_NAMES2.filter((n) => n !== f).slice(i % 6, (i % 6) + 2);
    return withOptionImages({
      prompt: "What is the fruit amongst the two?",
      images: [DS2_BY_NAME[f], DS2_BY_NAME[v]],
      correct: [f],
      wrong: [v, ...extras].filter((x, idx, arr) => arr.indexOf(x) === idx).slice(0, 3),
    });
  }),
  ...FV2_PAIRS.map(([f, v], i) => {
    const extras = VEGS2.map((x) => x.name).filter((n) => n !== v).slice(i % 6, (i % 6) + 2);
    return withOptionImages({
      prompt: "What is the vegetable amongst the two?",
      images: [DS2_BY_NAME[f], DS2_BY_NAME[v]],
      correct: [v],
      wrong: [f, ...extras].filter((x, idx, arr) => arr.indexOf(x) === idx).slice(0, 3),
    });
  }),
  ...FV2_SAME.map(([a, b], i) => {
    const bothFruit = FRUIT_NAMES2.includes(a);
    const pool = bothFruit ? FV2_SAME.filter((p) => FRUIT_NAMES2.includes(p[0])) : FV2_SAME.filter((p) => !FRUIT_NAMES2.includes(p[0]));
    return {
      prompt: bothFruit ? "What are the two fruits shown?" : "What are the two vegetables shown?",
      images: [DS2_BY_NAME[a], DS2_BY_NAME[b]],
      correct: [`${a} & ${b}`],
      wrong: pool.filter(([x]) => x !== a).map(([x, y]) => `${x} & ${y}`).slice(0, 3).concat(
        i % 2 === 0 ? [] : [],
      ),
    };
  }),
];


/* Level 3 — everyday knowledge, four picture options */
const FV2_L3: BankQ[] = [
  { prompt: "Which one is used to make fresh juice?", correct: ["Orange"], wrong: ["Potato", "Onion", "Cabbage"] },
  { prompt: "Which one is used to make French fries?", correct: ["Potato"], wrong: ["Apple", "Mango", "Grapes"] },
  { prompt: "Which one is peeled before eating?", correct: ["Banana"], wrong: ["Tomato", "Cucumber", "Spinach"] },
  { prompt: "Which one is used in a fresh salad?", correct: ["Cucumber"], wrong: ["Mango", "Papaya", "Guava"] },
  { prompt: "Which one is used to make mango pickle?", correct: ["Mango"], wrong: ["Potato", "Spinach", "Garlic"] },
  { prompt: "Which one is used in palak sabzi?", correct: ["Spinach"], wrong: ["Apple", "Pear", "Banana"] },
  { prompt: "Which one is used in aloo gobi?", correct: ["Cauliflower"], wrong: ["Orange", "Grapes", "Papaya"] },
  { prompt: "Which one is added to dal for tang?", correct: ["Tomato"], wrong: ["Banana", "Grapes", "Pear"] },
  { prompt: "Which one has many small red seeds inside?", correct: ["Pomegranate"], wrong: ["Potato", "Cabbage", "Onion"] },
  { prompt: "Which one is eaten in slices on a hot summer day?", correct: ["Watermelon"], wrong: ["Garlic", "Brinjal", "Beans"] },
  { prompt: "Which one is used for tadka along with onion?", correct: ["Garlic"], wrong: ["Guava", "Pear", "Papaya"] },
  { prompt: "Which one is a green leafy vegetable?", correct: ["Lettuce"], wrong: ["Carrot", "Potato", "Brinjal"] },
  { prompt: "Which one is added to poha?", correct: ["Peas"], wrong: ["Banana", "Watermelon", "Guava"] },
  { prompt: "Which one is used to make baingan bharta?", correct: ["Brinjal"], wrong: ["Apple", "Orange", "Grapes"] },
  { prompt: "Which one is orange and good for the eyes?", correct: ["Carrot"], wrong: ["Cabbage", "Beans", "Spinach"] },
  { prompt: "Which one is eaten with salt or chaat masala?", correct: ["Guava"], wrong: ["Potato", "Onion", "Garlic"] },
  { prompt: "Which one is a tropical fruit with a spiky skin?", correct: ["Pineapple"], wrong: ["Cabbage", "Potato", "Beans"] },
  { prompt: "Which one is used in a fruit custard?", correct: ["Apple"], wrong: ["Onion", "Garlic", "Cauliflower"] },
].map(withOptionImages);

/* Level 4 — find the items in a real-life picture (multi select, more than one answer) */
const FV2_L4: BankQ[] = SCENES.map((s, i) => {
  const fruit = s.duo[0];
  const veg = s.duo[1];
  if (!ds2Img(fruit) || !ds2Img(veg)) return null;
  const fruitPool = FRUIT_NAMES2.filter((n) => n !== fruit && n !== veg);
  const vegPool = VEGS2.map((v) => v.name).filter((n) => n !== fruit && n !== veg);
  return withOptionImages({
    prompt: "Select all the fruits and vegetables you can see in this picture",
    image: img(`scene-${i + 1}`),
    multi: true,
    correct: [fruit, veg],
    wrong: [fruitPool[i % fruitPool.length], vegPool[(i + 3) % vegPool.length]].filter(
      (v, idx, arr) => v && arr.indexOf(v) === idx,
    ),
  });
}).filter(Boolean) as BankQ[];


/* Level 5 — odd one out, with pictures */
const FV2_L5: BankQ[] = oddGroups([
  [["Apple", "Mango", "Banana", "Carrot"], "Carrot"],
  [["Potato", "Onion", "Tomato", "Orange"], "Orange"],
  [["Mango", "Papaya", "Guava", "Potato"], "Potato"],
  [["Carrot", "Cabbage", "Potato", "Banana"], "Banana"],
  [["Spinach", "Cabbage", "Cauliflower", "Apple"], "Apple"],
  [["Orange", "Grapes", "Pear", "Brinjal"], "Brinjal"],
  [["Banana", "Mango", "Papaya", "Cucumber"], "Cucumber"],
  [["Tomato", "Potato", "Brinjal", "Watermelon"], "Watermelon"],
  [["Guava", "Apple", "Orange", "Onion"], "Onion"],
  [["Peas", "Beans", "Carrot", "Grapes"], "Grapes"],
  [["Cabbage", "Spinach", "Lettuce", "Banana"], "Banana"],
  [["Apple", "Guava", "Pear", "Tomato"], "Tomato"],
  [["Potato", "Carrot", "Garlic", "Mango"], "Mango"],
  [["Brinjal", "Cauliflower", "Cabbage", "Papaya"], "Papaya"],
  [["Banana", "Orange", "Grapes", "Onion"], "Onion"],
  [["Pineapple", "Watermelon", "Papaya", "Spinach"], "Spinach"],
  [["Onion", "Garlic", "Potato", "Apple"], "Apple"],
  [["Peas", "Beans", "Cabbage", "Mango"], "Mango"],
  [["Avocado", "Dragon Fruit", "Pomegranate", "Broccoli"], "Broccoli"],
  [["Bell Pepper", "Cucumber", "Beans", "Red Grapes"], "Red Grapes"],
  [["Pomegranate Seeds", "Guava", "Pear", "Lettuce"], "Lettuce"],
]).map(withOptionImages);

/* Fruits & vegetables on their own */
export const FRUITSVEG_BANK: Record<number, BankQ[]> = {
  1: FV2_L1,
  2: FV2_L2,
  3: FV2_L3,
  4: FV2_L4,
  5: FV2_L5,
};

/* Kept for compatibility: everything edible together */
export const FOOD_BANK: Record<number, BankQ[]> = {
  1: DISH_L1,
  2: [...DISH_L2, ...FV_L2],
  3: [...DISH_L3, ...FV_L3],
  4: [...DISH_L4, ...FV_L4],
  5: [...DISH_L5, ...FV_L5],
};

export const QUIZ_BANKS: Record<string, Record<number, BankQ[]>> = {
  food: FOOD_BANK,
  dishes: DISHES_BANK,
  fruitsveg: FRUITSVEG_BANK,
  festivals: FESTIVAL_BANK,
};

/** Doc rules: 7 questions a level, 6 correct to advance, level rewards below. */
export const QUIZ_QUESTIONS_PER_LEVEL = 7;
export const QUIZ_PASS_MARK = 6;
export const QUIZ_LEVEL_POINTS: Record<number, number> = { 1: 100, 2: 200, 3: 250, 4: 300, 5: 500 };
