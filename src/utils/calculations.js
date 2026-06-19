import { EMISSION_FACTORS } from '../data/constants';

/**
 * Validates and sanitizes numeric input values.
 * Prevents NaN, negative, and unreasonably large values.
 */
export function sanitizeNumericInput(value, max = 10000) {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return 0;
  return Math.min(parsed, max);
}

/**
 * Calculates total grams of CO2e for a given category/type/quantity.
 */
export function calcEmissionGrams(cat, type, qty) {
  const factor = EMISSION_FACTORS[cat]?.[type]?.factor ?? 0;
  return sanitizeNumericInput(qty) * factor * 1000;
}

/**
 * Gets current month's footprint in kg.
 */
export function currentMonthFootprintKg(logs) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return Object.entries(logs).reduce((sum, [date, dayLog]) => {
    const logDate = new Date(date + 'T00:00:00');
    if (logDate >= monthStart && logDate <= now) {
      return sum + Object.values(dayLog).reduce((dailyTotal, entryValue) => dailyTotal + (isFinite(entryValue) ? entryValue : 0), 0) / 1000;
    }
    return sum;
  }, 0);
}
