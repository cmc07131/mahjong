import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { PersistentBottomBar } from '../src/components/layout/PersistentBottomBar';
import '../global.css';

export default function RootLayout() {
  return (
    <View className="flex-1">
      <StatusBar style="auto" />
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="setup" />
          <Stack.Screen name="game" />
          <Stack.Screen name="settlement" />
          <Stack.Screen name="history/[id]" />
        </Stack>
      </View>
      <PersistentBottomBar />
    </View>
  );
}
