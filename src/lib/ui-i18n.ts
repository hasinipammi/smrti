// UI string translations for all supported languages
//
// NOTE: heroHeadline / heroSubtag / cognitive* / feature* / verifiedHeading /
// verifiedSub and the account* / fullscreen* strings below were machine-
// translated as a first pass for the hi/te/ta/bn/or dictionaries. Please have
// a native speaker review before shipping, especially `verifiedHeading` /
// `verifiedSub`, which are placeholder marketing copy (no clinical claim is
// actually being made yet).
export type UiKey =
  | "stepOf"
  | "chooseLanguage"
  | "games"
  | "pickTheme"
  | "chooseLevel"
  | "level"
  | "coins"
  | "questions"
  | "cards"
  | "memoryMatch"
  | "memoryMatchSub"
  | "quiz"
  | "quizSub"
  | "matchPairs"
  | "tapTwoCards"
  | "congratulations"
  | "soClose"
  | "youCleared"
  | "continueIn"
  | "retryIn"
  | "home"
  | "back"
  | "language"
  | "enterName"
  | "continueWord"
  | "getStarted"
  | "tagline"
  | "checkAnswer"
  | "muteSounds"
  | "unmuteSounds"
  | "heroHeadline"
  | "heroSubtag"
  | "cognitiveHeading"
  | "cognitiveSub"
  | "feature1Title"
  | "feature1Body"
  | "feature2Title"
  | "feature2Body"
  | "feature3Title"
  | "feature3Body"
  | "verifiedHeading"
  | "verifiedSub"
  | "account"
  | "accountFullName"
  | "accountStartedOn"
  | "accountEdit"
  | "accountSave"
  | "accountClose"
  | "fullscreenEnter"
  | "fullscreenExit";

type Dict = Record<UiKey, string>;

const en: Dict = {
  stepOf: "Step {n} of 4",
  chooseLanguage: "Choose your language",
  games: "Games",
  pickTheme: "Pick a theme",
  chooseLevel: "Choose a level",
  level: "Level {n}",
  coins: "coins",
  questions: "{n} questions",
  cards: "{n} cards",
  memoryMatch: "Memory Match",
  memoryMatchSub: "Find the matching pairs",
  quiz: "Quiz",
  quizSub: "Multiple choice answers",
  matchPairs: "Match the pairs",
  tapTwoCards: "Tap two cards to find a matching pair.",
  congratulations: "CONGRATULATIONS!",
  soClose: "SO CLOSE!",
  youCleared: "You cleared Level {n}.",
  continueIn: "Continue in {n}s",
  retryIn: "Retry in {n}s",
  home: "Home",
  back: "Back",
  language: "Language",
  enterName: "Enter your name",
  continueWord: "Continue",
  getStarted: "Get started",
  tagline: "India's first brain game in regional languages.",
  checkAnswer: "Check answer",
  muteSounds: "Mute sounds",
  unmuteSounds: "Unmute sounds",
  heroHeadline: "Keep your memories alive",
  heroSubtag: "Explore memory, attention, and more with India's first regional-language brain-training program",
  cognitiveHeading: "Cognitive support that feels familiar",
  cognitiveSub: "Rediscover, remember, reconnect. With Smṛti, explore language, culture, and activities designed around you.",
  feature1Title: "Bridging Language Barriers",
  feature1Body: "Smriti brings cognitive activities to regional languages, helping users understand instructions and interact comfortably in a language they know.",
  feature2Title: "Built Around Familiarity",
  feature2Body: "Familiar foods, festivals, sounds, and everyday objects are incorporated into Smriti to make activities more recognizable and meaningful.",
  feature3Title: "Tailored to Each User",
  feature3Body: "Different activities and difficulty levels allow Smriti to adapt to users' abilities and support engagement at their own pace.",
  verifiedHeading: "Verified by psychiatrists",
  verifiedSub: "Brought to you with care.",
  account: "Account",
  accountFullName: "Full name",
  accountStartedOn: "Started on",
  accountEdit: "Edit",
  accountSave: "Save",
  accountClose: "Close",
  fullscreenEnter: "Enter full screen",
  fullscreenExit: "Exit full screen",
};

