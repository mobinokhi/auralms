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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-purple-100 selection:text-purple-900">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
