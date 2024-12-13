export class HebrewGenderDetector {
  constructor() {
    // מילים וביטויים בזכר
    this.masculineWords = new Set([
      'הוא', 'שלו', 'אותו', 'לו', 'עצמו',
      'הלך', 'אמר', 'עשה', 'רצה', 'חשב',
      'ילד', 'איש', 'אבא', 'בן', 'אח'
    ]);

    // מילים וביטויים בנקבה
    this.feminineWords = new Set([
      'היא', 'שלה', 'אותה', 'לה', 'עצמה',
      'הלכה', 'אמרה', 'עשתה', 'רצתה', 'חשבה',
      'ילדה', 'אישה', 'אמא', 'בת', 'אחות'
    ]);

    // סיומות אופייניות לזכר
    this.masculineSuffixes = [
      'ים', // רבים
      'יו', // שלו
      'הו', // כינוי גוף
      'תי', // פעלתי
      'נו'  // פעלנו
    ];

    // סיומות אופייניות לנקבה
    this.feminineSuffixes = [
      'ות', // רבות
      'יה', // שלה
      'תה', // פעלה
      'תן', // פעלתן
      'הן'  // שלהן
    ];
  }

  detectGender(text) {
    if (!text) return { gender: 'unknown', confidence: 0 };

    const words = text.split(/\s+/);
    let masculineScore = 0;
    let feminineScore = 0;
    let totalRelevantWords = 0;

    for (const word of words) {
      const cleanWord = word.trim().replace(/[,.?!]$/, '');
      if (!cleanWord) continue;

      // בדיקת מילים מלאות
      if (this.masculineWords.has(cleanWord)) {
        masculineScore += 2;
        totalRelevantWords++;
        continue;
      }
      if (this.feminineWords.has(cleanWord)) {
        feminineScore += 2;
        totalRelevantWords++;
        continue;
      }

      // בדיקת סיומות
      let suffixFound = false;
      
      for (const suffix of this.masculineSuffixes) {
        if (cleanWord.endsWith(suffix)) {
          masculineScore += 1;
          totalRelevantWords++;
          suffixFound = true;
          break;
        }
      }
      
      if (!suffixFound) {
        for (const suffix of this.feminineSuffixes) {
          if (cleanWord.endsWith(suffix)) {
            feminineScore += 1;
            totalRelevantWords++;
            break;
          }
        }
      }
    }

    // חישוב התוצאה
    if (totalRelevantWords === 0) {
      return { gender: 'unknown', confidence: 0 };
    }

    const totalScore = masculineScore + feminineScore;
    if (totalScore === 0) {
      return { gender: 'unknown', confidence: 0 };
    }

    const confidence = Math.abs(masculineScore - feminineScore) / totalScore;
    
    return {
      gender: masculineScore > feminineScore ? 'male' : 
              feminineScore > masculineScore ? 'female' : 'unknown',
      confidence: parseFloat(confidence.toFixed(2))
    };
  }

  // פונקציה עזר לבדיקת סיומת
  hasAnySuffix(word, suffixes) {
    return suffixes.some(suffix => word.endsWith(suffix));
  }
}