import { View, Text, TouchableOpacity } from 'react-native';
import { Player, WinType } from '../../types';
import { FanSelector } from './FanSelector';
import { WinnerSelector } from './WinnerSelector';
import { WinTypeSelector } from './WinTypeSelector';

interface ActionPanelProps {
  players: Player[];
  // 番數
  selectedFan: number | null;
  onSelectFan: (fan: number) => void;
  // 贏家
  selectedWinnerId: string | null;
  onSelectWinner: (playerId: string) => void;
  // 食糊方式
  selectedWinType: WinType | null;
  onSelectWinType: (winType: WinType) => void;
  // 出銃者
  selectedLoserId: string | null;
  onSelectLoser: (playerId: string) => void;
  // 操作
  onConfirm: () => void;
  onDraw: () => void;
  onUndo: () => void;
  onFinish: () => void;
  canUndo: boolean;
  // 預覽分數變動
  previewChanges?: Record<string, number>;
}

export function ActionPanel({
  players,
  selectedFan,
  onSelectFan,
  selectedWinnerId,
  onSelectWinner,
  selectedWinType,
  onSelectWinType,
  selectedLoserId,
  onSelectLoser,
  onConfirm,
  onDraw,
  onUndo,
  onFinish,
  canUndo,
  previewChanges,
}: ActionPanelProps) {
  // 檢查是否可以確認本局
  const canConfirm = () => {
    if (!selectedFan) return false;
    if (!selectedWinnerId) return false;
    if (!selectedWinType) return false;
    // 如果是出銃，必須選擇出銃者
    if (selectedWinType === 'RON' && !selectedLoserId) return false;
    return true;
  };

  return (
    <View className="dark-panel rounded-2xl border border-gold-500/50 p-3 md:p-4 mx-3 md:mx-4">
      {/* Step 1: Fan Selection */}
      <View className="mb-3 md:mb-4">
        <Text className="text-white font-bold text-base md:text-lg mb-2 md:mb-3">步驟一：選擇番數</Text>
        <FanSelector
          selectedFan={selectedFan}
          onSelectFan={onSelectFan}
          disabled={false}
        />
      </View>
      
      {/* Step 2: Winner Selection */}
      <View className="mb-3 md:mb-4 border-t border-gold-500/30 pt-3 md:pt-4">
        <Text className="text-white font-bold text-base md:text-lg mb-2 md:mb-3">步驟二：選擇食糊者</Text>
        <WinnerSelector
          players={players}
          selectedWinnerId={selectedWinnerId}
          onSelectWinner={onSelectWinner}
          disabled={!selectedFan}
        />
      </View>
      
      {/* Step 3: Win Type */}
      <View className="mb-3 md:mb-4 border-t border-gold-500/30 pt-3 md:pt-4">
        <Text className="text-white font-bold text-base md:text-lg mb-2 md:mb-3">步驟三：選擇食糊方式</Text>
        <WinTypeSelector
          selectedWinType={selectedWinType}
          onSelectWinType={onSelectWinType}
          showLoserSelector={true}
          players={players}
          winnerId={selectedWinnerId}
          selectedLoserId={selectedLoserId}
          onSelectLoser={onSelectLoser}
          disabled={!selectedWinnerId}
        />
      </View>
      
      {/* Score Preview */}
      {previewChanges && Object.keys(previewChanges).length > 0 && (
        <View className="bg-white/90 rounded-lg p-2.5 md:p-3 mb-3 md:mb-4">
          <Text className="text-emerald-950 text-xs md:text-sm font-medium mb-1">
            本局分數變動預覽：
          </Text>
          <View className="flex-row flex-wrap">
            {players.map((player) => {
              const change = previewChanges[player.id] || 0;
              if (change === 0) return null;
              return (
                <Text
                  key={player.id}
                  className={change > 0 ? 'text-score-win font-medium text-xs md:text-sm' : 'text-score-lose font-medium text-xs md:text-sm'}
                >
                  {player.name}: {change > 0 ? '+' : ''}{change}{'  '}
                </Text>
              );
            })}
          </View>
        </View>
      )}
      
      {/* Confirm Button */}
      <TouchableOpacity
        onPress={onConfirm}
        disabled={!canConfirm()}
        className={`
          rounded-xl py-3 md:py-4 items-center justify-center
          transition-select button-press
          ${canConfirm()
            ? 'gold-gradient active:opacity-80'
            : 'bg-emerald-900/50 border border-gold-500/20'
          }
        `}
        activeOpacity={0.8}
      >
        <Text
          className={`
            font-bold text-base md:text-lg
            ${canConfirm() ? 'text-emerald-950' : 'text-emerald-700'}
          `}
        >
          確認
        </Text>
      </TouchableOpacity>

      {/* Action Buttons Row */}
      <View className="flex-row gap-1.5 md:gap-2 justify-center mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gold-500/30">
        {/* 流局 */}
        <TouchableOpacity
          onPress={onDraw}
          className="bg-orange-600 active:bg-orange-500 px-3 md:px-4 py-2.5 md:py-3 rounded-xl flex-1 items-center border border-orange-400/50 button-press"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm md:text-base">流局</Text>
        </TouchableOpacity>

        {/* Undo */}
        <TouchableOpacity
          onPress={onUndo}
          disabled={!canUndo}
          className={`
            px-3 md:px-4 py-2.5 md:py-3 rounded-xl flex-1 items-center border button-press
            ${canUndo
              ? 'bg-blue-600 active:bg-blue-500 border-blue-400/50'
              : 'bg-emerald-900/50 border-gold-500/20'
            }
          `}
          activeOpacity={0.8}
        >
          <Text className={`font-bold text-sm md:text-base ${canUndo ? 'text-white' : 'text-emerald-700'}`}>
            復原
          </Text>
        </TouchableOpacity>

        {/* 結束牌局 */}
        <TouchableOpacity
          onPress={onFinish}
          className="bg-red-600 active:bg-red-500 px-3 md:px-4 py-2.5 md:py-3 rounded-xl flex-1 items-center border border-red-400/50 button-press"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm md:text-base">結束牌局</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
