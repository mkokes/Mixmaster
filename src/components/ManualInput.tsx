import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectOption } from './ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

interface ManualInputProps {
  onSubmit: (amount: number, unit: 'gallons' | 'liters') => void;
  onCancel: () => void;
}

export default function ManualInput({ onSubmit, onCancel }: ManualInputProps) {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<'gallons' | 'liters'>('gallons');

  const unitOptions: SelectOption[] = [
    { label: 'Gallons', value: 'gallons' },
    { label: 'Liters', value: 'liters' },
  ];

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number');
      return;
    }

    if (numericAmount > 1000) {
      Alert.alert('Amount Too Large', 'Please enter a reasonable gas amount');
      return;
    }

    onSubmit(numericAmount, unit);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Card style={styles.container}>
          <CardHeader style={styles.header}>
            <View style={styles.headerContent}>
              <Pressable onPress={onCancel} style={styles.closeButton}>
                <X size={24} color="white" />
              </Pressable>
              <CardTitle style={styles.title}>Enter Gas Amount</CardTitle>
              <View style={{ width: 24 }} />
            </View>
          </CardHeader>

          <CardContent style={styles.content}>
            {/* Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Gas Amount</Text>
              <Input
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                autoFocus={true}
                style={styles.input}
              />
            </View>

            {/* Unit Selection */}
            <View style={styles.unitSection}>
              <Text style={styles.label}>Unit</Text>
              <Select
                options={unitOptions}
                value={unit}
                onValueChange={(value) => setUnit(value as 'gallons' | 'liters')}
                style={styles.select}
              />
            </View>
          </CardContent>

          <CardFooter style={styles.footer}>
            <View style={styles.buttonContainer}>
              <Button
                variant="outline"
                onPress={onCancel}
                style={styles.cancelButton}
              >
                Cancel
              </Button>

              <Button
                onPress={handleSubmit}
                disabled={!amount}
                style={styles.submitButton}
              >
                Calculate
              </Button>
            </View>
          </CardFooter>

          {/* Help Text */}
          <Text style={styles.helpText}>
            Enter the gas amount shown on the pump display
          </Text>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1a1a1a',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  header: {
    paddingBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    paddingTop: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  unitSection: {
    marginBottom: 20,
  },
  select: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  footer: {
    paddingTop: 0,
    flexDirection: 'column',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  submitButton: {
    flex: 1,
  },
  helpText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
