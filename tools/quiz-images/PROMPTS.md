# Dish image prompt pack

Prompts for regenerating the 22 Indian-dish photos so they sit in the same
visual family as the fruits/veg (`src/assets/ds2`) and festival (`fest3`) sets.

Generate in any image model (Midjourney, DALL·E, Gemini, Firefly, SDXL…), save
each file with the **exact filename** listed below, then run:

```
python tools/quiz-images/import.py <folder-with-your-images>
```

The importer crops, resizes to 420×300, sharpens, writes into `public/l5e/`
and resyncs the manifests. Nothing in `src/` needs editing.

---

## Style block — prepend this to every prompt

Keeping this identical across all 22 is what makes the set look like a set.
Change it once here and regenerate everything, never per-dish.

```
Warm, appetising food photograph of {DISH}. Single serving as the clear hero,
plated on simple off-white ceramic. Camera at a 35-degree overhead angle,
centred composition with even margins around the food. Soft diffused daylight
from the upper left, gentle natural shadows, no harsh specular highlights.
Background: plain warm cream to soft peach surface (#FFF3DC to #FFE0CB),
clean and uncluttered, shallow depth of field. Warm golden colour palette.
Photorealistic, high detail, food-magazine quality.
Negative: no text, no logos, no watermarks, no hands, no faces, no cutlery
clutter, no dark or moody background, no busy props, no border, no collage.
Aspect ratio 3:2, minimum 1200px wide.
```

> **Why these constraints:** the app renders these at `h-40 sm:h-48` with
> `object-cover` on a cream→lavender gradient. Dark or busy backgrounds fight
> that gradient — which is exactly why the current set looks foreign. Centred
> composition with margins survives the crop at every breakpoint.

---

## The 22 dishes

Replace `{DISH}` in the style block with the description, save as the filename.

| # | Save as | `{DISH}` description |
|---|---|---|
| 1 | `dish-basmati-rice.jpg` | a mound of steamed long-grain basmati rice, fluffy separate grains, faint steam |
| 2 | `dish-chicken-biryani.jpg` | chicken biryani, saffron-streaked long-grain rice with pieces of chicken, fried onion and coriander on top |
| 3 | `dish-chole-bhatura.jpg` | chole bhatura, one puffed golden bhatura beside a bowl of dark spiced chickpea curry |
| 4 | `dish-dal-makhni.jpg` | dal makhani, creamy dark black-lentil curry in a bowl with a swirl of cream |
| 5 | `dish-dosa.jpg` | a golden crisp folded masala dosa with a small bowl of sambar |
| 6 | `dish-gulab-jamun.jpg` | three gulab jamun, glossy deep-brown milk-solid spheres in golden sugar syrup, pistachio slivers |
| 7 | `dish-idli.jpg` | three soft white steamed idli, with coconut chutney and sambar in small bowls |
| 8 | `dish-jalebi.jpg` | bright orange spiral jalebi, glistening with syrup, stacked on a plate |
| 9 | `dish-kheer.jpg` | rice kheer, creamy pale rice pudding in a bowl, garnished with chopped almonds and pistachio |
| 10 | `dish-mirchi-bhujji.jpg` | mirchi bajji, batter-fried green chilli fritters, golden and crisp |
| 11 | `dish-naan.jpg` | one butter naan, teardrop-shaped leopard-spotted flatbread brushed with butter |
| 12 | `dish-palak-paneer.jpg` | palak paneer, vivid green spinach curry with cubes of white paneer |
| 13 | `dish-paneer-tikka.jpg` | paneer tikka, char-grilled marinated paneer cubes with peppers and onion |
| 14 | `dish-pani-puri.jpg` | pani puri, round crisp hollow puris with a small jug of spiced green water |
| 15 | `dish-pav-bhaji.jpg` | pav bhaji, spiced red-orange mashed vegetable bhaji with a pat of butter, soft pav rolls beside |
| 16 | `dish-rajma-chawal.jpg` | rajma chawal, red kidney-bean curry served next to white rice |
| 17 | `dish-rasgulla.jpg` | rasgulla, soft white spongy cheese balls in clear light sugar syrup in a bowl |
| 18 | `dish-rogan-josh.jpg` | rogan josh, deep red Kashmiri lamb curry in a bowl, glossy oil sheen |
| 19 | `dish-roti.jpg` | a stack of soft round whole-wheat roti, lightly charred spots |
| 20 | `dish-sambar.jpg` | sambar, golden-orange lentil and vegetable stew in a bowl with curry leaves |
| 21 | `dish-samosa.jpg` | three golden crisp triangular samosas with a small bowl of green mint chutney |
| 22 | `dish-vada.jpg` | medu vada, golden crisp savoury lentil doughnuts with a hole in the centre |

---

## Notes

- **Filenames must match exactly** — the importer maps them to asset IDs in
  `src/assets/mcq2/dish-*.asset.json`. It refuses to run on unrecognised names
  rather than guessing.
- `.png`, `.jpg`, `.jpeg` and `.webp` inputs are all accepted; output is always
  optimised progressive JPEG.
- You do not have to do all 22 at once. The importer only touches the files
  you supply and leaves the rest alone.
- Run `python tools/quiz-images/import.py <folder> --dry-run` first to see
  exactly what would change.

---

# Festival image prompt pack

The 42 festival photos in `src/assets/fest3` shipped at **six different aspect
ratios** (0.78 portrait → 2.33 panorama) and as small as 209×269. They are now
letterboxed to a uniform 420×300, which fixes the cropping — but letterboxing
cannot add detail a 209px-wide source never had, so regenerating them is the
only way to remove the remaining softness.

