import { performTextRecognition } from '../services/textRecognitionService';
import { parseGasPumpReading } from './calculations';

/**
 * Test the Google Vision API with sample images
 * This function can be called from the app to test OCR functionality
 */
export async function testVisionAPI() {
  console.log('🧪 Testing Google Vision API...');
  
  // Test with a sample image URL (you can replace with actual test images)
  const testImageUri = 'https://example.com/test-image.jpg';
  
  try {
    console.log('📸 Testing text recognition...');
    const textResults = await performTextRecognition(testImageUri, false);
    
    console.log('✅ Text Recognition Results:', textResults);
    
    // Test parsing the results
    const combinedText = textResults.join(' ');
    console.log('📝 Combined Text:', combinedText);
    
    const parsedReading = parseGasPumpReading(combinedText);
    console.log('⛽ Parsed Gas Reading:', parsedReading);
    
    return {
      success: true,
      textResults,
      combinedText,
      parsedReading
    };
  } catch (error) {
    console.error('❌ Vision API Test Failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test with mock data to verify parsing logic
 */
export function testParsingLogic() {
  console.log('🧪 Testing parsing logic with mock data...');
  console.log('=====================================');

  const testTexts = [
    'GALLONS 5.234',
    'TOTAL $25.67 GALLONS 3.456',
    '3.456 GAL',
    'LITERS 12.5',
    'FUEL 2.789 GALLONS',
    'DIESEL 15.67 L',
    'REGULAR 4.123 GAL',
    'PREMIUM 8.901 GALLONS',
    'UNLEADED 6.789 GALLONS',
    '7.123 LITERS TOTAL',
    'PUMP 1 GALLONS 4.567',
    'GRADE: REGULAR 2.345 GAL',
    'AMOUNT: 9.876 GALLONS',
    'FUEL DISPENSED 1.234 L'
  ];

  const results = [];

  testTexts.forEach((text, index) => {
    console.log(`\n📝 Test ${index + 1}: "${text}"`);
    const result = parseGasPumpReading(text);
    console.log('⛽ Parsed Result:', result);

    if (result) {
      results.push({
        input: text,
        output: result,
        success: true
      });
      console.log(`✅ SUCCESS: Found ${result.amount} ${result.unit}`);
    } else {
      results.push({
        input: text,
        output: null,
        success: false
      });
      console.log('❌ FAILED: No gas amount detected');
    }
  });

  console.log('\n📊 SUMMARY:');
  console.log('=====================================');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  console.log(`✅ Successful: ${successful}/${total} (${Math.round(successful/total*100)}%)`);
  console.log(`❌ Failed: ${total - successful}/${total}`);

  return results;
}

/**
 * Create a test button component that can be added to your app temporarily
 */
export const createTestButton = () => {
  return `
    // Add this to your main app component for testing:
    
    import { testVisionAPI, testParsingLogic } from './utils/testVisionAPI';
    
    // In your component:
    const handleTestVision = async () => {
      const result = await testVisionAPI();
      Alert.alert('Test Results', JSON.stringify(result, null, 2));
    };
    
    const handleTestParsing = () => {
      testParsingLogic();
      Alert.alert('Parsing Test', 'Check console for results');
    };
    
    // Add these buttons to your JSX:
    <Button title="Test Vision API" onPress={handleTestVision} />
    <Button title="Test Parsing Logic" onPress={handleTestParsing} />
  `;
};
