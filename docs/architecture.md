# 香港麻將計分 App 技術架構文件

## 1. 技術選型建議

### 1.1 前端框架

**建議：React Native + Expo**

| 選項 | 優點 | 缺點 |
|------|------|------|
| **React Native + Expo** ✅ | 跨平台、開發效率高、Hot Reload、生態系成熟 | 效能略遜原生 |
| Flutter | 效能佳、UI 一致性高 | 需學習 Dart、生態系較小 |
| Swift (Native) | 最佳 iOS 效能與整合 | 僅支援 iOS、開發成本高 |
| PWA | 開發最快、跨平台 | iOS 支援有限、離線功能受限 |

**選擇理由**：
- iOS 優先但保留 Android 擴展彈性
- Expo 提供 OTA 更新功能，方便快速迭代
- 開發效率高，適合小型專案
- 社群資源豐富

### 1.2 狀態管理方案

**建議：Zustand + AsyncStorage**

```
┌─────────────────────────────────────────┐
│              Zustand Store              │
│  ┌─────────────────────────────────┐   │
│  │      Game State                 │   │
│  │  - players                      │   │
│  │  - currentRound                 │   │
│  │  - roundHistory                 │   │
│  │  - dealerIndex                  │   │
│  │  - prevailingWind               │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      UI State                   │   │
│  │  - currentScreen                │   │
│  │  - modalVisible                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│           AsyncStorage                  │
│        (持久化儲存)                      │
└─────────────────────────────────────────┘
```

**選擇理由**：
- Zustand 輕量、API 簡潔、學習曲線低
- 內建 middleware 支援持久化
- 不需 Provider 包裝，使用方便
- 適合小型應用的狀態管理需求

### 1.3 CSS 框架/樣式方案

**建議：NativeWind (Tailwind CSS for React Native)**

**選擇理由**：
- 使用熟悉的 Tailwind CSS 語法
- 響應式設計支援佳
- 樣式與元件分離清晰
- 社群活躍、文件完善

**替代方案**：StyleSheet (React Native 內建) - 若追求最小依賴

---

## 2. 資料結構設計

### 2.1 Player 資料結構

```typescript
interface Player {
  id: string;                    // 唯一識別碼
  name: string;                  // 玩家姓名
  position: Wind;                // 當前座位風位 (東南西北)
  score: number;                 // 累計分數 (正為贏，負為輸)
  isDealer: boolean;             // 是否為莊家
}

type Wind = 'EAST' | 'SOUTH' | 'WEST' | 'NORTH';
```

### 2.2 Game 狀態結構

```typescript
interface GameState {
  // 遊戲設定
  id: string;                    // 遊戲唯一識別碼
  createdAt: Date;               // 建立時間
  unitAmount: number;            // 每單位金額 (如: 10元)
  
  // 玩家資訊
  players: Player[];             // 四位玩家 (依座位順序: 東南西北)
  dealerIndex: number;           // 當前莊家索引 (0-3)
  prevailingWind: Wind;          // 當前圈風
  
  // 回合記錄
  rounds: Round[];               // 所有已完成的回合
  currentRound: CurrentRound | null;  // 當前進行中的回合
  
  // 遊戲狀態
  status: GameStatus;            // 遊戲狀態
  roundCount: number;            // 總回合數
}

type GameStatus = 'SETUP' | 'PLAYING' | 'SETTLED';

// 圈風順序
const WIND_ORDER: Wind[] = ['EAST', 'SOUTH', 'WEST', 'NORTH'];
```

### 2.3 Round 記錄結構

```typescript
interface Round {
  id: string;                    // 回合唯一識別碼
  roundNumber: number;           // 回合編號
  
  // 食糊資訊
  winnerId: string;              // 贏家 ID
  winType: WinType;              // 食糊類型
  fan: number;                   // 番數 (1-5)
  
  // 輸家資訊
  loserIds: string[];            // 輸家 ID 陣列 (自摸三家或出銃一人)
  
  // 金額計算
  baseAmount: number;            // 基礎金額 (番數轉換後)
  totalAmount: number;           // 總金額
  
  // 莊家資訊
  dealerId: string;              // 該回合莊家 ID
  isDealerWin: boolean;          // 莊家是否食糊
  isDraw: boolean;               // 是否流局
  
  // 分數變動記錄
  scoreChanges: ScoreChange[];   // 各玩家分數變動
  
  // 時間戳記
  createdAt: Date;
}

type WinType = 'SELF_DRAW' | 'RON';  // 自摸 | 出銃

interface ScoreChange {
  playerId: string;
  change: number;                // 正為獲得，負為失去
}

interface CurrentRound {
  // 暫存的當前回合輸入
  winnerId: string | null;
  winType: WinType | null;
  fan: number | null;
  loserIds: string[];
}
```

### 2.4 歷史記錄結構 (用於 Undo)

```typescript
interface GameSnapshot {
  id: string;
  timestamp: Date;
  
  // 完整遊戲狀態快照
  state: {
    players: Player[];
    dealerIndex: number;
    prevailingWind: Wind;
    rounds: Round[];
    roundCount: number;
  };
  
  // 操作描述
  action: UndoableAction;
}

type UndoableAction = 
  | { type: 'WIN'; roundId: string }
  | { type: 'DRAW'; roundId: string }
  | { type: 'START_GAME' };

// Undo Stack 結構
interface UndoState {
  snapshots: GameSnapshot[];     // 歷史快照堆疊
  maxSnapshots: number;          // 最大快照數量 (建議: 20)
}
```

