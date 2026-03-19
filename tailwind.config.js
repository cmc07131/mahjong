/** @type {import('tailwindcss').Config} */
module.exports = {
  // 重要：添加 NativeWind preset
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 麻將相關顏色
        mahjong: {
          green: '#2D5016',
          red: '#C41E3A',
          blue: '#1E3A5F',
          white: '#FAFAFA',
          bamboo: '#228B22',
          character: '#DC143C',
          dot: '#1E90FF',
        },
        // 風位顏色
        wind: {
          east: '#DC143C',   // 東 - 紅
          south: '#228B22',  // 南 - 綠
          west: '#FFFFFF',   // 西 - 白
          north: '#1E3A5F',  // 北 - 藍
        },
        // 遊戲狀態顏色
        game: {
          win: '#22C55E',
          lose: '#EF4444',
          draw: '#F59E0B',
          dealer: '#FFD700',
        },
      },
      fontFamily: {
        chinese: ['PingFang TC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