const hi: Dict = {
  stepOf: "चरण {n} / 4",
  chooseLanguage: "अपनी भाषा चुनें",
  games: "खेल",
  pickTheme: "विषय चुनें",
  chooseLevel: "स्तर चुनें",
  level: "स्तर {n}",
  coins: "सिक्के",
  questions: "{n} प्रश्न",
  cards: "{n} पत्ते",
  memoryMatch: "याददाश्त जोड़ी",
  memoryMatchSub: "मिलती जोड़ियाँ ढूँढें",
  quiz: "प्रश्नोत्तरी",
  quizSub: "बहुविकल्पीय उत्तर",
  matchPairs: "जोड़ियाँ मिलाएँ",
  tapTwoCards: "जोड़ी ढूँढने के लिए दो पत्तों पर टैप करें।",
  congratulations: "बधाई हो!",
  soClose: "बहुत करीब!",
  youCleared: "आपने स्तर {n} पूरा किया।",
  continueIn: "{n} सेकंड में जारी रखें",
  retryIn: "{n} सेकंड में फिर कोशिश",
  home: "होम",
  back: "पीछे",
  language: "भाषा",
  enterName: "अपना नाम लिखें",
  continueWord: "जारी रखें",
  getStarted: "शुरू करें",
  tagline: "क्षेत्रीय भाषाओं में भारत का पहला मस्तिष्क खेल।",
  checkAnswer: "उत्तर जाँचें",
  muteSounds: "आवाज़ बंद करें",
  unmuteSounds: "आवाज़ चालू करें",
  heroHeadline: "अपनी यादों को जीवित रखें",
  heroSubtag: "क्षेत्रीय भाषा में भारत के पहले मस्तिष्क-प्रशिक्षण कार्यक्रम के साथ स्मृति, ध्यान और अधिक का अन्वेषण करें",
  cognitiveHeading: "पहचानी हुई तरह से मिलने वाला सहयोग",
  cognitiveSub: "फिर से खोजें, याद करें, फिर से जुड़ें। स्मृति के साथ भाषा, संस्कृति और आपके लिए बनाई गई गतिविधियों का अन्वेषण करें।",
  feature1Title: "भाषा की बाधाओं को पाटना",
  feature1Body: "स्मृति संज्ञानात्मक गतिविधियों को क्षेत्रीय भाषाओं में लाती है, जिससे उपयोगकर्ता निर्देशों को समझ सकें और अपनी जानी-पहचानी भाषा में सहजता से बातचीत कर सकें।",
  feature2Title: "पहचान के इर्द-गिर्द बनाया गया",
  feature2Body: "जानी-पहचानी खाद्य वस्तुएँ, त्योहार, ध्वनियाँ और रोज़मर्रा की चीज़ें स्मृति में शामिल की गई हैं ताकि गतिविधियाँ अधिक पहचानी जाने योग्य और सार्थक बनें।",
  feature3Title: "हर उपयोगकर्ता के अनुसार अनुकूलित",
  feature3Body: "अलग-अलग गतिविधियाँ और कठिनाई स्तर स्मृति को उपयोगकर्ताओं की क्षमताओं के अनुसार ढलने देते हैं और उन्हें अपनी गति से जुड़े रहने में मदद करते हैं।",
  verifiedHeading: "मनोचिकित्सकों द्वारा सत्यापित",
  verifiedSub: "सावधानी से आप तक पहुँचाया गया।",
  account: "खाता",
  accountFullName: "पूरा नाम",
  accountStartedOn: "शुरुआत की तारीख़",
  accountEdit: "बदलें",
  accountSave: "सहेजें",
  accountClose: "बंद करें",
  fullscreenEnter: "फ़ुल स्क्रीन में देखें",
  fullscreenExit: "फ़ुल स्क्रीन से बाहर निकलें",
};

