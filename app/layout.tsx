import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import ConditionalHeader from '@/components/ConditionalHeader';
import ConditionalFooter from '@/components/ConditionalFooter';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ইস্টার্ন ইনসাইট | Eastern Insight — আঞ্চলিক বিশ্লেষণ ও কৌশলগত গোয়েন্দা তথ্য',
  description: 'ইস্টার্ন ইনসাইট — বাংলাদেশ ও পূর্ব এশিয়ার আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি এবং অর্থনীতির প্রিমিয়াম প্রকাশনা।',
  keywords: 'বাংলাদেশ, মিয়ানমার, আসিয়ান, ভূরাজনীতি, অর্থনীতি, বিশ্লেষণ, Eastern Insight',
  authors: [{ name: 'Eastern Insight' }],
  robots: 'index, follow',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইস্টার্ন ইনসাইট',
    title: 'ইস্টার্ন ইনসাইট | Eastern Insight',
    description: 'বাংলাদেশ ও পূর্ব এশিয়ার আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি এবং অর্থনীতির প্রিমিয়াম প্রকাশনা।',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ইস্টার্ন ইনসাইট | Eastern Insight',
    description: 'বাংলাদেশ ও পূর্ব এশিয়ার আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি এবং অর্থনীতির প্রিমিয়াম প্রকাশনা।',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const shouldLoadAdSense = adSenseClientId && !adSenseClientId.includes('XXXX');

  return (
    <html lang="bn" dir="ltr">
      <head>
        {/* Kalpurush — Bangla serif */}
        <link rel="preconnect" href="https://fonts.maateen.me" />
        <link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet" />
        <link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet" />
        {/* Source Serif 4, Space Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {shouldLoadAdSense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bengali-text">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <ConditionalHeader />
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
