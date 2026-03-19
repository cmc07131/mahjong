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

  // Determine if this is a horizontal position (left/right) or vertical position (top/bottom)
  const isHorizontal = position === 'left' || position === 'right';

  // For horizontal positions: avatar on outer edge, info box toward center
  // For vertical positions: avatar on outer edge, info box toward center
  // The flex direction changes based on position
  
  if (isHorizontal) {
    // Left position: avatar on left (outer), info box on right (toward center)
    // Right position: info box on left (toward center), avatar on right (outer)
    return (
      <View className="flex-row items-center">
        {/* Left position: Avatar first, then info box */}
        {position === 'left' && (
          <>
            {/* Dealer Crown */}
            {player.isDealer && (
              <View className="absolute -top-2 left-6 z-10">
                <Text className="text-base">👑</Text>
              </View>
            )}
            {/* Avatar */}
            <View
              className={`
                w-10 h-10 rounded-full items-center justify-center
                border-2 border-gold-500
                ${player.isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
              `}
              style={{
                shadowColor: '#D4AF37',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 3,
              }}
            >
              <Text className="text-lg">
                {getAvatarEmoji(player, playerIndex)}
              </Text>
            </View>
            {/* Info Box */}
            <View
              className="dark-panel rounded-lg px-2 py-1.5 ml-1.5 min-w-[56px] items-center justify-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text className="text-gold-400 text-[10px] font-medium text-center">
                {WIND_LABELS[player.position]}
              </Text>
              <Text
                className="text-white text-xs font-bold text-center mt-0.5"
                numberOfLines={1}
              >
                {player.name}
              </Text>
              {roundScoreChange !== 0 && (
                <Text className={`text-xs font-bold text-center mt-0.5 ${getScoreColorClass(roundScoreChange)}`}>
                  {formatScore(roundScoreChange)}
                </Text>
              )}
              <Text className={`text-[10px] font-medium text-center mt-0.5 ${getScoreColorClass(player.score)}`}>
                {formatScore(player.score)}
              </Text>
            </View>
          </>
        )}

        {/* Right position: Info box first, then avatar */}
        {position === 'right' && (
          <>
            {/* Info Box */}
            <View
              className="dark-panel rounded-lg px-2 py-1.5 mr-1.5 min-w-[56px] items-center justify-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text className="text-gold-400 text-[10px] font-medium text-center">
                {WIND_LABELS[player.position]}
              </Text>
              <Text
                className="text-white text-xs font-bold text-center mt-0.5"
                numberOfLines={1}
              >
                {player.name}
              </Text>
              {roundScoreChange !== 0 && (
                <Text className={`text-xs font-bold text-center mt-0.5 ${getScoreColorClass(roundScoreChange)}`}>
                  {formatScore(roundScoreChange)}
                </Text>
              )}
              <Text className={`text-[10px] font-medium text-center mt-0.5 ${getScoreColorClass(player.score)}`}>
                {formatScore(player.score)}
              </Text>
            </View>
            {/* Dealer Crown */}
            {player.isDealer && (
              <View className="absolute -top-2 right-6 z-10">
                <Text className="text-base">👑</Text>
              </View>
            )}
            {/* Avatar */}
            <View
              className={`
                w-10 h-10 rounded-full items-center justify-center
                border-2 border-gold-500
                ${player.isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
              `}
              style={{
                shadowColor: '#D4AF37',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 3,
              }}
            >
              <Text className="text-lg">
                {getAvatarEmoji(player, playerIndex)}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  }

  // Vertical positions (top/bottom)
  // Top position: Avatar on top (outer), info box below (toward center)
  // Bottom position: Info box on top (toward center), avatar below (outer)
  return (
    <View className="items-center">
      {/* Top position: Avatar first, then info box */}
      {position === 'top' && (
        <>
          {/* Dealer Crown */}
          {player.isDealer && (
            <View className="mb-[-4] z-10">
              <Text className="text-base">👑</Text>
            </View>
          )}
          {/* Avatar */}
          <View
            className={`
              w-10 h-10 rounded-full items-center justify-center
              border-2 border-gold-500
              ${player.isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
            `}
            style={{
              shadowColor: '#D4AF37',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <Text className="text-lg">
              {getAvatarEmoji(player, playerIndex)}
            </Text>
          </View>
          {/* Info Box */}
          <View
            className="dark-panel rounded-lg px-2 py-1.5 mt-1 min-w-[56px] items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-gold-400 text-[10px] font-medium text-center">
              {WIND_LABELS[player.position]}
            </Text>
            <Text
              className="text-white text-xs font-bold text-center mt-0.5"
              numberOfLines={1}
            >
              {player.name}
            </Text>
            {roundScoreChange !== 0 && (
              <Text className={`text-xs font-bold text-center mt-0.5 ${getScoreColorClass(roundScoreChange)}`}>
                {formatScore(roundScoreChange)}
              </Text>
            )}
            <Text className={`text-[10px] font-medium text-center mt-0.5 ${getScoreColorClass(player.score)}`}>
              {formatScore(player.score)}
            </Text>
          </View>
        </>
      )}

      {/* Bottom position: Info box first, then avatar */}
      {position === 'bottom' && (
        <>
          {/* Info Box */}
          <View
            className="dark-panel rounded-lg px-2 py-1.5 mb-1 min-w-[56px] items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-gold-400 text-[10px] font-medium text-center">
              {WIND_LABELS[player.position]}
            </Text>
            <Text
              className="text-white text-xs font-bold text-center mt-0.5"
              numberOfLines={1}
            >
              {player.name}
            </Text>
            {roundScoreChange !== 0 && (
              <Text className={`text-xs font-bold text-center mt-0.5 ${getScoreColorClass(roundScoreChange)}`}>
                {formatScore(roundScoreChange)}
              </Text>
            )}
            <Text className={`text-[10px] font-medium text-center mt-0.5 ${getScoreColorClass(player.score)}`}>
              {formatScore(player.score)}
            </Text>
          </View>
          {/* Dealer Crown */}
          {player.isDealer && (
            <View className="absolute -bottom-2 z-10">
              <Text className="text-base">👑</Text>
            </View>
          )}
          {/* Avatar */}
          <View
            className={`
              w-10 h-10 rounded-full items-center justify-center
              border-2 border-gold-500
              ${player.isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
            `}
            style={{
              shadowColor: '#D4AF37',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <Text className="text-lg">
              {getAvatarEmoji(player, playerIndex)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
