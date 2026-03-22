import { View, Text, Dimensions } from 'react-native';
import { Player, Wind } from '../../types';
import { PlayerSeat } from './PlayerSeat';
import { useThemeStore } from '../../store/themeStore';
import { useTableStore } from '../../store/tableStore';

interface MahjongTableProps {
  players: Player[];
  dealerIndex: number;
  roundScoreChanges?: Record<string, number>;
  prevailingWind: Wind;
  roundNumber: number;
}

const WIND_LABELS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
};

const WIND_ORDER: Wind[] = ['EAST', 'SOUTH', 'WEST', 'NORTH'];

// 根據座位和莊家計算門風（逆時針方向）
// 座位順序：0(上/12點) → 1(左/9點) → 2(下/6點) → 3(右/3點) 逆時針
// 莊家 = 東, 上家(左手邊) = 南, 對家 = 西, 下家(右手邊) = 北
const getWindForSeat = (seatIndex: number, dealerIndex: number): Wind => {
  const offset = (dealerIndex - seatIndex + 4) % 4;
  return WIND_ORDER[offset];
};

export function MahjongTable({
  players,
  dealerIndex = 0,
  roundScoreChanges = {},
  prevailingWind,
  roundNumber
}: MahjongTableProps) {
  const { currentTheme } = useThemeStore();
  const { shape, customColors } = useTableStore();
  
  // Get table colors (use custom if set, otherwise use theme)
  const tableColors = customColors
    ? {
        surface: customColors.surface || currentTheme.colors.mahjongTable.surface,
        frame: customColors.frame || currentTheme.colors.mahjongTable.frame,
        accent: currentTheme.colors.mahjongTable.accent,
        border: currentTheme.colors.mahjongTable.border,
      }
    : currentTheme.colors.mahjongTable;
  
  // Get screen dimensions for responsive table size
  const screenWidth = Dimensions.get('window').width;
  // Ensure table doesn't exceed viewport and is responsive
  const tableSize = Math.min(screenWidth * 0.85, 360);
  
  // Determine border radius based on shape
  const borderRadius = shape === 'round' ? tableSize / 2 : 0;

  // Find player by seat index
  const getPlayerBySeat = (seatIndex: number): Player | undefined => {
    return players.find(p => p.seatIndex === seatIndex);
  };

  // Get round score change for a player
  const getRoundScoreChange = (playerId: string): number => {
    return roundScoreChanges[playerId] || 0;
  };

  // Four seat players (fixed positions) - anticlockwise like setup page
  const topPlayer = getPlayerBySeat(0);      // 12 o'clock - 東 (EAST)
  const leftPlayer = getPlayerBySeat(1);     // 9 o'clock - 南 (SOUTH)
  const bottomPlayer = getPlayerBySeat(2);   // 6 o'clock - 西 (WEST)
  const rightPlayer = getPlayerBySeat(3);    // 3 o'clock - 北 (NORTH)

  // Calculate consistent offset from edge for all positions
  // This ensures all player seats are equidistant from center
  const edgeOffset = 4; // percentage from edge

  return (
    <View className="items-center justify-center">
      {/* Center Round Title - positioned ABOVE the table */}
      <View className="mb-3">
        <View className={`${currentTheme.classes.panel} px-4 py-2 rounded-full ${currentTheme.classes.panelBorder} shadow-lg`}>
          <Text
            className={`${currentTheme.classes.textAccent} text-base font-bold`}
            style={{ letterSpacing: 2 }}
          >
            {WIND_LABELS[prevailingWind]}風圈 / 第{roundNumber}局
          </Text>
        </View>
      </View>
      
      {/* Mahjong Table Layout */}
      <View
        className="relative items-center justify-center"
        style={{ width: tableSize, height: tableSize }}
      >
        {/* Outer wooden frame with 3D depth */}
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
        
        {/* Inner wooden border */}
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
        
        {/* Accent ring */}
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
        
        {/* Table surface */}
        <View
          className="absolute"
          style={{
            width: tableSize - 28,
            height: tableSize - 28,
            backgroundColor: tableColors.surface,
            borderRadius: borderRadius,
          }}
        >
          {/* Felt texture overlay */}
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
          
          {/* Inner decorative border */}
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
          
          {/* Subtle radial gradient effect for depth */}
          <View
            className="absolute"
            style={{
              left: '15%',
              top: '15%',
              right: '15%',
              bottom: '15%',
              backgroundColor: tableColors.surface,
              opacity: 0.7,
              borderRadius: borderRadius,
            }}
          />
        </View>

        {/* Top Player (12 o'clock) */}
        <View
          className="absolute items-center"
          style={{
            left: '50%',
            top: `${edgeOffset}%`,
            transform: [{ translateX: -28 }]
          }}
        >
          {topPlayer && (
            <PlayerSeat
              player={topPlayer}
              position="top"
              windLabel={WIND_LABELS[getWindForSeat(0, dealerIndex)]}
              roundScoreChange={getRoundScoreChange(topPlayer.id)}
              isDealer={topPlayer.seatIndex === dealerIndex}
            />
          )}
        </View>

        {/* Left Player (9 o'clock) - 南 */}
        <View
          className="absolute"
          style={{ 
            left: `${edgeOffset}%`, 
            top: '50%',
            transform: [{ translateY: -35 }]
          }}
        >
          {leftPlayer && (
            <PlayerSeat
              player={leftPlayer}
              position="left"
              windLabel={WIND_LABELS[getWindForSeat(1, dealerIndex)]}
              roundScoreChange={getRoundScoreChange(leftPlayer.id)}
              isDealer={leftPlayer.seatIndex === dealerIndex}
            />
          )}
        </View>

        {/* Right Player (3 o'clock) - 北 */}
        <View
          className="absolute"
          style={{ 
            right: `${edgeOffset}%`, 
            top: '50%',
            transform: [{ translateY: -35 }]
          }}
        >
          {rightPlayer && (
            <PlayerSeat
              player={rightPlayer}
              position="right"
              windLabel={WIND_LABELS[getWindForSeat(3, dealerIndex)]}
              roundScoreChange={getRoundScoreChange(rightPlayer.id)}
              isDealer={rightPlayer.seatIndex === dealerIndex}
            />
          )}
        </View>

        {/* Bottom Player (6 o'clock) */}
        <View
          className="absolute items-center"
          style={{
            left: '50%',
            bottom: `${edgeOffset}%`,
            transform: [{ translateX: -28 }]
          }}
        >
          {bottomPlayer && (
            <PlayerSeat
              player={bottomPlayer}
              position="bottom"
              windLabel={WIND_LABELS[getWindForSeat(2, dealerIndex)]}
              roundScoreChange={getRoundScoreChange(bottomPlayer.id)}
              isDealer={bottomPlayer.seatIndex === dealerIndex}
            />
          )}
        </View>
      </View>
    </View>
  );
}
