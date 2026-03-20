import { ReactNode } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  textClassName = '',
}: ButtonProps) {
  const { currentTheme } = useThemeStore();
  // 基礎樣式
  const baseButtonStyle: ViewStyle = {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  // 變體樣式
  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: currentTheme.colors.button.primary,
    },
    secondary: {
      backgroundColor: currentTheme.colors.button.secondary,
    },
    outline: {
      backgroundColor: currentTheme.colors.button.outline,
      borderWidth: 2,
      borderColor: currentTheme.colors.button.primary,
    },
  };

  // 尺寸樣式
  const sizeStyles: Record<string, ViewStyle> = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      minHeight: 36,
    },
    md: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      minHeight: 48,
    },
    lg: {
      paddingVertical: 18,
      paddingHorizontal: 32,
      minHeight: 56,
    },
  };

  // 文字樣式
  const baseTextStyle: TextStyle = {
    fontWeight: '600',
  };

  const textSizeStyles: Record<string, TextStyle> = {
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
  };

  const textVariantStyles: Record<string, TextStyle> = {
    primary: { color: currentTheme.colors.text.primary },
    secondary: { color: currentTheme.colors.text.primary },
    outline: { color: currentTheme.colors.button.primary },
  };

  const disabledStyle: ViewStyle = {
    opacity: 0.5,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        baseButtonStyle,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && disabledStyle,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? currentTheme.colors.button.primary : currentTheme.colors.text.primary} />
      ) : (
        <Text
          style={[
            baseTextStyle,
            textSizeStyles[size],
            textVariantStyles[variant],
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
