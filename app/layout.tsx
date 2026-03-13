import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fixoo – Your Local Problem Solver',
  description: 'India\'s #1 hyperlocal service marketplace. Book electricians, plumbers, cleaners and more in seconds.',
  keywords: 'home services, electrician, plumber, cleaning, India, hyperlocal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
