import { CalculationResult } from '../types';

/**
 * Calculate the required oil amount based on gas amount, unit, and mixing ratio
 */
export function calculateOilAmount(
  gasAmount: number,
  gasUnit: 'gallons' | 'liters',
  ratio: number
): CalculationResult {
  let oilAmount: number;
  let oilUnit: 'fl oz' | 'ml';

  if (gasUnit === 'gallons') {
    // Convert gallons to fluid ounces for oil calculation
    // 1 gallon = 128 fluid ounces
    const gasInOunces = gasAmount * 128;
    oilAmount = gasInOunces / ratio;
    oilUnit = 'fl oz';
  } else {
    // Convert liters to milliliters for oil calculation
    // 1 liter = 1000 milliliters
    const gasInMilliliters = gasAmount * 1000;
    oilAmount = gasInMilliliters / ratio;
    oilUnit = 'ml';
  }

  // Round to 2 decimal places
  oilAmount = Math.round(oilAmount * 100) / 100;

  return {
    gasAmount,
    gasUnit,
    oilAmount,
    oilUnit,
    ratio,
  };
}

/**
 * Parse text to extract numerical values and units
 */
export function parseGasPumpReading(text: string): { amount: number; unit: 'gallons' | 'liters' } | null {
  // Clean the text
  const cleanText = text.replace(/[^\w\s\.\,]/g, ' ').toLowerCase();
  
  // Patterns to match common gas pump display formats
  const patterns = [
    // Match patterns like "12.5 gal", "12.5 gallons", "12.5 GAL"
    /(\d+\.?\d*)\s*(?:gal|gallons?|g)\b/i,
    // Match patterns like "47.3 l", "47.3 liters", "47.3 L"
    /(\d+\.?\d*)\s*(?:l|liters?|ltr)\b/i,
    // Match patterns like "GAL 12.5", "GALLONS 12.5"
    /(?:gal|gallons?|g)\s*(\d+\.?\d*)/i,
    // Match patterns like "L 47.3", "LITERS 47.3"
    /(?:l|liters?|ltr)\s*(\d+\.?\d*)/i,
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      if (!isNaN(amount) && amount > 0) {
        // Determine unit based on the matched text
        const unitText = match[0].toLowerCase();
        const unit = unitText.includes('gal') ? 'gallons' : 'liters';
        return { amount, unit };
      }
    }
  }

  // Fallback: look for standalone numbers and try to infer unit from context
  const numberMatch = cleanText.match(/(\d+\.?\d*)/);
  if (numberMatch) {
    const amount = parseFloat(numberMatch[1]);
    if (!isNaN(amount) && amount > 0) {
      // Try to infer unit from surrounding text
      if (cleanText.includes('gal') || cleanText.includes('gallon')) {
        return { amount, unit: 'gallons' };
      } else if (cleanText.includes('l') || cleanText.includes('liter') || cleanText.includes('litre')) {
        return { amount, unit: 'liters' };
      }
      
      // Default assumption based on typical ranges
      // Gas pumps typically show 0-50 gallons or 0-200 liters
      if (amount <= 50) {
        return { amount, unit: 'gallons' };
      } else {
        return { amount, unit: 'liters' };
      }
    }
  }

  return null;
}

/**
 * Format oil amount for display
 */
export function formatOilAmount(amount: number, unit: 'fl oz' | 'ml'): string {
  if (amount < 1) {
    return `${(amount * (unit === 'fl oz' ? 1 : 1)).toFixed(2)} ${unit}`;
  } else if (amount < 10) {
    return `${amount.toFixed(2)} ${unit}`;
  } else {
    return `${amount.toFixed(1)} ${unit}`;
  }
}

/**
 * Format gas amount for display
 */
export function formatGasAmount(amount: number, unit: 'gallons' | 'liters'): string {
  if (amount < 10) {
    return `${amount.toFixed(2)} ${unit}`;
  } else {
    return `${amount.toFixed(1)} ${unit}`;
  }
}
