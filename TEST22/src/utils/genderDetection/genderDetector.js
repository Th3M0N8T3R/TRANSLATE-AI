import { GENDER_TYPES } from './constants.js';
import { analyzeContext } from './contextAnalyzer.js';
import { isFemalePredicate, isMalePredicate, detectPredicateGender } from './predicateAnalyzer.js';
import { removeNiqqud } from '../textUtils.js';

export async function detectGender(text, translateAPI) {
  try {
    // תרגום הטקסט לעברית
    const translatedText = await translateAPI(text, 'en', 'he');
    
    // הסרת ניקוד ותווים מיוחדים
    const normalizedText = removeNiqqud(translatedText);
    
    // פיצול למילים
    const words = normalizedText.split(/\s+/);
    
    // ניתוח הקשר מורחב
    const contextResult = analyzeContext(words);
    if (contextResult !== GENDER_TYPES.UNKNOWN) {
      return { translatedText: normalizedText, detectedGender: contextResult };
    }

    // בדיקת מילים ספציפיות
    let detectedGender = GENDER_TYPES.UNKNOWN;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const nextWord = words[i + 1];
      
      // בדיקת צירופי מילים
      if (word === 'את' && nextWord && isFemalePredicate(nextWord)) {
        detectedGender = GENDER_TYPES.FEMALE;
        break;
      }
      
      if (word === 'אתה' && nextWord && isMalePredicate(nextWord)) {
        detectedGender = GENDER_TYPES.MALE;
        break;
      }
      
      if (word === 'אני') {
        const gender = detectPredicateGender(nextWord);
        if (gender !== GENDER_TYPES.UNKNOWN) {
          detectedGender = gender;
          break;
        }
      }
    }

    return { translatedText: normalizedText, detectedGender };
  } catch (error) {
    throw new Error(`Gender detection failed: ${error.message}`);
  }
}