const te: Dict = {
  stepOf: "దశ {n} / 4",
  chooseLanguage: "మీ భాషను ఎంచుకోండి",
  games: "ఆటలు",
  pickTheme: "అంశాన్ని ఎంచుకోండి",
  chooseLevel: "స్థాయిని ఎంచుకోండి",
  level: "స్థాయి {n}",
  coins: "నాణేలు",
  questions: "{n} ప్రశ్నలు",
  cards: "{n} కార్డులు",
  memoryMatch: "జ్ఞాపక జతలు",
  memoryMatchSub: "సరిపోయే జతలను కనుగొనండి",
  quiz: "క్విజ్",
  quizSub: "బహుళైచ్ఛిక సమాధానాలు",
  matchPairs: "జతలను కలపండి",
  tapTwoCards: "జత కనుగొనేందుకు రెండు కార్డులను తాకండి.",
  congratulations: "అభినందనలు!",
  soClose: "చాలా దగ్గరగా!",
  youCleared: "మీరు స్థాయి {n} పూర్తి చేశారు.",
  continueIn: "{n} సెకన్లలో కొనసాగండి",
  retryIn: "{n} సెకన్లలో మళ్లీ ప్రయత్నించండి",
  home: "హోమ్",
  back: "వెనుకకు",
  language: "భాష",
  enterName: "మీ పేరు రాయండి",
  continueWord: "కొనసాగించు",
  getStarted: "ప్రారంభించండి",
  tagline: "ప్రాంతీయ భాషలలో భారతదేశపు తొలి మెదడు ఆట.",
  checkAnswer: "సమాధానం తనిఖీ చేయండి",
  muteSounds: "శబ్దం ఆపు",
  unmuteSounds: "శబ్దం ఆన్ చేయి",
  heroHeadline: "మీ జ్ఞాపకాలను సజీవంగా ఉంచండి",
  heroSubtag: "ప్రాంతీయ భాషలో భారతదేశపు తొలి మెదడు-శిక్షణ కార్యక్రమంతో జ్ఞాపకశక్తి, శ్రద్ధ మరియు మరిన్నింటిని అన్వేషించండి",
  cognitiveHeading: "పరిచయమైనట్లు అనిపించే మద్దతు",
  cognitiveSub: "మళ్లీ కనుగొనండి, గుర్తుంచుకోండి, మళ్లీ కనెక్ట్ అవ్వండి. స్మృతితో భాష, సంస్కృతి మరియు మీ కోసం రూపొందించిన కార్యకలాపాలను అన్వేషించండి.",
  feature1Title: "భాషా అడ్డంకులను తగ్గించడం",
  feature1Body: "స్మృతి కాగ్నిటివ్ కార్యకలాపాలను ప్రాంతీయ భాషల్లోకి తీసుకువస్తుంది, తద్వారా వినియోగదారులు సూచనలను అర్థం చేసుకుని, తమకు తెలిసిన భాషలో సౌకర్యంగా సంభాషించగలరు.",
  feature2Title: "పరిచయం చుట్టూ నిర్మించబడింది",
  feature2Body: "కార్యకలాపాలను మరింత గుర్తుపట్టదగినవిగా మరియు అర్థవంతంగా చేయడానికి పరిచయమైన ఆహారాలు, పండుగలు, శబ్దాలు మరియు నిత్య వస్తువులను స్మృతిలో చేర్చారు.",
  feature3Title: "ప్రతి వినియోగదారుకు అనుగుణంగా రూపొందించబడింది",
  feature3Body: "వివిధ కార్యకలాపాలు మరియు కష్టతా స్థాయిలు స్మృతిని వినియోగదారుల సామర్థ్యాలకు అనుగుణంగా మార్చుకోవడానికి మరియు వారి స్వంత వేగంతో నిమగ్నత కొనసాగించడానికి సహాయపడతాయి.",
  verifiedHeading: "మానసిక వైద్యులచే ధృవీకరించబడింది",
  verifiedSub: "శ్రద్ధతో మీకు అందించబడింది.",
  account: "ఖాతా",
  accountFullName: "పూర్తి పేరు",
  accountStartedOn: "ప్రారంభ తేదీ",
  accountEdit: "మార్చండి",
  accountSave: "సేవ్ చేయండి",
  accountClose: "మూసివేయండి",
  fullscreenEnter: "పూర్తి తెరపై చూడండి",
  fullscreenExit: "పూర్తి తెర నుండి నిష్క్రమించండి",
};

