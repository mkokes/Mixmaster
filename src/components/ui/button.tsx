import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  style?: any;
}

const Button = React.forwardRef<View, ButtonProps>(
  ({ className, variant, size, children, onPress, disabled, style, ...props }, ref) => {
    const getButtonStyles = () => {
      const baseStyles = {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
      };

      const variantStyles = {
        default: {
          backgroundColor: '#22c55e', // green-500
        },
        destructive: {
          backgroundColor: '#ef4444', // red-500
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#e5e7eb', // gray-200
        },
        secondary: {
          backgroundColor: '#f3f4f6', // gray-100
        },
        ghost: {
          backgroundColor: 'transparent',
        },
        link: {
          backgroundColor: 'transparent',
        },
      };

      const sizeStyles = {
        default: {
          height: 40,
          paddingHorizontal: 16,
          paddingVertical: 8,
        },
        sm: {
          height: 36,
          paddingHorizontal: 12,
          paddingVertical: 6,
        },
        lg: {
          height: 44,
          paddingHorizontal: 32,
          paddingVertical: 12,
        },
        icon: {
          height: 40,
          width: 40,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
      };

      return {
        ...baseStyles,
        ...variantStyles[variant || 'default'],
        ...sizeStyles[size || 'default'],
        opacity: disabled ? 0.5 : 1,
        ...style,
      };
    };

    const getTextStyles = () => {
      const baseTextStyles = {
        fontSize: 14,
        fontWeight: '500' as const,
        textAlign: 'center' as const,
      };

      const variantTextStyles = {
        default: {
          color: '#ffffff',
        },
        destructive: {
          color: '#ffffff',
        },
        outline: {
          color: '#374151', // gray-700
        },
        secondary: {
          color: '#374151', // gray-700
        },
        ghost: {
          color: '#374151', // gray-700
        },
        link: {
          color: '#22c55e', // green-500
          textDecorationLine: 'underline' as const,
        },
      };

      return {
        ...baseTextStyles,
        ...variantTextStyles[variant || 'default'],
      };
    };

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          getButtonStyles(),
          pressed && { opacity: 0.8 },
        ]}
        onPress={onPress}
        disabled={disabled}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text style={getTextStyles()}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
