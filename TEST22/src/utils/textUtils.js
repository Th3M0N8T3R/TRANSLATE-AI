/**
 * מסיר ניקוד ותווים מיוחדים מטקסט בעברית
 * @param {string} text - הטקסט להסרת ניקוד
 * @returns {string} - הטקסט ללא ניקוד
 */
export function removeNiqqud(text) {
  return text.normalize('NFD')
    .replace(/[\u0591-\u05C7]/g, '') // הסרת ניקוד
    .replace(/[^\u0590-\u05FF\s]/g, '') // השארת אותיות עבריות ורווחים בלבד
    .replace(/\s+/g, ' ') // נירמול רווחים
    .trim();
}