const ta: Dict = {
  stepOf: "படி {n} / 4",
  chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுங்கள்",
  games: "விளையாட்டுகள்",
  pickTheme: "கருப்பொருளைத் தேர்வுசெய்க",
  chooseLevel: "நிலையைத் தேர்வுசெய்க",
  level: "நிலை {n}",
  coins: "நாணயங்கள்",
  questions: "{n} கேள்விகள்",
  cards: "{n} அட்டைகள்",
  memoryMatch: "நினைவு ஜோடி",
  memoryMatchSub: "பொருந்தும் ஜோடிகளைக் கண்டறியுங்கள்",
  quiz: "வினாடி வினா",
  quizSub: "பல தேர்வு விடைகள்",
  matchPairs: "ஜோடிகளைப் பொருத்துங்கள்",
  tapTwoCards: "ஜோடியைக் காண இரண்டு அட்டைகளைத் தொடவும்.",
  congratulations: "வாழ்த்துக்கள்!",
  soClose: "மிக அருகில்!",
  youCleared: "நீங்கள் நிலை {n} முடித்தீர்கள்.",
  continueIn: "{n} வினாடிகளில் தொடரவும்",
  retryIn: "{n} வினாடிகளில் மீண்டும்",
  home: "முகப்பு",
  back: "பின்",
  language: "மொழி",
  enterName: "உங்கள் பெயரை உள்ளிடவும்",
  continueWord: "தொடரவும்",
  getStarted: "தொடங்குங்கள்",
  tagline: "பிராந்திய மொழிகளில் இந்தியாவின் முதல் மூளை விளையாட்டு.",
  checkAnswer: "பதிலைச் சரிபார்க்கவும்",
  muteSounds: "ஒலியை நிறுத்து",
  unmuteSounds: "ஒலியை இயக்கு",
  heroHeadline: "உங்கள் நினைவுகளை உயிரோட்டமாக வையுங்கள்",
  heroSubtag: "பிராந்திய மொழியில் இந்தியாவின் முதல் மூளை-பயிற்சி திட்டத்துடன் நினைவாற்றல், கவனம் மற்றும் பலவற்றை ஆராயுங்கள்",
  cognitiveHeading: "பரிச்சயமாக உணரும் ஆதரவு",
  cognitiveSub: "மீண்டும் கண்டறியுங்கள், நினைவு கூருங்கள், மீண்டும் இணையுங்கள். ஸ்மிருதியுடன் மொழி, கலாச்சாரம் மற்றும் உங்களுக்காக வடிவமைக்கப்பட்ட செயல்பாடுகளை ஆராயுங்கள்.",
  feature1Title: "மொழி தடைகளை இணைத்தல்",
  feature1Body: "ஸ்மிருதி அறிவாற்றல் செயல்பாடுகளை பிராந்திய மொழிகளுக்குக் கொண்டு வருகிறது, இது பயனர்கள் வழிமுறைகளைப் புரிந்துகொண்டு, தமக்குத் தெரிந்த மொழியில் வசதியாக தொடர்பு கொள்ள உதவுகிறது.",
  feature2Title: "பரிச்சயத்தை மையமாகக் கொண்டு உருவாக்கப்பட்டது",
  feature2Body: "செயல்பாடுகளை மேலும் அடையாளம் காணக்கூடியதாகவும் அர்த்தமுள்ளதாகவும் மாற்ற பரிச்சயமான உணவுகள், பண்டிகைகள், ஒலிகள் மற்றும் அன்றாட பொருட்கள் ஸ்மிருதியில் இணைக்கப்பட்டுள்ளன.",
  feature3Title: "ஒவ்வொரு பயனருக்கும் ஏற்றவாறு வடிவமைக்கப்பட்டது",
  feature3Body: "வெவ்வேறு செயல்பாடுகள் மற்றும் சிரம நிலைகள் ஸ்மிருதியை பயனர்களின் திறன்களுக்கு ஏற்ப மாற்றியமைக்கவும், அவர்கள் சொந்த வேகத்தில் ஈடுபாட்டைத் தொடரவும் உதவுகின்றன.",
  verifiedHeading: "மனநல மருத்துவர்களால் சரிபார்க்கப்பட்டது",
  verifiedSub: "அக்கறையுடன் உங்களுக்கு வழங்கப்படுகிறது.",
  account: "கணக்கு",
  accountFullName: "முழுப் பெயர்",
  accountStartedOn: "தொடங்கிய தேதி",
  accountEdit: "திருத்து",
  accountSave: "சேமி",
  accountClose: "மூடு",
  fullscreenEnter: "முழுத்திரையில் காண்க",
  fullscreenExit: "முழுத்திரையிலிருந்து வெளியேறு",
};

