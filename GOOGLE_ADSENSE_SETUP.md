# Google AdSense Setup Guide

## Overview
A Google AdSense banner has been added between the header and featured news section on your homepage.

## Files Modified/Created

1. **`components/GoogleAdBanner.tsx`** - Reusable AdSense banner component
2. **`app/layout.tsx`** - Added AdSense script to the head
3. **`app/page.tsx`** - Added banner between header and featured news

## Setup Instructions

### Step 1: Get Your AdSense Publisher ID

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in or create an account
3. Once approved, find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 2: Update the Publisher ID

Replace `ca-pub-XXXXXXXXXXXXXXXX` in **TWO locations**:

#### Location 1: `app/layout.tsx` (Line 46)
```tsx
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossOrigin="anonymous"
/>
```

#### Location 2: `components/GoogleAdBanner.tsx` (Line 33)
```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
```

### Step 3: Create Ad Units and Get Ad Slot IDs

1. In your AdSense dashboard, go to **Ads** → **By ad unit**
2. Click **+ New ad unit**
3. Choose **Display ads**
4. Configure:
   - **Ad unit name**: "Homepage Top Banner" (or any name)
   - **Ad size**: Responsive (recommended)
5. Click **Create**
6. Copy the **Ad slot ID** (format: `1234567890`)

### Step 4: Update Ad Slot ID

In `app/page.tsx` (Line 188), replace the placeholder:

```tsx
<GoogleAdBanner 
  adSlot="1234567890"  // Replace with your actual ad slot ID
  style={{ minHeight: '90px' }}
  className="text-center"
/>
```

## Customization Options

### Change Ad Size/Style

You can customize the ad banner by modifying the props in `app/page.tsx`:

```tsx
<GoogleAdBanner 
  adSlot="YOUR_AD_SLOT_ID"
  adFormat="horizontal"  // Options: 'auto', 'horizontal', 'vertical', 'rectangle'
  fullWidthResponsive={true}  // Makes ad responsive
  style={{ minHeight: '120px' }}  // Adjust height
  className="text-center my-4"  // Add custom classes
/>
```

### Add More Ad Banners

You can reuse the `GoogleAdBanner` component anywhere in your app:

```tsx
import GoogleAdBanner from '@/components/GoogleAdBanner';

// In your component
<GoogleAdBanner 
  adSlot="DIFFERENT_AD_SLOT_ID"
  style={{ minHeight: '250px' }}
/>
```

## Common Ad Sizes

- **Leaderboard**: 728x90 (Desktop)
- **Banner**: 468x60
- **Large Rectangle**: 336x280
- **Medium Rectangle**: 300x250
- **Wide Skyscraper**: 160x600
- **Mobile Banner**: 320x50

For responsive ads, use `adFormat="auto"` and `fullWidthResponsive={true}`.

## Testing

1. After updating your Publisher ID and Ad Slot ID, deploy your site
2. AdSense may show blank ads or test ads initially
3. It can take **24-48 hours** for real ads to appear
4. Make sure your site complies with [AdSense Program Policies](https://support.google.com/adsense/answer/48182)

## Troubleshooting

### Ads Not Showing?

1. **Check Console**: Open browser DevTools and look for AdSense errors
2. **Verify IDs**: Ensure Publisher ID and Ad Slot ID are correct
3. **Wait**: New ad units can take time to activate
4. **Ad Blockers**: Disable ad blockers when testing
5. **Policy Compliance**: Ensure your site meets AdSense policies

### Ad Placement Best Practices

- Don't place too many ads on one page
- Ensure ads don't interfere with navigation
- Follow AdSense placement policies
- Maintain good user experience

## Support

For AdSense-specific issues, visit:
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Community](https://support.google.com/adsense/community)

---

**Note**: Replace all placeholder IDs (`ca-pub-XXXXXXXXXXXXXXXX` and `1234567890`) with your actual AdSense credentials before deploying to production.
