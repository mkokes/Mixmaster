import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { ArrowLeft, Edit3, Camera, ArrowRightLeft } from 'lucide-react-native';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { DetectedReading, MixingRatio, CalculationResult } from '../types';
import { formatGasAmount, formatOilAmount } from '../utils/calculations';

interface ResultsDisplayProps {
  detectedReading: DetectedReading | null;
  selectedRatio: MixingRatio;
  calculationResult: CalculationResult;
  onReset: () => void;
  onManualInput: () => void;
}

export default function ResultsDisplay({
  detectedReading,
  selectedRatio,
  calculationResult,
  onReset,
  onManualInput,
}: ResultsDisplayProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onReset}>
            <ArrowLeft size={24} color="white" />
          </Pressable>
          <Text style={styles.headerTitle}>Mix Calculation</Text>
          <Pressable style={styles.editButton} onPress={onManualInput}>
            <Edit3 size={24} color="white" />
          </Pressable>
        </View>

        {/* Results Card */}
        <Card style={styles.resultsCard}>
          <CardContent style={styles.cardContent}>
            {/* Gas Amount */}
            <View style={styles.resultSection}>
              <Text style={styles.sectionLabel}>Gas Amount</Text>
              <Text style={styles.primaryValue}>
                {formatGasAmount(calculationResult.gasAmount, calculationResult.gasUnit)}
              </Text>
              {detectedReading && (
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(detectedReading.confidence * 100)}%
                </Text>
              )}
            </View>

            {/* Ratio */}
            <View style={styles.ratioSection}>
              <ArrowRightLeft size={32} color="#22c55e" />
              <Text style={styles.ratioText}>{selectedRatio.ratio}</Text>
              <Text style={styles.ratioLabel}>Gas : Oil</Text>
            </View>

            {/* Oil Amount */}
            <View style={styles.resultSection}>
              <Text style={styles.sectionLabel}>Oil Required</Text>
              <Text style={styles.primaryValue}>
                {formatOilAmount(calculationResult.oilAmount, calculationResult.oilUnit)}
              </Text>
              <Text style={styles.unitLabel}>
                {calculationResult.oilUnit === 'fl oz' ? 'Fluid Ounces' : 'Milliliters'}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <CardHeader>
            <CardTitle style={styles.instructionsTitle}>Mixing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Add {formatOilAmount(calculationResult.oilAmount, calculationResult.oilUnit)} of 2-stroke oil to your mixing container
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Add {formatGasAmount(calculationResult.gasAmount, calculationResult.gasUnit)} of gasoline
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Mix thoroughly by gently swirling the container
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="outline"
            onPress={onManualInput}
            style={styles.secondaryButton}
          >
            <View style={styles.buttonContent}>
              <Edit3 size={20} color="#22c55e" />
              <Text style={styles.secondaryButtonText}>Edit Amount</Text>
            </View>
          </Button>

          <Button
            onPress={onReset}
            style={styles.primaryButton}
          >
            <View style={styles.buttonContent}>
              <Camera size={20} color="white" />
              <Text style={styles.primaryButtonText}>New Reading</Text>
            </View>
          </Button>
        </View>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  cardContent: {
    alignItems: 'center',
    padding: 30,
  },
  resultSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  primaryValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  confidenceText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 5,
  },
  unitLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  ratioSection: {
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratioText: {
    color: '#22c55e',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  ratioLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  instructionsCard: {
    marginBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
});
