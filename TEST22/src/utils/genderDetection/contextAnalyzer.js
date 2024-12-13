import { GENDER_TYPES, FEMALE_INDICATORS, MALE_INDICATORS } from './constants.js';

export function analyzeContext(words) {
  let femaleScore = 0;
  let maleScore = 0;

  // מעבר על כל המילים וחיפוש רמזי הקשר
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];
    const prevWord = words[i - 1];

    // בדיקת צירופי מילים נפוצים
    if (prevWord === 'אני' && word.endsWith('ת')) {
      femaleScore += 2;
    }
    
    if (prevWord === 'אני' && !word.endsWith('ת')) {
      maleScore += 1;
    }

    // בדיקת מילות יחס
    if (FEMALE_INDICATORS.POSSESSIVES.includes(word)) {
      femaleScore += 1;
    }

    if (MALE_INDICATORS.POSSESSIVES.includes(word)) {
      maleScore += 1;
    }

    // בדיקת כינויי גוף
    if (FEMALE_INDICATORS.PRONOUNS.includes(word)) {
      femaleScore += 2;
    }

    if (MALE_INDICATORS.PRONOUNS.includes(word)) {
      maleScore += 2;
    }

    // בדיקת פעלים בזמן הווה
    if (word.match(/ת$/) && !word.match(/ות$/)) {
      femaleScore += 1;
    }
    
    if (word.match(/ים$/)) {
      maleScore += 1;
    }
  }

  // קבלת החלטה לפי הניקוד
  if (femaleScore > maleScore && femaleScore > 2) {
    return GENDER_TYPES.FEMALE;
  }
  
  if (maleScore > femaleScore && maleScore > 2) {
    return GENDER_TYPES.MALE;
  }

  return GENDER_TYPES.UNKNOWN;
}