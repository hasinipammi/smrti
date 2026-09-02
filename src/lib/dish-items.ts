// Indian dishes photo set (Dataset: "Indian dishes - flip the cards")
import gulabJamun from "@/assets/mcq2/dish-gulab-jamun.jpg.asset.json";
import jalebi from "@/assets/mcq2/dish-jalebi.jpg.asset.json";
import rasgulla from "@/assets/mcq2/dish-rasgulla.jpg.asset.json";
import paniPuri from "@/assets/mcq2/dish-pani-puri.jpg.asset.json";
import pavBhaji from "@/assets/mcq2/dish-pav-bhaji.jpg.asset.json";
import samosa from "@/assets/mcq2/dish-samosa.jpg.asset.json";
import basmatiRice from "@/assets/mcq2/dish-basmati-rice.jpg.asset.json";
import sambar from "@/assets/mcq2/dish-sambar.jpg.asset.json";
import dosa from "@/assets/mcq2/dish-dosa.jpg.asset.json";
import idli from "@/assets/mcq2/dish-idli.jpg.asset.json";
import vada from "@/assets/mcq2/dish-vada.jpg.asset.json";
import naan from "@/assets/mcq2/dish-naan.jpg.asset.json";
import roti from "@/assets/mcq2/dish-roti.jpg.asset.json";
import paneerTikka from "@/assets/mcq2/dish-paneer-tikka.jpg.asset.json";
import palakPaneer from "@/assets/mcq2/dish-palak-paneer.jpg.asset.json";
import biryani from "@/assets/mcq2/dish-chicken-biryani.jpg.asset.json";
import roganJosh from "@/assets/mcq2/dish-rogan-josh.jpg.asset.json";
import kheer from "@/assets/mcq2/dish-kheer.jpg.asset.json";
import mirchiBujji from "@/assets/mcq2/dish-mirchi-bhujji.jpg.asset.json";
import choleBattura from "@/assets/mcq2/dish-chole-bhatura.jpg.asset.json";
import rajmaChawal from "@/assets/mcq2/dish-rajma-chawal.jpg.asset.json";
import dalMakhni from "@/assets/mcq2/dish-dal-makhni.jpg.asset.json";

export type DishItem = {
  emoji: string;
  image: string;
  english: string;
  labels: Record<string, string>;
};

type Row = [{ url: string }, string, string, string, string, string, string];

const rows: Row[] = [
  [gulabJamun, "Gulab Jamun", "गुलाब जामुन", "గులాబ్ జామూన్", "குலாப் ஜாமூன்", "গোলাপ জাম", "ଗୁଲାବ ଜାମୁନ"],
  [jalebi, "Jalebi", "जलेबी", "జిలేబీ", "ஜிலேபி", "জিলিপি", "ଜିଲାପି"],
  [rasgulla, "Rasgulla", "रसगुल्ला", "రసగుల్లా", "ரசகுல்லா", "রসগোল্লা", "ରସଗୋଲା"],
  [paniPuri, "Pani Puri", "पानी पूरी", "పానీ పూరీ", "பானி பூரி", "পানি পুরি", "ପାଣି ପୁରି"],
  [pavBhaji, "Pav Bhaji", "पाव भाजी", "పావ్ భాజీ", "பாவ் பாஜி", "পাও ভাজি", "ପାଉ ଭାଜି"],
  [samosa, "Samosa", "समोसा", "సమోసా", "சமோசா", "সিঙ্গাড়া", "ସମୋସା"],
  [basmatiRice, "Basmati Rice", "बासमती चावल", "బాస్మతి అన్నం", "பாஸ்மதி சாதம்", "বাসমতি ভাত", "ବାସମତୀ ଭାତ"],
  [sambar, "Sambar", "सांभर", "సాంబార్", "சாம்பார்", "সাম্বার", "ସାମ୍ବାର"],
  [dosa, "Dosa", "डोसा", "దోస", "தோசை", "দোসা", "ଦୋସା"],
  [idli, "Idli", "इडली", "ఇడ్లీ", "இட்லி", "ইডলি", "ଇଡଲି"],
  [vada, "Vada", "वड़ा", "వడ", "வடை", "বড়া", "ବଡ଼ା"],
  [naan, "Naan", "नान", "నాన్", "நான்", "নান", "ନାନ"],
  [roti, "Roti", "रोटी", "రొట్టె", "ரொட்டி", "রুটি", "ରୁଟି"],
  [paneerTikka, "Paneer Tikka", "पनीर टिक्का", "పనీర్ టిక్కా", "பன்னீர் திக்கா", "পনির টিক্কা", "ପନିର ଟିକ୍କା"],
  [palakPaneer, "Palak Paneer", "पालक पनीर", "పాలక్ పనీర్", "பாலக் பன்னீர்", "পালং পনির", "ପାଳଙ୍ଗ ପନିର"],
  [biryani, "Chicken Biryani", "चिकन बिरयानी", "చికెన్ బిర్యానీ", "சிக்கன் பிரியாணி", "চিকেন বিরিয়ানি", "ଚିକେନ ବିରିୟାନି"],
  [roganJosh, "Rogan Josh", "रोगन जोश", "రోగన్ జోష్", "ரோகன் ஜோஷ்", "রোগান জোশ", "ରୋଗାନ ଜୋଶ"],
  [kheer, "Kheer", "खीर", "పాయసం", "பாயசம்", "পায়েস", "କ୍ଷୀରି"],
  [mirchiBujji, "Mirchi Bujji", "मिर्ची भज्जी", "మిర్చి బజ్జీ", "மிளகாய் பஜ்ஜி", "মরিচ ভাজি", "ମରିଚ ଭଜା"],
  [choleBattura, "Chole Battura", "छोले भटूरे", "చోలే బటూరా", "சோலே பட்டூரா", "ছোলে ভাটুরা", "ଛୋଲେ ଭଟୁରା"],
  [rajmaChawal, "Rajma Chawal", "राजमा चावल", "రాజ్మా అన్నం", "ராஜ்மா சாதம்", "রাজমা ভাত", "ରାଜମା ଭାତ"],
  [dalMakhni, "Dal Makhni", "दाल मखनी", "దాల్ మఖనీ", "தால் மக்கனி", "ডাল মাখানি", "ଡାଲ ମଖନୀ"],
];

const ALL: DishItem[] = rows.map(([img, en, hi, te, ta, bn, or]) => ({
  emoji: en,
  image: img.url,
  english: en,
  labels: { en, hi, te, ta, bn, or },
}));

export const DISH_PHOTO_ITEMS = ALL;
// Levels 1-5 use progressively larger sets of pairs (2,3,4,5,6 pairs)
export const DISH_BASE = ALL.slice(0, 6);
export const DISH_SWAP_POOL = ALL.slice(6);
