/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2874F0', // Flipkart Primary Blue
          hover: '#1259c7',
        },
        accent: {
          DEFAULT: '#F7E200', // Flipkart Accent Yellow
          hover: '#e0cd00',
        },
        promo: {
          DEFAULT: '#F09120', // Promotional Orange
        },
        surface: {
          DEFAULT: '#FFFFFF',
          page: '#F1F3F6', // Page Light Grey Background
        },
        textPrimary: '#212121',
        textSecondary: '#666666',
        textMuted: '#878787',
        borderLight: '#EEEEEE',
        borderSubtle: '#E0E0E0',
        success: '#2E7D32',
        error: '#D32F2F',
        warning: '#ED6C02',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        card: '4px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.12)',
        elevated: '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
