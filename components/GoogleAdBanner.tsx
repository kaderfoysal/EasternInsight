'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdBannerProps {
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function GoogleAdBanner({
  adSlot = '1234567890', // Replace with your actual ad slot ID
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  className = ''
}: GoogleAdBannerProps) {
  const adRef = useRef(null);
  const isAdPushed = useRef(false);

  // Get AdSense client ID from environment variable
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  
  // Show placeholder if AdSense is not configured
  const isConfigured = adClient !== 'ca-pub-XXXXXXXXXXXXXXXX' && !adClient.includes('XXXX');

  useEffect(() => {
    if (!isConfigured) {
      console.warn('⚠️ Google AdSense not configured. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env.local');
      return;
    }

    try {
      // Only push ad if it hasn't been pushed yet and the element exists
      if (typeof window !== 'undefined' && adRef.current && !isAdPushed.current) {
        // Check if the ad has already been filled
        const adElement = adRef.current;
        const isAdFilled = adElement.getAttribute('data-ad-status') === 'filled' || 
                          adElement.getAttribute('data-adsbygoogle-status') === 'done';
        
        if (!isAdFilled) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          isAdPushed.current = true;
        }
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [isConfigured]);

  // Show placeholder if not configured
  if (!isConfigured) {
    return (
      <div 
        className={`ad-placeholder ${className}`} 
        style={{ 
          backgroundColor: '#f3f4f6',
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '250px',
          padding: '20px',
          textAlign: 'center',
          ...style 
        }}
      >
        <div>
          <p className="text-gray-600 font-semibold mb-2">📢 বিজ্ঞাপন স্থান</p>
          <p className="text-gray-500 text-sm">Google AdSense কনফিগার করুন</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={{ margin: 0, padding: 0, ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', margin: 0, padding: 0 }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
