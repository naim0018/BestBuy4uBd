import { useState } from "react";
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
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetProductByIdQuery, useGetAllProductsQuery } from "@/store/Api/ProductApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart, openWishlist } from "@/store/Slices/UISlice";
import { addToWishlist, removeFromWishlist } from "@/store/Slices/wishlistSlice";
import { RootState } from "@/store/store";
import CommonWrapper from "@/common/CommonWrapper";
import ProductCard from "../ProductCard";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { id } = useParams<{ id: string }>();
  const { data: productResponse, isLoading } = useGetProductByIdQuery({ id: id || "" });
  const { data: relatedProductsResponse } = useGetAllProductsQuery({ limit: 5 });
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = productResponse?.data;
  const isWishlisted = product ? wishlistItems.some(item => item._id === product._id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0]?.url,
      quantity: quantity,
      selectedVariants: []
    }));
    
    dispatch(openCart());
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted font-semibold animate-pulse uppercase tracking-widest text-[10px]">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-2 uppercase tracking-tighter">PRODUCT NOT FOUND</h2>
          <p className="text-text-muted mb-6 font-medium uppercase tracking-widest text-[10px]">The product you are looking for does not exist or has been removed.</p>
          <Link to="/shop" className="px-8 py-3 bg-secondary text-white rounded-component font-semibold shadow-lg shadow-secondary/20 uppercase tracking-widest text-xs">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.price.discounted 
    ? Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-bg-base pb-20 font-primary">
      {/* Breadcrumbs */}
      <div className="bg-bg-surface border-b border-border-main mb-8">
        <CommonWrapper className="py-4 px-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-text-muted">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-secondary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-primary truncate max-w-[300px]">{product.basicInfo.title}</span>
          </div>
        </CommonWrapper>
      </div>

      <CommonWrapper className="px-4">
        <div className="card-container p-6 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
              <div className="relative aspect-square card-inner bg-bg-base/50 border border-border-main flex items-center justify-center group overflow-hidden">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={product.images[selectedImage]?.url}
                  alt={product.basicInfo.title}
                  className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-3">
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
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-24 rounded-component border-2 transition-all flex-shrink-0 bg-bg-base/30 overflow-hidden ${
                      selectedImage === idx ? "border-secondary scale-105 shadow-md" : "border-border-main hover:border-text-muted"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Product Info */}
            <div className="w-full lg:w-[35%] flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating?.average || 0) ? "fill-current" : "text-text-muted/20"}`} />
                  ))}
                </div>
                <span className="small font-medium">({product.rating?.count || 0})</span>
              </div>

              <h1 className="h1 line-clamp-2 uppercase">
                {product.basicInfo.title}
              </h1>

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

              <div className="space-y-3">
                <h4 className="h6 uppercase tracking-widest pl-1">Key Features</h4>
                <ul className="space-y-2">
                  {product.basicInfo.keyFeatures?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-semibold text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-2 bg-secondary/5 rounded-component px-4 inline-block border border-secondary/10">
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-[0.2em]">Free Shipping Available</span>
              </div>

              <div className="h-px bg-border-main" />

              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${product.stockStatus === "In Stock" ? "bg-secondary" : "bg-danger"}`} />
                 <span className={`text-sm font-medium ${product.stockStatus === "In Stock" ? "text-secondary" : "text-danger"}`}>
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
                    <span className="w-12 text-center font-semibold text-text-primary">{quantity}</span>
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
                    <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : "group-hover:fill-danger"}`} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-6 border-t border-border-main space-y-4">
                 <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2">Guaranteed Safe Checkout</p>
                 <div className="flex flex-wrap gap-2 opacity-60">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 grayscale hover:grayscale-0 transition-all" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 grayscale hover:grayscale-0 transition-all" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-6 grayscale hover:grayscale-0 transition-all" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Bkash_logo.png" alt="Bkash" className="h-6 grayscale hover:grayscale-0 transition-all" />
                 </div>
              </div>

              <div className="space-y-2 mt-4 text-xs font-medium">
                 <div className="flex gap-2">
                    <span className="text-text-muted uppercase tracking-widest">SKU:</span>
                    <span className="text-text-primary">{product.basicInfo.productCode || "N/A"}</span>
                 </div>
                 <div className="flex gap-2">
                    <span className="text-text-muted uppercase tracking-widest">Category:</span>
                    <span className="text-text-primary">{product.basicInfo.category}</span>
                 </div>
                 <div className="flex gap-2">
                    <span className="text-text-muted uppercase tracking-widest">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                        {product.tags?.map((t, i) => (
                            <span key={i} className="text-text-primary after:content-[','] last:after:content-['']">{t}</span>
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
               <div className="bg-bg-base rounded-component p-6 border border-border-main text-center flex flex-col items-center gap-3">
                  <span className="tag text-text-muted">BRAND</span>
                  <div className="w-24 h-12 bg-bg-surface rounded-inner shadow-sm flex items-center justify-center p-2">
                     <span className="font-semibold text-text-primary italic uppercase">{product.basicInfo.brand}</span>
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
                        <img src={product.images[0]?.url} alt="" className="w-full h-full object-contain" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-text-primary line-clamp-1 truncate uppercase">{product.basicInfo.title}</p>
                        <p className="text-xs font-semibold text-secondary">{quantity} x ৳{(product.price.discounted || product.price.regular).toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-text-muted uppercase tracking-widest">Sub Total:</span>
                    <span className="text-lg font-semibold text-text-primary">৳{(quantity * (product.price.discounted || product.price.regular)).toLocaleString()}</span>
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
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-widest">Fast Delivery</p>
                        <p className="text-[10px] font-medium text-text-muted">Estimated delivery: {product.additionalInfo?.estimatedDelivery || "2-4 days"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                        <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-widest">Easy Returns</p>
                        <p className="text-[10px] font-medium text-text-muted">{product.additionalInfo?.returnPolicy || "30-day money back guarantee"}</p>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        <div className="space-y-10">
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
                {relatedProductsResponse?.data?.filter(p => p._id !== product._id).slice(0, 5).map((item) => (
                    <ProductCard key={item._id} product={item} />
                ))}
            </div>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default ProductDetails;
