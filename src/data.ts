import { WordItem, GujNumberItem } from './types';

export const ENGLISH_ABC: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const ENGLISH_WORDS: WordItem[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎', phonetic: 'A for Apple' },
  { letter: 'B', word: 'Ball', emoji: '⚽', phonetic: 'B for Ball' },
  { letter: 'C', word: 'Cat', emoji: '🐱', phonetic: 'C for Cat' },
  { letter: 'D', word: 'Dog', emoji: '🐶', phonetic: 'D for Dog' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', phonetic: 'E for Elephant' },
  { letter: 'F', word: 'Fish', emoji: '🐟', phonetic: 'F for Fish' },
  { letter: 'G', word: 'Grapes', emoji: '🍇', phonetic: 'G for Grapes' },
  { letter: 'H', word: 'Hat', emoji: '🎩', phonetic: 'H for Hat' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', phonetic: 'I for Ice Cream' },
  { letter: 'J', word: 'Jug', emoji: '🏺', phonetic: 'J for Jug' },
  { letter: 'K', word: 'Kite', emoji: '🪁', phonetic: 'K for Kite' },
  { letter: 'L', word: 'Lion', emoji: '🦁', phonetic: 'L for Lion' },
  { letter: 'M', word: 'Monkey', emoji: '🐒', phonetic: 'M for Monkey' },
  { letter: 'N', word: 'Nest', emoji: '🪹', phonetic: 'N for Nest' },
  { letter: 'O', word: 'Orange', emoji: '🍊', phonetic: 'O for Orange' },
  { letter: 'P', word: 'Parrot', emoji: '🦜', phonetic: 'P for Parrot' },
  { letter: 'Q', word: 'Queen', emoji: '👸', phonetic: 'Q for Queen' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰', phonetic: 'R for Rabbit' },
  { letter: 'S', word: 'Sun', emoji: '☀️', phonetic: 'S for Sun' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', phonetic: 'T for Tiger' },
  { letter: 'U', word: 'Umbrella', emoji: '⛱️', phonetic: 'U for Umbrella' },
  { letter: 'V', word: 'Van', emoji: '🚐', phonetic: 'V for Van' },
  { letter: 'W', word: 'Watch', emoji: '⌚', phonetic: 'W for Watch' },
  { letter: 'X', word: 'Xylophone', emoji: '🎼', phonetic: 'X for Xylophone' },
  { letter: 'Y', word: 'Yak', emoji: '🐂', phonetic: 'Y for Yak' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', phonetic: 'Z for Zebra' },
];

export function getEnglishNumberSpelling(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 100) return 'One Hundred';
  if (num < 20) return ones[num];
  const tenDigit = Math.floor(num / 10);
  const oneDigit = num % 10;
  return tens[tenDigit] + (oneDigit > 0 ? ' ' + ones[oneDigit] : '');
}

export const GUJARATI_VOWELS = [
  { char: 'અ', name: 'અ', phonetic: 'a', word: 'અનાનસ', emoji: '🍍' },
  { char: 'આ', name: 'આ', phonetic: 'aa', word: 'આગાડી', emoji: '🚂' },
  { char: 'ઇ', name: 'ઇ', phonetic: 'i', word: 'ઇમારત', emoji: '🏢' },
  { char: 'ઈ', name: 'ઈ', phonetic: 'ee', word: 'ઈશ્વર', emoji: '🙏' },
  { char: 'ઉ', name: 'ઉ', phonetic: 'u', word: 'ઉંદર', emoji: '🐀' },
  { char: 'ઊ', name: 'ઊ', phonetic: 'oo', word: 'ઊંટ', emoji: '🐫' },
  { char: 'ઋ', name: 'ઋ', phonetic: 'ru', word: 'ઋષિ', emoji: '🧘' },
  { char: 'એ', name: 'એ', phonetic: 'e', word: 'એરણ', emoji: '🔨' },
  { char: 'ઐ', name: 'ઐ', phonetic: 'ai', word: 'ઐરાવત', emoji: '🐘' },
  { char: 'ઓ', name: 'ઓ', phonetic: 'o', word: 'ઓજાર', emoji: '🛠️' },
  { char: 'ઔ', name: 'ઔ', phonetic: 'au', word: 'ઔષધ', emoji: '🧪' },
  { char: 'અં', name: 'અં', phonetic: 'am', word: 'અંજીર', emoji: '🥯' },
  { char: 'અઃ', name: 'અઃ', phonetic: 'aha', word: 'નમઃ', emoji: '🙇' }
];

export const GUJARATI_CONSONANTS = [
  { char: 'ક', phonetic: 'ka', word: 'કમળ', emoji: '🪷' },
  { char: 'ખ', phonetic: 'kha', word: 'ખલ', emoji: '🥣' },
  { char: 'ગ', phonetic: 'ga', word: 'ગણપતિ', emoji: '🕉️' },
  { char: 'ઘ', phonetic: 'gha', word: 'ઘર', emoji: '🏠' },
  { char: 'ઙ', phonetic: 'nga', word: 'ઙ', emoji: '🔔' },
  { char: 'ચ', phonetic: 'cha', word: 'ચકલી', emoji: '🐦' },
  { char: 'છ', phonetic: 'chha', word: 'છત્રી', emoji: '☔' },
  { char: 'જ', phonetic: 'ja', word: 'જલેબી', emoji: '🍥' },
  { char: 'ઝ', phonetic: 'jha', word: 'ઝભલું', emoji: '👗' },
  { char: 'ઞ', phonetic: 'nya', word: 'ઞ', emoji: '🎵' },
  { char: 'ટ', phonetic: 'ta', word: 'ટમેટું', emoji: '🍅' },
  { char: 'ઠ', phonetic: 'tha', word: 'ઠોઠ', emoji: '🪵' },
  { char: 'ડ', phonetic: 'da', word: 'ડમરુ', emoji: '🪘' },
  { char: 'ઢ', phonetic: 'dha', word: 'ઢોલ', emoji: '🥁' },
  { char: 'ણ', phonetic: 'na', word: 'ફેણ', emoji: '🐍' },
  { char: 'ત', phonetic: 'ta', word: 'તલવાર', emoji: '⚔️' },
  { char: 'થ', phonetic: 'tha', word: 'થડ', emoji: '🪵' },
  { char: 'દ', phonetic: 'da', word: 'દડો', emoji: '⚽' },
  { char: 'ધ', phonetic: 'dha', word: 'ધનુષ', emoji: '🏹' },
  { char: 'ન', phonetic: 'na', word: 'નળ', emoji: '🚰' },
  { char: 'પ', phonetic: 'pa', word: 'પતંગ', emoji: '🪁' },
  { char: 'ફ', phonetic: 'fa', word: 'ફટાકડા', emoji: '🎆' },
  { char: 'બ', phonetic: 'ba', word: 'બતક', emoji: '🦆' },
  { char: 'ભ', phonetic: 'bha', word: 'ભમરડો', emoji: '🪀' },
  { char: 'મ', phonetic: 'ma', word: 'મગર', emoji: '🐊' },
  { char: 'ય', phonetic: 'ya', word: 'યજ્ઞ', emoji: '🔥' },
  { char: 'ર', phonetic: 'ra', word: 'રથ', emoji: '🛕' },
  { char: 'લ', phonetic: 'la', word: 'લસણ', emoji: '🧄' },
  { char: 'વ', phonetic: 'va', word: 'વહાણ', emoji: '⛵' },
  { char: 'શ', phonetic: 'sha', word: 'શરણાઈ', emoji: '🎺' },
  { char: 'ષ', phonetic: 'sha', word: 'ષટકોણ', emoji: '⬡' },
  { char: 'સ', phonetic: 'sa', word: 'સસલું', emoji: '🐇' },
  { char: 'હ', phonetic: 'ha', word: 'હરણ', emoji: '🦌' },
  { char: 'ળ', phonetic: 'la', word: 'નળ', emoji: '🚰' },
  { char: 'ક્ષ', phonetic: 'ksha', word: 'ક્ષત્રિય', emoji: '🛡️' },
  { char: 'જ્ઞ', phonetic: 'gna', word: 'જ્ઞાની', emoji: '🎓' }
];

const GUJARATI_NUM_SPELLINGS: string[] = [
  "એક", "બે", "ત્રણ", "ચાર", "પાંચ", "છ", "સાત", "આઠ", "નવ", "દસ",
  "અગિયાર", "બાર", "તેર", "ચૌદ", "પંદર", "સોળ", "સત્તર", "અઢાર", "ઓગણીસ", "વીસ",
  "એકવીસ", "બાવીસ", "ત્રેવીસ", "ચોવીસ", "પચ્ચીસ", "છવ્વીસ", "સત્યાવીસ", "અઠ્યાવીસ", "ઓગણત્રીસ", "ત્રીસ",
  "એકત્રીસ", "બત્રીસ", "તેત્રીસ", "ચોત્રીસ", "પાંત્રીસ", "છત્રીસ", "સાડત્રીસ", "આડત્રીસ", "ઓગણચાલીસ", "ચાળીસ",
  "એકતાળીસ", "બેતાળીસ", "તેતાળીસ", "ચુંમાળીસ", "પીસ્તાળીસ", "છેતાળીસ", "સુડતાળીસ", "અડતાળીસ", "ઓગણપચાસ", "પયાસ",
  "એકાવન", "બાવન", "ત્રેપન", "ચોપ્પન", "પંચાવન", "છપ્પન", "સત્તાવન", "અઠ્ઠાવન", "ઓગણસાઠ", "સાઠ",
  "એકસઠ", "બાસઠ", "ત્રેસઠ", "ચોસઠ", "પાંસઠ", "છાસઠ", "સડસઠ", "અડસઠ", "ઓગણસિત્તેર", "સિત્તેર",
  "ઈકોતેર", "બોતેર", "તોતેર", "ચુંમોતેર", "પંચોતેર", "છોતેર", "સિત્તોતેર", "ઇઠેતેર", "ઓગણએંસી", "એંસી",
  "એકાસી", "બ્યાસી", "ત્યાસી", "ચોરાસી", "પંચાસી", "છયાસી", "સيت્યાસી", "ઇઠ્યાસી", "નેવ્યાસી", "નેવું",
  "એકાણું", "બાણું", "ત્રાણું", "ચોરાણું", "પંચાણું", "છન્નું", "સતાણું", "અઠાણું", "નવાણું", "સો"
];

// Gujarati digits mapping
const GUJARATI_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

export function toGujaratiNumberString(num: number): string {
  return num.toString().split('').map(digit => GUJARATI_DIGITS[parseInt(digit)]).join('');
}

export const GUJARATI_NUMBERS: GujNumberItem[] = Array.from({ length: 100 }, (_, i) => {
  const val = i + 1;
  return {
    number: val,
    gujNumber: toGujaratiNumberString(val),
    gujSpelling: GUJARATI_NUM_SPELLINGS[i]
  };
});

export interface TableRow {
  num: number;
  mult: number;
  result: number;
  gujNum?: string;
  gujMult?: string;
  gujResult?: string;
}

export function getEnglishTable(num: number): TableRow[] {
  return Array.from({ length: 10 }, (_, i) => {
    const mult = i + 1;
    return {
      num,
      mult,
      result: num * mult
    };
  });
}

export function getGujaratiTable(num: number): TableRow[] {
  return Array.from({ length: 10 }, (_, i) => {
    const mult = i + 1;
    return {
      num,
      mult,
      result: num * mult,
      gujNum: toGujaratiNumberString(num),
      gujMult: toGujaratiNumberString(mult),
      gujResult: toGujaratiNumberString(num * mult)
    };
  });
}

export const GUJARATI_BARAKHADI_MATRAS = [
  { name: 'અ', sign: '' },
  { name: 'આ', sign: 'ા' },
  { name: 'ઇ', sign: 'િ' },
  { name: 'ઈ', sign: 'ી' },
  { name: 'ઉ', sign: 'ુ' },
  { name: 'ઊ', sign: 'ૂ' },
  { name: 'એ', sign: 'ે' },
  { name: 'ઐ', sign: 'ૈ' },
  { name: 'ઓ', sign: 'ો' },
  { name: 'ઔ', sign: 'ૌ' },
  { name: 'અં', sign: 'ં' },
  { name: 'અઃ', sign: 'ઃ' }
];

export const GUJARATI_ALPHABET = [...GUJARATI_VOWELS, ...GUJARATI_CONSONANTS];
