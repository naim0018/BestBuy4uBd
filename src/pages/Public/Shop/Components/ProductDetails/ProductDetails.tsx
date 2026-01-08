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

const ForYouCardSkeleton = () => (
  <div className="flex gap-4 items-center animate-pulse">
    <Skeleton className="w-20 h-20 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
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
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { data: allProductsResponse } = useGetAllProductsQuery({ limit: 12 });

  const product = productResponse?.data;
  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;

    const variantsPayload = product.variants
      ?.map((vg) => ({
        ...vg,
        value: selectedVariants[vg.group],
      }))
      .filter((v) => v.value);

    dispatch(
      addToCart({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        image: product.images[0]?.url,
        quantity: quantity,
        selectedVariants: variantsPayload || [],
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
                      ৳{product.price.discounted.toLocaleString()}
                    </span>
                    <span className="text-xl font-medium text-text-muted line-through">
                      ৳{product.price.regular.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-semibold text-text-primary">
                    ৳{product.price.regular.toLocaleString()}
                  </span>
                )}
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  {product.variants.map((variantGroup) => (
                    <div key={variantGroup.group} className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">
                        Select {variantGroup.group}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variantGroup.items.map((item) => (
                          <button
                            key={item.value}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variantGroup.group]: item.value,
                              }))
                            }
                            className={`px-4 py-2 rounded-component text-xs font-semibold transition-all border ${
                              selectedVariants[variantGroup.group] ===
                              item.value
                                ? "border-secondary bg-secondary text-white shadow-lg shadow-secondary/20"
                                : "border-border-main text-text-secondary hover:border-secondary/50 bg-bg-base"
                            }`}
                          >
                            {item.value}
                            {item.price && (
                              <span className="ml-1 opacity-80">
                                (+৳{item.price})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="py-2 bg-secondary/5 rounded-component px-4 inline-block border border-secondary/10">
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-[0.2em]">
                  Free Shipping Available
                </span>
              </div>

              <div className="h-px bg-border-main" />

              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stockStatus === "In Stock"
                      ? "bg-secondary"
                      : "bg-danger"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    product.stockStatus === "In Stock"
                      ? "text-secondary"
                      : "text-danger"
                  }`}
                >
                  {product.stockStatus}
                </span>
                <span className="text-sm font-medium text-text-muted px-3 border-l border-border-main">
                  Only {product.stockQuantity || 0} left
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <label className="tag text-text-muted pl-1">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-bg-base rounded-component p-1 border border-border-main">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-secondary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-text-primary">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-secondary text-white rounded-component font-semibold shadow-xl shadow-secondary/30 uppercase tracking-widest text-sm hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleWishlist}
                    className={`w-14 h-14 rounded-component flex items-center justify-center transition-all border group ${
                      isWishlisted
                        ? "bg-danger/10 border-danger text-danger"
                        : "bg-bg-base border-border-main text-text-muted hover:text-danger hover:bg-danger/5"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isWishlisted
                          ? "fill-current"
                          : "group-hover:fill-danger"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-6 border-t border-border-main space-y-4">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2">
                  Guaranteed Safe Checkout
                </p>
                <div className="flex flex-wrap gap-2 opacity-60">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    className="h-6 grayscale hover:grayscale-0 transition-all"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-6 grayscale hover:grayscale-0 transition-all"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="Paypal"
                    className="h-6 grayscale hover:grayscale-0 transition-all"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/16/Bkash_logo.png"
                    alt="Bkash"
                    className="h-6 grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4 text-xs font-medium">
                <div className="flex gap-2">
                  <span className="text-text-muted uppercase tracking-widest">
                    SKU:
                  </span>
                  <span className="text-text-primary">
                    {product.basicInfo.productCode || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-text-muted uppercase tracking-widest">
                    Category:
                  </span>
                  <span className="text-text-primary">
                    {product.basicInfo.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-text-muted uppercase tracking-widest">
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="text-text-primary after:content-[','] last:after:content-['']"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button className="w-9 h-9 rounded-full bg-bg-base flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Facebook className="w-4 h-4 fill-current" />
                </button>
                <button className="w-9 h-9 rounded-full bg-bg-base flex items-center justify-center text-text-muted hover:bg-info hover:text-white transition-all shadow-sm">
                  <Twitter className="w-4 h-4 fill-current" />
                </button>
                <button className="w-9 h-9 rounded-full bg-bg-base flex items-center justify-center text-text-muted hover:bg-danger hover:text-white transition-all shadow-sm">
                  <Instagram className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Action Box & Trust */}
            <div className="w-full lg:w-[20%] flex flex-col gap-6">
              {/* Brand Box */}
              <div className="bg-bg-surface rounded-component p-4 border border-border-main">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Brand Info
                    </span>
                    <span className="text-[9px] font-medium text-secondary bg-secondary/5 px-2 py-0.5 rounded-full">
                      Official
                    </span>
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-text-primary">
                      {product.basicInfo.brand}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                      Authentic product sourced directly from{" "}
                      {product.basicInfo.brand} or authorized distributors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Your Cart Preview */}
              <div className="bg-bg-surface rounded-component p-6 border-2 border-secondary/20 shadow-xl shadow-bg-base/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <X className="w-4 h-4 text-text-muted hover:text-danger cursor-pointer" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-secondary" />
                  YOUR CART
                </h3>

                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-main">
                  <div className="w-14 h-14 bg-bg-base rounded-inner flex-shrink-0 p-2">
                    <img
                      src={product.images[0]?.url}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-text-primary line-clamp-1 truncate uppercase">
                      {product.basicInfo.title}
                    </p>
                    <p className="text-xs font-semibold text-secondary">
                      {quantity} x ৳
                      {(
                        product.price.discounted || product.price.regular
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-widest">
                    Sub Total:
                  </span>
                  <span className="text-lg font-semibold text-text-primary">
                    ৳
                    {(
                      quantity *
                      (product.price.discounted || product.price.regular)
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => dispatch(openCart())}
                    className="w-full py-3 bg-text-primary text-white rounded-component font-semibold text-[10px] uppercase tracking-widest shadow-lg hover:bg-text-primary/90 transition-all"
                  >
                    View Cart
                  </button>
                  <Link
                    to="/checkout"
                    className="w-full py-3 bg-secondary text-white rounded-component font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all text-center block"
                  >
                    Checkout
                  </Link>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-bg-base rounded-component p-6 border border-border-main space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-secondary shadow-sm flex-shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary uppercase tracking-widest">
                      Fast Delivery
                    </p>
                    <p className="text-[10px] font-medium text-text-muted">
                      Estimated delivery:{" "}
                      {product.additionalInfo?.estimatedDelivery || "2-4 days"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary uppercase tracking-widest">
                      Easy Returns
                    </p>
                    <p className="text-[10px] font-medium text-text-muted">
                      {product.additionalInfo?.returnPolicy ||
                        "30-day money back guarantee"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Detailed Information Sections */}
          <div className="w-full lg:w-[75%] space-y-10">
            {/* Description Section */}
            <div className="card-container p-8 md:p-10">
              <h3 className="h6 uppercase tracking-[0.3em] text-secondary mb-8 flex items-center gap-4">
                <div className="w-10 h-px bg-secondary/30" />
                Description
              </h3>
              <div className="prose prose-neutral max-w-none">
                <div
                  className="text-text-secondary text-base leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.basicInfo.description,
                  }}
                />
              </div>
            </div>

            {/* Key Features Section */}
            <div className="card-container p-8 md:p-10">
              <h3 className="h6 uppercase tracking-[0.3em] text-secondary mb-8 flex items-center gap-4">
                <div className="w-10 h-px bg-secondary/30" />
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.basicInfo.keyFeatures?.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 bg-bg-base/50 rounded-component border border-border-main hover:border-secondary/30 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all flex-shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mt-1">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Section */}
            <div className="card-container p-8 md:p-10">
              <h3 className="h6 uppercase tracking-[0.3em] text-secondary mb-8 flex items-center gap-4">
                <div className="w-10 h-px bg-secondary/30" />
                Specifications
              </h3>
              <div className="space-y-10">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, i) => (
                    <div key={i} className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted flex items-center gap-3">
                        {spec.group}
                      </h4>
                      <div className="grid grid-cols-1 gap-px bg-border-main rounded-component overflow-hidden border border-border-main">
                        {spec.items.map((item, j) => (
                          <div
                            key={j}
                            className="grid grid-cols-3 bg-bg-surface group"
                          >
                            <div className="p-4 text-[10px] font-bold text-text-muted uppercase tracking-wider bg-bg-base/30 group-hover:bg-bg-base/50 transition-colors">
                              {item.name}
                            </div>
                            <div className="p-4 text-xs font-semibold text-text-primary col-span-2 group-hover:bg-bg-base/20 transition-colors">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      No detailed specifications available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: For You Sidebar */}
          <div className="w-full lg:w-[25%] lg:sticky lg:top-24">
            <div className="card-container p-6">
              <h3 className="h6 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                For You
              </h3>
              <div className="space-y-8">
                {forYouProducts.map((p: any) => (
                  <ForYouCard key={p._id} product={p} />
                ))}
                {forYouProducts.length === 0 && (
                  <div className="space-y-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ForYouCardSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-border-main">
                <div className="bg-secondary/5 rounded-component p-5 border border-secondary/10">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">
                    Member Discount
                  </p>
                  <p className="text-xs font-medium text-text-muted leading-relaxed">
                    Sign up now to get exclusive deals and 10% off on your first
                    order!
                  </p>
                  <button className="mt-4 w-full py-2 bg-secondary text-white rounded-component text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="space-y-10 my-14">
          <div className="flex items-center justify-between">
            <h2 className="h3 uppercase tracking-tighter">Related Products</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-border-main flex items-center justify-center text-text-muted hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm">
                {"<"}
              </button>
              <button className="w-10 h-10 rounded-full border border-border-main flex items-center justify-center text-text-muted hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm">
                {">"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {relatedProductsResponse?.data
              ? relatedProductsResponse.data
                  .filter((p) => p._id !== product._id)
                  .slice(0, 5)
                  .map((item) => <ProductCard key={item._id} product={item} />)
              : Array.from({ length: 5 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
          </div>
        </div>
      </CommonWrapper>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-6">
              <div className="text-white">
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {product.basicInfo.title}
                </h2>
                <p className="text-[10px] text-white/50 font-medium mt-1">
                  Image {selectedImage + 1} of {product.images.length}
                </p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox main view */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5 z-10"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, x: -20 }}
                src={product.images[selectedImage]?.url}
                alt=""
                className="max-w-full max-h-full object-contain select-none"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5 z-10"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Lightbox Thumbnails */}
            <div className="p-8 flex justify-center gap-4 overflow-x-auto scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg border-2 transition-all flex-shrink-0 bg-white/5 overflow-hidden ${
                    selectedImage === idx
                      ? "border-secondary scale-110 shadow-lg shadow-secondary/20"
                      : "border-white/10 hover:border-white/30"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
