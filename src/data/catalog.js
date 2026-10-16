export const SIGNS = [
  { en: 'Aries', hi: 'मेष', short: 'Ar' },
  { en: 'Taurus', hi: 'वृष', short: 'Ta' },
  { en: 'Gemini', hi: 'मिथुन', short: 'Ge' },
  { en: 'Cancer', hi: 'कर्क', short: 'Cn' },
  { en: 'Leo', hi: 'सिंह', short: 'Le' },
  { en: 'Virgo', hi: 'कन्या', short: 'Vi' },
  { en: 'Libra', hi: 'तुला', short: 'Li' },
  { en: 'Scorpio', hi: 'वृश्चिक', short: 'Sc' },
  { en: 'Sagittarius', hi: 'धनु', short: 'Sg' },
  { en: 'Capricorn', hi: 'मकर', short: 'Cp' },
  { en: 'Aquarius', hi: 'कुम्भ', short: 'Aq' },
  { en: 'Pisces', hi: 'मीन', short: 'Pi' },
];

export const PLANETS = [
  { id: 'sun', en: 'Sun', hi: 'सूर्य', abbr: 'Su', hiAbbr: 'सू' },
  { id: 'moon', en: 'Moon', hi: 'चन्द्र', abbr: 'Mo', hiAbbr: 'चं' },
  { id: 'mars', en: 'Mars', hi: 'मंगल', abbr: 'Ma', hiAbbr: 'मं' },
  { id: 'mercury', en: 'Mercury', hi: 'बुध', abbr: 'Me', hiAbbr: 'बु' },
  { id: 'jupiter', en: 'Jupiter', hi: 'गुरु', abbr: 'Ju', hiAbbr: 'गु' },
  { id: 'venus', en: 'Venus', hi: 'शुक्र', abbr: 'Ve', hiAbbr: 'शु' },
  { id: 'saturn', en: 'Saturn', hi: 'शनि', abbr: 'Sa', hiAbbr: 'श' },
  { id: 'rahu', en: 'Rahu', hi: 'राहु', abbr: 'Ra', hiAbbr: 'रा' },
  { id: 'ketu', en: 'Ketu', hi: 'केतु', abbr: 'Ke', hiAbbr: 'के' },
];

export const NAKSHATRAS = [
  ['Ashwini', 'अश्विनी'],
  ['Bharani', 'भरणी'],
  ['Krittika', 'कृत्तिका'],
  ['Rohini', 'रोहिणी'],
  ['Mrigashira', 'मृगशिरा'],
  ['Ardra', 'आर्द्रा'],
  ['Punarvasu', 'पुनर्वसु'],
  ['Pushya', 'पुष्य'],
  ['Ashlesha', 'आश्लेषा'],
  ['Magha', 'मघा'],
  ['Purva Phalguni', 'पूर्व फाल्गुनी'],
  ['Uttara Phalguni', 'उत्तर फाल्गुनी'],
  ['Hasta', 'हस्त'],
  ['Chitra', 'चित्रा'],
  ['Swati', 'स्वाती'],
  ['Vishakha', 'विशाखा'],
  ['Anuradha', 'अनुराधा'],
  ['Jyeshtha', 'ज्येष्ठा'],
  ['Mula', 'मूल'],
  ['Purva Ashadha', 'पूर्वाषाढ़ा'],
  ['Uttara Ashadha', 'उत्तराषाढ़ा'],
  ['Shravana', 'श्रवण'],
  ['Dhanishta', 'धनिष्ठा'],
  ['Shatabhisha', 'शतभिषा'],
  ['Purva Bhadrapada', 'पूर्व भाद्रपद'],
  ['Uttara Bhadrapada', 'उत्तर भाद्रपद'],
  ['Revati', 'रेवती'],
];

export const DASHA_LORDS = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'];
export const DASHA_YEARS = { ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7, rahu: 18, jupiter: 16, saturn: 19, mercury: 17 };

export const YOGINIS = [
  { en: 'Mangala', hi: 'मंगला', years: 1 },
  { en: 'Pingala', hi: 'पिंगला', years: 2 },
  { en: 'Dhanya', hi: 'धान्या', years: 3 },
  { en: 'Bhramari', hi: 'भ्रामरी', years: 4 },
  { en: 'Bhadrika', hi: 'भद्रिका', years: 5 },
  { en: 'Ulka', hi: 'उल्का', years: 6 },
  { en: 'Siddha', hi: 'सिद्धा', years: 7 },
  { en: 'Sankata', hi: 'संकटा', years: 8 },
];

