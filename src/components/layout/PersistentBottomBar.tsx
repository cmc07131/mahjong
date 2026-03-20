import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface PersistentBottomBarProps {
  onThemePress?: () => void;
}

export function PersistentBottomBar({ onThemePress }: PersistentBottomBarProps) {
  const router = useRouter();

  const handleHomePress = () => {
    router.replace('/');
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
        onPress={onThemePress}
      >
        <Text className="text-white text-2xl">🎨</Text>
      </TouchableOpacity>
    </View>
  );
}