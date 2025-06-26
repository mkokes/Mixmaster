import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  Pressable,
  Text,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import CameraView from './components/CameraView';
import RatioSelector from './components/RatioSelector';
import ResultsDisplay from './components/ResultsDisplay';
import ManualInput from './components/ManualInput';
import { MixingRatio, DetectedReading, CalculationResult } from './types';
import { calculateOilAmount } from './utils/calculations';
import { testParsingLogic } from './utils/testVisionAPI';
import { performTextRecognition } from './services/textRecognitionService';

const MIXING_RATIOS: MixingRatio[] = [
  { ratio: '50:1', value: 50 },
  { ratio: '40:1', value: 40 },
  { ratio: '32:1', value: 32 },
  { ratio: '25:1', value: 25 },
  { ratio: '20:1', value: 20 },
  { ratio: '16:1', value: 16 },
];

export default function MixMasterApp() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<MixingRatio>(MIXING_RATIOS[0]);
  const [detectedReading, setDetectedReading] = useState<DetectedReading | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      if (Platform.OS !== 'web') {
        const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Permission Error', 'Failed to request camera permissions');
    }
  };

  const handleTextDetected = (reading: DetectedReading) => {
    setDetectedReading(reading);
    const result = calculateOilAmount(reading.amount, reading.unit, selectedRatio.value);
    setCalculationResult(result);
  };

  const handleManualInput = (amount: number, unit: 'gallons' | 'liters') => {
    const reading: DetectedReading = {
      amount,
      unit,
      confidence: 1.0,
    };
    setDetectedReading(reading);
    const result = calculateOilAmount(amount, unit, selectedRatio.value);
    setCalculationResult(result);
    setShowManualInput(false);
  };

  const handleReset = () => {
    setDetectedReading(null);
    setCalculationResult(null);
    setShowManualInput(false);
  };

  const handleTestParsing = () => {
    console.log('🧪 Running parsing logic test...');
    testParsingLogic();
    Alert.alert(
      'Parsing Test Complete',
      'Check the console/logs for detailed results. This tests the gas pump text parsing without using the Vision API.',
      [{ text: 'OK' }]
    );
  };

  const handleTestVisionAPI = async () => {
    try {
      setIsProcessing(true);
      console.log('🧪 Testing Vision API with mock data...');

      // Test with mock data first to verify the API is working
      const mockResults = await performTextRecognition('test-image-uri', true);
      console.log('✅ Mock test results:', mockResults);

      Alert.alert(
        'Vision API Test',
        `Mock test completed successfully!\n\nResults: ${mockResults.join(', ')}\n\nCheck console for detailed logs. To test with real images, take a photo using the camera.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Vision API test failed:', error);
      Alert.alert(
        'Vision API Test Failed',
        `Error: ${error.message}\n\nThis might be normal if testing without a real image. Try taking a photo with the camera for a real test.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasCameraPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasCameraPermission === false) {
    Alert.alert(
      'Camera Permission Required',
      'This app needs camera access to detect gas pump readings. Please enable camera permissions in your device settings.',
      [{ text: 'OK' }]
    );
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {!calculationResult ? (
          <>
            <CameraView
              onTextDetected={handleTextDetected}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
            <View style={styles.controlsContainer}>
              <RatioSelector
                ratios={MIXING_RATIOS}
                selectedRatio={selectedRatio}
                onRatioChange={setSelectedRatio}
              />

              {/* Temporary test buttons - remove after testing */}
              <Pressable style={styles.testButton} onPress={handleTestParsing}>
                <Text style={styles.testButtonText}>🧪 Test Parsing Logic</Text>
              </Pressable>

              <Pressable style={[styles.testButton, styles.testButtonSecondary]} onPress={handleTestVisionAPI}>
                <Text style={styles.testButtonText}>🔍 Test Vision API</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <ResultsDisplay
            detectedReading={detectedReading}
            selectedRatio={selectedRatio}
            calculationResult={calculationResult}
            onReset={handleReset}
            onManualInput={() => setShowManualInput(true)}
          />
        )}
        
        {showManualInput && (
          <ManualInput
            onSubmit={handleManualInput}
            onCancel={() => setShowManualInput(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  testButton: {
    backgroundColor: 'rgba(0, 150, 255, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testButtonSecondary: {
    backgroundColor: 'rgba(255, 150, 0, 0.8)',
    marginTop: 8,
  },
});