export const OWN = {
  sun: [4],
  moon: [3],
  mars: [0, 7],
  mercury: [2, 5],
  jupiter: [8, 11],
  venus: [1, 6],
  saturn: [9, 10],
};
export const EXALT = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6 };
export const SIGN_LORDS = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];

export const WEEKDAYS = [
  ['Sunday', 'रविवार'],
  ['Monday', 'सोमवार'],
  ['Tuesday', 'मंगलवार'],
  ['Wednesday', 'बुधवार'],
  ['Thursday', 'गुरुवार'],
  ['Friday', 'शुक्रवार'],
  ['Saturday', 'शनिवार'],
];

export const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];
export const TITHIS_HI = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा',
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'अमावस्या',
];

export const YOGA_NAMES = [
  ['Vishkambha', 'विष्कुम्भ'], ['Priti', 'प्रीति'], ['Ayushman', 'आयुष्मान'], ['Saubhagya', 'सौभाग्य'],
  ['Shobhana', 'शोभन'], ['Atiganda', 'अतिगण्ड'], ['Sukarma', 'सुकर्मा'], ['Dhriti', 'धृति'],
  ['Shula', 'शूल'], ['Ganda', 'गण्ड'], ['Vriddhi', 'वृद्धि'], ['Dhruva', 'ध्रुव'],
  ['Vyaghata', 'व्याघात'], ['Harshana', 'हर्षण'], ['Vajra', 'वज्र'], ['Siddhi', 'सिद्धि'],
  ['Vyatipata', 'व्यतीपात'], ['Variyana', 'वरीयान'], ['Parigha', 'परिघ'], ['Shiva', 'शिव'],
  ['Siddha', 'सिद्ध'], ['Sadhya', 'साध्य'], ['Shubha', 'शुभ'], ['Shukla', 'शुक्ल'],
  ['Brahma', 'ब्रह्म'], ['Indra', 'इन्द्र'], ['Vaidhriti', 'वैधृति'],
];

export const KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
export const KARANAS_HI = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि', 'शकुनि', 'चतुष्पाद', 'नाग', 'किंस्तुघ्न'];

export const VARGA_SET = [
  { id: 'D1', name: 'Rasi', hi: 'राशि', parts: 1 },
  { id: 'D2', name: 'Hora', hi: 'होरा', parts: 2 },
  { id: 'D3', name: 'Drekkana', hi: 'द्रेष्काण', parts: 3 },
  { id: 'D4', name: 'Chaturthamsa', hi: 'चतुर्थांश', parts: 4 },
  { id: 'D7', name: 'Saptamsa', hi: 'सप्तांश', parts: 7 },
  { id: 'D9', name: 'Navamsa', hi: 'नवांश', parts: 9 },
  { id: 'D10', name: 'Dasamsa', hi: 'दशांश', parts: 10 },
  { id: 'D12', name: 'Dwadasamsa', hi: 'द्वादशांश', parts: 12 },
  { id: 'D16', name: 'Shodasamsa', hi: 'षोडशांश', parts: 16 },
  { id: 'D20', name: 'Vimsamsa', hi: 'विंशांश', parts: 20 },
  { id: 'D24', name: 'Chaturvimsamsa', hi: 'चतुर्विंशांश', parts: 24 },
  { id: 'D27', name: 'Saptavimsamsa', hi: 'सप्तविंशांश', parts: 27 },
  { id: 'D30', name: 'Trimsamsa', hi: 'त्रिंशांश', parts: 30 },
  { id: 'D40', name: 'Khavedamsa', hi: 'खवेदांश', parts: 40 },
  { id: 'D45', name: 'Akshavedamsa', hi: 'अक्षवेदांश', parts: 45 },
  { id: 'D60', name: 'Shashtiamsa', hi: 'षष्ट्यंश', parts: 60 },
];