const bn: Dict = {
  stepOf: "ধাপ {n} / 4",
  chooseLanguage: "আপনার ভাষা বেছে নিন",
  games: "খেলা",
  pickTheme: "বিষয় বেছে নিন",
  chooseLevel: "স্তর বেছে নিন",
  level: "স্তর {n}",
  coins: "কয়েন",
  questions: "{n} প্রশ্ন",
  cards: "{n} কার্ড",
  memoryMatch: "স্মৃতি জোড়া",
  memoryMatchSub: "মিলে যাওয়া জোড়া খুঁজুন",
  quiz: "কুইজ",
  quizSub: "বহুনির্বাচনী উত্তর",
  matchPairs: "জোড়া মেলান",
  tapTwoCards: "জোড়া খুঁজতে দুটি কার্ডে চাপ দিন।",
  congratulations: "অভিনন্দন!",
  soClose: "প্রায় হয়ে গিয়েছিল!",
  youCleared: "আপনি স্তর {n} সম্পূর্ণ করেছেন।",
  continueIn: "{n} সেকেন্ডে চালিয়ে যান",
  retryIn: "{n} সেকেন্ডে আবার চেষ্টা",
  home: "হোম",
  back: "পিছনে",
  language: "ভাষা",
  enterName: "আপনার নাম লিখুন",
  continueWord: "চালিয়ে যান",
  getStarted: "শুরু করুন",
  tagline: "আঞ্চলিক ভাষায় ভারতের প্রথম মস্তিষ্ক খেলা।",
  checkAnswer: "উত্তর যাচাই করুন",
  muteSounds: "শব্দ বন্ধ",
  unmuteSounds: "শব্দ চালু",
  heroHeadline: "আপনার স্মৃতিগুলো জীবন্ত রাখুন",
  heroSubtag: "আঞ্চলিক ভাষায় ভারতের প্রথম মস্তিষ্ক-প্রশিক্ষণ কর্মসূচির সাথে স্মৃতি, মনোযোগ এবং আরও অনেক কিছু অন্বেষণ করুন",
  cognitiveHeading: "চেনা মনে হওয়া সহায়তা",
  cognitiveSub: "আবার আবিষ্কার করুন, মনে রাখুন, আবার সংযুক্ত হন। স্মৃতির সাথে ভাষা, সংস্কৃতি এবং আপনার জন্য তৈরি কার্যক্রম অন্বেষণ করুন।",
  feature1Title: "ভাষার বাধা দূর করা",
  feature1Body: "স্মৃতি প্রাজ্ঞানিক কার্যক্রমকে আঞ্চলিক ভাষায় নিয়ে আসে, যা ব্যবহারকারীদের নির্দেশাবলী বুঝতে এবং তাদের পরিচিত ভাষায় স্বাচ্ছন্দ্যে যোগাযোগ করতে সাহায্য করে।",
  feature2Title: "পরিচিতির চারপাশে তৈরি",
  feature2Body: "কার্যক্রমকে আরও চেনাজানা ও অর্থবহ করতে পরিচিত খাবার, উৎসব, শব্দ এবং প্রাত্যহিক জিনিসপত্র স্মৃতিতে যুক্ত করা হয়েছে।",
  feature3Title: "প্রতিটি ব্যবহারকারীর উপযোগী করে তৈরি",
  feature3Body: "বিভিন্ন কার্যক্রম এবং কঠিনতার স্তর স্মৃতিকে ব্যবহারকারীদের সক্ষমতা অনুযায়ী মানিয়ে নিতে এবং তাদের নিজস্ব গতিতে যুক্ত থাকতে সাহায্য করে।",
  verifiedHeading: "মনোরোগ বিশেষজ্ঞদের দ্বারা যাচাইকৃত",
  verifiedSub: "যত্নসহকারে আপনার কাছে আনা হয়েছে।",
  account: "অ্যাকাউন্ট",
  accountFullName: "পূর্ণ নাম",
  accountStartedOn: "শুরুর তারিখ",
  accountEdit: "পরিবর্তন করুন",
  accountSave: "সংরক্ষণ করুন",
  accountClose: "বন্ধ করুন",
  fullscreenEnter: "পূর্ণ স্ক্রিনে দেখুন",
  fullscreenExit: "পূর্ণ স্ক্রিন থেকে বের হন",
};

