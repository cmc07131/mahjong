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
        // Retro Luxury - Emerald Green Palette
        emerald: {
          950: '#0a1f1a',  // Darkest - background top
          900: '#0d2920',  // Dark - background gradient
          800: '#134d3a',  // Medium dark - table surface
          700: '#1a6b4f',  // Medium - velvet texture
          600: '#228b6b',  // Medium light - button default
          500: '#2db07e',  // Light - highlights
          400: '#4dc896',  // Lighter
          300: '#7dddb5',  // Lightest
        },
        // Retro Luxury - Gold Accent Palette
        gold: {
          900: '#8B6914',  // Dark gold - shadows
          700: '#B8860B',  // Medium dark
          500: '#D4AF37',  // Classic gold - primary
          400: '#E5C158',  // Light gold
          300: '#F0D77A',  // Lighter
          200: '#F7E7A8',  // Very light
          100: '#FDF6E3',  // Lightest - shine
        },
        // Retro Luxury - UI Colors
        luxury: {
          velvet: '#0d2920',
          felt: '#1a4d3a',
          shadow: '#061208',
          goldRing: '#D4AF37',
          goldShine: '#F7E7A8',
        },
        // Score Colors
        score: {
          win: '#22c55e',   // Green for positive
          lose: '#ef4444',  // Red for negative
          neutral: '#ffffff',
        },
      },
      fontFamily: {
        chinese: ['PingFang TC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
