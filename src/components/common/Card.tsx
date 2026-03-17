import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Card({ children, padding = 'md', style }: CardProps) {
  const baseStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  };

  const paddingStyles: Record<string, ViewStyle> = {
    none: {},
    sm: { padding: 12 },
    md: { padding: 16 },
    lg: { padding: 24 },
  };

  return (
    <View style={[baseStyle, paddingStyles[padding], style]}>
      {children}
    </View>
  );
}
