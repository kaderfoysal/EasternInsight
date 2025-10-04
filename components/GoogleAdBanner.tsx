'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={{ margin: 0, padding: 0, ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', margin: 0, padding: 0 }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
