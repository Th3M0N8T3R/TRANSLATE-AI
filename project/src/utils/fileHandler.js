import fs from 'fs/promises';

export class SubtitleFileHandler {
  async readSubtitlesFromFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      // מפצל את הטקסט לשורות ומסנן שורות ריקות
      return content.split('\n').filter(line => line.trim());
    } catch (error) {
      console.error('שגיאה בקריאת הקובץ:', error.message);
      return [];
    }
  }

  async saveTranslation(outputPath, translations) {
    try {
      const output = translations.map(t => 
        `מקור: ${t.original}\nתרגום: ${t.translated}\nמגדר: ${t.gender}\n`
      ).join('\n');
      
      await fs.writeFile(outputPath, output, 'utf-8');
      console.log(`התרגום נשמר בהצלחה לקובץ: ${outputPath}`);
    } catch (error) {
      console.error('שגיאה בשמירת הקובץ:', error.message);
    }
  }
}