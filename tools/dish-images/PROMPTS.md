# Dish image prompt pack

Prompts for regenerating the 22 Indian-dish photos so they sit in the same
visual family as the fruits/veg (`src/assets/ds2`) and festival (`fest3`) sets.

Generate in any image model (Midjourney, DALL·E, Gemini, Firefly, SDXL…), save
each file with the **exact filename** listed below, then run:

```
python tools/dish-images/import.py <folder-with-your-images>
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
- Run `python tools/dish-images/import.py <folder> --dry-run` first to see
  exactly what would change.
