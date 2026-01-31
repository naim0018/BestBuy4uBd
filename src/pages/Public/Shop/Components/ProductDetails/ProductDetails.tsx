import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
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
            className={`w-2.5 h-2.5 ${
              i < Math.floor(product.rating?.average || 0)
                ? "fill-current"
                : "text-text-muted/20"
            }`}
          />
        ))}
      </div>
    </div>
  </Link>
);

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { id } = useParams<{ id: string }>();
  const { data: productResponse, isLoading } = useGetProductByIdQuery({
    id: id || "",
  });
  const { data: relatedProductsResponse } = useGetAllProductsQuery({
    limit: 8,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any[]>>({});
  const [isManualQty, setIsManualQty] = useState<boolean>(false);
  
  const product = productResponse?.data;

  const parseQty = (value: string) => {
    const match = value.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };


  useEffect(() => {
    if (product?.variants && Object.keys(selectedVariants).length === 0) {
      const defaults: Record<string, any[]> = {};
      product.variants.forEach(vg => {
        if (vg.items.length > 0) {
          defaults[vg.group] = [vg.items[0]];
        }
      });
      setSelectedVariants(defaults);
    }
  }, [product, selectedVariants]);

  // Sync Quantity with Selection
  // Sync Quantity with Selection
  useEffect(() => {
    if (!isManualQty) {
      let maxGroupSelection = 1;
      let pricingVariantQty = 1;
      let hasPricingVariant = false;

      Object.entries(selectedVariants).forEach(([groupName, items]) => {
        const name = groupName.toLowerCase();
        const isPricing = name.includes("qty") || name.includes("quantity") || name.includes("টা") || name.includes("প্যাকেজ");
        
        if (isPricing) {
          items.forEach(item => {
            pricingVariantQty *= parseQty(item.value);
            hasPricingVariant = true;
          });
        } else {
          if (items.length > maxGroupSelection) {
            maxGroupSelection = items.length;
          }
        }
      });

      if (hasPricingVariant) {
        setQuantity(Math.max(1, pricingVariantQty));
      } else {
        setQuantity(Math.max(1, maxGroupSelection));
      }
    }
  }, [selectedVariants, isManualQty]);

  const displayPrice = useMemo(() => {
    if (!product) return 0;
    
    const regularPrice = product.price.regular;
    const discountedPrice = product.price.discounted || regularPrice;

    // Determine price per unit based on quantity and bulk pricing tiers
    let pricePerUnit = discountedPrice;

    // Check bulk pricing tiers (these are PER-UNIT prices)
    if (product.bulkPricing && product.bulkPricing.length > 0) {
      const sortedBulk = [...product.bulkPricing].sort((a, b) => b.minQuantity - a.minQuantity);
      const tier = sortedBulk.find(t => quantity >= t.minQuantity);
      if (tier) {
        pricePerUnit = tier.price; // This is the per-unit price for this tier
      }
    }

    return pricePerUnit;
  }, [product, quantity]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { data: allProductsResponse } = useGetAllProductsQuery({ limit: 12 });

  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;

    const variantsPayload = Object.entries(selectedVariants).map(([group, items]) => ({
      group,
      items: items.map(i => ({ value: i.value, price: i.price || 0 }))
    }));

    dispatch(
      addToCart({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        image: product.images[0]?.url,
        quantity: quantity,
        selectedVariants: variantsPayload || [],
        bulkPricing: product.bulkPricing || [],
        deliveryChargeInsideDhaka: product.basicInfo.deliveryChargeInsideDhaka,
        deliveryChargeOutsideDhaka: product.basicInfo.deliveryChargeOutsideDhaka,
        freeShipping: product.additionalInfo?.freeShipping,
      })
    );

    dispatch(openCart());
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
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
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
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  }, [product]);

  const prevImage = useCallback(() => {
    if (product) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  }, [product]);

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
                    className={`w-24 h-24 rounded-component border-2 transition-all flex-shrink-0 bg-bg-base/30 overflow-hidden ${
                      selectedImage === idx
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
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating?.average || 0)
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
              <div className="flex items-baseline gap-4">
                {product.price.discounted ? (
                  <>
                    <span className="text-3xl font-semibold text-danger">
                      ৳{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-xl font-medium text-text-muted line-through">
                      ৳{product.price.regular.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-semibold text-text-primary">
                    ৳{displayPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {/* Bulk Pricing Section */}
              {product.bulkPricing && product.bulkPricing.length > 0 && (
                <div className="bg-secondary/5 rounded-2xl p-6 border border-secondary/10 space-y-4">
                  <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Bulk Pricing Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.bulkPricing.map((tier, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-secondary/10 flex justify-between items-center shadow-sm">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Buy {tier.minQuantity}+</span>
                        <span className="text-secondary font-bold">৳{tier.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                <div className="space-y-4">
                  {product?.variants?.map((variantGroup: any) => {
                    const isPricingGrp = (groupName: string) => {
                      const name = groupName.toLowerCase();
                      return name.includes("qty") || name.includes("quantity") || name.includes("টা") || name.includes("প্যাকেজ");
                    };
                    const isPricing = isPricingGrp(variantGroup.group);

                    return (
                    <div key={variantGroup.group} className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
                        Select {variantGroup.group} {isPricing && "(Updates with Quantity)"}
                      </label>
                      <div className={`flex flex-wrap gap-2`}>
                        {variantGroup.items.map((item: any) => {
                          const groupSelections = selectedVariants[variantGroup.group] || [];
                          const isActive = groupSelections.some((i: any) => i.value === item.value);

                          return (
                            <button
                              key={item.value}
                              onClick={() => {
                                const currentItems = selectedVariants[variantGroup.group] || [];
                                const index = currentItems.findIndex((i: any) => i.value === item.value);
                                let updatedItems;
                                if (index > -1) {
                                  updatedItems = currentItems.filter((i: any) => i.value !== item.value);
                                } else {
                                  updatedItems = [...currentItems, item];
                                }
                                
                                const newVariants: Record<string, any[]> = {
                                  ...selectedVariants,
                                  [variantGroup.group]: updatedItems
                                };
                                
                                if (updatedItems.length === 0) {
                                  delete newVariants[variantGroup.group];
                                }
                                
                                setIsManualQty(false);
                                setSelectedVariants(newVariants);

                                if (item.image?.url) {
                                  const imgIdx = product.images.findIndex((img: any) => img.url === item.image.url);
                                  if (imgIdx !== -1) setSelectedImage(imgIdx);
                                }
                              }}
                              className={`px-6 py-3 rounded-component border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                isActive
                                  ? "border-secondary bg-secondary text-white shadow-lg"
                                  : "border-border-main hover:border-text-secondary text-text-primary bg-bg-surface"
                              }`}
                            >
                              {item.value}
                              {(item.price ?? 0) > 0 && <span className="ml-2 opacity-60">
                                {isPricing ? "" : "+" }৳{item.price}
                              </span>}
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
                    Quantity
                  </span>
                  <div className="flex items-center border border-border-main rounded-component overflow-hidden bg-bg-surface h-12">
                    <button
                      onClick={() => {
                        setIsManualQty(true);
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      className="w-12 h-full flex items-center justify-center hover:bg-bg-base transition-colors border-r border-border-main"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 h-full flex items-center justify-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        setIsManualQty(true);
                        setQuantity(quantity + 1);
                      }}
                      className="w-12 h-full flex items-center justify-center hover:bg-bg-base transition-colors border-l border-border-main"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-14 bg-secondary text-white rounded-component font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-14 h-14 flex items-center justify-center rounded-component border-2 transition-all ${
                      isWishlisted
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
                      className={`p-8 border-border-main ${
                        i % 2 === 0 ? "md:border-r" : ""
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
              .slice(0,4)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            {(!relatedProductsResponse?.data || relatedProductsResponse.data.length <= 1) && 
              Array.from({length: 4}).map((_, i) => <ProductCardSkeleton key={i} />)
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
                  className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === idx
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