const or: Dict = {
  stepOf: "ପଦକ୍ଷେପ {n} / 4",
  chooseLanguage: "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ",
  games: "ଖେଳ",
  pickTheme: "ବିଷୟ ବାଛନ୍ତୁ",
  chooseLevel: "ସ୍ତର ବାଛନ୍ତୁ",
  level: "ସ୍ତର {n}",
  coins: "ମୁଦ୍ରା",
  questions: "{n} ପ୍ରଶ୍ନ",
  cards: "{n} କାର୍ଡ",
  memoryMatch: "ସ୍ମୃତି ଯୋଡି",
  memoryMatchSub: "ମେଳ ଖାଉଥିବା ଯୋଡି ଖୋଜନ୍ତୁ",
  quiz: "କୁଇଜ୍",
  quizSub: "ବହୁବିକଳ୍ପ ଉତ୍ତର",
  matchPairs: "ଯୋଡି ମିଳାନ୍ତୁ",
  tapTwoCards: "ଯୋଡି ଖୋଜିବା ପାଇଁ ଦୁଇଟି କାର୍ଡ ଛୁଅନ୍ତୁ।",
  congratulations: "ଅଭିନନ୍ଦନ!",
  soClose: "ବହୁତ ପାଖରେ!",
  youCleared: "ଆପଣ ସ୍ତର {n} ସମ୍ପୂର୍ଣ୍ଣ କଲେ।",
  continueIn: "{n} ସେକେଣ୍ଡରେ ଆଗକୁ",
  retryIn: "{n} ସେକେଣ୍ଡରେ ପୁଣି ଚେଷ୍ଟା",
  home: "ହୋମ୍",
  back: "ପଛକୁ",
  language: "ଭାଷା",
  enterName: "ଆପଣଙ୍କ ନାମ ଲେଖନ୍ତୁ",
  continueWord: "ଜାରି ରଖନ୍ତୁ",
  getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
  tagline: "ଆଞ୍ଚଳିକ ଭାଷାରେ ଭାରତର ପ୍ରଥମ ମସ୍ତିଷ୍କ ଖେଳ।",
  checkAnswer: "ଉତ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ",
  muteSounds: "ଶବ୍ଦ ବନ୍ଦ",
  unmuteSounds: "ଶବ୍ଦ ଚାଲୁ",
  heroHeadline: "ଆପଣଙ୍କ ସ୍ମୃତିକୁ ଜୀବନ୍ତ ରଖନ୍ତୁ",
  heroSubtag: "ଆଞ୍ଚଳିକ ଭାଷାରେ ଭାରତର ପ୍ରଥମ ମସ୍ତିଷ୍କ-ପ୍ରଶିକ୍ଷଣ କାର୍ଯ୍ୟକ୍ରମ ସହିତ ସ୍ମୃତି, ଧ୍ୟାନ ଏବଂ ଅଧିକ ବିଷୟ ଅନ୍ୱେଷଣ କରନ୍ତୁ",
  cognitiveHeading: "ପରିଚିତ ଅନୁଭବ ହେଉଥିବା ସହାୟତା",
  cognitiveSub: "ପୁନଃ ଆବିଷ୍କାର କରନ୍ତୁ, ମନେ ରଖନ୍ତୁ, ପୁନଃ ସଂଯୋଗ କରନ୍ତୁ। ସ୍ମୃତି ସହିତ ଭାଷା, ସଂସ୍କୃତି ଏବଂ ଆପଣଙ୍କ ପାଇଁ ପ୍ରସ୍ତୁତ କାର୍ଯ୍ୟକଳାପ ଅନ୍ୱେଷଣ କରନ୍ତୁ।",
  feature1Title: "ଭାଷା ବାଧାକୁ ଦୂର କରିବା",
  feature1Body: "ସ୍ମୃତି ମାନସିକ କାର୍ଯ୍ୟକଳାପକୁ ଆଞ୍ଚଳିକ ଭାଷାକୁ ଆଣିଥାଏ, ଯାହା ବ୍ୟବହାରକାରୀଙ୍କୁ ନିର୍ଦ୍ଦେଶ ବୁଝିବାରେ ଏବଂ ସେମାନଙ୍କ ଜଣା ଭାଷାରେ ସହଜରେ ଯୋଗାଯୋଗ କରିବାରେ ସାହାଯ୍ୟ କରେ।",
  feature2Title: "ପରିଚିତତା ଚାରିପାଖରେ ନିର୍ମିତ",
  feature2Body: "କାର୍ଯ୍ୟକଳାପକୁ ଅଧିକ ପରିଚିତ ଓ ଅର୍ଥପୂର୍ଣ୍ଣ କରିବା ପାଇଁ ପରିଚିତ ଖାଦ୍ୟ, ପର୍ବ, ଶବ୍ଦ ଏବଂ ଦୈନନ୍ଦିନ ବସ୍ତୁକୁ ସ୍ମୃତିରେ ସାମିଲ କରାଯାଇଛି।",
  feature3Title: "ପ୍ରତ୍ୟେକ ବ୍ୟବହାରକାରୀଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ",
  feature3Body: "ବିଭିନ୍ନ କାର୍ଯ୍ୟକଳାପ ଏବଂ କଠିନତା ସ୍ତର ସ୍ମୃତିକୁ ବ୍ୟବହାରକାରୀଙ୍କ ସାମର୍ଥ୍ୟ ଅନୁସାରେ ଖାପ ଖୁଆଇବାରେ ଏବଂ ସେମାନଙ୍କ ନିଜ ଗତିରେ ସମ୍ପୃକ୍ତ ରହିବାରେ ସାହାଯ୍ୟ କରେ।",
  verifiedHeading: "ମନୋଚିକିତ୍ସକଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚିତ",
  verifiedSub: "ଯତ୍ନର ସହ ଆପଣଙ୍କ ପାଖରେ ଆଣାଯାଇଛି।",
  account: "ଖାତା",
  accountFullName: "ପୂର୍ଣ୍ଣ ନାମ",
  accountStartedOn: "ଆରମ୍ଭ ତାରିଖ",
  accountEdit: "ବଦଳାନ୍ତୁ",
  accountSave: "ସେଭ୍ କରନ୍ତୁ",
  accountClose: "ବନ୍ଦ କରନ୍ତୁ",
  fullscreenEnter: "ପୂର୍ଣ୍ଣ ସ୍କ୍ରିନରେ ଦେଖନ୍ତୁ",
  fullscreenExit: "ପୂର୍ଣ୍ଣ ସ୍କ୍ରିନରୁ ବାହାରକୁ ଯାଆନ୍ତୁ",
};

