// genderDetector.js
import { 
  MASCULINE_WORDS, 
  FEMININE_WORDS, 
  MASCULINE_PATTERNS, 
  FEMININE_PATTERNS, 
  GENDER_TYPES, 
  AMBIGUOUS_WORDS 
} from './constants.js';

import { removeDiacritics, fixRTL, findAmbiguousLines } from './textProcessor.js';

function normalizeText(text) {
  return text
    .normalize("NFKD")  // מפרק תווים משולבים
    .replace(/[\u0591-\u05C7\u05B0-\u05BD\u05BF\u05C1-\u05C2\u05C4\u05C5]/g, "")  // מסיר ניקוד
    .replace(/[\u200D\u200E\u200F]/g, "") // מסיר תווי כיוון
    .trim()
    .toLowerCase();
}

function matchPatterns(word, patterns) {
  return patterns.some(pattern => pattern.test(word));
}

export class HebrewGenderDetector {
  detectGender(text) {
    if (!text) return { gender: GENDER_TYPES.UNKNOWN, confidence: 0 };

    const words = normalizeText(text).split(/\s+/);
    let detectedGender = GENDER_TYPES.UNKNOWN;

    for (const word of words) {
      if (MASCULINE_WORDS.has(word) || matchPatterns(word, MASCULINE_PATTERNS)) {
        detectedGender = GENDER_TYPES.MALE;
      } else if (FEMININE_WORDS.has(word) || matchPatterns(word, FEMININE_PATTERNS)) {
        detectedGender = GENDER_TYPES.FEMALE;
      }
    }

    return { gender: detectedGender, confidence: detectedGender !== GENDER_TYPES.UNKNOWN ? 1 : 0 };
  }

  async detectGenderWithAPI(text, translateAPI) {
    if (!text) return { gender: GENDER_TYPES.UNKNOWN, translatedText: '' };

    const translatedText = await translateAPI(text, 'en', 'he');
    const cleanedText = fixRTL(removeDiacritics(translatedText));
    const words = cleanedText.split(/\s+/);

    let detectedGender = GENDER_TYPES.UNKNOWN;

    for (const word of words) {
      if (MASCULINE_WORDS.has(word) || matchPatterns(word, MASCULINE_PATTERNS)) {
        detectedGender = GENDER_TYPES.MALE;
      } else if (FEMININE_WORDS.has(word) || matchPatterns(word, FEMININE_PATTERNS)) {
        detectedGender = GENDER_TYPES.FEMALE;
      }
    }

    const ambiguousLines = findAmbiguousLines([cleanedText], AMBIGUOUS_WORDS);

    return { translatedText, detectedGender, ambiguousLines };
  }
}
