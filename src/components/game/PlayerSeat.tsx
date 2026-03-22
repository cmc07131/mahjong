import { View, Text } from 'react-native';
import { Player } from '../../types';
import { useThemeStore } from '../../store/themeStore';

interface PlayerSeatProps {
  player: Player;
  position: 'top' | 'right' | 'bottom' | 'left';
  windLabel: string;
  roundScoreChange?: number;
  isDealer?: boolean;
}

// Animal avatar emojis for each player position
const getAvatarEmoji = (player: Player, index: number): string => {
  // Use different animal emojis for each player
  // 🐯 Tiger, 🐉 Dragon, 🐔 Rooster, 🐍 Snake
  const animalAvatars = ['🐯', '🐉', '🐔', '🐍'];
  return animalAvatars[index % 4];
};

export function PlayerSeat({ player, position, windLabel, roundScoreChange = 0, isDealer = false }: PlayerSeatProps) {
  const { currentTheme } = useThemeStore();
  
  const formatScore = (score: number) => {
    if (score === 0) return '0';
    return score > 0 ? `+${score}` : `${score}`;
  };

  const getScoreColorClass = (score: number) => {
    if (score > 0) return currentTheme.classes.scorePositive;
    if (score < 0) return currentTheme.classes.scoreNegative;
    return currentTheme.classes.textPrimary;
  };

  // Get player index for avatar selection (use seatIndex)
  const playerIndex = player.seatIndex;

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
            {/* Avatar with Crown */}
            <View className="relative items-center justify-center">
              {/* Dealer Crown - positioned directly above the emoji */}
              {isDealer && (
                <View className="absolute -top-4 z-10">
                  <Text className="text-base">👑</Text>
                </View>
              )}
              {/* Avatar */}
              <View
                className={`
                  w-10 h-10 rounded-full items-center justify-center
                  ${currentTheme.classes.panelBorder}
                  ${isDealer ? 'bg-gold-500/20' : currentTheme.classes.panel}
                `}
                style={{
                  shadowColor: currentTheme.colors.shadow.color,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: currentTheme.colors.shadow.opacity,
                  shadowRadius: currentTheme.colors.shadow.radius,
                  elevation: currentTheme.colors.shadow.elevation,
                }}
              >
                <Text className="text-lg">
                  {getAvatarEmoji(player, playerIndex)}
                </Text>
              </View>
            </View>
            {/* Info Box */}
            <View
              className={`${currentTheme.classes.panel} rounded-lg px-2 py-1.5 ml-1.5 min-w-[56px] items-center justify-center`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text className={`${currentTheme.classes.textAccent} text-[10px] font-medium text-center`}>
                {windLabel}
              </Text>
              <Text
                className={`${currentTheme.classes.textPrimary} text-xs font-bold text-center mt-0.5`}
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
              className={`${currentTheme.classes.panel} rounded-lg px-2 py-1.5 mr-1.5 min-w-[56px] items-center justify-center`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text className={`${currentTheme.classes.textAccent} text-[10px] font-medium text-center`}>
                {windLabel}
              </Text>
              <Text
                className={`${currentTheme.classes.textPrimary} text-xs font-bold text-center mt-0.5`}
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
            {/* Avatar with Crown */}
            <View className="relative items-center justify-center">
              {/* Dealer Crown - positioned directly above the emoji */}
              {isDealer && (
                <View className="absolute -top-4 z-10">
                  <Text className="text-base">👑</Text>
                </View>
              )}
              {/* Avatar */}
              <View
                className={`
                  w-10 h-10 rounded-full items-center justify-center
                  border-2 border-gold-500
                  ${isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
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
          {/* Dealer Crown - positioned directly above the emoji */}
          {isDealer && (
            <View className="absolute -top-4 z-10">
              <Text className="text-base">👑</Text>
            </View>
          )}
          {/* Avatar */}
          <View
            className={`
              w-10 h-10 rounded-full items-center justify-center
              ${currentTheme.classes.panelBorder}
              ${isDealer ? 'bg-gold-500/20' : currentTheme.classes.panel}
            `}
            style={{
              shadowColor: currentTheme.colors.shadow.color,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: currentTheme.colors.shadow.opacity,
              shadowRadius: currentTheme.colors.shadow.radius,
              elevation: currentTheme.colors.shadow.elevation,
            }}
          >
            <Text className="text-lg">
              {getAvatarEmoji(player, playerIndex)}
            </Text>
          </View>
          {/* Info Box */}
          <View
            className={`${currentTheme.classes.panel} rounded-lg px-2 py-1.5 mt-1 min-w-[56px] items-center justify-center`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className={`${currentTheme.classes.textAccent} text-[10px] font-medium text-center`}>
              {windLabel}
            </Text>
            <Text
              className={`${currentTheme.classes.textPrimary} text-xs font-bold text-center mt-0.5`}
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
            className={`${currentTheme.classes.panel} rounded-lg px-2 py-1.5 mb-1 min-w-[56px] items-center justify-center`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className={`${currentTheme.classes.textAccent} text-[10px] font-medium text-center`}>
              {windLabel}
            </Text>
            <Text
              className={`${currentTheme.classes.textPrimary} text-xs font-bold text-center mt-0.5`}
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
          {/* Avatar with Crown */}
          <View className="relative items-center justify-center">
            {/* Dealer Crown - positioned directly above the emoji */}
            {isDealer && (
              <View className="absolute -top-4 z-10">
                <Text className="text-base">👑</Text>
              </View>
            )}
            <View
              className={`
                w-10 h-10 rounded-full items-center justify-center
                border-2 border-gold-500
                ${isDealer ? 'bg-gold-500/20' : 'bg-emerald-800'}
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
          </View>
        </>
      )}
    </View>
  );
}