const DICTS: Record<string, Dict> = { en, hi, te, ta, bn, or };

export function t(code: string | undefined, key: UiKey, n?: number | string): string {
  const d = DICTS[code ?? "en"] ?? en;
  const s = d[key] ?? en[key];
  return n === undefined ? s : s.replace("{n}", String(n));
}

// Theme labels / subtitles by theme id
const THEME_TEXT: Record<string, Record<string, { label: string; sub: string }>> = {
  fruitsveg: {
    en: { label: "Fruits & Veggies", sub: "Everyday fruits and vegetables" },
    hi: { label: "फल और सब्ज़ियाँ", sub: "रोज़मर्रा के फल और सब्ज़ियाँ" },
    te: { label: "పండ్లు & కూరగాయలు", sub: "రోజువారీ పండ్లు మరియు కూరగాయలు" },
    ta: { label: "பழங்கள் & காய்கறிகள்", sub: "அன்றாட பழங்கள் மற்றும் காய்கறிகள்" },
    bn: { label: "ফল ও সবজি", sub: "প্রতিদিনের ফল ও সবজি" },
    or: { label: "ଫଳ ଓ ପନିପରିବା", sub: "ଦୈନନ୍ଦିନ ଫଳ ଓ ପନିପରିବା" },
  },
  dishes: {
    en: { label: "Indian Dishes", sub: "Dosa, biryani, sweets & more" },
    hi: { label: "भारतीय व्यंजन", sub: "डोसा, बिरयानी, मिठाइयाँ और भी" },
    te: { label: "భారతీయ వంటకాలు", sub: "దోస, బిర్యానీ, స్వీట్లు మరియు మరిన్ని" },
    ta: { label: "இந்திய உணவுகள்", sub: "தோசை, பிரியாணி, இனிப்புகள் மற்றும் பல" },
    bn: { label: "ভারতীয় খাবার", sub: "দোসা, বিরিয়ানি, মিষ্টি ও আরও" },
    or: { label: "ଭାରତୀୟ ଖାଦ୍ୟ", sub: "ଦୋସା, ବିରିୟାନି, ମିଠା ଓ ଅଧିକ" },
  },
  festivals: {
    en: { label: "Festivals", sub: "Indian celebrations" },
    hi: { label: "त्योहार", sub: "भारतीय उत्सव" },
    te: { label: "పండుగలు", sub: "భారతీయ వేడుకలు" },
    ta: { label: "பண்டிகைகள்", sub: "இந்திய கொண்டாட்டங்கள்" },
    bn: { label: "উৎসব", sub: "ভারতীয় উদযাপন" },
    or: { label: "ପର୍ବ", sub: "ଭାରତୀୟ ଉତ୍ସବ" },
  },
  colors: {
    en: { label: "Colors & Shapes", sub: "Bright and simple" },
    hi: { label: "रंग और आकार", sub: "चमकीले और सरल" },
    te: { label: "రంగులు & ఆకారాలు", sub: "ప్రకాశవంతం మరియు సులభం" },
    ta: { label: "நிறங்கள் & வடிவங்கள்", sub: "பிரகாசமும் எளிமையும்" },
    bn: { label: "রঙ ও আকার", sub: "উজ্জ্বল ও সহজ" },
    or: { label: "ରଙ୍ଗ ଓ ଆକାର", sub: "ଉଜ୍ଜ୍ୱଳ ଓ ସରଳ" },
  },
  food: {
    en: { label: "Food", sub: "Fruits, vegetables & Indian dishes" },
    hi: { label: "भोजन", sub: "फल, सब्ज़ियाँ और भारतीय व्यंजन" },
    te: { label: "ఆహారం", sub: "పండ్లు, కూరగాయలు & భారతీయ వంటకాలు" },
    ta: { label: "உணவு", sub: "பழங்கள், காய்கறிகள் & இந்திய உணவுகள்" },
    bn: { label: "খাবার", sub: "ফল, সবজি ও ভারতীয় খাবার" },
    or: { label: "ଖାଦ୍ୟ", sub: "ଫଳ, ପନିପରିବା ଓ ଭାରତୀୟ ଖାଦ୍ୟ" },
  },
};

export function themeLabel(id: string, code: string | undefined, fallback: string): string {
  return THEME_TEXT[id]?.[code ?? "en"]?.label ?? fallback;
}
export function themeSub(id: string, code: string | undefined, fallback: string): string {
  return THEME_TEXT[id]?.[code ?? "en"]?.sub ?? fallback;
}