Save each file as `<language>-<festival>.jpg` and run the same importer:

```
python tools/quiz-images/import.py <folder>
```

## Style block — prepend to every festival prompt

```
Warm, respectful documentary photograph of {FESTIVAL} being celebrated in India.
One clear focal subject, centred, with generous margins on all sides. Rich
festive colour, soft natural daylight, gentle depth of field. Background
uncluttered and warm-toned so it sits against a cream-to-lavender page.
Photorealistic, high detail, editorial quality, dignified and joyful.
Negative: no text, no logos, no watermarks, no collage, no borders, no
distorted hands or faces, no dark muddy background.
Aspect ratio 3:2, minimum 1200px wide.
```

> **Generate at 3:2 (1.50) or 4:3 (1.33), never portrait.** The importer will
> centre-crop anything within 12% of 1.40 and letterbox anything further out.
> A portrait source still imports safely — it just arrives with side bars.

## The 42 festivals

Replace `{FESTIVAL}` with the description; save as the filename shown.

### Hindi — 12
`hindi-basant-panchami.jpg` Basant Panchami, yellow flowers and Saraswati puja ·
`hindi-bhai-dooj.jpg` Bhai Dooj, sister applying tilak to her brother ·
`hindi-chhath-puja.jpg` Chhath Puja, woman offering to the sun in a river at dawn ·
`hindi-diwali.jpg` Diwali, rows of lit clay diyas and rangoli ·
`hindi-ganesh-chaturthi.jpg` Ganesh Chaturthi, decorated Ganesha idol with marigolds ·
`hindi-holi.jpg` Holi, people covered in bright coloured powder ·
`hindi-janmashtami.jpg` Janmashtami, infant Krishna idol with peacock feather ·
`hindi-karva-chauth.jpg` Karva Chauth, woman viewing the moon through a sieve ·
`hindi-navratri.jpg` Navratri, garba dancers in mirrored chaniya choli ·
`hindi-raksha-bandhan.jpg` Raksha Bandhan, rakhi being tied on a wrist ·
`hindi-ram-navami.jpg` Ram Navami, Rama idol decorated with flowers ·
`hindi-teej.jpg` Teej, women in green saris on a decorated swing

### Telugu — 10
`telugu-bathukamma.jpg` Bathukamma, conical stacked flower arrangement with women dancing ·
`telugu-bonalu.jpg` Bonalu, women carrying decorated pots on their heads ·
`telugu-diwali.jpg` Diwali in Andhra, diyas and fireworks ·
`telugu-dussehra.jpg` Dussehra, Durga idol and celebration ·
`telugu-ganesh-chaturthi.jpg` Ganesh Chaturthi, large Ganesha pandal idol ·
`telugu-holi.jpg` Holi in Telangana, colour powder celebration ·
`telugu-pongal.jpg` Pongal, decorated clay pot boiling over with rice ·
`telugu-sankranti.jpg` Sankranti, colourful muggu rangoli and harvest ·
`telugu-sri-rama-navami.jpg` Sri Rama Navami, Rama and Sita idols with flowers ·
`telugu-ugadi.jpg` Ugadi, festive platter of ugadi pachadi with neem and mango

### Tamil — 7
`tamil-chithirai-festival.jpg` Chithirai festival, temple chariot procession in Madurai ·
`tamil-deepavali.jpg` Deepavali in Tamil Nadu, oil lamps and sweets ·
`tamil-karthigai-deepam.jpg` Karthigai Deepam, rows of oil lamps at a temple ·
`tamil-pongal.jpg` Pongal, decorated pot with sugarcane and turmeric ·
`tamil-puthandu.jpg` Puthandu, Tamil new year festive platter and kolam ·
`tamil-thaipusam.jpg` Thaipusam, devotee carrying a decorated kavadi ·
`tamil-vinayagar-chaturthi.jpg` Vinayagar Chaturthi, Ganesha idol with flowers

### Bengali — 7
`bengali-dol-jatra.jpg` Dol Jatra, Bengali spring colour festival ·
`bengali-durga-puja.jpg` Durga Puja, ornate Durga idol in a pandal ·
`bengali-jamai-shashthi.jpg` Jamai Shashthi, festive Bengali meal laid out for a son-in-law ·
`bengali-kali-puja.jpg` Kali Puja, Kali idol with hibiscus and lamps ·
`bengali-nabanna.jpg` Nabanna, Bengali harvest festival with new rice ·
`bengali-pohela-boishakh.jpg` Pohela Boishakh, Bengali new year procession ·
`bengali-saraswati-puja.jpg` Saraswati Puja, Saraswati idol with yellow marigolds

### Odia — 6
`odia-durga-puja.jpg` Durga Puja in Odisha, decorated Durga idol ·
`odia-kali-puja.jpg` Kali Puja in Odisha, Kali idol with lamps ·
`odia-nuakhai.jpg` Nuakhai, Odia harvest festival with new rice offering ·
`odia-raja-parba.jpg` Raja Parba, decorated swings and girls in new saris ·
`odia-rath-yatra.jpg` Rath Yatra, the three tall Puri chariots in procession ·
`odia-snana-yatra.jpg` Snana Yatra, ceremonial bathing of the Jagannath deities

## Notes

- **Depictions of deities and rituals should be respectful and conventional.**
  If a generated image looks doctrinally odd or garbled, discard it — a soft
  but correct photo beats a sharp but wrong one for this audience.
- The importer keeps `.bak` copies of whatever it replaces, so you can compare
  and revert per-image.