---

## 3. 元件架構

### 3.1 畫面元件樹狀圖

```
App
├── StoreProvider
│   └── NavigationContainer
│       ├── SetupScreen (開局畫面)
│       │   ├── Header
│       │   │   └── Title
│       │   ├── PlayerInputList
│       │   │   └── PlayerInput (x4)
│       │   ├── UnitAmountInput
│       │   └── StartGameButton
│       │
│       ├── GameScreen (主畫面 - 麻將桌)
│       │   ├── Header
│       │   │   ├── PrevailingWindIndicator
│       │   │   ├── RoundCounter
│       │   │   └── UndoButton
│       │   │
│       │   ├── MahjongTable
│       │   │   ├── PlayerPosition (x4)
│       │   │   │   ├── PlayerName
│       │   │   │   ├── PlayerScore
│       │   │   │   ├── DealerBadge
│       │   │   │   └── WindIndicator
│       │   │   │
│       │   │   └── CenterArea
│       │   │       └── ActionButtons
│       │   │
│       │   ├── WinInputModal
│       │   │   ├── WinnerSelector
│       │   │   ├── WinTypeSelector
│       │   │   ├── FanSelector
│       │   │   ├── LoserSelector (條件顯示)
│       │   │   └── ConfirmButton
│       │   │
│       │   └── DrawButton
│       │
│       └── SettlementScreen (結算畫面)
│           ├── Header
│           │   └── Title
│           ├── FinalScoreList
│           │   └── PlayerScoreCard (x4)
│           ├── SettlementList
│           │   └── SettlementItem (最簡化找數)
│           ├── GameSummary
│           │   ├── TotalRounds
│           │   └── GameDuration
│           └── ActionButtons
│               ├── NewGameButton
│               └── BackToGameButton
```

### 3.2 共用元件列表

| 元件名稱 | 用途 | Props |
|---------|------|-------|
| `Button` | 通用按鈕 | `onPress, variant, disabled, children` |
| `Card` | 卡片容器 | `children, padding` |
| `Badge` | 標籤徽章 | `text, variant` |
| `Modal` | 彈窗容器 | `visible, onClose, children` |
| `PlayerAvatar` | 玩家頭像 | `name, isDealer, wind` |
| `ScoreDisplay` | 分數顯示 | `score, unit` |
| `FanButton` | 番數選擇按鈕 | `fan, selected, onPress` |
| `WindIcon` | 風位圖示 | `wind, size` |
| `NumberInput` | 數字輸入框 | `value, onChange, min, max` |
| `ConfirmDialog` | 確認對話框 | `title, message, onConfirm, onCancel` |

---

## 4. 核心演算法設計

### 4.1 計分演算法

```typescript
// 番數轉換表
const FAN_MULTIPLIER: Record<number, number> = {
  1: 1,   // 1番 = 1單位
  2: 2,   // 2番 = 2單位
  3: 4,   // 3番 = 4單位
  4: 8,   // 4番 = 8單位
  5: 16,  // 5番 = 16單位
};

function calculateScore(
  fan: number,
  winType: WinType,
  unitAmount: number
): ScoreResult {
  const baseUnit = FAN_MULTIPLIER[fan];
  const baseAmount = baseUnit * unitAmount;
  
  if (winType === 'SELF_DRAW') {
    // 自摸：三家各付
    return {
      perPlayer: baseAmount,
      total: baseAmount * 3,
      distribution: 'THREE_PLAYERS',
    };
  } else {
    // 出銃：一人支付
    return {
      perPlayer: baseAmount * 3,
      total: baseAmount * 3,
      distribution: 'ONE_PLAYER',
    };
  }
}

interface ScoreResult {
  perPlayer: number;      // 每人支付金額
  total: number;          // 總金額
  distribution: 'THREE_PLAYERS' | 'ONE_PLAYER';
}
```

**計分流程圖**：

```
┌─────────────┐
│ 輸入番數    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ 查表取得    │────►│ 1→1, 2→2   │
│ 基礎單位    │     │ 3→4, 4→8   │
└──────┬──────┘     │ 5→16       │
       │            └─────────────┘
       ▼
┌─────────────┐
│ 乘以單位金額│
│ 得到基礎金額│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 判斷食糊類型│
└──────┬──────┘
       │
    ┌──┴──┐
    │     │
    ▼     ▼
┌──────┐ ┌──────┐
│ 自摸 │ │ 出銃 │
└──┬───┘ └──┬───┘
   │        │
   ▼        ▼
┌──────┐ ┌──────┐
│三家各│ │一人付│
│付基礎│ │三倍  │
│金額  │ │基礎  │
└──────┘ └──────┘
```

### 4.2 轉莊演算法

```typescript
function processDealerChange(
  gameState: GameState,
  winnerId: string,
  isDraw: boolean
): DealerChangeResult {
  const { players, dealerIndex, prevailingWind } = gameState;
  const dealer = players[dealerIndex];
  const isDealerWin = winnerId === dealer.id;
  
  if (isDraw) {
    // 流局：過莊
    return {
      newDealerIndex: (dealerIndex + 1) % 4,
      newPrevailingWind: calculateNewWind(dealerIndex, prevailingWind),
      action: 'PASS',
    };
  }
  
  if (isDealerWin) {
    // 莊家食糊：連莊
    return {
      newDealerIndex: dealerIndex,
      newPrevailingWind: prevailingWind,
      action: 'CONTINUE',
    };
  }
  
  // 閒家食糊：過莊
  return {
    newDealerIndex: (dealerIndex + 1) % 4,
    newPrevailingWind: calculateNewWind(dealerIndex, prevailingWind),
    action: 'PASS',
  };
}

function calculateNewWind(
  currentDealerIndex: number,
  currentWind: Wind
): Wind {
  // 當莊家索引為 3 (北家) 且要過莊時，圈風改變
  if (currentDealerIndex === 3) {
    const windIndex = WIND_ORDER.indexOf(currentWind);
    return WIND_ORDER[(windIndex + 1) % 4];
  }
  return currentWind;
}
```

