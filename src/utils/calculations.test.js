import { sanitizeNumericInput, calcEmissionGrams, currentMonthFootprintKg } from './calculations';

describe('sanitizeNumericInput', () => {
  test('returns 0 for NaN input', () => {
    expect(sanitizeNumericInput('abc')).toBe(0);
  });
  test('returns 0 for negative input', () => {
    expect(sanitizeNumericInput(-5)).toBe(0);
  });
  test('returns 0 for empty string', () => {
    expect(sanitizeNumericInput('')).toBe(0);
  });
  test('returns parsed value for valid numeric string', () => {
    expect(sanitizeNumericInput('42')).toBe(42);
  });
  test('clamps value at max', () => {
    expect(sanitizeNumericInput(99999, 100)).toBe(100);
  });
  test('allows zero', () => {
    expect(sanitizeNumericInput(0)).toBe(0);
  });
  test('handles decimal values', () => {
    expect(sanitizeNumericInput('3.5')).toBeCloseTo(3.5);
  });
});

describe('calcEmissionGrams', () => {
  test('returns 0 for unknown category', () => {
    expect(calcEmissionGrams('unknown', 'thing', 10)).toBe(0);
  });
  test('returns 0 for unknown type', () => {
    expect(calcEmissionGrams('transport', 'spaceship', 10)).toBe(0);
  });
  test('calculates car emissions correctly', () => {
    // car_petrol: 0.192 kg CO2e/km -> 10km = 1.92 kg = 1920g
    expect(calcEmissionGrams('transport', 'car_petrol', 10)).toBeCloseTo(1920);
  });
  test('returns 0 for bike (zero-emission)', () => {
    expect(calcEmissionGrams('transport', 'bike', 100)).toBe(0);
  });
  test('returns 0 for negative quantity', () => {
    expect(calcEmissionGrams('transport', 'car_petrol', -5)).toBe(0);
  });
});

describe('currentMonthFootprintKg', () => {
  test('returns 0 for empty logs', () => {
    expect(currentMonthFootprintKg({})).toBe(0);
  });

  test('sums only current month entries', () => {
    const today = new Date().toISOString().split('T')[0];
    const logs = { [today]: { transport_car_petrol: 1000 } };
    expect(currentMonthFootprintKg(logs)).toBeCloseTo(1);
  });

  test('ignores past months', () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const key = lastMonth.toISOString().split('T')[0];
    const logs = { [key]: { transport_car_petrol: 5000 } };
    expect(currentMonthFootprintKg(logs)).toBe(0);
  });

  test('handles multiple entries in a day', () => {
    const today = new Date().toISOString().split('T')[0];
    const logs = {
      [today]: {
        transport_car_petrol: 1000,
        home_electricity: 2000,
        food_beef: 500,
      }
    };
    expect(currentMonthFootprintKg(logs)).toBeCloseTo(3.5);
  });

  test('ignores non-finite values gracefully', () => {
    const today = new Date().toISOString().split('T')[0];
    const logs = { [today]: { bad_entry: NaN, good_entry: 1000 } };
    expect(currentMonthFootprintKg(logs)).toBeCloseTo(1);
  });
});
