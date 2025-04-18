import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ContextProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sellet Esmalteria',
  description: 'Onde sua beleza é nossa prioridade!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
