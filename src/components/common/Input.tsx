import { TextInput, View, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  ...props
}: InputProps) {
  const { currentTheme } = useThemeStore();
  
  const containerStyle: ViewStyle = {
    marginBottom: 12,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: currentTheme.colors.text.primary,
    marginBottom: 6,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: currentTheme.colors.panel.secondary,
    borderWidth: 1,
    borderColor: error ? currentTheme.colors.score.negative : currentTheme.colors.panel.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: currentTheme.colors.text.primary,
    paddingVertical: 12,
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: currentTheme.colors.score.negative,
    marginTop: 4,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={inputStyle}
          placeholderTextColor={currentTheme.colors.text.muted}
          {...props}
        />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
}
