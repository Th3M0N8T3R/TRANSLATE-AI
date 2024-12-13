import {
  MASCULINE_PATTERNS,
  FEMININE_PATTERNS,
  MASCULINE_WORDS,
  FEMININE_WORDS,
  GENDER_TYPES
} from './constants.js';

export class PatternMatcher {
  matchWord(word) {
    const cleanWord = word.trim().toLowerCase();
    let score = {
      [GENDER_TYPES.MALE]: 0,
      [GENDER_TYPES.FEMALE]: 0,
      confidence: 0
    };

    // בדיקת מילים מדויקות
    if (MASCULINE_WORDS.has(cleanWord)) {
      score[GENDER_TYPES.MALE] += 2;
      score.confidence = 1;
      return score;
    }
    
    if (FEMININE_WORDS.has(cleanWord)) {
      score[GENDER_TYPES.FEMALE] += 2;
      score.confidence = 1;
      return score;
    }

    // בדיקת תבניות דקדוקיות
    let patternFound = false;

    for (const pattern of MASCULINE_PATTERNS) {
      if (pattern.test(cleanWord)) {
        score[GENDER_TYPES.MALE] += 1;
        patternFound = true;
      }
    }

    for (const pattern of FEMININE_PATTERNS) {
      if (pattern.test(cleanWord)) {
        score[GENDER_TYPES.FEMALE] += 1;
        patternFound = true;
      }
    }

    if (patternFound) {
      score.confidence = 0.7;
    }

    return score;
  }

  // בדיקת התאמה בין שם ותואר
  checkAgreement(noun, adjective) {
    const nounScore = this.matchWord(noun);
    const adjScore = this.matchWord(adjective);
    
    if (nounScore[GENDER_TYPES.MALE] > 0 && adjScore[GENDER_TYPES.MALE] > 0) {
      return { agreed: true, gender: GENDER_TYPES.MALE };
    }
    
    if (nounScore[GENDER_TYPES.FEMALE] > 0 && adjScore[GENDER_TYPES.FEMALE] > 0) {
      return { agreed: true, gender: GENDER_TYPES.FEMALE };
    }
    
    return { agreed: false, gender: GENDER_TYPES.UNKNOWN };
  }
}