# מערכת תרגום כתוביות

מערכת לתרגום כתוביות מאנגלית לעברית עם זיהוי מגדר.

## התקנה

1. התקן Node.js מהאתר הרשמי: https://nodejs.org/
2. הורד את הפרויקט
3. פתח טרמינל בתיקיית הפרויקט
4. הרץ `npm install`
5. הגדר מפתח Google API בקובץ `.env`

## שימוש

1. הכן את קובץ הכתוביות שלך (בפורמט SRT או ASS)
   
2. הרץ את התוכנית עם נתיב לקובץ הכתוביות:
   ```bash
   npm start ./path/to/subtitles.srt
   # או
   npm start ./path/to/subtitles.ass
   ```

3. התוצאות:
   - יוצגו בקונסול בזמן אמת
   - יישמרו אוטומטית לקובץ חדש עם הסיומת '_translated'
   - לדוגמה: `subtitles.srt` יהפוך ל-`subtitles_translated.srt`

## פורמטים נתמכים

- קבצי SRT (.srt)
- קבצי ASS (.ass)

## דוגמה להרצה

```bash
npm start ./subtitles.srt
```