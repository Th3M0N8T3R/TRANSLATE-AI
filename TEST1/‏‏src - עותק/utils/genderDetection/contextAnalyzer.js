import { GENDER_TYPES } from './constants.js';

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
    if (word === 'שלך' && nextWord && nextWord.endsWith('ת')) {
      femaleScore += 1;
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