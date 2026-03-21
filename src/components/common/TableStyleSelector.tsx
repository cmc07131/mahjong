import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { useTableStore, TableShape } from '../../store/tableStore';
import { useThemeStore } from '../../store/themeStore';

interface TableStyleSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const TABLE_SHAPES: { shape: TableShape; name: string; description: string; icon: string }[] = [
  {
    shape: 'round',
    name: '經典圓桌',
    description: '傳統圓形麻將桌',
    icon: '⭕',
  },
  {
    shape: 'square',
    name: '方形實桌',
    description: '模擬真實方形麻將桌',
    icon: '⬜',
  },
];

const PRESET_COLORS = [
  { name: '經典綠', surface: '#1B5E20', frame: '#5D4037' },
  { name: '深藍', surface: '#0d47a1', frame: '#37474f' },
  { name: '墨綠', surface: '#004d40', frame: '#1a237e' },
  { name: '酒紅', surface: '#4a148c', frame: '#311b92' },
  { name: '深灰', surface: '#263238', frame: '#1a1a1a' },
];

export function TableStyleSelector({ visible, onClose }: TableStyleSelectorProps) {
  const { currentTheme } = useThemeStore();
  const { 
    shape, 
    customColors, 
    useCustomColors,
    setShape, 
    setCustomColors, 
    setUseCustomColors,
    resetToThemeDefaults 
  } = useTableStore();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempSurface, setTempSurface] = useState(customColors?.surface || currentTheme.colors.mahjongTable.surface);
  const [tempFrame, setTempFrame] = useState(customColors?.frame || currentTheme.colors.mahjongTable.frame);

  const handleShapeSelect = (newShape: TableShape) => {
    setShape(newShape);
  };

  const handlePresetColor = (surface: string, frame: string) => {
    setCustomColors({ surface, frame });
    setUseCustomColors(true);
    setTempSurface(surface);
    setTempFrame(frame);
  };

  const handleApplyCustomColors = () => {
    setCustomColors({ surface: tempSurface, frame: tempFrame });
    setUseCustomColors(true);
    setShowColorPicker(false);
  };

  const handleResetToTheme = () => {
    resetToThemeDefaults();
    setShowColorPicker(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className={`flex-1 ${currentTheme.classes.background}`}>
        {/* Header */}
        <View className={`px-4 py-4 ${currentTheme.classes.panelBorder}`}>
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose}>
              <Text className={`${currentTheme.classes.textSecondary} text-lg`}>取消</Text>
            </TouchableOpacity>
            <Text className={`${currentTheme.classes.textPrimary} text-xl font-bold`}>桌面設定</Text>
            <View className="w-12" />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Table Shape Section */}
          <View className="mb-6">
            <Text className={`${currentTheme.classes.textAccent} text-lg font-bold mb-3`}>
              桌面形狀
            </Text>
            <View className="flex-row gap-3">
              {TABLE_SHAPES.map((item) => {
                const isSelected = shape === item.shape;
                return (
                  <TouchableOpacity
                    key={item.shape}
                    onPress={() => handleShapeSelect(item.shape)}
                    className={`flex-1 p-4 rounded-xl ${
                      isSelected 
                        ? `${currentTheme.classes.buttonPrimary}` 
                        : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                    }`}
                    style={{
                      shadowColor: isSelected ? currentTheme.colors.shadow.color : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.3 : 0,
                      shadowRadius: 4,
                      elevation: isSelected ? 4 : 0,
                    }}
                  >
                    <Text className="text-3xl text-center mb-2">{item.icon}</Text>
                    <Text className={`text-center font-bold ${
                      isSelected ? 'text-emerald-950' : currentTheme.classes.textPrimary
                    }`}>
                      {item.name}
                    </Text>
                    <Text className={`text-center text-xs mt-1 ${
                      isSelected ? 'text-emerald-800' : currentTheme.classes.textSecondary
                    }`}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Color Section */}
          <View className="mb-6">
            <Text className={`${currentTheme.classes.textAccent} text-lg font-bold mb-3`}>
              桌面顏色
            </Text>
            
            {/* Theme Default */}
            <TouchableOpacity
              onPress={handleResetToTheme}
              className={`p-4 rounded-xl mb-3 ${
                !useCustomColors 
                  ? `${currentTheme.classes.buttonPrimary}` 
                  : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
              }`}
            >
              <View className="flex-row items-center">
                <View 
                  className="w-10 h-10 rounded-lg mr-3 border-2"
                  style={{ 
                    backgroundColor: currentTheme.colors.mahjongTable.surface,
                    borderColor: currentTheme.colors.mahjongTable.frame,
                  }}
                />
                <View className="flex-1">
                  <Text className={`font-bold ${
                    !useCustomColors ? 'text-emerald-950' : currentTheme.classes.textPrimary
                  }`}>
                    主題預設
                  </Text>
                  <Text className={`text-xs ${
                    !useCustomColors ? 'text-emerald-800' : currentTheme.classes.textSecondary
                  }`}>
                    跟隨主題配色
                  </Text>
                </View>
                {!useCustomColors && (
                  <View className="w-6 h-6 rounded-full bg-emerald-950 items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Preset Colors */}
            <Text className={`${currentTheme.classes.textSecondary} text-sm mb-2`}>預設配色</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {PRESET_COLORS.map((preset) => {
                const isSelected = useCustomColors && 
                  customColors?.surface === preset.surface && 
                  customColors?.frame === preset.frame;
                
                return (
                  <TouchableOpacity
                    key={preset.name}
                    onPress={() => handlePresetColor(preset.surface, preset.frame)}
                    className={`p-3 rounded-xl ${
                      isSelected 
                        ? 'border-2 border-yellow-400' 
                        : `${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`
                    }`}
                  >
                    <View 
                      className="w-12 h-12 rounded-lg mb-2 border-2"
                      style={{ 
                        backgroundColor: preset.surface,
                        borderColor: preset.frame,
                      }}
                    />
                    <Text className={`text-xs text-center ${
                      isSelected ? currentTheme.classes.textAccent : currentTheme.classes.textSecondary
                    }`}>
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Color Picker */}
            <TouchableOpacity
              onPress={() => setShowColorPicker(!showColorPicker)}
              className={`p-4 rounded-xl ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`}
            >
              <Text className={`${currentTheme.classes.textPrimary} font-bold`}>
                🎨 自訂顏色
              </Text>
              <Text className={`${currentTheme.classes.textSecondary} text-xs mt-1`}>
                輸入自訂色碼
              </Text>
            </TouchableOpacity>

            {showColorPicker && (
              <View className={`mt-3 p-4 rounded-xl ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder}`}>
                {/* Surface Color */}
                <View className="mb-4">
                  <Text className={`${currentTheme.classes.textSecondary} text-sm mb-2`}>桌面顏色</Text>
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-lg mr-3 border border-gray-500"
                      style={{ backgroundColor: tempSurface }}
                    />
                    <TextInput
                      value={tempSurface}
                      onChangeText={setTempSurface}
                      placeholder="#1B5E20"
                      placeholderTextColor={currentTheme.colors.text.muted}
                      className={`flex-1 ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-lg px-3 py-2`}
                      style={{ color: currentTheme.colors.text.primary }}
                    />
                  </View>
                </View>

                {/* Frame Color */}
                <View className="mb-4">
                  <Text className={`${currentTheme.classes.textSecondary} text-sm mb-2`}>木框顏色</Text>
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-lg mr-3 border border-gray-500"
                      style={{ backgroundColor: tempFrame }}
                    />
                    <TextInput
                      value={tempFrame}
                      onChangeText={setTempFrame}
                      placeholder="#5D4037"
                      placeholderTextColor={currentTheme.colors.text.muted}
                      className={`flex-1 ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-lg px-3 py-2`}
                      style={{ color: currentTheme.colors.text.primary }}
                    />
                  </View>
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  onPress={handleApplyCustomColors}
                  className={`${currentTheme.classes.buttonPrimary} rounded-xl py-3 items-center`}
                >
                  <Text className="text-emerald-950 font-bold">套用自訂顏色</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}