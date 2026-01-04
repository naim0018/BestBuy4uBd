# Banner System - Easy Customization Guide

## 📁 Folder Structure

```
src/pages/Public/Home/Home1/Components/Banner/
├── index.ts              # Main exports
├── types.ts              # TypeScript types
├── bannerConfig.ts       # ⭐ EDIT THIS FILE to customize banners
├── HeroBanner.tsx        # Large banner component
├── ProductCard.tsx       # Product card component
└── BannerGrid.tsx        # Layout manager
```

## 🎯 How to Customize Banners

### Quick Start: Edit `bannerConfig.ts`

This is the **ONLY file** you need to edit to change banner content!

```typescript
export const bannerConfig: BannerGridData = {
  // Large Hero Banner (Left side)
  heroBanner: {
    id: "hero-1",
    type: "hero",
    title: "YOUR PRODUCT NAME",           // ✏️ Edit title
    subtitle: "Product Description",      // ✏️ Edit subtitle
    features: [                           // ✏️ Edit features
      "Feature 1",
      "Feature 2"
    ],
    ctaText: "BUY NOW",                  // ✏️ Edit button text
    ctaLink: "/your-link",               // ✏️ Edit link
    bgColor: "bg-slate-400",             // ✏️ Change background
    textColor: "text-white",             // ✏️ Change text color
    size: "large",
  },

  productCards: [
    {
      id: "product-1",
      brand: "BRAND NAME",               // ✏️ Edit brand
      title: "Product Title",            // ✏️ Edit title
      price: "$199",                     // ✏️ Edit price (optional)
      ctaText: "SHOP NOW",              // ✏️ Edit CTA
      ctaLink: "/link",                 // ✏️ Edit link
      bgColor: "bg-white",              // ✏️ Change background
      textColor: "text-dark-blue",      // ✏️ Change text
      size: "medium",                   // medium or small
    },
    // Add more cards...
  ],
};
```

## 🎨 Available Background Colors

- `bg-white` / `bg-slate-100` to `bg-slate-900`
- `bg-primary-blue` / `bg-primary-green` / `bg-primary-purple`

## 📝 Banner Types

**Hero Banner**: Large promotional banner with title, features, CTA
**Product Card**: Medium/small cards with brand, title, price, CTA
**Feature Card**: Small cards with title, subtitle, CTA

## 💡 Tips

1. Keep titles short (2-5 words)
2. Use contrasting colors
3. Limit features to 2-3 items
4. Test on mobile

## ✅ Customization

Edit **one file only**: `bannerConfig.ts` - No component editing required! 🎉
