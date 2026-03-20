import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

interface BottomNavigationProps {
  onHistoryPress?: () => void;
  onSettingsPress?: () => void;
  onFaPress?: () => void;
}

export function BottomNavigation({ 
  onHistoryPress, 
  onSettingsPress, 
  onFaPress 
}: BottomNavigationProps) {
  const { currentTheme } = useThemeStore();
  
  return (
    <View
      className={`flex-row justify-between items-center px-4 md:px-6 py-2.5 md:py-3 ${currentTheme.classes.background} ${currentTheme.classes.panelBorder}`}
      style={{
        shadowColor: currentTheme.colors.shadow.color,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: currentTheme.colors.shadow.opacity,
        shadowRadius: currentTheme.colors.shadow.radius,
        elevation: currentTheme.colors.shadow.elevation,
      }}
    >
      {/* 發 Button - Gold square button */}
      <TouchableOpacity
        className="w-12 h-12 md:w-14 md:h-14 gold-gradient rounded-lg items-center justify-center button-press"
        onPress={onFaPress}
        style={{
          shadowColor: '#D4AF37',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text
          className="text-xl md:text-2xl text-emerald-950 font-bold"
          style={{ letterSpacing: 2 }}
        >
          發
        </Text>
      </TouchableOpacity>
      
      {/* History Button - Circular icon */}
      <TouchableOpacity
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-800 items-center justify-center border border-gold-500/30 button-press"
        onPress={onHistoryPress}
      >
        <Text className="text-white text-base md:text-lg font-bold">J</Text>
      </TouchableOpacity>
      
      {/* Settings Button - Gear icon */}
      <TouchableOpacity
        className="w-10 h-10 md:w-12 md:h-12 items-center justify-center button-press"
        onPress={onSettingsPress}
      >
        <Text className="text-white text-xl md:text-2xl">⚙️</Text>
      </TouchableOpacity>
    </View>
  );
}
