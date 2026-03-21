import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { useTableStore, TableShape } from '../../store/tableStore';
import { useThemeStore } from '../../store/themeStore';
import { TABLE_SHAPES, PRESET_TABLE_COLORS, isValidHexColor } from '../../config/table';

interface TableStyleSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function TableStyleSelector({ visible, onClose }: TableStyleSelectorProps) {
  const { currentTheme } = useThemeStore();
  const { 
    shape, 
    customColors, 
    setShape, 
    setCustomColors, 
    resetToThemeDefaults 
  } = useTableStore();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempSurface, setTempSurface] = useState(customColors?.surface || currentTheme.colors.mahjongTable.surface);
  const [tempFrame, setTempFrame] = useState(customColors?.frame || currentTheme.colors.mahjongTable.frame);
  const [surfaceError, setSurfaceError] = useState('');
  const [frameError, setFrameError] = useState('');

  const handleShapeSelect = (newShape: TableShape) => {
    setShape(newShape);
  };

  const handlePresetColor = (surface: string, frame: string) => {
    setCustomColors({ surface, frame });
    setTempSurface(surface);
    setTempFrame(frame);
    setSurfaceError('');
    setFrameError('');
  };

  const handleApplyCustomColors = () => {
    let hasError = false;
    
    if (!isValidHexColor(tempSurface)) {
      setSurfaceError('請輸入有效的色碼 (例如 #1B5E20)');
      hasError = true;
    } else {
      setSurfaceError('');
    }
    
    if (!isValidHexColor(tempFrame)) {
      setFrameError('請輸入有效的色碼 (例如 #5D4037)');
      hasError = true;
    } else {
      setFrameError('');
    }
    
    if (hasError) return;
    
    setCustomColors({ surface: tempSurface, frame: tempFrame });
    setShowColorPicker(false);
  };

  const handleResetToTheme = () => {
    resetToThemeDefaults();
    setShowColorPicker(false);
    setSurfaceError('');
    setFrameError('');
  };

  const isUsingThemeDefault = !customColors;

  // Get preview colors
  const previewSurface = customColors?.surface || currentTheme.colors.mahjongTable.surface;
  const previewFrame = customColors?.frame || currentTheme.colors.mahjongTable.frame;
  const previewAccent = currentTheme.colors.mahjongTable.accent;
  const previewBorder = currentTheme.colors.mahjongTable.border;

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
          {/* Table Preview */}
          <View className="mb-6 items-center">
            <Text className={`${currentTheme.classes.textAccent} text-lg font-bold mb-3`}>
              預覽
            </Text>
            <View
              style={{
                width: 120,
                height: 120,
                position: 'relative',
              }}
            >
              {/* Outer frame */}
              <View
                style={{
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  backgroundColor: previewFrame,
                  borderRadius: shape === 'round' ? 60 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              />
              {/* Accent ring */}
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  width: 108,
                  height: 108,
                  backgroundColor: previewAccent,
                  borderRadius: shape === 'round' ? 54 : 0,
                }}
              />
              {/* Surface */}
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  width: 96,
                  height: 96,
                  backgroundColor: previewSurface,
                  borderRadius: shape === 'round' ? 48 : 0,
                }}
              >
                {/* Inner border */}
                <View
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    right: 6,
                    bottom: 6,
                    borderWidth: 1,
                    borderColor: previewBorder,
                    borderRadius: shape === 'round' ? 42 : 0,
                  }}
                />
              </View>
            </View>
          </View>

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
                isUsingThemeDefault 
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
                    isUsingThemeDefault ? 'text-emerald-950' : currentTheme.classes.textPrimary
                  }`}>
                    主題預設
                  </Text>
                  <Text className={`text-xs ${
                    isUsingThemeDefault ? 'text-emerald-800' : currentTheme.classes.textSecondary
                  }`}>
                    跟隨主題配色
                  </Text>
                </View>
                {isUsingThemeDefault && (
                  <View className="w-6 h-6 rounded-full bg-emerald-950 items-center justify-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Preset Colors */}
            <Text className={`${currentTheme.classes.textSecondary} text-sm mb-2`}>預設配色</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {PRESET_TABLE_COLORS.map((preset) => {
                const isSelected = !isUsingThemeDefault && 
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
                      style={{ backgroundColor: isValidHexColor(tempSurface) ? tempSurface : '#000000' }}
                    />
                    <TextInput
                      value={tempSurface}
                      onChangeText={(text) => {
                        setTempSurface(text);
                        if (surfaceError && isValidHexColor(text)) {
                          setSurfaceError('');
                        }
                      }}
                      placeholder="#1B5E20"
                      placeholderTextColor={currentTheme.colors.text.muted}
                      className={`flex-1 ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-lg px-3 py-2`}
                      style={{ color: currentTheme.colors.text.primary }}
                      autoCapitalize="none"
                    />
                  </View>
                  {surfaceError ? (
                    <Text className="text-red-400 text-xs mt-1">{surfaceError}</Text>
                  ) : null}
                </View>

                {/* Frame Color */}
                <View className="mb-4">
                  <Text className={`${currentTheme.classes.textSecondary} text-sm mb-2`}>木框顏色</Text>
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-lg mr-3 border border-gray-500"
                      style={{ backgroundColor: isValidHexColor(tempFrame) ? tempFrame : '#000000' }}
                    />
                    <TextInput
                      value={tempFrame}
                      onChangeText={(text) => {
                        setTempFrame(text);
                        if (frameError && isValidHexColor(text)) {
                          setFrameError('');
                        }
                      }}
                      placeholder="#5D4037"
                      placeholderTextColor={currentTheme.colors.text.muted}
                      className={`flex-1 ${currentTheme.classes.panel} ${currentTheme.classes.panelBorder} rounded-lg px-3 py-2`}
                      style={{ color: currentTheme.colors.text.primary }}
                      autoCapitalize="none"
                    />
                  </View>
                  {frameError ? (
                    <Text className="text-red-400 text-xs mt-1">{frameError}</Text>
                  ) : null}
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