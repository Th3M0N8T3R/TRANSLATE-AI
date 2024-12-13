# Hebrew Gender Detection System

מערכת לזיהוי מגדר בטקסט עברי

## התקנה

```bash
npm install
```

## הפעלה

```bash
npm start
```

## תיאור

המערכת מזהה את המגדר בטקסט עברי על ידי:
- ניתוח הקשרי של המשפט
- זיהוי סיומות מגדריות
- זיהוי מילות יחס וכינויי גוף

## דוגמאות

```javascript
const text = "I am thinking about it";
const result = await detectGender(text, translateText);
// Expected output: { translatedText: "אני חושבת על זה", detectedGender: "female" }
```

## מבנה הפרויקט

```
project/
├── src/
│   ├── index.js
│   └── utils/
│       ├── translator.js
│       ├── textUtils.js
│       └── genderDetection/
│           ├── genderDetector.js
│           ├── contextAnalyzer.js
│           ├── predicateAnalyzer.js
│           └── constants.js
├── .env
├── package.json
└── README.md
```