import { View, Text, Dimensions } from 'react-native';
import { Player, Wind } from '../../types';
import { PlayerSeat } from './PlayerSeat';

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
  // Get screen dimensions for responsive table size
  const screenWidth = Dimensions.get('window').width;
  // Ensure table doesn't exceed viewport and is responsive
  const tableSize = Math.min(screenWidth * 0.85, 360);

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
        <View className="bg-emerald-950/90 px-4 py-2 rounded-full border border-gold-500/50 shadow-lg">
          <Text
            className="text-gold-400 text-base font-bold"
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
          className="absolute rounded-full"
          style={{
            width: tableSize,
            height: tableSize,
            backgroundColor: '#5D4037',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
          }}
        />
        
        {/* Inner wooden border */}
        <View
          className="absolute rounded-full"
          style={{
            width: tableSize - 8,
            height: tableSize - 8,
            backgroundColor: '#6D4C41'
          }}
        />
        
        {/* Gold inlay ring */}
        <View
          className="absolute rounded-full"
          style={{
            width: tableSize - 16,
            height: tableSize - 16,
            backgroundColor: '#B8860B',
            shadowColor: '#D4AF37',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        />
        
        {/* Green felt table surface */}
        <View
          className="absolute rounded-full"
          style={{
            width: tableSize - 28,
            height: tableSize - 28,
            backgroundColor: '#1B5E20',
          }}
        >
          {/* Felt texture overlay */}
          <View
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          />
          
          {/* Inner decorative border */}
          <View
            className="absolute rounded-full border-2"
            style={{
              left: 12,
              top: 12,
              right: 12,
              bottom: 12,
              borderColor: 'rgba(184, 134, 11, 0.4)',
            }}
          />
          
          {/* Subtle radial gradient effect for depth */}
          <View
            className="absolute rounded-full"
            style={{
              left: '15%',
              top: '15%',
              right: '15%',
              bottom: '15%',
              backgroundColor: 'rgba(46, 125, 50, 0.3)',
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
