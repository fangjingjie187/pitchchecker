/** @type {import('tailwindcss').Config} */
// 视觉方向：明亮活泼 —— 青蓝（主）+ 珊瑚（强调），单一浅色主题，无暗色模式
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 青蓝 —— 主色：信任、理性、清澈
        brand: {
          50: '#EFF9FE',
          100: '#DCF1FC',
          200: '#B8E4F9',
          300: '#86D2F4',
          400: '#45B7EA',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // 珊瑚 —— 强调色：行动、温度、青春
        coral: {
          50: '#FFF4F1',
          100: '#FFE5DE',
          200: '#FFCCBF',
          300: '#FFAC97',
          400: '#FF8168',
          500: '#FF6B4A',
          600: '#F04A28',
          700: '#C73618',
          800: '#9E2E15',
          900: '#7F2A15',
        },
        // 中性文字
        ink: {
          400: '#8296AA',
          500: '#5B7086',
          600: '#46596C',
          700: '#33475B',
          800: '#22344A',
          900: '#12212E',
        },
        // 背景层
        paper: '#FFFFFF',
        mist: '#F5FAFD',
        'mist-deep': '#E8F3F9',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Source Han Sans SC"',
          '"Noto Sans CJK SC"',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,33,46,.04), 0 8px 24px -12px rgba(12,74,110,.18)',
        'card-hover': '0 2px 4px rgba(18,33,46,.05), 0 16px 36px -16px rgba(12,74,110,.28)',
        focus: '0 0 0 4px rgba(14,165,233,.22)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .32s cubic-bezier(.22,.68,.36,1) both',
        'fade-in': 'fade-in .24s ease both',
        'pop-in': 'pop-in .2s cubic-bezier(.22,.68,.36,1) both',
      },
    },
  },
  plugins: [],
};
