import fs from 'fs/promises';
import { parseSync, stringifySync } from 'subtitle';

export class SubtitleParser {
  async parseSRT(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const nodes = parseSync(content);
      
      if (!Array.isArray(nodes)) {
        throw new Error('פרסור לא תקין של קובץ SRT');
      }

      return nodes
        .filter(node => node.type === 'cue' && node.data && node.data.text)
        .map(node => ({
          text: node.data.text.replace(/<[^>]+>/g, ''), // הסר תגיות HTML
          start: node.data.start,
          end: node.data.end
        }));
    } catch (error) {
      console.error('שגיאה בקריאת קובץ SRT:', error.message);
      return [];
    }
  }

  async parseASS(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const dialogues = lines.filter(line => line.startsWith('Dialogue:'));
      
      return dialogues.map(line => {
        const parts = line.split(',');
        if (parts.length < 10) {
          console.warn('שורת דיאלוג לא תקינה:', line);
          return null;
        }
        
        return {
          start: this.parseASSTime(parts[1]),
          end: this.parseASSTime(parts[2]),
          text: parts.slice(9).join(',').trim().replace(/{[^}]+}/g, '') // הסר תגיות ASS
        };
      }).filter(Boolean); // הסר ערכי null
    } catch (error) {
      console.error('שגיאה בקריאת קובץ ASS:', error.message);
      return [];
    }
  }

  parseASSTime(timestamp) {
    try {
      const [h, m, s] = timestamp.trim().split(':');
      const [seconds, centiseconds] = s.split('.');
      return (parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(seconds)) * 1000 + parseInt(centiseconds) * 10;
    } catch (error) {
      console.error('שגיאה בפרסור זמן ASS:', timestamp);
      return 0;
    }
  }

  async saveSRT(translations, outputPath) {
    try {
      if (!Array.isArray(translations) || translations.length === 0) {
        throw new Error('אין תרגומים לשמירה');
      }

      const nodes = translations.map((t, index) => ({
        type: 'cue',
        data: {
          start: t.start,
          end: t.end,
          text: t.translated,
          index: index + 1
        }
      }));

      const output = stringifySync(nodes, { format: 'SRT' });
      await fs.writeFile(outputPath, output, 'utf-8');
      console.log(`התרגום נשמר בהצלחה לקובץ: ${outputPath}`);
      return true;
    } catch (error) {
      console.error('שגיאה בשמירת קובץ SRT:', error.message);
      return false;
    }
  }

  async saveASS(translations, outputPath, originalPath) {
    try {
      if (!Array.isArray(translations) || translations.length === 0) {
        throw new Error('אין תרגומים לשמירה');
      }

      const content = await fs.readFile(originalPath, 'utf-8');
      const lines = content.split('\n');
      const headerEnd = lines.findIndex(line => line.includes('[Events]'));
      
      if (headerEnd === -1) {
        throw new Error('מבנה קובץ ASS לא תקין');
      }

      const header = lines.slice(0, headerEnd + 2).join('\n');
      const translatedLines = translations.map(t => {
        const startTime = this.formatASSTime(t.start);
        const endTime = this.formatASSTime(t.end);
        return `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${t.translated}`;
      });

      const output = `${header}\n${translatedLines.join('\n')}`;
      await fs.writeFile(outputPath, output, 'utf-8');
      console.log(`התרגום נשמר בהצלחה לקובץ: ${outputPath}`);
      return true;
    } catch (error) {
      console.error('שגיאה בשמירת קובץ ASS:', error.message);
      return false;
    }
  }

  formatASSTime(ms) {
    try {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const centiseconds = Math.floor((ms % 1000) / 10);
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('שגיאה בפורמט זמן ASS');
      return '0:00:00.00';
    }
  }
}