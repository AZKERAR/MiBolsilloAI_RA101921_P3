import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { formatAmountInput } from '@/utils/formatters';

interface AmountInputProps {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  error?: string;
  currency?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  label = 'Monto',
  error,
  currency = 'USD',
}) => {
  const handleChange = (text: string) => {
    const formatted = formatAmountInput(text);
    onChangeText(formatted);
  };

  return (
    <Input
      label={label}
      value={value}
      onChangeText={handleChange}
      keyboardType="decimal-pad"
      error={error}
      left={<>$</>}
      placeholder="0.00"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
