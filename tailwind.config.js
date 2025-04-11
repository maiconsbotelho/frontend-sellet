// filepath: /home/maicon/workspace/sellet/frontend-sellet/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Inclua os arquivos do Next.js
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        background: 'var(--background-color)',
        foreground: 'var(--foreground-color)',
      },
    },
  },
  plugins: [],
};
