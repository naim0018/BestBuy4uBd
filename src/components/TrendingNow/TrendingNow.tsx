import { useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "@/store/Api/ProductApi";

const FETCH_LIMIT = 12;

const TrendingNow = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: productsData, isLoading } = useGetAllProductsQuery({
    limit: FETCH_LIMIT,
    page: 1,
  });

  const trendingProducts = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data
      .slice()
      .sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0))
      .map((item: any) => ({
        id: item._id,
        title: item.basicInfo?.title || "Product",
        price: item.price?.discounted || item.price?.regular || 0,
        oldPrice: item.price?.discounted ? item.price.regular : undefined,
        discount: item.price?.discounted
          ? Math.round(
              ((item.price.regular - item.price.discounted) /
                item.price.regular) *
                100,
            )
          : undefined,
        image:
          item.images?.[0]?.url ||
          "https://placehold.co/300x300/f5f5f5/aaa?text=Product",
        rating: item.rating?.average || 0,
        reviews: item.rating?.count || 0,
        sold: item.sold || 0,
        category: item.basicInfo?.category || "",
      }));
  }, [productsData]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <section className="py-10 bg-bg-base">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-orange-500 inline-block" />
            <h2 className="text-xl font-bold text-text-primary">
              Trending Now
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-border-main bg-bg-surface flex items-center justify-center text-text-muted hover:bg-bg-base transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-border-main bg-bg-surface flex items-center justify-center text-text-muted hover:bg-bg-base transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 rounded-xl bg-bg-surface border border-border-main animate-pulse overflow-hidden"
                >
                  <div className="h-40 bg-bg-base" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-3/4 bg-bg-base rounded" />
                    <div className="h-3 w-1/2 bg-bg-base rounded" />
                    <div className="h-4 w-1/3 bg-bg-base rounded mt-2" />
                  </div>
                </div>
              ))
            : trendingProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex-shrink-0 w-48 group"
                >
                  <div className="bg-bg-surface rounded-xl border border-border-main overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Image */}
                    <div className="relative h-40 bg-bg-base overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discount && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-[11px] text-text-muted mb-0.5 truncate">
                        {product.category}
                      </p>
                      <h3 className="text-sm text-text-primary font-medium line-clamp-2 leading-snug mb-2">
                        {product.title}
                      </h3>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < Math.floor(product.rating)
                                  ? "fill-current text-yellow-400"
                                  : "fill-current text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-text-muted">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price row */}
                      <div className="flex items-center justify-between">
                        <div>
                          {product.oldPrice && (
                            <span className="text-[10px] text-text-muted line-through block">
                              ৳{product.oldPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm font-bold text-text-primary">
                            ৳{product.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-text-muted">
                          {product.sold} sold
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/products"
            className="text-sm text-secondary font-semibold hover:underline underline-offset-4"
          >
            View all →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
