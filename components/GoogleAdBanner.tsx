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

  useEffect(() => {
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
  }, []);

  return (
    <div className={`ad-container ${className}`} style={{ margin: 0, padding: 0, ...style }}>
      <ins
        ref={adRef}
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
