import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import { CameraView as ExpoCameraView, CameraType, FlashMode } from 'expo-camera';
import { Flashlight, FlashlightOff, RotateCcw, Camera as CameraIcon } from 'lucide-react-native';
import { performTextRecognition } from '../services/textRecognitionService';
import { DetectedReading } from '../types';
import { parseGasPumpReading } from '../utils/calculations';

const { width: screenWidth } = Dimensions.get('window');

interface CameraViewProps {
  onTextDetected: (reading: DetectedReading) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function CameraView({
  onTextDetected,
  isProcessing,
  setIsProcessing,
}: CameraViewProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef = useRef<ExpoCameraView>(null);

  const captureAndAnalyze = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      
      // Take a picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      // Perform text recognition using our new service
      const textResults = await performTextRecognition(photo.uri, false); // Using real Google Vision API

      if (textResults && textResults.length > 0) {
        // Combine all detected text
        const allText = textResults.join(' ');
        console.log('Detected text:', allText);
        
        // Parse the text to extract gas amount and unit
        const parsedReading = parseGasPumpReading(allText);
        
        if (parsedReading) {
          const detectedReading: DetectedReading = {
            amount: parsedReading.amount,
            unit: parsedReading.unit,
            confidence: 0.8, // Default confidence
          };
          
          onTextDetected(detectedReading);
        } else {
          Alert.alert(
            'No Reading Detected',
            'Could not detect a gas amount from the image. Please try again or use manual input.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'No Text Detected',
          'No text was found in the image. Please ensure the gas pump display is clearly visible and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Error',
        'Failed to analyze the image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCameraType = () => {
    setFacing(current =>
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlash = () => {
    setFlash(current => current === 'off' ? 'on' : 'off');
  };

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Detection Area Overlay */}
        <View style={styles.overlay}>
          <View style={styles.detectionArea}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          
          <Text style={styles.instructionText}>
            Point camera at gas pump display
          </Text>
        </View>

        {/* Camera Controls */}
        <View style={styles.controlsContainer}>
          <Pressable
            style={styles.controlButton}
            onPress={toggleFlash}
          >
            {flash === 'off' ? (
              <FlashlightOff size={24} color="white" />
            ) : (
              <Flashlight size={24} color="white" />
            )}
          </Pressable>

          <Pressable
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
            onPress={captureAndAnalyze}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.captureButtonText}>Processing...</Text>
            ) : (
              <CameraIcon size={32} color="white" />
            )}
          </Pressable>

          <Pressable
            style={styles.controlButton}
            onPress={toggleCameraType}
          >
            <RotateCcw size={24} color="white" />
          </Pressable>
        </View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectionArea: {
    width: screenWidth * 0.8,
    height: 120,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00ff00',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#00ff00',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00ff00',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#00ff00',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
