// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
import { ContextProvider } from './providers';

// const inter = Inter({ subsets: ['latin'] });

const montserrat = Montserrat({
  subsets: ['latin'], // adicione os pesos que vai usar
});

export const metadata: Metadata = {
  title: 'Sellet Esmalteria',
  description: 'Onde sua beleza é nossa prioridade!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