**轉莊流程圖**：

```
           ┌──────────────┐
           │   食糊/流局   │
           └───────┬──────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐         ┌─────────┐
    │  流局   │         │  食糊   │
    └────┬────┘         └────┬────┘
         │                   │
         │         ┌─────────┴─────────┐
         │         │                   │
         │         ▼                   ▼
         │    ┌──────────┐       ┌──────────┐
         │    │莊家食糊  │       │閒家食糊  │
         │    └────┬─────┘       └────┬─────┘
         │         │                   │
         ▼         ▼                   ▼
    ┌────────┐ ┌────────┐         ┌────────┐
    │ 過莊   │ │ 連莊   │         │ 過莊   │
    └────┬───┘ └────────┘         └────┬───┘
         │                             │
         └──────────┬──────────────────┘
                    │
                    ▼
           ┌────────────────┐
           │ 莊家位置 = 北? │
           └───────┬────────┘
                   │
            ┌──────┴──────┐
            │             │
            ▼             ▼
       ┌────────┐    ┌────────┐
       │ 是     │    │ 否     │
       └───┬────┘    └───┬────┘
           │             │
           ▼             ▼
    ┌──────────────┐ ┌──────────────┐
    │ 圈風+1       │ │ 圈風不變     │
    │ 東→南→西→北 │ │              │
    └──────────────┘ └──────────────┘
```

### 4.3 最簡化找數演算法 (債務抵銷)

**目標**：將多筆債務關係簡化為最少交易次數

```typescript
interface Settlement {
  from: string;      // 付款者 ID
  to: string;        // 收款者 ID
  amount: number;    // 金額
}

function calculateSettlement(players: Player[]): Settlement[] {
  // Step 1: 計算每人淨額
  const netAmounts = players.map(player => ({
    id: player.id,
    name: player.name,
    net: player.score,  // 正為應收，負為應付
  }));
  
  // Step 2: 分離債權人與債務人
  const creditors = netAmounts.filter(p => p.net > 0).sort((a, b) => b.net - a.net);
  const debtors = netAmounts.filter(p => p.net < 0).sort((a, b) => a.net - b.net);
  
  // Step 3: 貪婪配對演算法
  const settlements: Settlement[] = [];
  
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const amount = Math.min(creditor.net, -debtor.net);
    
    if (amount > 0) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: amount,
      });
    }
    
    creditor.net -= amount;
    debtor.net += amount;
    
    if (creditor.net === 0) i++;
    if (debtor.net === 0) j++;
  }
  
  return settlements;
}
```

**演算法示意圖**：

```
原始狀態 (4人分數):
┌────────────────────────────────────┐
│ A: +30  (贏家)                     │
│ B: -20  (輸家)                     │
│ C: +10  (小贏)                     │
│ D: -20  (輸家)                     │
└────────────────────────────────────┘
              │
              ▼
Step 1: 計算淨額
┌────────────────────────────────────┐
│ 債權人: A(+30), C(+10)             │
│ 債務人: B(-20), D(-20)             │
└────────────────────────────────────┘
              │
              ▼
Step 2: 排序
┌────────────────────────────────────┐
│ 債權人 (降序): A(+30), C(+10)      │
│ 債務人 (升序): B(-20), D(-20)      │
└────────────────────────────────────┘
              │
              ▼
Step 3: 貪婪配對
┌────────────────────────────────────┐
│ 1. B 付 A: min(30, 20) = 20        │
│    A 剩 +10, B 清償                │
│                                    │
│ 2. D 付 A: min(10, 20) = 10        │
│    A 清償, D 剩 -10                │
│                                    │
│ 3. D 付 C: min(10, 10) = 10        │
│    C 清償, D 清償                  │
└────────────────────────────────────┘
              │
              ▼
最簡化結果 (3筆交易):
┌────────────────────────────────────┐
│ B → A: $20                         │
│ D → A: $10                         │
│ D → C: $10                         │
└────────────────────────────────────┘
```

**演算法複雜度**：
- 時間複雜度：O(n log n) - 主要為排序
- 空間複雜度：O(n)
- 交易次數：最多 n-1 筆 (n 為人數)

---

## 5. 專案目錄結構建議

