import React from 'react';

import { Product, ProductImage, ProductVariantItem } from '@/types/Product/Product';
import TrustSignals from './TrustSignals';
import AnimatedContainer from '../../../Components/AnimatedContainer';

interface LandingPageHeroSectionProps {
  product: Product;
  currentImage: ProductImage | null;
  currentPrice: number;
  setCurrentImage: (img: ProductImage) => void;
  quantity: number;
  handleVariantSelect: (groupName: string, variant: ProductVariantItem) => void;
  selectedVariants: Map<string, ProductVariantItem[]>;
  handleIncrement: () => void;
  handleDecrement: () => void;
  scrollToCheckout: () => void;
}

const LandingPageHeroSection: React.FC<LandingPageHeroSectionProps> = ({
  product,
  currentImage,
  currentPrice,
  setCurrentImage,
  quantity,
  handleVariantSelect,
  selectedVariants,
  handleIncrement,
  handleDecrement,
  scrollToCheckout,
}) => {

  const { title } = product.basicInfo;
  const { regular: regularPrice, discounted: discountedPrice } = product.price;

  // --- Helper: Savings ---
  const hasDiscount = discountedPrice && discountedPrice < regularPrice;

   const savings = hasDiscount
    ? product.price.regular - (product.price.discounted || 0)
    : 0;

  const savingsPercent = hasDiscount
    ? Math.round((savings / regularPrice) * 100)
    : 0;

  const stockStatusColor =
    product.stockStatus === "In Stock"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-green-50 border border-gray-200 rounded-3xl p-8 lg:p-16">
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Images */}
          <AnimatedContainer direction="right">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100">
                  <img
                    src={currentImage?.url || "https://placehold.co/600x600?text=No+Image"}
                    alt={currentImage?.alt || title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== "https://placehold.co/600x600?text=No+Image") {
                        target.src = "https://placehold.co/600x600?text=No+Image";
                      }
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {hasDiscount && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{savingsPercent}% OFF
                      </span>
                    )}
                    {product.additionalInfo?.isFeatured && (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        ⭐ FEATURED
                      </span>
                    )}
                    {product.additionalInfo?.freeShipping && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        🚚 FREE SHIPPING
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold bg-white shadow-lg ${stockStatusColor}`}
                    >
                      {product.stockStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product?.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      currentImage?.url === img.url
                        ? "border-green-500 ring-2 ring-green-200 scale-105"
                        : "border-gray-200 hover:border-green-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img.url || "https://placehold.co/100x100?text=No+Image"}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "https://placehold.co/100x100?text=No+Image") {
                          target.src = "https://placehold.co/100x100?text=No+Image";
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </AnimatedContainer>

          {/* Product Info */}
          <AnimatedContainer direction="left">
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {product.basicInfo.brand}
                </span>
                <span className="text-gray-500">
                  {product.basicInfo.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.basicInfo.title}
              </h1>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl lg:text-5xl font-bold text-green-600">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-400 line-through">
                      ৳{product.price.regular.toLocaleString()}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      You Save ৳{(savings * quantity).toLocaleString()} (
                      {savingsPercent}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Key Features */}
              {product.basicInfo.keyFeatures && product.basicInfo.keyFeatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ✨ Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.basicInfo.keyFeatures
                      .slice(0, 4)
                      .map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Variants */}
              {product?.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  {product.variants.map((variantGroup: any) => {
                    const isPricing = (groupName: string) => {
                        const name = groupName.toLowerCase();
                        return name.includes("qty") || name.includes("quantity") || name.includes("টা") || name.includes("প্যাকেজ");
                    };
                    const isPricingGrp = isPricing(variantGroup.group);

                    return (
                    <div key={variantGroup.group}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Choose {variantGroup.group} {isPricingGrp && "(Updates with Quantity)"}
                      </h3>
                      <div className={`flex flex-wrap gap-3`}>
                        {variantGroup.items.map((variant: ProductVariantItem) => {
                          const groupSelections = selectedVariants.get(variantGroup.group) || [];
                          const isActive = groupSelections.some(item => item.value === variant.value);

                          return (
                          <button
                            key={variant.value}
                            onClick={() => {
                              handleVariantSelect(variantGroup.group, variant);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                              isActive
                                ? "border-green-500 bg-green-50 text-green-700 shadow-lg scale-105"
                                : "border-gray-200 hover:border-green-300 hover:shadow-md hover:scale-105"
                            }`}
                          >
                            <span>{variant.value}</span>
                            {variant.price !== undefined && variant.price > 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                {isPricingGrp ? "" : "+"}৳{variant.price}
                              </span>
                            )}
                          </button>
                          );
                        })}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      className="px-4 py-3 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-6 py-3 text-xl font-bold border-x-2 border-gray-200 bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-4 py-3 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {product.stockQuantity && (
                    <span className="text-sm text-gray-500">
                      {product.stockQuantity} items available
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={scrollToCheckout}
                className="animate-bounce w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-8 rounded-2xl text-xl font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                🛒 অর্ডার করুন এখনই (Order Now)
              </button>

              {/* Trust Signals */}
              <TrustSignals />
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeroSection;
