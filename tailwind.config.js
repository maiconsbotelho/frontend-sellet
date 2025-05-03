/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita o modo escuro baseado em classe
  content: [
    // Caminhos para seus arquivos que usam classes Tailwind
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Adicione outros diretórios se necessário
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // colors: {
      //   // Mapeamento direto para variáveis CSS principais
      //   primary: 'primary',
      //   secondary: 'var(--secondary)',

      //   background: 'var(--background)',
      //   foreground: 'var(--foreground)',
      // },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // Adicione plugins se estiver usando (ex: tailwindcss-animate para shadcn/ui)
};
