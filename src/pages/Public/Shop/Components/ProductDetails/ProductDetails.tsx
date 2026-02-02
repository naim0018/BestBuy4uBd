import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Truck,
  RotateCcw,
  Facebook,
  Twitter,
  Instagram,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetProductByIdQuery,
  useGetAllProductsQuery,
} from "@/store/Api/ProductApi";
import { useTracking } from "@/hooks/useTracking";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart, openWishlist } from "@/store/Slices/UISlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/Slices/wishlistSlice";
import { RootState } from "@/store/store";
import CommonWrapper from "@/common/CommonWrapper";
import ProductCard from "../ProductCard";

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-200 border border-border-main rounded-component ${className}`}
  />
);

const ProductDetailsSkeleton = () => (
  <div className="min-h-screen bg-bg-base pb-20 font-primary">
    {/* Breadcrumbs Skeleton */}
    <div className="bg-bg-surface border-b border-border-main mb-8">
      <CommonWrapper className="py-4 px-4">
        <div className="flex gap-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-40 h-4" />
        </div>
      </CommonWrapper>
    </div>

    <CommonWrapper className="px-4">
      <div className="card-container p-6 md:p-12 mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery Skeleton */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            <Skeleton className="aspect-square w-full" />
            <div className="flex gap-4">
              <Skeleton className="w-24 h-24" />
              <Skeleton className="w-24 h-24" />
              <Skeleton className="w-24 h-24" />
            </div>
          </div>

          {/* Center: Product Info Skeleton */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/3" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-14 w-14" />
            </div>
          </div>

          {/* Right: Action Box Skeleton */}
          <div className="w-full lg:w-[20%] flex flex-col gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[75%] space-y-10">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="w-full lg:w-[25%]">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </CommonWrapper>
  </div>
);


const ProductCardSkeleton = () => (
  <div className="card-container p-4 h-full flex flex-col space-y-4 animate-pulse">
    <Skeleton className="h-56 w-full mb-1" />
    <Skeleton className="h-3 w-1/4" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="mt-auto pt-4 border-t border-border-main flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

const ForYouCard = ({ product }: { product: any }) => (
  <Link
    to={`/product/${product._id}`}
    className="group flex gap-4 items-center"
  >
    <div className="w-20 h-20 bg-bg-base rounded-inner flex-shrink-0 border border-border-main group-hover:border-secondary transition-all overflow-hidden">
      <img
        src={product.images[0]?.url}
        alt=""
        className="w-full h-full object-cover rounded-lg  group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-text-primary truncate group-hover:text-secondary transition-colors tracking-wider">
        {product.basicInfo.title}
      </h4>
      <p className="text-xs font-bold text-secondary mt-1">
        ৳{(product.price.discounted || product.price.regular).toLocaleString()}
      </p>
      <div className="flex text-accent mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-2.5 h-2.5 ${i < Math.floor(product.rating?.average || 0)
              ? "fill-current"
              : "text-text-muted/20"
              }`}
          />
        ))}
      </div>
    </div>
  </Link>
);