```
mahjong-scoring-app/
├── app/                          # Expo Router 路由
│   ├── _layout.tsx               # 根佈局
│   ├── index.tsx                 # 首頁 (開局畫面)
│   ├── game.tsx                  # 遊戲主畫面
│   └── settlement.tsx            # 結算畫面
│
├── src/
│   ├── components/               # 元件
│   │   ├── common/               # 共用元件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── setup/                # 開局畫面元件
│   │   │   ├── PlayerInput.tsx
│   │   │   ├── PlayerInputList.tsx
│   │   │   ├── UnitAmountInput.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── game/                 # 遊戲畫面元件
│   │   │   ├── MahjongTable.tsx
│   │   │   ├── PlayerPosition.tsx
│   │   │   ├── WinInputModal.tsx
│   │   │   ├── FanSelector.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── settlement/           # 結算畫面元件
│   │       ├── FinalScoreList.tsx
│   │       ├── SettlementList.tsx
│   │       ├── SettlementItem.tsx
│   │       └── index.ts
│   │
│   ├── store/                    # 狀態管理
│   │   ├── gameStore.ts          # 遊戲狀態
│   │   ├── uiStore.ts            # UI 狀態
│   │   └── index.ts
│   │
│   ├── hooks/                    # 自訂 Hooks
│   │   ├── useGame.ts            # 遊戲邏輯
│   │   ├── useUndo.ts            # Undo 功能
│   │   └── index.ts
│   │
│   ├── utils/                    # 工具函數
│   │   ├── scoring.ts            # 計分演算法
│   │   ├── dealer.ts             # 轉莊演算法
│   │   ├── settlement.ts         # 找數演算法
│   │   └── index.ts
│   │
│   ├── types/                    # TypeScript 型別
│   │   ├── game.ts               # 遊戲相關型別
│   │   ├── player.ts             # 玩家相關型別
│   │   └── index.ts
│   │
│   ├── constants/                # 常數定義
│   │   ├── scoring.ts            # 番數對照表
│   │   ├── winds.ts              # 風位常數
│   │   └── index.ts
│   │
│   └── assets/                   # 靜態資源
│       ├── fonts/
│       ├── images/
│       └── icons/
│
├── docs/                         # 文件
│   └── architecture.md           # 架構文件
│
├── app.json                      # Expo 設定
├── package.json                  # 專案設定
├── tsconfig.json                 # TypeScript 設定
├── tailwind.config.js            # NativeWind 設定
└── README.md                     # 專案說明
```

---

## 6. 資料流架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │SetupScreen  │  │ GameScreen  │  │Settlement   │            │
│  │             │  │             │  │Screen       │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
└─────────┼────────────────┼────────────────┼────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Zustand Store                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Game Store                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │ Players     │  │ Rounds      │  │ Settings    │      │  │
│  │  │ - name      │  │ - history   │  │ - unitAmount│      │  │
│  │  │ - score     │  │ - current   │  │ - status    │      │  │
│  │  │ - position  │  │             │  │             │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                 │
│                              ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Undo Stack                            │  │
│  │  [Snapshot 1] → [Snapshot 2] → [Snapshot 3] → ...       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Persistence Layer                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    AsyncStorage                           │  │
│  │  - game-state-{id}                                        │  │
│  │  - game-list                                              │  │
│  │  - settings                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. 關鍵決策摘要

| 決策項目 | 選擇 | 理由 |
|---------|------|------|
| 前端框架 | React Native + Expo | iOS 優先、開發效率高、保留跨平台彈性 |
| 狀態管理 | Zustand | 輕量、簡潔、適合小型專案 |
| 樣式方案 | NativeWind | Tailwind 語法熟悉、響應式支援佳 |
| 導航方案 | Expo Router | 檔案系統路由、原生導航體驗 |
| 持久化 | AsyncStorage | 簡單可靠、適合小型資料 |
| 找數演算法 | 貪婪配對 | O(n log n)、最多 n-1 筆交易 |

---

## 8. 後續建議

1. **MVP 優先順序**：
   - Phase 1: 開局畫面 + 基本計分
   - Phase 2: 轉莊與圈風機制
   - Phase 3: Undo 功能
   - Phase 4: 結算與找數演算法

2. **測試策略**：
   - 單元測試：計分演算法、轉莊邏輯、找數演算法
   - 整合測試：完整遊戲流程
   - E2E 測試：Detox 或 Appium

3. **未來擴展**：
   - 遊戲歷史記錄查詢
   - 統計數據分析
   - 多局遊戲支援
   - 線上多人對戰

---

## 9. 比賽歷史記錄功能設計

### 9.1 資料結構設計

#### 9.1.1 MatchHistory 類型定義

```typescript
// 比賽歷史記錄摘要 (用於列表顯示)
export interface MatchHistorySummary {
  id: string;                      // 比賽唯一識別碼
  createdAt: Date;                 // 比賽開始時間
  finishedAt: Date | null;         // 比賽結束時間
  status: GameStatus;              // 比賽狀態
  
  // 玩家摘要資訊
  players: PlayerSummary[];        // 玩家列表 (含最終分數)
  
  // 比賽統計
  totalRounds: number;             // 總局數
  finalWind: Wind;                 // 最終圈風
  
  // 單位金額
  unitAmount: number;              // 每單位金額
}

// 玩家摘要資訊
export interface PlayerSummary {
  id: string;
  name: string;
  position: Wind;                  // 初始座位風位
  finalScore: number;              // 最終分數
  isWinner: boolean;               // 是否為最終贏家
}

// 完整比賽歷史記錄 (用於詳情/編輯)
export interface MatchHistoryDetail extends MatchHistorySummary {
  // 完整玩家資訊
  players: Player[];               // 完整玩家資料
  
  // 完整回合記錄
  rounds: Round[];                 // 所有回合記錄
  
  // 結算資訊
  settlements: Settlement[];       // 最簡化找數結果
  
  // 莊家資訊
  dealerIndex: number;             // 最終莊家索引
  prevailingWind: Wind;            // 最終圈風
}

// 歷史記錄列表狀態
export interface HistoryListState {
  matches: MatchHistorySummary[];
  isLoading: boolean;
  error: string | null;
  sortBy: 'date' | 'rounds';       // 排序方式
  sortOrder: 'asc' | 'desc';       // 排序順序
}
```

