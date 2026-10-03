import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'M.A.S LMS — Developed by M.A.S Cloud Studio',
  description: 'Clean modern enterprise Learning Management System and corporate training intelligence platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
