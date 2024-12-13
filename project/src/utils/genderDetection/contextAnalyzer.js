import { GENDER_TYPES } from './constants.js';

export class ContextAnalyzer {
  analyzeContext(words, currentIndex) {
    const prevWords = words.slice(Math.max(0, currentIndex - 3), currentIndex);
    const nextWords = words.slice(currentIndex + 1, currentIndex + 4);
    
    return {
      prevContext: this.analyzeWordGroup(prevWords),
      nextContext: this.analyzeWordGroup(nextWords)
    };
  }

  analyzeWordGroup(words) {
    const contextScore = {
      [GENDER_TYPES.MALE]: 0,
      [GENDER_TYPES.FEMALE]: 0
    };

    // ניתוח הקשר על פי מילות יחס ופעלים סמוכים
    words.forEach((word, index) => {
      if (word.match(/הוא|אותו|שלו/)) contextScore[GENDER_TYPES.MALE]++;
      if (word.match(/היא|אותה|שלה/)) contextScore[GENDER_TYPES.FEMALE]++;
      
      // בדיקת התאמה בין מילים סמוכות
      if (index > 0) {
        const prevWord = words[index - 1];
        if (this.checkAgreement(prevWord, word)) {
          if (word.endsWith('ה')) contextScore[GENDER_TYPES.FEMALE]++;
          else contextScore[GENDER_TYPES.MALE]++;
        }
      }
    });

    return contextScore;
  }

  checkAgreement(word1, word2) {
    // בדיקת התאמה דקדוקית בין שתי מילים
    const bothEndWithHe = word1.endsWith('ה') && word2.endsWith('ה');
    const bothEndWithIm = word1.endsWith('ים') && word2.endsWith('ים');
    const bothEndWithOt = word1.endsWith('ות') && word2.endsWith('ות');
    
    return bothEndWithHe || bothEndWithIm || bothEndWithOt;
  }
}