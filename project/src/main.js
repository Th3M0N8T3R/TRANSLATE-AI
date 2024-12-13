// main.js

import { detectGender } from './utils/genderDetector.js';

// דוגמה לטקסט מתורגם
const translatedLines = [
  "אני חושבת עליך.",
  "אתה יודע מה קרה?",
  "אני מתגעגעת אליך."
];

// בדיקת מגדר
translatedLines.forEach((line, index) => {
  const result = detectGender(line);
  if (result.lines.length > 0) {
    console.log(`שורה ${index + 1}:`, result.lines[0].line, "- מגדר לא ברור");
  } else {
    console.log(`שורה ${index + 1}:`, line, "- מגדר לא נמצא");
  }
});
