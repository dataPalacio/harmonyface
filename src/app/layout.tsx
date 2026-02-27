import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HarmoniFace CRM',
  description: 'CRM para consultório de harmonização facial com suporte de IA'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
