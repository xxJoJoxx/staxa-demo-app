import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Staxa Demo — Task Board',
  description: 'A task management app deployed on Staxa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
