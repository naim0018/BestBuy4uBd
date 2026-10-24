import React from "react";

/**
 * -------------------------------------------------------------
 * TEMPLATE 1 SKELETON
 * Layout: Full-bleed DynamicBanner (60vh) + 2-col showcase (Gallery left, Details right) + Checkout
 * -------------------------------------------------------------
 */
export const Template1Skeleton: React.FC = () => (
  <div className="min-h-screen bg-white pb-20 animate-pulse">
    {/* DynamicBanner (60vh) */}
    <div className="relative h-[45vh] sm:h-[60vh] w-full bg-slate-900/90 overflow-hidden flex items-center">
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl w-full space-y-4">
          <div className="h-5 w-32 bg-slate-800 rounded-full" />
          <div className="h-8 sm:h-12 w-3/4 bg-slate-800 rounded-lg" />
          <div className="h-8 sm:h-12 w-1/2 bg-slate-800 rounded-lg" />
          <div className="h-4 sm:h-6 w-full bg-slate-800/80 rounded" />
          <div className="flex items-center gap-4 pt-4">
            <div className="h-14 w-40 bg-emerald-700/60 rounded-lg" />
            <div className="h-10 w-28 bg-slate-800 rounded-md" />
          </div>
        </div>
        <div className="hidden lg:block w-48 h-48 rounded-full bg-slate-800 border border-slate-700" />
      </div>
    </div>

    {/* Product Grid */}
    <div className="container mx-auto px-4 mt-12 sm:mt-20 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-8">
            <div className="w-3/4 h-3/4 bg-slate-200/80 rounded-xl" />
          </div>
          <div className="flex gap-4 overflow-hidden pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-20 h-20 rounded-lg bg-slate-100 border border-slate-200" />
            ))}
          </div>
        </div>

        {/* Right: Info & Pricing */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-6 w-24 bg-green-50 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-7 w-full bg-slate-100 rounded-md" />
            <div className="h-7 w-4/5 bg-slate-100 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 bg-slate-100 rounded" />
            <div className="h-5 w-20 bg-slate-100 rounded" />
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="flex items-baseline gap-3">
            <div className="h-10 w-36 bg-slate-200 rounded-lg" />
            <div className="h-6 w-24 bg-slate-100 rounded" />
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3">
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-8 w-full bg-slate-200/60 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-100 rounded-lg" />
            <div className="h-10 w-24 bg-slate-100 rounded-lg" />
            <div className="h-10 w-24 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * -------------------------------------------------------------
 * TEMPLATE 2 SKELETON
 * Layout: Gradient Hero Card at top + DynamicBanner + Tab Navigation + Checkout
 * -------------------------------------------------------------
 */
export const Template2Skeleton: React.FC = () => (
  <div className="bg-white min-h-screen pb-20 animate-pulse">
    {/* Gradient Hero Section Container */}
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-gradient-to-br from-slate-50 via-white to-green-50 border border-gray-200 rounded-3xl p-6 sm:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-white shadow-xl border border-gray-100 p-8 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-slate-100 rounded-xl" />
            </div>
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-slate-100 border border-gray-200 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: Product Hero Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-28 bg-slate-200 rounded-full" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="h-8 sm:h-10 w-full bg-slate-200 rounded-lg" />
            <div className="h-8 sm:h-10 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-12 w-48 bg-emerald-100 rounded-xl" />
            <div className="h-20 w-full bg-white border border-gray-200 rounded-2xl p-4" />
            <div className="h-14 w-full bg-emerald-600/70 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Dynamic Banner */}
    <div className="my-10 h-64 bg-slate-900/80 w-full" />
  </div>
);

/**
 * -------------------------------------------------------------
 * TEMPLATE 3 SKELETON
 * Layout: Centered Hero Title + Rounded Image with Thick Brand Border + Thumbnails Carousel
 * -------------------------------------------------------------
 */
export const Template3Skeleton: React.FC = () => (
  <div className="bg-gray-50 min-h-screen pb-20 animate-pulse">
    {/* Centered Hero Section */}
    <div className="bg-white border-b border-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* Title */}
        <div className="h-8 sm:h-10 w-3/4 bg-slate-200 rounded-lg mx-auto mb-4" />
        <div className="h-8 sm:h-10 w-1/2 bg-slate-200 rounded-lg mx-auto mb-8" />

        {/* Thick-Bordered Central Image */}
        <div className="max-w-xl mx-auto mb-8 aspect-square rounded-[1.5rem] border-6 border-slate-300 shadow-xl bg-white p-4 flex items-center justify-center">
          <div className="w-4/5 h-4/5 bg-slate-100 rounded-xl" />
        </div>

        {/* Thumbnail Dots/Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="size-16 rounded-xl bg-slate-100 border-2 border-gray-200" />
          ))}
        </div>

        {/* Countdown Box & Price */}
        <div className="max-w-md mx-auto p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <div className="h-8 w-40 bg-slate-200 rounded-md mx-auto" />
          <div className="h-12 w-full bg-emerald-600/60 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * -------------------------------------------------------------
 * TEMPLATE 4 SKELETON
 * Layout: Dark Theme (slate-900/purple-900) + Large Centered Hero + Product Showcase + Feature cards
 * -------------------------------------------------------------
 */
export const Template4Skeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pb-20 animate-pulse">
    {/* Dark Hero Section */}
    <div className="container mx-auto px-4 pt-16 pb-12 text-center max-w-5xl">
      <div className="h-6 w-36 bg-purple-700/50 rounded-full mx-auto mb-6" />
      <div className="h-10 sm:h-14 w-4/5 bg-slate-700 rounded-xl mx-auto mb-4" />
      <div className="h-6 w-2/3 bg-slate-700/70 rounded-md mx-auto mb-10" />

      {/* Hero Showcase Image */}
      <div className="max-w-3xl mx-auto aspect-video rounded-2xl bg-slate-800/90 border border-purple-500/20 shadow-2xl mb-8 flex items-center justify-center">
        <div className="w-2/3 h-2/3 bg-slate-700/60 rounded-xl" />
      </div>

      <div className="h-14 w-52 bg-emerald-500/70 rounded-xl mx-auto" />
    </div>

    {/* Dark 2-column showcase */}
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-square rounded-xl bg-white/5 border border-white/10" />
        <div className="space-y-6">
          <div className="h-8 w-full bg-slate-700/60 rounded-lg" />
          <div className="h-10 w-44 bg-purple-500/40 rounded-lg" />
          <div className="h-24 w-full bg-white/5 rounded-xl border border-white/10" />
          <div className="h-14 w-full bg-emerald-500/60 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Master dispatcher: picks the skeleton matching the requested product template
 */
export const getLandingSkeletonByTemplate = (templateName: string = "template1") => {
  switch (templateName.toLowerCase()) {
    case "template4":
      return <Template4Skeleton />;
    case "template3":
      return <Template3Skeleton />;
    case "template2":
      return <Template2Skeleton />;
    case "template1":
    default:
      return <Template1Skeleton />;
  }
};
