import { detectGender } from './utils/genderDetection/genderDetector.js';
import { translateText } from './utils/translator.js';

// דוגמה לשימוש
async function main() {
  try {
    const text = "I am thinking about it";
    const result = await detectGender(text, translateText);
    console.log('Original text:', text);
    console.log('Translated text:', result.translatedText);
    console.log('Detected gender:', result.detectedGender);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();