import { GENDER_TYPES } from './constants.js';

export function isFemalePredicate(word) {
  const femaleSuffixes = ['ת', 'ות', 'ית'];
  return femaleSuffixes.some(suffix => word.endsWith(suffix));
}

export function isMalePredicate(word) {
  const maleSuffixes = ['', 'ים'];
  return maleSuffixes.some(suffix => word.endsWith(suffix));
}

export function detectPredicateGender(word) {
  if (!word) return GENDER_TYPES.UNKNOWN;
  
  if (isFemalePredicate(word)) {
    return GENDER_TYPES.FEMALE;
  }
  
  if (isMalePredicate(word)) {
    return GENDER_TYPES.MALE;
  }
  
  return GENDER_TYPES.UNKNOWN;
}