#### 9.1.2 與現有類型的關係

```
┌─────────────────────────────────────────────────────────────┐
│                    現有類型                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ GameState   │  │ Player      │  │ Round       │        │
│  │ - id        │  │ - id        │  │ - id        │        │
│  │ - createdAt │  │ - name      │  │ - winnerId  │        │
│  │ - players   │  │ - position  │  │ - fan       │        │
│  │ - rounds    │  │ - score     │  │ - ...       │        │
│  │ - ...       │  │ - ...       │  │             │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    新增類型                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ MatchHistorySummary │  │ MatchHistoryDetail  │          │
│  │ - id                │  │ extends Summary     │          │
│  │ - createdAt         │  │ + players: Player[] │          │
│  │ - players: Summary[]│  │ + rounds: Round[]   │          │
│  │ - totalRounds       │  │ + settlements       │          │
│  └─────────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 儲存機制設計

#### 9.2.1 儲存架構

```
┌─────────────────────────────────────────────────────────────┐
│                      AsyncStorage                            │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ mahjong-game-storage (現有)                          │   │
│  │ - 當前進行中的遊戲狀態                                │   │
│  │ - 由 gameStore 管理                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ mahjong-history-list (新增)                          │   │
│  │ - MatchHistorySummary[] 的 JSON 陣列                 │   │
│  │ - 用於列表快速載入                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ mahjong-history-{id} (新增)                          │   │
│  │ - MatchHistoryDetail 的 JSON 物件                    │   │
│  │ - 每場比賽一個 key                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.2.2 History Store 設計

```typescript
// src/store/historyStore.ts

interface HistoryStore {
  // 狀態
  matches: MatchHistorySummary[];
  currentMatch: MatchHistoryDetail | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions - 列表操作
  loadHistoryList: () => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  deleteAllMatches: () => Promise<void>;
  
  // Actions - 單場比賽操作
  loadMatchDetail: (id: string) => Promise<void>;
  saveCurrentGame: () => Promise<void>;
  updateMatch: (id: string, updates: Partial<MatchHistoryDetail>) => Promise<void>;
  
  // Actions - 編輯功能
  editMatchPlayers: (id: string, players: Player[]) => Promise<void>;
  editMatchRounds: (id: string, rounds: Round[]) => Promise<void>;
  
  // Helpers
  getMatchById: (id: string) => MatchHistorySummary | undefined;
  sortMatches: (sortBy: 'date' | 'rounds', order: 'asc' | 'desc') => void;
}

// 儲存 Key 常數
const STORAGE_KEYS = {
  HISTORY_LIST: 'mahjong-history-list',
  HISTORY_DETAIL: (id: string) => `mahjong-history-${id}`,
  CURRENT_GAME: 'mahjong-game-storage',
};
```

#### 9.2.3 儲存服務 API 設計

```typescript
// src/services/historyService.ts

interface HistoryService {
  // 列表操作
  getHistoryList(): Promise<MatchHistorySummary[]>;
  saveHistoryList(list: MatchHistorySummary[]): Promise<void>;
  
  // 單場比賽操作
  getMatchDetail(id: string): Promise<MatchHistoryDetail | null>;
  saveMatchDetail(match: MatchHistoryDetail): Promise<void>;
  deleteMatch(id: string): Promise<void>;
  
  // 從當前遊戲建立歷史記錄
  createFromCurrentGame(gameState: GameState): Promise<MatchHistoryDetail>;
  
  // 更新操作
  updateMatchSummary(id: string, summary: Partial<MatchHistorySummary>): Promise<void>;
  updateMatchDetail(id: string, detail: Partial<MatchHistoryDetail>): Promise<void>;
}

// 實作範例
export const historyService: HistoryService = {
  async getHistoryList() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY_LIST);
    return data ? JSON.parse(data) : [];
  },
  
  async saveHistoryList(list) {
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY_LIST, JSON.stringify(list));
  },
  
  async getMatchDetail(id) {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY_DETAIL(id));
    return data ? JSON.parse(data) : null;
  },
  
  async saveMatchDetail(match) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.HISTORY_DETAIL(match.id),
      JSON.stringify(match)
    );
  },
  
  async deleteMatch(id) {
    // 從列表移除
    const list = await this.getHistoryList();
    const newList = list.filter(m => m.id !== id);
    await this.saveHistoryList(newList);
    
    // 刪除詳細資料
    await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY_DETAIL(id));
  },
  
  // ... 其他方法實作
};
```

### 9.3 頁面流程設計

#### 9.3.1 頁面導航結構

