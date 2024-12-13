import { SubtitleTranslator } from './utils/translator.js';
import { SubtitleParser } from './utils/subtitleParsers.js';
import path from 'path';

async function main() {
  try {
    const translator = new SubtitleTranslator();
    const parser = new SubtitleParser();

    const inputFile = process.argv[2];
    if (!inputFile) {
      console.error('נא לספק נתיב לקובץ כתוביות. לדוגמה: npm start ./subtitles.srt');
      return;
    }

    if (!await fileExists(inputFile)) {
      console.error('הקובץ לא נמצא:', inputFile);
      return;
    }

    const fileExtension = path.extname(inputFile).toLowerCase();
    let subtitles = [];

    console.log('קורא את קובץ הכתוביות...');

    if (fileExtension === '.srt') {
      subtitles = await parser.parseSRT(inputFile);
    } else if (fileExtension === '.ass') {
      subtitles = await parser.parseASS(inputFile);
    } else {
      console.error('פורמט קובץ לא נתמך. אנא השתמש בקובץ .srt או .ass');
      return;
    }

    if (subtitles.length === 0) {
      console.log('לא נמצאו כתוביות לתרגום');
      return;
    }

    console.log(`נמצאו ${subtitles.length} שורות לתרגום`);
    console.log('מתחיל תרגום...');

    const translations = [];
    
    for (const subtitle of subtitles) {
      if (!subtitle.text) continue;
      
      const result = await translator.translateLine(subtitle.text);
      if (result) {
        translations.push({
          ...subtitle,
          translated: result.translated,
          gender: result.gender,
          confidence: result.confidence
        });
        
        console.log('\nתוצאת תרגום:');
        console.log(`טקסט מקורי: ${subtitle.text}`);
        console.log(`תרגום: ${result.translated}`);
        console.log(`מגדר: ${result.gender}`);
        console.log(`רמת ביטחון: ${result.confidence}`);
      }
    }

    if (translations.length === 0) {
      console.error('לא הצלחנו לתרגם אף שורה');
      return;
    }

    const outputFile = inputFile.replace(/\.[^.]+$/, '_translated$&');
    
    let saveSuccess = false;
    if (fileExtension === '.srt') {
      saveSuccess = await parser.saveSRT(translations, outputFile);
    } else if (fileExtension === '.ass') {
      saveSuccess = await parser.saveASS(translations, outputFile, inputFile);
    }

    if (saveSuccess) {
      console.log('\nהתרגום הושלם בהצלחה!');
    } else {
      console.error('\nהיתה בעיה בשמירת הקובץ המתורגם');
    }
  } catch (error) {
    console.error('שגיאה:', error.message);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// הוספת ייבוא fs/promises
import fs from 'fs/promises';

main().catch(error => {
  console.error('שגיאה:', error);
});