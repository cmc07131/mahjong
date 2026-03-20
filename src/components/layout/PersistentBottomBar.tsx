import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ThemeSelector } from '../common/ThemeSelector';
import { useThemeStore } from '../../store/themeStore';

interface PersistentBottomBarProps {
  onThemePress?: () => void;
}

export function PersistentBottomBar({ onThemePress }: PersistentBottomBarProps) {
  const router = useRouter();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { currentThemeName, setTheme, currentTheme } = useThemeStore();

  const handleHomePress = () => {
    router.replace('/');
  };

  const handleThemePress = () => {
    if (onThemePress) {
      onThemePress();
    } else {
      setShowThemeSelector(true);
    }
  };

  const handleSelectTheme = (themeName: string) => {
    setTheme(themeName as any);
  };

  return (
    <View
      className={`flex-row justify-between items-center px-6 py-3 ${currentTheme.classes.background} ${currentTheme.classes.panelBorder}`}
      style={{
        shadowColor: currentTheme.colors.shadow.color,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: currentTheme.colors.shadow.opacity,
        shadowRadius: currentTheme.colors.shadow.radius,
        elevation: currentTheme.colors.shadow.elevation,
      }}
    >
      {/* Spacer for left side */}
      <View className="w-12" />
      
      {/* Home Button - Center */}
      <TouchableOpacity
        className={`w-12 h-12 rounded-full ${currentTheme.classes.panel} items-center justify-center ${currentTheme.classes.panelBorder} button-press`}
        onPress={handleHomePress}
      >
        <Text className={`${currentTheme.classes.textPrimary} text-lg`}>🏠</Text>
      </TouchableOpacity>
      
      {/* Theme Button - Right side */}
      <TouchableOpacity
        className={`w-12 h-12 rounded-full ${currentTheme.classes.panel} items-center justify-center ${currentTheme.classes.panelBorder}`}
        onPress={handleThemePress}
        activeOpacity={0.7}
        style={{
          borderWidth: 2,
        }}
      >
        <Text className={`${currentTheme.classes.textPrimary} text-lg`}>🖌️</Text>
      </TouchableOpacity>

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        currentTheme={currentThemeName}
        onSelectTheme={handleSelectTheme}
      />
    </View>
  );
}
