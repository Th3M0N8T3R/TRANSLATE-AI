import fetch from 'node-fetch';
import { HebrewGenderDetector } from './genderDetector.js';
import { config } from '../config/config.js';

export class SubtitleTranslator {
  constructor() {
    this.apiKey = config.googleApiKey;
    this.genderDetector = new HebrewGenderDetector();
  }

  async translateLine(text) {
    if (!text || typeof text !== 'string') {
      console.error('טקסט לא תקין לתרגום');
      return null;
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'he',
          })
        }
      );

      if (!response.ok) {
        throw new Error(`שגיאת HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // בדיקת תקינות התגובה
      if (!data?.data?.translations?.[0]?.translatedText) {
        throw new Error('תגובה לא תקינה מה-API');
      }

      const translatedText = data.data.translations[0].translatedText;
      const genderInfo = this.genderDetector.detectGender(translatedText);

      return {
        original: text,
        translated: translatedText,
        gender: genderInfo.gender,
        confidence: genderInfo.confidence
      };
    } catch (error) {
      console.error('שגיאת תרגום:', error.message);
      return null;
    }
  }

  async translateBatch(texts) {
    const results = [];
    for (const text of texts) {
      try {
        const result = await this.translateLine(text);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`שגיאה בתרגום השורה: "${text}"`, error.message);
      }
    }
    return results;
  }
}