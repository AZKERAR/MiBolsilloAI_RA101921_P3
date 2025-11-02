import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface CustomButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({
  title,
  variant = 'contained',
  fullWidth = false,
  mode,
  style,
  ...props
}) => {
  const buttonMode = mode || (variant === 'contained' ? 'contained' : variant === 'outlined' ? 'outlined' : 'text');

  return (
    <PaperButton
      mode={buttonMode}
      style={[fullWidth && styles.fullWidth, style]}
      {...props}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});