```
┌─────────────────────────────────────────────────────────────┐
│                        頁面流程                              │
│                                                              │
│  ┌─────────────┐                                            │
│  │   首頁      │                                            │
│  │  index.tsx  │                                            │
│  │             │                                            │
│  │ ┌─────────┐ │     ┌─────────────┐                       │
│  │ │歷史列表 │──────►│ 比賽詳情    │                       │
│  │ └─────────┘ │     │ history/    │                       │
│  │             │     │ [id].tsx    │                       │
│  │ ┌─────────┐ │     └──────┬──────┘                       │
│  │ │新遊戲   │──┼───────────┼──────────────────────┐       │
│  │ └─────────┘ │           │                      │       │
│  └─────────────┘           ▼                      ▼       │
│                     ┌─────────────┐        ┌─────────────┐ │
│                     │ 編輯比賽    │        │ 設定畫面    │ │
│                     │ history/    │        │ setup.tsx   │ │
│                     │ [id]/edit   │        └──────┬──────┘ │
│                     └─────────────┘               │        │
│                                                  ▼        │
│                                           ┌─────────────┐ │
│                                           │ 遊戲畫面    │ │
│                                           │ game.tsx    │ │
│                                           └──────┬──────┘ │
│                                                  │        │
│                                                  ▼        │
│                                           ┌─────────────┐ │
│                                           │ 結算畫面    │ │
│                                           │ settlement  │ │
│                                           └─────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.3.2 首頁設計

```
┌─────────────────────────────────────────────────────────────┐
│                         首頁                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Header                                               │   │
│  │ ┌───────────────┐  ┌───────────────┐                │   │
│  │ │ 麻將計分      │  │ 排序按鈕      │                │   │
│  │ └───────────────┘  └───────────────┘                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 新遊戲按鈕 (主要 CTA)                                │   │
│  │ [  +  開始新局  ]                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 歷史記錄標題                                         │   │
│  │ 歷史記錄                                    查看全部 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ MatchHistoryList                                     │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ MatchHistoryCard                                 │ │   │
│  │ │ ┌─────────┐  ┌─────────────────────────────┐   │ │   │
│  │ │ │ 日期    │  │ 玩家: A, B, C, D            │   │ │   │
│  │ │ │ 03/17   │  │ 局數: 8 局                   │   │ │   │
│  │ │ │ 14:30   │  │ 贏家: A (+$120)              │   │ │   │
│  │ │ └─────────┘  └─────────────────────────────┘   │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ MatchHistoryCard                                 │ │   │
│  │ │ ...                                               │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ 空狀態 (無歷史記錄)                              │ │   │
│  │ │ [圖示]                                          │ │   │
│  │ │ 尚無比賽記錄                                     │ │   │
│  │ │ 開始你的第一場比賽吧！                           │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 進行中的遊戲 (條件顯示)                              │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ 🎮 繼續遊戲                                      │ │   │
│  │ │ 玩家: A, B, C, D  |  第 5 局                    │ │   │
│  │ │ [繼續]                           [放棄]         │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.3.3 比賽詳情頁面設計

```
┌─────────────────────────────────────────────────────────────┐
│                      比賽詳情頁                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Header                                               │   │
│  │ ┌─────┐  比賽詳情                    ┌───────────┐  │   │
│  │ │ ←   │                              │ 編輯 | 刪除│  │   │
│  │ └─────┘                              └───────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 比賽資訊卡片                                         │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ 日期: 2024/03/17 14:30                          │ │   │
│  │ │ 總局數: 8 局                                     │ │   │
│  │ │ 單位金額: $10                                    │ │   │
│  │ │ 最終圈風: 南風                                   │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 最終分數                                             │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ 🏆 A: +$120  (東)                               │ │   │
│  │ │    B: -$30   (南)                               │ │   │
│  │ │    C: -$50   (西)                               │ │   │
│  │ │    D: -$40   (北)                               │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 結算明細                                             │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ B → A: $30                                       │ │   │
│  │ │ D → A: $90                                       │ │   │
│  │ │ D → C: $50                                       │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 回合記錄 (可展開)                                    │   │
│  │ ┌─────────────────────────────────────────────────┐ │   │
│  │ │ ▼ 第 1 局 - A 自摸 3 番                         │ │   │
│  │ │   莊家: A (連莊)                                │ │   │
│  │ │   A: +$120, B: -$40, C: -$40, D: -$40          │ │   │
│  │ ├─────────────────────────────────────────────────┤ │   │
│  │ │ ▶ 第 2 局 - B 出銃 2 番                         │ │   │
│  │ ├─────────────────────────────────────────────────┤ │   │
│  │ │ ▶ 第 3 局 - 流局                               │ │   │
│  │ └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.3.4 刪除確認流程

```
┌─────────────────────────────────────────────────────────────┐
│                      刪除確認流程                            │
│                                                              │
│  用戶點擊刪除                                                │
│       │                                                      │
│       ▼                                                      │
│  ┌─────────────┐                                            │
│  │ 彈出確認對話框│                                            │
│  │             │                                            │
│  │ 確定要刪除  │                                            │
│  │ 這場比賽嗎？│                                            │
│  │             │                                            │
│  │ [取消][刪除]│                                            │
│  └──────┬──────┘                                            │
│         │                                                    │
│    ┌────┴────┐                                               │
│    │         │                                               │
│    ▼         ▼                                               │
│ [取消]    [刪除]                                             │
│    │         │                                               │
│    ▼         ▼                                               │
│ 關閉對話框  執行刪除                                          │
│              │                                               │
│              ▼                                               │
│        ┌─────────────┐                                       │
│        │ 顯示載入中  │                                       │
│        └──────┬──────┘                                       │
│               │                                              │
│               ▼                                              │
│        ┌─────────────┐                                       │
│        │ 刪除成功    │                                       │
│        │ 返回首頁    │                                       │
│        └─────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 9.4 組件設計

#### 9.4.1 新增組件列表

