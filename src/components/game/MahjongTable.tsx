import { View, Text, Dimensions } from 'react-native';
import { Player, Wind } from '../../types';
import { PlayerSeat } from './PlayerSeat';
import { useThemeStore } from '../../store/themeStore';
import { useTableStore } from '../../store/tableStore';

interface MahjongTableProps {
  players: Player[];
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

export function MahjongTable({
  players,
  roundScoreChanges = {},
  prevailingWind,
  roundNumber
}: MahjongTableProps) {
  const { currentTheme } = useThemeStore();
  const { shape, customColors, useCustomColors } = useTableStore();
  
  // Get table colors (use custom if enabled, otherwise use theme)
  const tableColors = useCustomColors && customColors
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
  const borderRadius = shape === 'round' ? tableSize / 2 : 16;

  // Find player by wind position
  const getPlayerByWind = (wind: Wind): Player | undefined => {
    return players.find(p => p.position === wind);
  };

  // Get round score change for a player
  const getRoundScoreChange = (playerId: string): number => {
    return roundScoreChanges[playerId] || 0;
  };

  // Four seat players
  const eastPlayer = getPlayerByWind('EAST');
  const southPlayer = getPlayerByWind('SOUTH');
  const westPlayer = getPlayerByWind('WEST');
  const northPlayer = getPlayerByWind('NORTH');

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

        {/* North Player (12 o'clock - Top Center) */}
        {/* Avatar on outer edge (top), info box toward center (below avatar) */}
        <View
          className="absolute items-center"
          style={{
            left: '50%',
            top: `${edgeOffset}%`,
            transform: [{ translateX: -28 }]
          }}
        >
          {northPlayer && (
            <PlayerSeat
              player={northPlayer}
              position="top"
              roundScoreChange={getRoundScoreChange(northPlayer.id)}
            />
          )}
        </View>

        {/* West Player (9 o'clock - Left Center) */}
        {/* Avatar on outer edge (left), info box toward center (right of avatar) */}
        <View
          className="absolute"
          style={{ 
            left: `${edgeOffset}%`, 
            top: '50%',
            transform: [{ translateY: -35 }]
          }}
        >
          {westPlayer && (
            <PlayerSeat
              player={westPlayer}
              position="left"
              roundScoreChange={getRoundScoreChange(westPlayer.id)}
            />
          )}
        </View>

        {/* East Player (3 o'clock - Right Center) */}
        {/* Avatar on outer edge (right), info box toward center (left of avatar) */}
        <View
          className="absolute"
          style={{ 
            right: `${edgeOffset}%`, 
            top: '50%',
            transform: [{ translateY: -35 }]
          }}
        >
          {eastPlayer && (
            <PlayerSeat
              player={eastPlayer}
              position="right"
              roundScoreChange={getRoundScoreChange(eastPlayer.id)}
            />
          )}
        </View>

        {/* South Player (6 o'clock - Bottom Center) */}
        {/* Avatar on outer edge (bottom), info box toward center (above avatar) */}
        <View
          className="absolute items-center"
          style={{
            left: '50%',
            bottom: `${edgeOffset}%`,
            transform: [{ translateX: -28 }]
          }}
        >
          {southPlayer && (
            <PlayerSeat
              player={southPlayer}
              position="bottom"
              roundScoreChange={getRoundScoreChange(southPlayer.id)}
            />
          )}
        </View>
      </View>
    </View>
  );
}
