import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ViewStyle, TextStyle } from 'react-native';

interface UnitSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PRESET_AMOUNTS = [128, 256, 512];

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  const [isCustom, setIsCustom] = useState(!PRESET_AMOUNTS.includes(value));
  const [customValue, setCustomValue] = useState(value.toString());

  const containerStyle: ViewStyle = {
    marginTop: 8,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  };

  const optionsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  };

  const optionStyle = (isSelected: boolean): ViewStyle => ({
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: isSelected ? '#16a34a' : '#f3f4f6',
    borderWidth: 1,
    borderColor: isSelected ? '#16a34a' : '#e5e7eb',
  });

  const optionTextStyle = (isSelected: boolean): TextStyle => ({
    fontSize: 15,
    fontWeight: '600',
    color: isSelected ? '#ffffff' : '#374151',
  });

  const customContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  };

  const customInputContainerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: isCustom ? '#16a34a' : '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  };

  const customInputTextStyle: TextStyle = {
    fontSize: 16,
    color: '#1f2937',
  };

  const handlePresetSelect = (amount: number) => {
    setIsCustom(false);
    onChange(amount);
  };

  const handleCustomChange = (text: string) => {
    setCustomValue(text);
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
  };

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>10番多少錢？</Text>
      
      <View style={optionsContainerStyle}>
        {PRESET_AMOUNTS.map((amount) => {
          const isSelected = !isCustom && value === amount;
          return (
            <TouchableOpacity
              key={amount}
              style={optionStyle(isSelected)}
              onPress={() => handlePresetSelect(amount)}
              activeOpacity={0.7}
            >
              <Text style={optionTextStyle(isSelected)}>${amount}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={customContainerStyle}>
        <Text style={{ fontSize: 14, color: '#6b7280', marginRight: 8 }}>或自訂：</Text>
        <TextInput
          style={[customInputContainerStyle, customInputTextStyle]}
          value={isCustom ? customValue : ''}
          onChangeText={handleCustomChange}
          onFocus={handleCustomFocus}
          placeholder="輸入金額"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
