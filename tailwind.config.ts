import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#f7f8fa',
        card: '#ffffff',
        border: '#e2e8f0',
        accent: '#2563eb',
        accentSoft: '#dbeafe',
        airbnb: '#f15a5a',
        vrbo: '#3b82f6',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
