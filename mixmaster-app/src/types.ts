export interface MixingRatio {
  ratio: string;
  value: number;
}

export interface DetectedReading {
  amount: number;
  unit: 'gallons' | 'liters';
  confidence: number;
}

export interface CalculationResult {
  gasAmount: number;
  gasUnit: 'gallons' | 'liters';
  oilAmount: number;
  oilUnit: 'fl oz' | 'ml';
  ratio: number;
}

export interface TextRecognitionResult {
  text: string;
  confidence: number;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
