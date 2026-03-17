import { View, Text } from 'react-native';
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
  // 根據風位找到對應的玩家
  const getPlayerByWind = (wind: Wind): Player | undefined => {
    return players.find(p => p.position === wind);
  };

  // 取得玩家的本局分數變動
  const getRoundScoreChange = (playerId: string): number => {
    return roundScoreChanges[playerId] || 0;
  };

  // 四個座位的玩家
  const eastPlayer = getPlayerByWind('EAST');
  const southPlayer = getPlayerByWind('SOUTH');
  const westPlayer = getPlayerByWind('WEST');
  const northPlayer = getPlayerByWind('NORTH');

  return (
    <View className="flex-1 items-center justify-center">
      {/* 圈風資訊 */}
      <View className="bg-green-900/70 px-4 py-2 rounded-full mb-4">
        <Text className="text-green-100 text-lg font-bold">
          {WIND_LABELS[prevailingWind]}風圈 / 第 {roundNumber} 局
        </Text>
      </View>

      {/* 麻將桌佈局 */}
      <View className="relative w-full max-w-md aspect-square items-center justify-center">
        {/* 桌面背景 */}
        <View className="absolute inset-8 bg-green-700/50 rounded-full" />
        
        {/* 北家 (上方) */}
        <View className="absolute top-0">
          {northPlayer && (
            <PlayerSeat
              player={northPlayer}
              position="top"
              roundScoreChange={getRoundScoreChange(northPlayer.id)}
            />
          )}
        </View>

        {/* 西家 (左邊) */}
        <View className="absolute left-0">
          {westPlayer && (
            <PlayerSeat
              player={westPlayer}
              position="left"
              roundScoreChange={getRoundScoreChange(westPlayer.id)}
            />
          )}
        </View>

        {/* 東家 (右邊) */}
        <View className="absolute right-0">
          {eastPlayer && (
            <PlayerSeat
              player={eastPlayer}
              position="right"
              roundScoreChange={getRoundScoreChange(eastPlayer.id)}
            />
          )}
        </View>

        {/* 南家 (下方) */}
        <View className="absolute bottom-0">
          {southPlayer && (
            <PlayerSeat
              player={southPlayer}
              position="bottom"
              roundScoreChange={getRoundScoreChange(southPlayer.id)}
            />
          )}
        </View>

        {/* 中央指示 */}
        <View className="bg-green-900/80 px-3 py-1.5 rounded-lg">
          <Text className="text-green-200 text-sm">麻將桌</Text>
        </View>
      </View>
    </View>
  );
}
