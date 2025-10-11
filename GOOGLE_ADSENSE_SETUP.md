# Google AdSense Setup Guide

## ✅ Current Status
Your site now shows **placeholder ads** (gray boxes with "বিজ্ঞাপন স্থান") because AdSense is not configured yet.

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your AdSense Publisher ID

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in or create an account
3. Add your website: `www.easterninsight.net`
4. Wait for approval (can take 1-3 days)
5. Once approved, find your **Publisher ID** (format: `ca-pub-1234567890123456`)

### Step 2: Add Publisher ID to Environment Variables

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
```

Replace `ca-pub-1234567890123456` with your actual Publisher ID.

**That's it!** The ads will automatically start showing once you restart your server.

### Step 3: (Optional) Create Custom Ad Units

By default, auto ads will show. For more control:

1. In your AdSense dashboard, go to **Ads** → **By ad unit**
2. Click **+ New ad unit**
3. Choose **Display ads**
4. Configure:
   - **Ad unit name**: "Homepage Top Banner"
   - **Ad size**: Responsive
5. Click **Create** and copy the **Ad slot ID**

Then update your ad components with the slot ID:

```tsx
<GoogleAdBanner 
  adSlot="YOUR_AD_SLOT_ID"
  adFormat="auto"
  fullWidthResponsive={true}
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
