import React from 'react';
import { TextInput as PaperTextInput, TextInputProps, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  helperText,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <PaperTextInput
        mode="outlined"
        error={!!error}
        style={[styles.input, style]}
        {...props}
      />
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText)}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
  },
});
