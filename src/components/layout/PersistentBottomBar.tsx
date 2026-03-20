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
  const { currentThemeName, setTheme } = useThemeStore();

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
      className="flex-row justify-between items-center px-6 py-3 bg-emerald-950 border-t border-gold-700/30"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      {/* Spacer for left side */}
      <View className="w-12" />
      
      {/* Home Button - Center */}
      <TouchableOpacity
        className="w-12 h-12 rounded-full bg-emerald-800 items-center justify-center border border-gold-500/30 button-press"
        onPress={handleHomePress}
      >
        <Text className="text-white text-lg">🏠</Text>
      </TouchableOpacity>
      
      {/* Theme Button - Right side */}
      <TouchableOpacity
        className="w-12 h-12 items-center justify-center button-press"
        onPress={handleThemePress}
      >
        <Text className="text-white text-2xl">🎨</Text>
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
