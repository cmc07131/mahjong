import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { getAllThemes, Theme, ThemeName } from '../../config/theme';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onSelectTheme: (themeName: ThemeName) => void;
}

export function ThemeSelector({ 
  visible, 
  onClose, 
  currentTheme, 
  onSelectTheme 
}: ThemeSelectorProps) {
  const themes = getAllThemes();

  const handleSelectTheme = (theme: Theme) => {
    onSelectTheme(theme.name);
    onClose();
  };

  const getThemePreview = (theme: Theme) => {
    return {
      backgroundColor: theme.colors.background.primary,
      borderColor: theme.colors.panel.border,
      textColor: theme.colors.text.primary,
      accentColor: theme.colors.text.accent,
    };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-900">
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-700">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-400 text-lg">取消</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">選擇主題</Text>
            <View className="w-12" />
          </View>
        </View>

        {/* Theme List */}
        <ScrollView className="flex-1 px-4 py-4">
          {themes.map((theme) => {
            const preview = getThemePreview(theme);
            const isSelected = currentTheme === theme.name;
            
            return (
              <TouchableOpacity
                key={theme.name}
                onPress={() => handleSelectTheme(theme)}
                className={`mb-4 rounded-xl overflow-hidden ${
                  isSelected ? 'border-2 border-blue-500' : 'border border-gray-700'
                }`}
                style={{
                  shadowColor: isSelected ? '#3b82f6' : '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: isSelected ? 4 : 2,
                }}
              >
                {/* Theme Preview */}
                <View 
                  className="p-4"
                  style={{ backgroundColor: preview.backgroundColor }}
                >
                  {/* Mini Table Preview */}
                  <View 
                    className="rounded-lg p-3 mb-3"
                    style={{ 
                      backgroundColor: preview.backgroundColor,
                      borderWidth: 1,
                      borderColor: preview.borderColor,
                    }}
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text 
                        className="text-sm font-bold"
                        style={{ color: preview.accentColor }}
                      >
                        🀄 麻將計分
                      </Text>
                      <Text 
                        className="text-xs"
                        style={{ color: preview.textColor }}
                      >
                        第1局
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <View className="items-center">
                        <Text className="text-lg">🐯</Text>
                        <Text 
                          className="text-xs mt-1"
                          style={{ color: preview.textColor }}
                        >
                          玩家A
                        </Text>
                        <Text 
                          className="text-xs font-bold"
                          style={{ color: preview.accentColor }}
                        >
                          +$512
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg">🐉</Text>
                        <Text 
                          className="text-xs mt-1"
                          style={{ color: preview.textColor }}
                        >
                          玩家B
                        </Text>
                        <Text 
                          className="text-xs font-bold"
                          style={{ color: '#ef4444' }}
                        >
                          -$512
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Theme Info */}
                <View className="p-4 bg-gray-800">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold mb-1">
                        {theme.displayName}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {theme.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center">
                        <Text className="text-white font-bold">✓</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View className="px-4 py-4 border-t border-gray-700">
          <Text className="text-gray-500 text-center text-sm">
            選擇主題後立即生效，可隨時更換
          </Text>
        </View>
      </View>
    </Modal>
  );
}