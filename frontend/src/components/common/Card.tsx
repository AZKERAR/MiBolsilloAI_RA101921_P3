import React from 'react';
import { Card as PaperCard, CardProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';

/**
 * Card Component
 * Wrapper para react-native-paper Card
 */
export default function Card({ children, style, ...props }: CardProps) {
  return (
    <PaperCard style={[styles.card, style]} {...props}>
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
});
