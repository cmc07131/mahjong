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
  const tableSize = Math.min(screenWidth * 0.7, 400);

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

  return (
    <View className="flex-1 items-center justify-center">
      {/* Mahjong Table Layout */}
      <View 
        className="relative items-center justify-center"
        style={{ width: tableSize, height: tableSize }}
      >
        {/* Outer gold ring with 3D depth */}
        <View 
          className="absolute rounded-full gold-ring-shadow"
          style={{ 
            width: tableSize, 
            height: tableSize,
            backgroundColor: '#D4AF37'
          }}
        />
        
        {/* Inner gold border ring */}
        <View 
          className="absolute rounded-full"
          style={{ 
            width: tableSize - 12, 
            height: tableSize - 12,
            backgroundColor: '#8B6914'
          }}
        />
        
        {/* Velvet table surface */}
        <View 
          className="absolute rounded-full velvet-texture"
          style={{ 
            width: tableSize - 24, 
            height: tableSize - 24,
            backgroundColor: '#1a4a2e'
          }}
        >
          {/* Inner gold border line */}
          <View 
            className="absolute rounded-full border-2 border-gold-500/60"
            style={{ 
              left: 16, 
              top: 16, 
              right: 16, 
              bottom: 16 
            }}
          />
          
          {/* Cloud pattern overlay */}
          <View 
            className="absolute rounded-full cloud-pattern opacity-30"
            style={{ 
              left: 24, 
              top: 24, 
              right: 24, 
              bottom: 24 
            }}
          />
        </View>

        {/* Center Round Title */}
        <View className="absolute z-10 items-center justify-center">
          <View className="bg-emerald-950/80 px-5 py-2.5 rounded-full border border-gold-500/40">
            <Text 
              className="text-white text-lg font-bold text-outline text-gold-glow"
              style={{ letterSpacing: 2 }}
            >
              {WIND_LABELS[prevailingWind]}風圈 / 第{roundNumber}局
            </Text>
          </View>
        </View>

        {/* North Player (12 o'clock - Top Center) */}
        <View
          className="absolute"
          style={{ top: '2%', left: '50%', transform: [{ translateX: -50 }] }}
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
        <View
          className="absolute"
          style={{ left: '2%', top: '50%', transform: [{ translateY: -50 }] }}
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
        <View
          className="absolute"
          style={{ right: '2%', top: '50%', transform: [{ translateY: -50 }] }}
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
        <View
          className="absolute"
          style={{ bottom: '2%', left: '50%', transform: [{ translateX: -50 }] }}
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
