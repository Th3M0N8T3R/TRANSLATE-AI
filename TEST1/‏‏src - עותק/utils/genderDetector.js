// genderDetector.js

import { contextAnalyzer } from './genderDetection/contextAnalyzer.js';
import { patternMatcher } from './genderDetection/patternMatcher.js';
import { MASCULINE_WORDS, FEMININE_WORDS, GENDER_TYPES } from './genderDetection/constants.js';

export class HebrewGenderDetector {
  constructor() {
    this.contextAnalyzer = new contextAnalyzer();
    this.patternMatcher = new patternMatcher();
  }

  // פונקציה קיימת: זיהוי מגדר ללא קריאת API
  detectGender(text) {
    if (!text) return { gender: GENDER_TYPES.UNKNOWN, confidence: 0 };

    const words = text.split(/\s+/);
    let detectedGender = GENDER_TYPES.UNKNOWN;

    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (MASCULINE_WORDS.has(lowerWord)) {
        detectedGender = GENDER_TYPES.MALE;
      } else if (FEMININE_WORDS.has(lowerWord)) {
        detectedGender = GENDER_TYPES.FEMALE;
      }
    });

    return { gender: detectedGender, confidence: 1 };
  }

  // פונקציה משודרגת: זיהוי מגדר עם קריאת API
  async detectGenderWithAPI(text, translateAPI) {
    if (!text) return { gender: GENDER_TYPES.UNKNOWN, translatedText: '' };

    // שלב 1: קריאת ה-API
    const translatedText = await translateAPI(text, 'en', 'he');

    // שלב 2: בדיקת המילים בעברית
    const words = translatedText.split(/\s+/);
    let detectedGender = GENDER_TYPES.UNKNOWN;

    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (MASCULINE_WORDS.has(lowerWord)) {
        detectedGender = GENDER_TYPES.MALE;
      } else if (FEMININE_WORDS.has(lowerWord)) {
        detectedGender = GENDER_TYPES.FEMALE;
      }
    });

    // שלב 3: בדיקה מול האנגלית
    const englishWords = text.split(/\s+/);
    englishWords.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (MASCULINE_WORDS.has(lowerWord)) {
        detectedGender = GENDER_TYPES.MALE;
      } else if (FEMININE_WORDS.has(lowerWord)) {
        detectedGender = GENDER_TYPES.FEMALE;
      }
    });

    return { translatedText, detectedGender };
  }
}
