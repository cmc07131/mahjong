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
    <View className="bg-green-900/90 rounded-t-3xl p-4 pt-6">
      {/* 步驟一：選擇番數 */}
      <FanSelector
        selectedFan={selectedFan}
        onSelectFan={onSelectFan}
        disabled={false}
      />

      {/* 步驟二：選擇贏家 */}
      <WinnerSelector
        players={players}
        selectedWinnerId={selectedWinnerId}
        onSelectWinner={onSelectWinner}
        disabled={!selectedFan}
      />

      {/* 步驟三：選擇食糊方式 */}
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

      {/* 分數預覽 */}
      {previewChanges && Object.keys(previewChanges).length > 0 && (
        <View className="mb-4 bg-green-800/50 rounded-lg p-3">
          <Text className="text-green-200 text-sm font-medium mb-1">本局分數變動預覽：</Text>
          <View className="flex-row flex-wrap gap-2">
            {players.map((player) => {
              const change = previewChanges[player.id] || 0;
              if (change === 0) return null;
              return (
                <View key={player.id} className="flex-row items-center">
                  <Text className="text-white text-sm">{player.name}: </Text>
                  <Text className={`text-sm font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change > 0 ? `+${change}` : change}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 步驟四：完成本局 */}
      <View className="mb-4">
        <Text className="text-white text-lg font-bold mb-2">步驟四：完成</Text>
        <TouchableOpacity
          onPress={onConfirm}
          disabled={!canConfirm()}
          className={`
            py-4 rounded-lg items-center justify-center
            ${canConfirm() 
              ? 'bg-yellow-500 active:bg-yellow-400' 
              : 'bg-gray-600'
            }
          `}
        >
          <Text 
            className={`
              text-xl font-bold
              ${canConfirm() ? 'text-yellow-900' : 'text-gray-400'}
            `}
          >
            完成本局
          </Text>
        </TouchableOpacity>
      </View>

      {/* 特殊操作按鈕 */}
      <View className="flex-row gap-2 justify-center">
        {/* 流局 */}
        <TouchableOpacity
          onPress={onDraw}
          className="bg-orange-600 active:bg-orange-500 px-4 py-2 rounded-lg flex-1 items-center"
        >
          <Text className="text-white font-bold">流局</Text>
        </TouchableOpacity>

        {/* Undo */}
        <TouchableOpacity
          onPress={onUndo}
          disabled={!canUndo}
          className={`
            px-4 py-2 rounded-lg flex-1 items-center
            ${canUndo 
              ? 'bg-blue-600 active:bg-blue-500' 
              : 'bg-gray-600'
            }
          `}
        >
          <Text className={`font-bold ${canUndo ? 'text-white' : 'text-gray-400'}`}>
            Undo
          </Text>
        </TouchableOpacity>

        {/* 結束牌局 */}
        <TouchableOpacity
          onPress={onFinish}
          className="bg-red-600 active:bg-red-500 px-4 py-2 rounded-lg flex-1 items-center"
        >
          <Text className="text-white font-bold">結束牌局</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