| 組件名稱 | 用途 | Props | 位置 |
|---------|------|-------|------|
| `MatchHistoryCard` | 單場比賽卡片 | `match: MatchHistorySummary, onPress: () => void` | `src/components/history/` |
| `MatchHistoryList` | 歷史記錄列表 | `matches: MatchHistorySummary[], onItemPress: (id: string) => void` | `src/components/history/` |
| `MatchDetailHeader` | 詳情頁標題 | `match: MatchHistoryDetail, onEdit: () => void, onDelete: () => void` | `src/components/history/` |
| `MatchInfoCard` | 比賽資訊卡片 | `match: MatchHistoryDetail` | `src/components/history/` |
| `FinalScoreCard` | 最終分數卡片 | `players: Player[]` | `src/components/history/` |
| `RoundHistoryList` | 回合記錄列表 | `rounds: Round[], players: Player[]` | `src/components/history/` |
| `RoundHistoryItem` | 單局記錄項目 | `round: Round, players: Player[], isExpanded: boolean` | `src/components/history/` |
| `DeleteConfirmModal` | 刪除確認彈窗 | `visible: boolean, onConfirm: () => void, onCancel: () => void` | `src/components/common/` |
| `EmptyState` | 空狀態顯示 | `icon: string, title: string, description: string` | `src/components/common/` |
| `CurrentGameCard` | 進行中遊戲卡片 | `onContinue: () => void, onAbandon: () => void` | `src/components/history/` |

#### 9.4.2 組件 Props 詳細定義

```typescript
// src/components/history/MatchHistoryCard.tsx
interface MatchHistoryCardProps {
  match: MatchHistorySummary;
  onPress: () => void;
  variant?: 'default' | 'compact';  // 顯示模式
}

// src/components/history/MatchHistoryList.tsx
interface MatchHistoryListProps {
  matches: MatchHistorySummary[];
  onItemPress: (id: string) => void;
  isLoading?: boolean;
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
}

// src/components/history/MatchDetailHeader.tsx
interface MatchDetailHeaderProps {
  match: MatchHistoryDetail;
  onEdit: () => void;
  onDelete: () => void;
  showActions?: boolean;  // 是否顯示編輯/刪除按鈕
}

// src/components/history/RoundHistoryList.tsx
interface RoundHistoryListProps {
  rounds: Round[];
  players: Player[];
  defaultExpanded?: boolean;  // 預設是否展開
  onRoundPress?: (round: Round) => void;
}

// src/components/common/DeleteConfirmModal.tsx
interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// src/components/common/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// src/components/history/CurrentGameCard.tsx
interface CurrentGameCardProps {
  gameState: GameState;
  onContinue: () => void;
  onAbandon: () => void;
}
```

#### 9.4.3 組件樹狀結構

```
首頁 (app/index.tsx)
├── Header
│   ├── Title
│   └── SortButton
├── NewGameButton
├── CurrentGameCard (條件顯示)
│   ├── GameInfo
│   └── ActionButtons
│       ├── ContinueButton
│       └── AbandonButton
└── MatchHistoryList
    ├── EmptyState (無資料時)
    │   ├── Icon
    │   ├── Title
    │   └── Description
    └── MatchHistoryCard (多個)
        ├── DateSection
        │   ├── DateText
        │   └── TimeText
        └── InfoSection
            ├── PlayerNames
            ├── RoundCount
            └── WinnerInfo

比賽詳情頁 (app/history/[id].tsx)
├── MatchDetailHeader
│   ├── BackButton
│   ├── Title
│   └── ActionButtons
│       ├── EditButton
│       └── DeleteButton
├── ScrollView
│   ├── MatchInfoCard
│   │   ├── DateRow
│   │   ├── RoundCountRow
│   │   ├── UnitAmountRow
│   │   └── FinalWindRow
│   ├── FinalScoreCard
│   │   └── PlayerScoreItem (x4)
│   ├── SettlementCard
│   │   └── SettlementItem (多個)
│   └── RoundHistoryList
│       └── RoundHistoryItem (多個)
│           ├── Header (可點擊展開)
│           │   ├── RoundNumber
│           │   ├── WinInfo
│           │   └── ExpandIcon
│           └── ExpandedContent
│               ├── DealerInfo
│               └── ScoreChanges
└── DeleteConfirmModal (條件顯示)
    ├── Title
    ├── Message
    └── Buttons
        ├── CancelButton
        └── ConfirmButton
```

### 9.5 API 設計

#### 9.5.1 History Service API

```typescript
// src/services/historyService.ts

export const historyService = {
  // ============ 列表操作 ============
  
  /**
   * 取得所有歷史記錄摘要列表
   */
  getHistoryList(): Promise<MatchHistorySummary[]>;
  
  /**
   * 儲存歷史記錄列表
   */
  saveHistoryList(list: MatchHistorySummary[]): Promise<void>;
  
  // ============ 單場比賽操作 ============
  
  /**
   * 取得單場比賽詳細資訊
   */
  getMatchDetail(id: string): Promise<MatchHistoryDetail | null>;
  
  /**
   * 儲存單場比賽詳細資訊
   */
  saveMatchDetail(match: MatchHistoryDetail): Promise<void>;
  
  /**
   * 刪除單場比賽
   */
  deleteMatch(id: string): Promise<void>;
  
  /**
   * 從當前遊戲狀態建立歷史記錄
   */
  createFromCurrentGame(gameState: GameState): Promise<MatchHistoryDetail>;
  
  // ============ 更新操作 ============
  
  /**
   * 更新比賽摘要資訊
   */
  updateMatchSummary(
    id: string,
    updates: Partial<MatchHistorySummary>
  ): Promise<void>;
  
  /**
   * 更新比賽詳細資訊
   */
  updateMatchDetail(
    id: string,
    updates: Partial<MatchHistoryDetail>
  ): Promise<void>;
  
  // ============ 編輯功能 ============
  
  /**
   * 編輯玩家資訊
   */
  editMatchPlayers(
    id: string,
    players: Player[]
  ): Promise<void>;
  
  /**
   * 編輯回合記錄
   */
  editMatchRounds(
    id: string,
    rounds: Round[]
  ): Promise<void>;
  
  // ============ 工具方法 ============
  
  /**
   * 檢查比賽是否存在
   */
  matchExists(id: string): Promise<boolean>;
  
  /**
   * 取得比賽數量
   */
  getMatchCount(): Promise<number>;
  
  /**
   * 清除所有歷史記錄
   */
  clearAllHistory(): Promise<void>;
};
```

