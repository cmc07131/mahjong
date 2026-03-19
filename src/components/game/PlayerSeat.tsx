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

// Simple avatar emoji based on player name or index
const getAvatarEmoji = (player: Player, index: number): string => {
  // Use a simple alternating pattern for avatars
  const avatars = ['👨', '👩', '👨', '👩'];
  return avatars[index % 4];
};

export function PlayerSeat({ player, position, roundScoreChange = 0 }: PlayerSeatProps) {
  const formatScore = (score: number) => {
    if (score === 0) return '0';
    return score > 0 ? `+${score}` : `${score}`;
  };

  const getScoreColorClass = (score: number) => {
    if (score > 0) return 'text-score-win';
    if (score < 0) return 'text-score-lose';
    return 'text-white';
  };

  // Get player index for avatar selection
  const playerIndex = ['EAST', 'SOUTH', 'WEST', 'NORTH'].indexOf(player.position);

  return (
    <View className="items-center">
      {/* Dealer Crown - above avatar */}
      {player.isDealer && (
        <View className="mb-[-6] md:mb-[-8] z-10">
          <Text className="text-lg md:text-xl">👑</Text>
        </View>
      )}
      
      {/* Circular Avatar with Gold Border */}
      <View
        className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full items-center justify-center
          border-2 md:border-4 border-gold-500
          ${player.isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
        `}
        style={{
          shadowColor: '#D4AF37',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text className="text-xl md:text-2xl">
          {getAvatarEmoji(player, playerIndex)}
        </Text>
      </View>

      {/* Info Box - Semi-transparent dark panel */}
      <View
        className="dark-panel rounded-lg md:rounded-xl px-2.5 md:px-3 py-1.5 md:py-2 mt-1 md:mt-1.5 min-w-[60px] md:min-w-[70px] items-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Wind Position Label */}
        <Text className="text-gold-400 text-xs font-medium">
          {WIND_LABELS[player.position]}
        </Text>
        
        {/* Player Name */}
        <Text
          className="text-white text-xs md:text-sm font-bold mt-0.5"
          numberOfLines={1}
        >
          {player.name}
        </Text>
        
        {/* Round Score Change (if any) */}
        {roundScoreChange !== 0 && (
          <Text className={`text-xs md:text-sm font-bold mt-0.5 ${getScoreColorClass(roundScoreChange)}`}>
            {formatScore(roundScoreChange)}
          </Text>
        )}
        
        {/* Total Score */}
        <Text className={`text-xs font-medium mt-0.5 ${getScoreColorClass(player.score)}`}>
          {formatScore(player.score)}
        </Text>
      </View>
    </View>
  );
}
