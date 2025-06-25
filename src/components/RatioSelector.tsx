import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { Select, SelectOption } from './ui/select';
import { Card, CardContent } from './ui/card';
import { MixingRatio } from '../types';

interface RatioSelectorProps {
  ratios: MixingRatio[];
  selectedRatio: MixingRatio;
  onRatioChange: (ratio: MixingRatio) => void;
}

export default function RatioSelector({
  ratios,
  selectedRatio,
  onRatioChange,
}: RatioSelectorProps) {
  const selectOptions: SelectOption[] = ratios.map(ratio => ({
    label: ratio.ratio,
    value: ratio.value.toString(),
  }));

  const handleValueChange = (value: string) => {
    const ratio = ratios.find(r => r.value.toString() === value);
    if (ratio) {
      onRatioChange(ratio);
    }
  };

  return (
    <Card style={styles.container}>
      <CardContent style={styles.content}>
        <Text style={styles.label}>Mixing Ratio (Gas:Oil)</Text>
        <Select
          options={selectOptions}
          value={selectedRatio.value.toString()}
          onValueChange={handleValueChange}
          placeholder="Select ratio..."
          style={styles.select}
        />
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  content: {
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  select: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
});