#### 9.5.2 History Store API

```typescript
// src/store/historyStore.ts

interface HistoryStore {
  // ============ 狀態 ============
  matches: MatchHistorySummary[];
  currentMatch: MatchHistoryDetail | null;
  isLoading: boolean;
  error: string | null;
  sortBy: 'date' | 'rounds';
  sortOrder: 'asc' | 'desc';
  
  // ============ 列表 Actions ============
  
  /**
   * 載入歷史記錄列表
   */
  loadHistoryList: () => Promise<void>;
  
  /**
   * 排序歷史記錄
   */
  sortMatches: (sortBy: 'date' | 'rounds', order: 'asc' | 'desc') => void;
  
  /**
   * 刪除單場比賽
   */
  deleteMatch: (id: string) => Promise<void>;
  
  /**
   * 刪除所有比賽
   */
  deleteAllMatches: () => Promise<void>;
  
  // ============ 詳情 Actions ============
  
  /**
   * 載入單場比賽詳情
   */
  loadMatchDetail: (id: string) => Promise<void>;
  
  /**
   * 清除當前比賽詳情
   */
  clearCurrentMatch: () => void;
  
  // ============ 儲存 Actions ============
  
  /**
   * 儲存當前遊戲為歷史記錄
   */
  saveCurrentGame: () => Promise<void>;
  
  /**
   * 更新比賽資訊
   */
  updateMatch: (id: string, updates: Partial<MatchHistoryDetail>) => Promise<void>;
  
  // ============ 編輯 Actions ============
  
  /**
   * 編輯玩家名稱
   */
  editPlayerName: (matchId: string, playerId: string, newName: string) => Promise<void>;
  
  /**
   * 刪除特定回合
   */
  deleteRound: (matchId: string, roundId: string) => Promise<void>;
  
  // ============ Selectors ============
  
  /**
   * 根據 ID 取得比賽摘要
   */
  getMatchById: (id: string) => MatchHistorySummary | undefined;
  
  /**
   * 取得排序後的列表
   */
  getSortedMatches: () => MatchHistorySummary[];
  
  /**
   * 取得最近的比賽
   */
  getRecentMatches: (count: number) => MatchHistorySummary[];
}
```

### 9.6 檔案結構更新

```
mahjong-scoring-app/
├── app/
│   ├── index.tsx                 # 首頁 (更新: 顯示歷史列表)
│   ├── setup.tsx
│   ├── game.tsx
│   ├── settlement.tsx
│   └── history/                  # 新增目錄
│       ├── [id].tsx              # 比賽詳情頁
│       └── [id]/
│           └── edit.tsx          # 編輯頁面 (可選)
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── DeleteConfirmModal.tsx  # 新增
│   │   │   ├── EmptyState.tsx          # 新增
│   │   │   └── index.ts                # 更新
│   │   │
│   │   ├── history/              # 新增目錄
│   │   │   ├── MatchHistoryCard.tsx
│   │   │   ├── MatchHistoryList.tsx
│   │   │   ├── MatchDetailHeader.tsx
│   │   │   ├── MatchInfoCard.tsx
│   │   │   ├── FinalScoreCard.tsx
│   │   │   ├── RoundHistoryList.tsx
│   │   │   ├── RoundHistoryItem.tsx
│   │   │   ├── CurrentGameCard.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── ...
│   │
│   ├── store/
│   │   ├── gameStore.ts
│   │   ├── historyStore.ts       # 新增
│   │   └── index.ts
│   │
│   ├── services/                 # 新增目錄
│   │   ├── historyService.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── index.ts              # 更新: 新增 MatchHistory 類型
│   │   └── history.ts            # 新增: 歷史記錄相關類型
│   │
│   └── ...
│
└── ...
```

### 9.7 實作優先順序建議

1. **Phase 1: 基礎架構**
   - 新增 `MatchHistorySummary` 和 `MatchHistoryDetail` 類型定義
   - 建立 `historyService` 基礎 API
   - 建立 `historyStore` 基礎結構

2. **Phase 2: 首頁列表**
   - 實作 `MatchHistoryCard` 組件
   - 實作 `MatchHistoryList` 組件
   - 更新首頁顯示歷史列表
   - 實作儲存當前遊戲功能

3. **Phase 3: 詳情頁面**
   - 建立詳情頁路由
   - 實作各詳情組件
   - 實作回合記錄展開功能

4. **Phase 4: 編輯與刪除**
   - 實作刪除確認流程
   - 實作編輯玩家名稱功能
   - 實作編輯回合記錄功能 (可選)
