import { View, Text } from 'react-native';
import { Player, Wind } from '../../types';

interface PlayerSeatProps {
  player: Player;
  position: 'top' | 'right' | 'bottom' | 'left';
  roundScoreChange?: number;
}

const WIND_LABELS: Record<Wind, string> = {
  EAST: '東',
  SOUTH: '南',
  WEST: '西',
  NORTH: '北',
};

export function PlayerSeat({ player, position, roundScoreChange = 0 }: PlayerSeatProps) {
  const formatScore = (score: number) => {
    if (score === 0) return '0';
    return score > 0 ? `+${score}` : `${score}`;
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-400';
    if (score < 0) return 'text-red-400';
    return 'text-gray-300';
  };

  // 根據位置調整佈局
  const isHorizontal = position === 'left' || position === 'right';
  
  return (
    <View
      className={`
        bg-green-800/80 rounded-xl p-3 min-w-[100px] items-center justify-center
        ${isHorizontal ? 'flex-row gap-2' : 'flex-col'}
        border-2 ${player.isDealer ? 'border-yellow-400' : 'border-green-600'}
      `}
    >
      {/* 莊家標記 */}
      {player.isDealer && (
        <View className="bg-yellow-400 px-2 py-0.5 rounded-full mb-1">
          <Text className="text-yellow-900 text-xs font-bold">莊</Text>
        </View>
      )}
      
      {/* 風位 */}
      <View className="bg-green-900/50 px-2 py-0.5 rounded">
        <Text className="text-green-200 text-sm font-medium">
          {WIND_LABELS[player.position]}
        </Text>
      </View>
      
      {/* 玩家名字 */}
      <Text className="text-white text-base font-bold mt-1" numberOfLines={1}>
        {player.name}
      </Text>
      
      {/* 本局輸贏 */}
      {roundScoreChange !== 0 && (
        <Text className={`text-sm font-medium ${getScoreColor(roundScoreChange)}`}>
          {formatScore(roundScoreChange)}
        </Text>
      )}
      
      {/* 總輸贏 */}
      <Text className={`text-xs ${getScoreColor(player.score)}`}>
        總: {formatScore(player.score)}
      </Text>
    </View>
  );
}
