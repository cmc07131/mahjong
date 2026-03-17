import { TextInput, View, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';

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
  const containerStyle: ViewStyle = {
    marginBottom: 12,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: error ? '#ef4444' : '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={inputStyle}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
}
