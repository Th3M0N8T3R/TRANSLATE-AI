import { GENDER_TYPES, FEMALE_INDICATORS, MALE_INDICATORS } from './constants.js';

export function isFemalePredicate(word) {
  return FEMALE_INDICATORS.VERB_SUFFIXES.some(suffix => word.endsWith(suffix));
}

export function isMalePredicate(word) {
  return MALE_INDICATORS.VERB_SUFFIXES.some(suffix => word.endsWith(suffix));
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