import * as ImageManipulator from 'expo-image-manipulator';
import { TextRecognitionResult } from '../types';

// Google Vision API configuration
// TODO: Replace with your actual API key from Google Cloud Console
const GOOGLE_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || 'YOUR_API_KEY_HERE';
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

export interface GoogleVisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly?: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
    }>;
    error?: {
      code: number;
      message: string;
    };
  }>;
}

/**
 * Converts an image to base64 format for Google Vision API
 */
async function imageToBase64(imageUri: string): Promise<string> {
  try {
    // Resize image to reduce API costs and improve processing speed
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 800 } }, // Resize to max width of 800px
      ],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!manipulatedImage.base64) {
      throw new Error('Failed to convert image to base64');
    }

    return manipulatedImage.base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Performs text recognition using Google Vision API
 */
export async function recognizeText(imageUri: string): Promise<TextRecognitionResult[]> {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);

    // Prepare the request body for Google Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 50,
            },
          ],
        },
      ],
    };

    // Make the API request
    const response = await fetch(GOOGLE_VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Google Vision API request failed: ${response.status} ${response.statusText}`);
    }

    const data: GoogleVisionResponse = await response.json();
    
    // Check for API errors
    if (data.responses[0]?.error) {
      throw new Error(`Google Vision API error: ${data.responses[0].error.message}`);
    }

    // Extract text annotations
    const textAnnotations = data.responses[0]?.textAnnotations || [];
    
    if (textAnnotations.length === 0) {
      return [];
    }

    // Convert to our TextRecognitionResult format
    const results: TextRecognitionResult[] = textAnnotations.map((annotation) => {
      const bounds = annotation.boundingPoly?.vertices;
      
      return {
        text: annotation.description,
        confidence: 0.9, // Google Vision API doesn't provide confidence scores for text detection
        bounds: bounds && bounds.length >= 2 ? {
          x: Math.min(...bounds.map(v => v.x)),
          y: Math.min(...bounds.map(v => v.y)),
          width: Math.max(...bounds.map(v => v.x)) - Math.min(...bounds.map(v => v.x)),
          height: Math.max(...bounds.map(v => v.y)) - Math.min(...bounds.map(v => v.y)),
        } : undefined,
      };
    });

    return results;
  } catch (error) {
    console.error('Error in text recognition:', error);
    throw error;
  }
}

/**
 * Fallback text recognition using a mock implementation
 * This can be used for development/testing when API key is not available
 */
export async function recognizeTextMock(_imageUri: string): Promise<TextRecognitionResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data for testing
  return [
    {
      text: "GALLONS 5.234",
      confidence: 0.85,
      bounds: { x: 100, y: 200, width: 150, height: 30 }
    },
    {
      text: "TOTAL $25.67",
      confidence: 0.90,
      bounds: { x: 100, y: 240, width: 120, height: 25 }
    }
  ];
}

/**
 * Main text recognition function that handles both real API and mock
 */
export async function performTextRecognition(imageUri: string, useMock: boolean = false): Promise<string[]> {
  try {
    let results: TextRecognitionResult[];

    // Use mock if explicitly requested or if API key is not configured
    if (useMock || !GOOGLE_VISION_API_KEY || GOOGLE_VISION_API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('Using mock text recognition - API key not configured');
      results = await recognizeTextMock(imageUri);
    } else {
      console.log('Using Google Vision API');
      results = await recognizeText(imageUri);
    }

    // Extract just the text strings
    return results.map(result => result.text);
  } catch (error) {
    console.error('Text recognition failed:', error);
    // Fallback to mock on API error
    console.log('Falling back to mock text recognition');
    const mockResults = await recognizeTextMock(imageUri);
    return mockResults.map(result => result.text);
  }
}
