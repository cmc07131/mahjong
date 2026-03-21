import { TableShape } from '../store/tableStore';

// 桌面形狀選項
export const TABLE_SHAPES: { 
  shape: TableShape; 
  name: string; 
  description: string; 
  icon: string;
}[] = [
  {
    shape: 'round',
    name: '經典圓桌',
    description: '傳統圓形麻將桌',
    icon: '⭕',
  },
  {
    shape: 'square',
    name: '方形實桌',
    description: '模擬真實方形麻將桌',
    icon: '⬜',
  },
];

// 預設桌面顏色
export const PRESET_TABLE_COLORS: { 
  name: string; 
  surface: string; 
  frame: string;
}[] = [
  { name: '經典綠', surface: '#1B5E20', frame: '#5D4037' },
  { name: '深藍', surface: '#0d47a1', frame: '#37474f' },
  { name: '墨綠', surface: '#004d40', frame: '#1a237e' },
  { name: '酒紅', surface: '#4a148c', frame: '#311b92' },
  { name: '深灰', surface: '#263238', frame: '#1a1a1a' },
];

// 顏色驗證函數
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}