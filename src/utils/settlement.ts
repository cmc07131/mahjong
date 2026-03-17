// Settlement utility functions will be placed here

import { Player } from '../types';

export interface Settlement {
  from: string;      // 付款者 ID
  to: string;        // 收款者 ID
  amount: number;    // 金額
}

/**
 * 最簡化找數演算法 (債務抵銷)
 * 將多筆債務關係簡化為最少交易次數
 */
export function calculateSettlement(players: Player[]): Settlement[] {
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
