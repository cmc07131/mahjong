import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Card({ children, padding = 'md', style }: CardProps) {
  const { currentTheme } = useThemeStore();
  
  const baseStyle: ViewStyle = {
    backgroundColor: currentTheme.colors.panel.primary,
    borderRadius: 16,
    shadowColor: currentTheme.colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: currentTheme.colors.shadow.opacity,
    shadowRadius: currentTheme.colors.shadow.radius,
    elevation: currentTheme.colors.shadow.elevation,
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