/** Classical Parashara benefic places, counted 1..12 from each contributor. */
export const ASHTAK = {
  sun: { sun: [1, 2, 4, 7, 8, 9, 10, 11], moon: [3, 6, 10, 11], mars: [1, 2, 4, 7, 8, 9, 10, 11], mercury: [3, 5, 6, 9, 10, 11, 12], jupiter: [5, 6, 9, 11], venus: [6, 7, 12], saturn: [1, 2, 4, 7, 8, 9, 10, 11], lagna: [3, 4, 6, 10, 11, 12] },
  moon: { sun: [3, 6, 7, 8, 10, 11], moon: [1, 3, 6, 7, 10, 11], mars: [2, 3, 5, 6, 9, 10, 11], mercury: [1, 3, 4, 5, 7, 8, 10, 11], jupiter: [1, 4, 7, 8, 10, 11, 12], venus: [3, 4, 5, 7, 9, 10, 11], saturn: [3, 5, 6, 11], lagna: [3, 6, 10, 11] },
  mars: { sun: [3, 5, 6, 10, 11], moon: [3, 6, 11], mars: [1, 2, 4, 7, 8, 10, 11], mercury: [3, 5, 6, 11], jupiter: [6, 10, 11, 12], venus: [6, 8, 11, 12], saturn: [1, 4, 7, 8, 9, 10, 11], lagna: [1, 3, 6, 10, 11] },
  mercury: { sun: [5, 6, 9, 11, 12], moon: [2, 4, 6, 8, 10, 11], mars: [1, 2, 4, 7, 8, 9, 10, 11], mercury: [1, 3, 5, 6, 9, 10, 11, 12], jupiter: [6, 8, 11, 12], venus: [1, 2, 3, 4, 5, 8, 9, 11], saturn: [1, 2, 4, 7, 8, 9, 10, 11], lagna: [1, 2, 4, 6, 8, 10, 11] },
  jupiter: { sun: [1, 2, 3, 4, 7, 8, 9, 10, 11], moon: [2, 5, 7, 9, 11], mars: [1, 2, 4, 7, 8, 10, 11], mercury: [1, 2, 4, 5, 6, 9, 10, 11], jupiter: [1, 2, 3, 4, 7, 8, 10, 11], venus: [2, 5, 6, 9, 10, 11], saturn: [3, 5, 6, 12], lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11] },
  venus: { sun: [8, 11, 12], moon: [1, 2, 3, 4, 5, 8, 9, 11, 12], mars: [3, 4, 6, 9, 11, 12], mercury: [3, 5, 6, 9, 11], jupiter: [5, 8, 9, 10, 11], venus: [1, 2, 3, 4, 5, 8, 9, 10, 11], saturn: [3, 4, 5, 8, 9, 10, 11], lagna: [1, 2, 3, 4, 5, 8, 9, 11] },
  saturn: { sun: [1, 2, 4, 7, 8, 10, 11], moon: [3, 6, 11], mars: [3, 5, 6, 10, 11, 12], mercury: [6, 8, 9, 10, 11, 12], jupiter: [5, 6, 11, 12], venus: [6, 11, 12], saturn: [3, 5, 6, 11], lagna: [1, 3, 4, 6, 10, 11] },
};

