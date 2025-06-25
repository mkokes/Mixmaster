import { calculateOilAmount, parseGasPumpReading, formatOilAmount, formatGasAmount } from '../calculations';

describe('calculateOilAmount', () => {
  test('calculates oil amount for gallons correctly', () => {
    const result = calculateOilAmount(5, 'gallons', 50);
    expect(result.gasAmount).toBe(5);
    expect(result.gasUnit).toBe('gallons');
    expect(result.oilAmount).toBe(12.8); // 5 * 128 / 50 = 12.8 fl oz
    expect(result.oilUnit).toBe('fl oz');
    expect(result.ratio).toBe(50);
  });

  test('calculates oil amount for liters correctly', () => {
    const result = calculateOilAmount(10, 'liters', 40);
    expect(result.gasAmount).toBe(10);
    expect(result.gasUnit).toBe('liters');
    expect(result.oilAmount).toBe(250); // 10 * 1000 / 40 = 250 ml
    expect(result.oilUnit).toBe('ml');
    expect(result.ratio).toBe(40);
  });

  test('rounds oil amount to 2 decimal places', () => {
    const result = calculateOilAmount(3.33, 'gallons', 32);
    expect(result.oilAmount).toBe(13.32); // 3.33 * 128 / 32 = 13.312, rounded to 13.32
  });
});

describe('parseGasPumpReading', () => {
  test('parses gallons format correctly', () => {
    expect(parseGasPumpReading('12.5 GAL')).toEqual({ amount: 12.5, unit: 'gallons' });
    expect(parseGasPumpReading('5.75 gallons')).toEqual({ amount: 5.75, unit: 'gallons' });
    expect(parseGasPumpReading('GAL 8.25')).toEqual({ amount: 8.25, unit: 'gallons' });
  });

  test('parses liters format correctly', () => {
    expect(parseGasPumpReading('47.3 L')).toEqual({ amount: 47.3, unit: 'liters' });
    expect(parseGasPumpReading('25.5 liters')).toEqual({ amount: 25.5, unit: 'liters' });
    expect(parseGasPumpReading('L 30.0')).toEqual({ amount: 30.0, unit: 'liters' });
  });

  test('handles mixed case and extra characters', () => {
    expect(parseGasPumpReading('Total: 12.5 GAL')).toEqual({ amount: 12.5, unit: 'gallons' });
    expect(parseGasPumpReading('Amount 47.3 L')).toEqual({ amount: 47.3, unit: 'liters' });
  });

  test('returns null for invalid input', () => {
    expect(parseGasPumpReading('no numbers here')).toBeNull();
    expect(parseGasPumpReading('')).toBeNull();
    expect(parseGasPumpReading('0 GAL')).toBeNull(); // Zero amount
  });

  test('infers unit based on typical ranges when unit is ambiguous', () => {
    expect(parseGasPumpReading('15.5')).toEqual({ amount: 15.5, unit: 'gallons' }); // <= 50, assume gallons
    expect(parseGasPumpReading('75.0')).toEqual({ amount: 75.0, unit: 'liters' }); // > 50, assume liters
  });
});

describe('formatOilAmount', () => {
  test('formats small amounts with 2 decimal places', () => {
    expect(formatOilAmount(0.75, 'fl oz')).toBe('0.75 fl oz');
    expect(formatOilAmount(2.33, 'ml')).toBe('2.33 ml');
  });

  test('formats medium amounts with 2 decimal places', () => {
    expect(formatOilAmount(5.67, 'fl oz')).toBe('5.67 fl oz');
    expect(formatOilAmount(8.25, 'ml')).toBe('8.25 ml');
  });

  test('formats large amounts with 1 decimal place', () => {
    expect(formatOilAmount(15.67, 'fl oz')).toBe('15.7 fl oz');
    expect(formatOilAmount(125.33, 'ml')).toBe('125.3 ml');
  });
});

describe('formatGasAmount', () => {
  test('formats small amounts with 2 decimal places', () => {
    expect(formatGasAmount(5.75, 'gallons')).toBe('5.75 gallons');
    expect(formatGasAmount(8.33, 'liters')).toBe('8.33 liters');
  });

  test('formats large amounts with 1 decimal place', () => {
    expect(formatGasAmount(15.67, 'gallons')).toBe('15.7 gallons');
    expect(formatGasAmount(47.33, 'liters')).toBe('47.3 liters');
  });
});
