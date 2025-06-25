import * as React from 'react';
import { TextInput, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
  className?: string;
  style?: ViewStyle;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, style, ...props }, ref) => {
    const inputStyles: ViewStyle & TextStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: '#ffffff',
      minHeight: 44,
      ...style,
    };

    return (
      <TextInput
        ref={ref}
        style={inputStyles}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
