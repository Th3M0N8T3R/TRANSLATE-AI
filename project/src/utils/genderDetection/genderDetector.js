import { ContextAnalyzer } from './contextAnalyzer.js';
import { PatternMatcher } from './patternMatcher.js';
import { GENDER_TYPES } from './constants.js';

export class HebrewGenderDetector {
  constructor() {
    this.contextAnalyzer = new ContextAnalyzer();
    this.patternMatcher = new PatternMatcher();
  }

  detectGender(text) {
    if (!text) return { gender: GENDER_TYPES.UNKNOWN, confidence: 0 };

    const words = text.split(/\s+/);
    let totalScore = {
      [GENDER_TYPES.MALE]: 0,
      [GENDER_TYPES.FEMALE]: 0,
      totalWords: 0,
      relevantWords: 0
    };

    // ניתוח כל מילה בהקשר
    words.forEach((word, index) => {
      if (!word.trim()) return;
      
      totalScore.totalWords++;
      
      // ניתוח תבניות במילה הנוכחית
      const patternScore = this.patternMatcher.matchWord(word);
      
      if (patternScore[GENDER_TYPES.MALE] > 0 || patternScore[GENDER_TYPES.FEMALE] > 0) {
        totalScore.relevantWords++;
        totalScore[GENDER_TYPES.MALE] += patternScore[GENDER_TYPES.MALE];
        totalScore[GENDER_TYPES.FEMALE] += patternScore[GENDER_TYPES.FEMALE];
      }

      // ניתוח הקשר
      const context = this.contextAnalyzer.analyzeContext(words, index);
      totalScore[GENDER_TYPES.MALE] += context.prevContext[GENDER_TYPES.MALE] * 0.5;
      totalScore[GENDER_TYPES.FEMALE] += context.prevContext[GENDER_TYPES.FEMALE] * 0.5;
      totalScore[GENDER_TYPES.MALE] += context.nextContext[GENDER_TYPES.MALE] * 0.3;
      totalScore[GENDER_TYPES.FEMALE] += context.nextContext[GENDER_TYPES.FEMALE] * 0.3;
    });

    // חישוב התוצאה הסופית
    if (totalScore.relevantWords === 0) {
      return { gender: GENDER_TYPES.UNKNOWN, confidence: 0 };
    }

    const maleScore = totalScore[GENDER_TYPES.MALE];
    const femaleScore = totalScore[GENDER_TYPES.FEMALE];
    const totalGenderScore = maleScore + femaleScore;

    if (totalGenderScore === 0) {
      return { gender: GENDER_TYPES.UNKNOWN, confidence: 0 };
    }

    // חישוב רמת הביטחון
    const confidence = Math.min(
      Math.abs(maleScore - femaleScore) / totalGenderScore,
      totalScore.relevantWords / totalScore.totalWords
    );

    return {
      gender: maleScore > femaleScore ? GENDER_TYPES.MALE : 
              femaleScore > maleScore ? GENDER_TYPES.FEMALE : 
              GENDER_TYPES.UNKNOWN,
      confidence: parseFloat(confidence.toFixed(2))
    };
  }
}