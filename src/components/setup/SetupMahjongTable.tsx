import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Wind } from '../../types';
import { useThemeStore } from '../../store/themeStore';
import { useTableStore } from '../../store/tableStore';

interface SetupMahjongTableProps {
  seatAssignments: (number | null)[];
  playerNames: string[];
  draggingIndex: number | null;
  onSeatClick: (seatIndex: number) => void;
  onRemoveSeat: (seatIndex: number) => void;
}

const WIND_LABELS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
};

const WIND_ORDER: Wind[] = ['EAST', 'SOUTH', 'WEST', 'NORTH'];

export function SetupMahjongTable({
  seatAssignments,
  playerNames,
  draggingIndex,
  onSeatClick,
  onRemoveSeat,
}: SetupMahjongTableProps) {
  const { currentTheme } = useThemeStore();
  const { shape, customColors } = useTableStore();
  
  const tableColors = customColors
    ? {
        surface: customColors.surface || currentTheme.colors.mahjongTable.surface,
        frame: customColors.frame || currentTheme.colors.mahjongTable.frame,
        accent: currentTheme.colors.mahjongTable.accent,
        border: currentTheme.colors.mahjongTable.border,
      }
    : currentTheme.colors.mahjongTable;
  
  const screenWidth = Dimensions.get('window').width;
  const tableSize = Math.min(screenWidth * 0.75, 300);
  const borderRadius = shape === 'round' ? tableSize / 2 : 16;
  
  // Calculate seat positions based on table center
  const centerX = tableSize / 2;
  const centerY = tableSize / 2;
  const radius = (tableSize / 2) - 35; // Distance from center to seat center
  const seatSize = 56;
  const halfSeat = seatSize / 2;

  const renderSeat = (seatIndex: number, position: { left?: string; top?: string }) => {
    const assignedPlayerIndex = seatAssignments[seatIndex];
    const wind = WIND_ORDER[seatIndex];
    const isEmpty = assignedPlayerIndex === null;
    const isDraggingOver = draggingIndex !== null && isEmpty;

    return (
      <TouchableOpacity
        className="absolute items-center justify-center"
        style={{
          ...position,
          width: seatSize,
          height: seatSize,
        } as any}
        onPress={() => isEmpty ? onSeatClick(seatIndex) : onRemoveSeat(seatIndex)}
        activeOpacity={0.7}
      >
        <View
          className="absolute w-full h-full rounded-full"
          style={{
            backgroundColor: isEmpty
              ? (isDraggingOver ? tableColors.accent + '80' : tableColors.surface)
              : tableColors.accent,
            borderWidth: 2,
            borderColor: isEmpty
              ? (isDraggingOver ? tableColors.accent : tableColors.border)
              : tableColors.frame,
            opacity: isEmpty ? 0.9 : 1,
          }}
        />
        
        {isEmpty ? (
          <View className="items-center">
            <Text
              className="font-bold text-base"
              style={{ color: isDraggingOver ? '#fff' : currentTheme.colors.text.secondary }}
            >
              {WIND_LABELS[wind]}
            </Text>
            <Text
              className="text-[10px]"
              style={{ color: isDraggingOver ? '#fff' : currentTheme.colors.text.muted }}
            >
              {isDraggingOver ? '放置' : '空位'}
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-white font-bold text-sm">
              {WIND_LABELS[wind]}
            </Text>
            <Text className="text-white text-[10px] font-medium" numberOfLines={1}>
              {playerNames[assignedPlayerIndex]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="items-center justify-center">
      <View
        className="relative items-center justify-center"
        style={{ width: tableSize, height: tableSize }}
      >
        <View
          className="absolute"
          style={{
            width: tableSize,
            height: tableSize,
            backgroundColor: tableColors.frame,
            borderRadius: borderRadius,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
          }}
        />
        
        <View
          className="absolute"
          style={{
            width: tableSize - 8,
            height: tableSize - 8,
            backgroundColor: tableColors.frame,
            borderRadius: borderRadius,
            opacity: 0.9,
          }}
        />
        
        <View
          className="absolute"
          style={{
            width: tableSize - 16,
            height: tableSize - 16,
            backgroundColor: tableColors.accent,
            borderRadius: borderRadius,
            shadowColor: tableColors.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        />
        
        <View
          className="absolute"
          style={{
            width: tableSize - 28,
            height: tableSize - 28,
            backgroundColor: tableColors.surface,
            borderRadius: borderRadius,
          }}
        >
          <View
            className="absolute"
            style={{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.05)',
              borderRadius: borderRadius,
            }}
          />
          
          <View
            className="absolute border-2"
            style={{
              left: 12,
              top: 12,
              right: 12,
              bottom: 12,
              borderColor: tableColors.border,
              borderRadius: borderRadius,
            }}
          />
          
          <View className="absolute items-center justify-center" style={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Text className={`${currentTheme.classes.textAccent} text-sm font-bold`}>
              點擊座位
            </Text>
            <Text className={`${currentTheme.classes.textSecondary} text-[10px]`}>
              分配玩家
            </Text>
          </View>
        </View>

        {renderSeat(0, {
          left: `${centerX - halfSeat}px`,           // 東 (上)
          top: `${centerY - radius - halfSeat}px`,
        })}

        {renderSeat(1, {
          left: `${centerX - radius - halfSeat}px`,  // 南 (左) - 逆時針
          top: `${centerY - halfSeat}px`,
        })}

        {renderSeat(2, {
          left: `${centerX - halfSeat}px`,           // 西 (下)
          top: `${centerY + radius - halfSeat}px`,
        })}

        {renderSeat(3, {
          left: `${centerX + radius - halfSeat}px`,  // 北 (右) - 逆時針
          top: `${centerY - halfSeat}px`,
        })}
      </View>
    </View>
  );
}