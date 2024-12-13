// textProcessor.js

// הסרת ניקוד ותווים מיוחדים
export function removeDiacritics(text) {
  return text
    .normalize("NFKD")
    .replace(/[\u0591-\u05C7\u05B0-\u05BD\u05BF\u05C1-\u05C2\u05C4\u05C5]/g, "") // הסרת ניקוד
    .replace(/[\u200D\u200E\u200F]/g, "") // תווי כיוון
    .trim();
}

// תיקון כיווניות טקסט
export function fixRTL(text) {
  return text.replace(/(\S)([.,!?])(\s|$)/g, '$2$1$3');
}

// מציאת שורות עם מילים דו-משמעיות
export function findAmbiguousLines(translatedLines, ambiguousWords) {
  const ambiguousLines = [];
  translatedLines.forEach((line, index) => {
    const cleanedLine = removeDiacritics(line);
    if (ambiguousWords.some(word => cleanedLine.includes(word))) {
      ambiguousLines.push({ line: cleanedLine, index: index + 1 });
    }
  });
  return ambiguousLines;
}
