import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dad.AI - Your Parenting Co-Pilot',
  description: 'AI companion and guide for new and expecting dads',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-100 antialiased font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
