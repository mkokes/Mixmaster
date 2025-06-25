import * as React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const Card = React.forwardRef<View, CardProps>(
  ({ className, style, children, ...props }, ref) => {
    const cardStyles: ViewStyle = {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      ...style,
    };

    return (
      <View ref={ref} style={cardStyles} {...props}>
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const CardHeader = React.forwardRef<View, CardHeaderProps>(
  ({ className, style, children, ...props }, ref) => {
    const headerStyles: ViewStyle = {
      padding: 24,
      paddingBottom: 0,
      ...style,
    };

    return (
      <View ref={ref} style={headerStyles} {...props}>
        {children}
      </View>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

const CardTitle = React.forwardRef<Text, CardTitleProps>(
  ({ className, style, children, ...props }, ref) => {
    const titleStyles: TextStyle = {
      fontSize: 20,
      fontWeight: '600',
      color: '#ffffff',
      lineHeight: 28,
      ...style,
    };

    return (
      <Text ref={ref} style={titleStyles} {...props}>
        {children}
      </Text>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

const CardDescription = React.forwardRef<Text, CardDescriptionProps>(
  ({ className, style, children, ...props }, ref) => {
    const descriptionStyles: TextStyle = {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: 20,
      ...style,
    };

    return (
      <Text ref={ref} style={descriptionStyles} {...props}>
        {children}
      </Text>
    );
  }
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const CardContent = React.forwardRef<View, CardContentProps>(
  ({ className, style, children, ...props }, ref) => {
    const contentStyles: ViewStyle = {
      padding: 24,
      paddingTop: 0,
      ...style,
    };

    return (
      <View ref={ref} style={contentStyles} {...props}>
        {children}
      </View>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const CardFooter = React.forwardRef<View, CardFooterProps>(
  ({ className, style, children, ...props }, ref) => {
    const footerStyles: ViewStyle = {
      padding: 24,
      paddingTop: 0,
      flexDirection: 'row',
      alignItems: 'center',
      ...style,
    };

    return (
      <View ref={ref} style={footerStyles} {...props}>
        {children}
      </View>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
