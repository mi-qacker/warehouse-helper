import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import Navbar from '@/ui/common/Navbar';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Warehouse helper',
  description: 'An application to help organize a warehouse',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
