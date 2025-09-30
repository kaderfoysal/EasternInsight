import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import ConditionalFooter from '@/components/ConditionalFooter';
import '../styles/globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'বাংলা সংবাদ পোর্টাল',
  description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
  keywords: 'বাংলা সংবাদ, খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন, প্রযুক্তি',
  authors: [{ name: 'Bengali News Portal' }],
  robots: 'index, follow',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    siteName: 'বাংলা সংবাদ পোর্টাল',
    title: 'বাংলা সংবাদ পোর্টাল',
    description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'বাংলা সংবাদ পোর্টাল',
    description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" dir="ltr">
      <body className={`${inter.className} bengali-text`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}