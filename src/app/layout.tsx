// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { ContextProvider } from './providers';

const montserrat = Montserrat({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sellet Esmalteria',
  description: 'Onde sua beleza é nossa prioridade!',
  themeColor: '#FFB6C1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={montserrat.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