/* New Hooks Integration */
import { useVariantQuantity } from "@/hooks/useVariantQuantity";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import PriceBreakdown from "../../../../../components/PriceBreakdown";
import ComboPricingDisplay from "../../../../../components/ComboPricingDisplay";
/* End New Hooks Integration */

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { trackViewItem, trackAddToCart, trackAddToWishlist, trackWishlistRemove, trackImageZoom, trackVariantSelect } = useTracking();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { id } = useParams<{ id: string }>();
  const { data: productResponse, isLoading } = useGetProductByIdQuery({
    id: id || "",
  });
  const { data: relatedProductsResponse } = useGetAllProductsQuery({
    limit: 8,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [, setIsManualQty] = useState<boolean>(false);
  const [manualQuantity, setManualQuantity] = useState(1);

  const product = productResponse?.data;

  // Utilize new hooks
  const {
    selectedVariants,
    totalQuantity,
    addVariant,
    updateVariantQuantity,
    initVariants
  } = useVariantQuantity(product?.variants, product);

  // Initialize variants when product loads
  useEffect(() => {
    if (product?.variants) {
      initVariants(product.variants, product);
    }

    if (product) {
      trackViewItem({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category
      });
    }
  }, [product, initVariants]);

  // Sync manual quantity with variant quantity
  // Only if manual quantity interaction happened?
  // Actually, we should probably rely on `totalQuantity` from variants principally.
  // But if there are no variants, we fallback to manualQuantity.
  const effectiveQuantity = (product?.variants?.length ?? 0) > 0 ? totalQuantity : manualQuantity;

  const {
    basePrice,
    variantTotal,
    appliedComboTier,
    finalTotal
  } = usePriceCalculation(product, selectedVariants, effectiveQuantity);


  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { data: allProductsResponse } = useGetAllProductsQuery({ limit: 12 });

  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;

    // Validate that at least one variant is selected
    if (totalQuantity === 0 || selectedVariants.length === 0) {
      toast.error('Please select at least one variant with quantity greater than 0', {
        position: 'top-right',
        autoClose: 3000
      });
      return;
    }

    // Transform selectedVariants to cart format if needed
    // Assuming backend/cart supports this structure or we flatten it.
    // For now, let's keep consistency with existing structure but with quantity.

    // Group variants by group name for CartSlice compatibility if needed?
    // The CartSlice likely expects `selectedVariants` as array of objects.
    // Let's modify the payload to include quantity info.

    // Convert to Group -> Items[] structure for backward compatibility if needed, 
    // OR update CartSlice to handle flat list with quantities.
    // The previous structure was: { group, items: [{value, price}] }
    // We can group them back.

    const groupedVariants: Record<string, any[]> = {};
    selectedVariants.forEach(sv => {
      if (!groupedVariants[sv.group]) {
        groupedVariants[sv.group] = [];
      }
      groupedVariants[sv.group].push({
        value: sv.item.value,
        price: sv.item.price,
        quantity: sv.quantity // Add quantity here
      });
    });

    const variantsPayload = Object.entries(groupedVariants).map(([group, items]) => ({
      group,
      items
    }));

    dispatch(
      addToCart({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        image: product.images[0]?.url,
        quantity: effectiveQuantity,
        selectedVariants: variantsPayload || [],
        deliveryChargeInsideDhaka: product.basicInfo.deliveryChargeInsideDhaka,
        deliveryChargeOutsideDhaka: product.basicInfo.deliveryChargeOutsideDhaka,
        freeShipping: product.additionalInfo?.freeShipping,
        // Add combo pricing info if needed in cart
        comboPricing: product.comboPricing
      })
    );

    dispatch(openCart());

    trackAddToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      category: product.basicInfo.category,
      quantity: effectiveQuantity,
      variant: selectedVariants.map(v => `${v.group}: ${v.item.value}`).join(", ")
    });
  };

  const forYouProducts = useMemo(() => {
    if (!allProductsResponse?.data) return [];
    return [...allProductsResponse.data]
      .filter((p) => p._id !== product?._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allProductsResponse, product?._id]);

  const handleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      trackWishlistRemove({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category
      });
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
      trackAddToWishlist({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const nextImage = useCallback(() => {
    if (product) {
      const nextIndex = (selectedImage + 1) % product.images.length;
      setSelectedImage(nextIndex);
      trackImageZoom(product._id, product.images[nextIndex]?.url);
    }
  }, [product, selectedImage, trackImageZoom]);

  const prevImage = useCallback(() => {
    if (product) {
      const prevIndex = (selectedImage - 1 + product.images.length) % product.images.length;
      setSelectedImage(prevIndex);
      trackImageZoom(product._id, product.images[prevIndex]?.url);
    }
  }, [product, selectedImage, trackImageZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-2 uppercase tracking-tighter">
            PRODUCT NOT FOUND
          </h2>
          <p className="text-text-muted mb-6 font-medium uppercase tracking-widest text-[10px]">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="px-8 py-3 bg-secondary text-white rounded-component font-semibold shadow-lg shadow-secondary/20 uppercase tracking-widest text-xs"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.price.discounted
    ? Math.round(
      ((product.price.regular - product.price.discounted) /
        product.price.regular) *
      100
    )
    : 0;

  return (
    <div className="min-h-screen bg-bg-base pb-20 font-primary">
      {/* Breadcrumbs */}
      <div className="bg-bg-surface border-b border-border-main mb-8">
        <CommonWrapper className="py-4 px-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-text-muted">
            <Link to="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-secondary transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-text-primary truncate max-w-[300px]">
              {product.basicInfo.title}
            </span>
          </div>
        </CommonWrapper>
      </div>

      <CommonWrapper className="px-4">
        <div className="card-container p-6 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
              <div
                className="relative aspect-square card-inner bg-bg-base/50 border border-border-main flex items-center justify-center group overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsLightboxOpen(true)}
              >
                <div
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{
                    transform: isHovered ? "scale(1.5)" : "scale(1)",
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                >
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={product.images[selectedImage]?.url}
                    alt={product.basicInfo.title}
                    className="w-full h-full object-contain p-8"
                  />
                </div>

                <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
                  {discountPercentage > 0 && (
                    <span className="tag bg-danger text-white shadow-lg">
                      -{discountPercentage}%
                    </span>
                  )}
                  {product.additionalInfo?.isFeatured && (
                    <span className="tag bg-primary text-white shadow-lg">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-text-primary/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-text-primary uppercase tracking-widest border border-text-primary/10">
                  <Maximize2 className="w-3 h-3" />
                  Click to Expand
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-24 rounded-component border-2 transition-all flex-shrink-0 bg-bg-base/30 overflow-hidden ${selectedImage === idx
                      ? "border-secondary scale-105 shadow-md"
                      : "border-border-main hover:border-text-muted"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Product Info */}
            <div className="w-full lg:w-[35%] flex flex-col gap-6">
              <h1 className="h3 uppercase">{product.basicInfo.title}</h1>
              <div className="flex items-center gap-2">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating?.average || 0)
                        ? "fill-current"
                        : "text-text-muted/20"
                        }`}
                    />
                  ))}
                </div>
                <span className="small font-medium">
                  ({product.rating?.count || 0})
                </span>
              </div>

              {/* Price Display */}
              <div className="flex flex-col gap-2">
                <PriceBreakdown
                  quantity={effectiveQuantity}
                  unitPrice={Math.round((((basePrice * effectiveQuantity) + variantTotal) / (effectiveQuantity || 1)))}
                  comboPricing={product.comboPricing || []}
                />
              </div>

              {/* Combo Pricing Section */}
              <div className="mt-4">
                <ComboPricingDisplay
                  comboPricing={product.comboPricing || []}
                  currentQuantity={effectiveQuantity}
                  appliedTier={appliedComboTier || undefined} 
                  variant="primary"
                />
              </div>

              <div className="space-y-4">
                {/* Base Variant - Auto-injected quantity option */}
                {selectedVariants.find(v => v.isBaseVariant) && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
                      Select Quantity
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedVariants
                        .filter(v => v.isBaseVariant)
                        .map((variant) => {
                          const quantity = variant.quantity;
                          const isActive = quantity > 0;

                          return (
                            <button
                              key={variant.item.value}
                              onClick={() => {
                                // Base variant is always selected, clicking increments quantity
                                updateVariantQuantity(variant.group, variant.item.value, quantity + 1);
                              }}
                              className={`relative px-6 py-3 rounded-component border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                                ? "border-secondary bg-secondary text-white shadow-lg"
                                : "border-border-main hover:border-text-secondary text-text-primary bg-bg-surface"
                                }`}
                            >
                              <div className="flex flex-col items-center">
                                <span>{variant.item.value}</span>
                                <span className="opacity-60 text-[8px]">Base Price</span>
                              </div>

                              {/* Quantity Badge on Variant */}
                              {isActive && (
                                <div className="absolute -top-2 -right-2 bg-white text-secondary text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-secondary shadow-sm z-10">
                                  {quantity}
                                </div>
                              )}

                              {/* Decrease Control - Allow deselecting base variant */}
                              {isActive && (
                                <div
                                  className="absolute -top-2 -left-2 bg-white text-danger text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-danger shadow-sm z-10 hover:bg-danger hover:text-white transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateVariantQuantity(variant.group, variant.item.value, quantity - 1);
                                  }}
                                >
                                  <Minus className="w-3 h-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Product Variants */}
                {product?.variants?.map((variantGroup: any) => {
                  return (
                    <div key={variantGroup.group} className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
                        Select {variantGroup.group}
                      </label>
                      <div className={`flex flex-wrap gap-2`}>
                        {variantGroup.items.map((item: any) => {
                          // Check if currently selected
                          // Logic: find if this exact Item is in selectedVariants
                          const selection = selectedVariants.find(v => v.group === variantGroup.group && v.item.value === item.value);
                          const quantity = selection?.quantity || 0;
                          const isActive = quantity > 0;

                          return (
                            <button
                              key={item.value}
                              onClick={() => {
                                // Add variant (or replace logic? default behavior is usually replace for single-choice groups)
                                // But user asked specifically for "Variant is a quantity... select multiple variant"
                                // So we treat this as "Adding to cart configuration"
                                addVariant(variantGroup.group, item);
                                trackVariantSelect(product._id, variantGroup.group, item.value);

                                if (item.image?.url) {
                                  const imgIdx = product.images.findIndex((img: any) => img.url === item.image.url);
                                  if (imgIdx !== -1) setSelectedImage(imgIdx);
                                }
                              }}
                              className={`relative px-6 py-3 rounded-component border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                                ? "border-secondary bg-secondary text-white shadow-lg"
                                : "border-border-main hover:border-text-secondary text-text-primary bg-bg-surface"
                                }`}
                            >
                              <div className="flex flex-col items-center">
                                <span>{item.value}</span>
                                {(item.price ?? 0) > 0 && <span className="opacity-60 text-[8px]">
                                  +৳{item.price}
                                </span>}
                              </div>

                              {/* Quantity Badge on Variant */}
                              {isActive && (
                                <div className="absolute -top-2 -right-2 bg-white text-secondary text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-secondary shadow-sm z-10">
                                  {quantity}
                                </div>
                              )}

                              {/* Decrease Control - Only visible if active/hovered? Or maybe handle quantity update differently? */}
                              {isActive && (
                                <div
                                  className="absolute -top-2 -left-2 bg-white text-danger text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-danger shadow-sm z-10 hover:bg-danger hover:text-white transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent re-adding
                                    updateVariantQuantity(variantGroup.group, item.value, quantity - 1);
                                  }}
                                >
                                  <Minus className="w-3 h-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-6">
                  <span className="small font-bold uppercase tracking-widest text-text-muted">
                    Total Quantity
                  </span>
                  <div className="flex items-center border border-border-main rounded-component overflow-hidden bg-bg-surface h-12">
                    {/* 
                        If variants exist, quantity is controlled by variants.
                        If no variants, manual control.
                     */}
                    {(product?.variants?.length ?? 0) > 0 ? (
                      <div className="w-32 h-full flex items-center justify-center font-bold text-lg bg-gray-50 text-text-muted cursor-not-allowed" title="Update quantity via variants">
                        {totalQuantity}
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsManualQty(true);
                            setManualQuantity(Math.max(1, manualQuantity - 1));
                          }}
                          className="w-12 h-full flex items-center justify-center hover:bg-bg-base transition-colors border-r border-border-main"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-16 h-full flex items-center justify-center font-bold text-lg">
                          {manualQuantity}
                        </span>
                        <button
                          onClick={() => {
                            setIsManualQty(true);
                            setManualQuantity(manualQuantity + 1);
                          }}
                          className="w-12 h-full flex items-center justify-center hover:bg-bg-base transition-colors border-l border-border-main"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={totalQuantity === 0}
                    className={`flex-1 h-14 rounded-component font-bold shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${totalQuantity === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-secondary text-white shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart - ৳{finalTotal.toLocaleString()}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-14 h-14 flex items-center justify-center rounded-component border-2 transition-all ${isWishlisted
                      ? "border-danger bg-danger text-white"
                      : "border-border-main hover:border-danger hover:text-danger text-text-muted"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Action Box */}
            <div className="w-full lg:w-[20%] flex flex-col gap-6">
              <div className="card-inner p-6 bg-secondary/5 border border-secondary/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                        Quick Delivery
                      </p>
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-0.5">
                        2-3 Business Days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                        Easy Returns
                      </p>
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-0.5">
                        7-Day Policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
                  Share This Product
                </p>
                <div className="flex gap-2">
                  {[Facebook, Twitter, Instagram].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-surface border border-border-main hover:border-secondary hover:text-secondary transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Advertisement or Featured Products */}
              <div className="card-inner p-6 space-y-6 mt-4">
                <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">
                  Popular Products
                </h3>
                <div className="flex flex-col gap-6">
                  {forYouProducts.map((p) => (
                    <ForYouCard key={p._id} product={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sections: Tabs for Info */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-[75%] space-y-10">
            {/* Description Tab */}
            <div className="card-container overflow-hidden">
              <div className="bg-bg-surface border-b border-border-main px-8 py-4">
                <h2 className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">
                  Product Description
                </h2>
              </div>
              <div className="p-8 md:p-12">
                <div
                  className="prose prose-slate max-w-none text-text-secondary leading-relaxed font-inter"
                  dangerouslySetInnerHTML={{ __html: product.basicInfo.description }}
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="card-container overflow-hidden">
              <div className="bg-bg-surface border-b border-border-main px-8 py-4">
                <h2 className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">
                  Technical Specifications
                </h2>
              </div>
              <div className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {product.specifications?.map((group, i) => (
                    <div
                      key={i}
                      className={`p-8 border-border-main ${i % 2 === 0 ? "md:border-r" : ""
                        } ${i < (product.specifications?.length || 0) - 2 ? "border-b" : ""}`}
                    >
                      <h3 className="text-secondary font-bold text-sm uppercase tracking-widest mb-6">
                        {group.group}
                      </h3>
                      <div className="space-y-4">
                        {group.items.map((item, j) => (
                          <div
                            key={j}
                            className="flex justify-between items-center pb-3 border-b border-border-main border-dashed last:border-0"
                          >
                            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                              {item.name}
                            </span>
                            <span className="text-xs font-bold text-text-primary">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[25%] space-y-8 sticky top-8">
            <div className="card-container p-8 bg-secondary text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="h4 mb-2 uppercase tracking-tighter">Need Help?</h3>
                <p className="text-white/80 text-[10px] font-medium uppercase tracking-widest mb-8 leading-loose">
                  Our customer support team is available 24/7 to assist you.
                </p>
                <button className="w-full py-4 bg-white text-secondary rounded-component font-bold shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-[10px]">
                  Contact Support
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">
                Recommended
              </span>
              <h2 className="h3 uppercase tracking-tighter">Related Products</h2>
            </div>
            <Link
              to="/shop"
              className="text-[10px] font-bold text-text-muted border-b-2 border-border-main hover:text-secondary hover:border-secondary transition-all pb-1 uppercase tracking-[0.2em]"
            >
              Discover More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProductsResponse?.data
              ?.filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            {(!relatedProductsResponse?.data || relatedProductsResponse.data.length <= 1) &&
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            }
          </div>
        </div>
      </CommonWrapper>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col pt-20"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Lightbox Content */}
            <div className="flex-1 relative flex items-center justify-center px-4 md:px-20 overflow-hidden">
              {/* Controls */}
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-8 z-10 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="relative max-w-5xl max-h-[70vh] w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    src={product.images[selectedImage]?.url}
                    alt=""
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
                </AnimatePresence>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-8 z-10 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Lightbox Thumbnails */}
            <div className="h-32 bg-white/5 border-t border-white/10 flex items-center justify-center gap-4 px-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${selectedImage === idx
                    ? "border-secondary scale-110 shadow-2xl"
                    : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
