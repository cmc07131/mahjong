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

// 視覺化顏色調色盤
export const COLOR_PALETTE: {
  category: string;
  colors: { name: string; hex: string }[];
}[] = [
  {
    category: '綠色系',
    colors: [
      { name: '深綠', hex: '#1B5E20' },
      { name: '墨綠', hex: '#004d40' },
      { name: '草綠', hex: '#2E7D32' },
      { name: '翠綠', hex: '#388E3C' },
      { name: '淺綠', hex: '#4CAF50' },
      { name: '薄荷', hex: '#66BB6A' },
    ],
  },
  {
    category: '藍色系',
    colors: [
      { name: '深藍', hex: '#0d47a1' },
      { name: '寶藍', hex: '#1565C0' },
      { name: '天藍', hex: '#1976D2' },
      { name: '湖藍', hex: '#1E88E5' },
      { name: '淺藍', hex: '#42A5F5' },
      { name: '粉藍', hex: '#64B5F6' },
    ],
  },
  {
    category: '棕色系',
    colors: [
      { name: '深棕', hex: '#3E2723' },
      { name: '咖啡', hex: '#4E342E' },
      { name: '木質', hex: '#5D4037' },
      { name: '淺棕', hex: '#6D4C41' },
      { name: '米棕', hex: '#795548' },
      { name: '奶茶', hex: '#8D6E63' },
    ],
  },
  {
    category: '紅色系',
    colors: [
      { name: '深紅', hex: '#B71C1C' },
      { name: '酒紅', hex: '#C62828' },
      { name: '正紅', hex: '#D32F2F' },
      { name: '磚紅', hex: '#E53935' },
      { name: '亮紅', hex: '#EF5350' },
      { name: '粉紅', hex: '#E57373' },
    ],
  },
  {
    category: '紫色系',
    colors: [
      { name: '深紫', hex: '#4A148C' },
      { name: '紫羅蘭', hex: '#6A1B9A' },
      { name: '葡萄紫', hex: '#7B1FA2' },
      { name: '薰衣草', hex: '#8E24AA' },
      { name: '淡紫', hex: '#AB47BC' },
      { name: '粉紫', hex: '#CE93D8' },
    ],
  },
  {
    category: '灰色系',
    colors: [
      { name: '炭黑', hex: '#212121' },
      { name: '深灰', hex: '#424242' },
      { name: '中灰', hex: '#616161' },
      { name: '淺灰', hex: '#9E9E9E' },
      { name: '銀灰', hex: '#BDBDBD' },
      { name: '白灰', hex: '#E0E0E0' },
    ],
  },
];