export const GANA = ['Deva', 'Manushya', 'Rakshasa', 'Manushya', 'Deva', 'Manushya', 'Deva', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva'];
export const NADI = ['Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya'];
export const YONI = ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent', 'Dog', 'Cat', 'Sheep', 'Cat', 'Rat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Buffalo', 'Tiger', 'Deer', 'Deer', 'Dog', 'Monkey', 'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion', 'Cow', 'Elephant'];
export const YONI_HI = ['अश्व', 'गज', 'मेष', 'सर्प', 'सर्प', 'श्वान', 'मार्जार', 'मेष', 'मार्जार', 'मूषक', 'मूषक', 'गौ', 'महिष', 'व्याघ्र', 'महिष', 'व्याघ्र', 'मृग', 'मृग', 'श्वान', 'वानर', 'नकुल', 'वानर', 'सिंह', 'अश्व', 'सिंह', 'गौ', 'गज'];
export const GANA_HI = { Deva: 'देव', Manushya: 'मनुष्य', Rakshasa: 'राक्षस' };
export const NADI_HI = { Adi: 'आदि', Madhya: 'मध्य', Antya: 'अन्त्य' };

export const ZONES = [
  { id: 'ist', label: 'India (82E30)', offset: 330 },
  { id: 'npt', label: 'Nepal (UTC+5:45)', offset: 345 },
  { id: 'pkt', label: 'Pakistan (UTC+5)', offset: 300 },
  { id: 'bst', label: 'Bangladesh (UTC+6)', offset: 360 },
  { id: 'sl', label: 'Sri Lanka (UTC+5:30)', offset: 330 },
  { id: 'mm', label: 'Myanmar (UTC+6:30)', offset: 390 },
  { id: 'gst', label: 'Gulf (UTC+4)', offset: 240 },
  { id: 'uk', label: 'United Kingdom (UTC+0)', offset: 0 },
  { id: 'cet', label: 'Central Europe (UTC+1)', offset: 60 },
  { id: 'eat', label: 'East Africa (UTC+3)', offset: 180 },
  { id: 'sg', label: 'Singapore (UTC+8)', offset: 480 },
  { id: 'jp', label: 'Japan (UTC+9)', offset: 540 },
  { id: 'aest', label: 'Australia East (UTC+10)', offset: 600 },
  { id: 'us_e', label: 'US Eastern (UTC-5)', offset: -300 },
  { id: 'us_c', label: 'US Central (UTC-6)', offset: -360 },
  { id: 'us_p', label: 'US Pacific (UTC-8)', offset: -480 },
];

const PLACE_ROWS = [
  { id: 'delhi', en: 'Delhi', hi: 'दिल्ली', lat: 28.65, lon: 77.2167 },
  { id: 'newdelhi', en: 'New Delhi', hi: 'नई दिल्ली', lat: 28.6139, lon: 77.209 },
  { id: 'mumbai', en: 'Mumbai', hi: 'मुम्बई', lat: 19.076, lon: 72.8777 },
  { id: 'kolkata', en: 'Kolkata', hi: 'कोलकाता', lat: 22.5726, lon: 88.3639 },
  { id: 'chennai', en: 'Chennai', hi: 'चेन्नई', lat: 13.0827, lon: 80.2707 },
  { id: 'bengaluru', en: 'Bengaluru', hi: 'बेंगलुरु', lat: 12.9716, lon: 77.5946 },
  { id: 'hyderabad', en: 'Hyderabad', hi: 'हैदराबाद', lat: 17.385, lon: 78.4867 },
  { id: 'ahmedabad', en: 'Ahmedabad', hi: 'अहमदाबाद', lat: 23.0225, lon: 72.5714 },
  { id: 'pune', en: 'Pune', hi: 'पुणे', lat: 18.5204, lon: 73.8567 },
  { id: 'jaipur', en: 'Jaipur', hi: 'जयपुर', lat: 26.9124, lon: 75.7873 },
  { id: 'lucknow', en: 'Lucknow', hi: 'लखनऊ', lat: 26.8467, lon: 80.9462 },
  { id: 'kanpur', en: 'Kanpur', hi: 'कानपुर', lat: 26.4499, lon: 80.3319 },
  { id: 'varanasi', en: 'Varanasi', hi: 'वाराणसी', lat: 25.3176, lon: 82.9739 },
  { id: 'agra', en: 'Agra', hi: 'आगरा', lat: 27.1767, lon: 78.0081 },
  { id: 'chandigarh', en: 'Chandigarh', hi: 'चण्डीगढ़', lat: 30.7333, lon: 76.7794 },
  { id: 'amritsar', en: 'Amritsar', hi: 'अमृतसर', lat: 31.634, lon: 74.8723 },
  { id: 'shimla', en: 'Shimla', hi: 'शिमला', lat: 31.1048, lon: 77.1734 },
  { id: 'dehradun', en: 'Dehradun', hi: 'देहरादून', lat: 30.3165, lon: 78.0322 },
  { id: 'srinagar', en: 'Srinagar', hi: 'श्रीनगर', lat: 34.0837, lon: 74.7973 },
  { id: 'jammu', en: 'Jammu', hi: 'जम्मू', lat: 32.7266, lon: 74.857 },
  { id: 'patna', en: 'Patna', hi: 'पटना', lat: 25.5941, lon: 85.1376 },
  { id: 'ranchi', en: 'Ranchi', hi: 'रांची', lat: 23.3441, lon: 85.3096 },
  { id: 'bhopal', en: 'Bhopal', hi: 'भोपाल', lat: 23.2599, lon: 77.4126 },
  { id: 'indore', en: 'Indore', hi: 'इन्दौर', lat: 22.7196, lon: 75.8577 },
  { id: 'nagpur', en: 'Nagpur', hi: 'नागपुर', lat: 21.1458, lon: 79.0882 },
  { id: 'surat', en: 'Surat', hi: 'सूरत', lat: 21.1702, lon: 72.8311 },
  { id: 'vadodara', en: 'Vadodara', hi: 'वडोदरा', lat: 22.3072, lon: 73.1812 },
  { id: 'rajkot', en: 'Rajkot', hi: 'राजकोट', lat: 22.3039, lon: 70.8022 },
  { id: 'bhubaneswar', en: 'Bhubaneswar', hi: 'भुवनेश्वर', lat: 20.2961, lon: 85.8245 },
  { id: 'guwahati', en: 'Guwahati', hi: 'गुवाहाटी', lat: 26.1445, lon: 91.7362 },
  { id: 'kochi', en: 'Kochi', hi: 'कोच्चि', lat: 9.9312, lon: 76.2673 },
  { id: 'thiruvananthapuram', en: 'Thiruvananthapuram', hi: 'तिरुवनन्तपुरम', lat: 8.5241, lon: 76.9366 },
  { id: 'madurai', en: 'Madurai', hi: 'मदुरै', lat: 9.9252, lon: 78.1198 },
  { id: 'coimbatore', en: 'Coimbatore', hi: 'कोयम्बटूर', lat: 11.0168, lon: 76.9558 },
  { id: 'visakhapatnam', en: 'Visakhapatnam', hi: 'विशाखापट्टनम', lat: 17.6868, lon: 83.2185 },
  { id: 'vijayawada', en: 'Vijayawada', hi: 'विजयवाड़ा', lat: 16.5062, lon: 80.648 },
  { id: 'mysuru', en: 'Mysuru', hi: 'मैसूर', lat: 12.2958, lon: 76.6394 },
  { id: 'udaipur', en: 'Udaipur', hi: 'उदयपुर', lat: 24.5854, lon: 73.7125 },
  { id: 'jodhpur', en: 'Jodhpur', hi: 'जोधपुर', lat: 26.2389, lon: 73.0243 },
  { id: 'allahabad', en: 'Prayagraj', hi: 'प्रयागराज', lat: 25.4358, lon: 81.8463 },
  { id: 'haridwar', en: 'Haridwar', hi: 'हरिद्वार', lat: 29.9457, lon: 78.1642 },
  { id: 'mathura', en: 'Mathura', hi: 'मथुरा', lat: 27.4924, lon: 77.6737 },
  { id: 'ujjain', en: 'Ujjain', hi: 'उज्जैन', lat: 23.1765, lon: 75.7885 },
  { id: 'kathmandu', en: 'Kathmandu', hi: 'काठमांडू', lat: 27.7172, lon: 85.324 },
  { id: 'lahore', en: 'Lahore', hi: 'लाहौर', lat: 31.5204, lon: 74.3587 },
  { id: 'custom', en: 'Other / type coordinates', hi: 'अन्य / निर्देशांक लिखें', lat: null, lon: null },
];

const PLACE_REGION = {
  kathmandu: { country: 'Nepal', countryHi: 'नेपाल', zone: 'npt' },
  lahore: { country: 'Pakistan', countryHi: 'पाकिस्तान', zone: 'pkt' },
};

export const PLACES = PLACE_ROWS.map((place) => ({
  ...place,
  ...(PLACE_REGION[place.id] || (place.id === 'custom'
    ? { country: '', countryHi: '', zone: '' }
    : { country: 'India', countryHi: 'भारत', zone: 'ist' })),
}));

export const AYANAMSAS = [
  { id: 'lahiri', en: 'N.C. Lahiri', hi: 'एन.सी. लाहिड़ी' },
  { id: 'raman', en: 'B.V. Raman', hi: 'बी.वी. रामन' },
  { id: 'krishnamurti', en: 'Krishnamurti', hi: 'कृष्णमूर्ति' },
  { id: 'yukteshwar', en: 'Yukteshwar', hi: 'युक्तेश्वर' },
];

export const MONTHS = [
  ['January', 'जनवरी'], ['February', 'फ़रवरी'], ['March', 'मार्च'], ['April', 'अप्रैल'],
  ['May', 'मई'], ['June', 'जून'], ['July', 'जुलाई'], ['August', 'अगस्त'],
  ['September', 'सितम्बर'], ['October', 'अक्टूबर'], ['November', 'नवम्बर'], ['December', 'दिसम्बर'],
];

export function signName(index, lang) {
  const s = SIGNS[((index % 12) + 12) % 12];
  return lang === 'hi' ? s.hi : s.en;
}

export function planetName(id, lang) {
  const p = PLANETS.find((x) => x.id === id);
  if (!p) return id;
  return lang === 'hi' ? p.hi : p.en;
}

export function planetAbbr(id, lang) {
  const p = PLANETS.find((x) => x.id === id);
  if (!p) return 'As';
  return lang === 'hi' ? p.hiAbbr : p.abbr;
}
