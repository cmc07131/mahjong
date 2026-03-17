import { ReactNode } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

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
      backgroundColor: '#16a34a',
    },
    secondary: {
      backgroundColor: '#22c55e',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#16a34a',
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
    primary: { color: '#ffffff' },
    secondary: { color: '#ffffff' },
    outline: { color: '#16a34a' },
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
        <ActivityIndicator color={variant === 'outline' ? '#16a34a' : '#ffffff'} />
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
