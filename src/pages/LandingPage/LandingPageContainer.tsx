import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/store/Api/ProductApi";
import { useTracking } from "@/hooks/useTracking";
import { Template1Skeleton } from "./Components/LandingPageExactSkeleton";

import Template1LandingPage from "./Template1/LandingPage";
import Template2LandingPage from "./Template2/LandingPage/LandingPage";
import Template3LandingPage from "./Template3/LandingPage/LandingPage";
import Template4LandingPage from "./Template4/LandingPage/LandingPage";

const LandingPageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const { trackViewItem } = useTracking();
  
  const {
    data: response,
    isLoading,
    error,
  } = useGetProductByIdQuery(
    { id: id as string },
    {
      skip: !id,
    }
  );

  const product = response?.data;
  const template = product?.additionalInfo?.landingPageTemplate || "template1";

  useEffect(() => {
    if (product) {
      // Dynamically update document title to show product name and tenant store name
      const storeName =
        typeof window !== "undefined"
          ? window.location.hostname
              .replace(/^www\./i, "")
              .split(".")[0]
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
          : "Shop";

      document.title = `${product.basicInfo.title} | ${storeName}`;

      trackViewItem({
        id: product._id,
        name: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        category: product.basicInfo.category,
      });
    }
  }, [product, trackViewItem]);

  // Initial fetch loading (default to Template 1 layout before metadata is known)
  if (isLoading) {
    return <Template1Skeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-600 text-lg">
            Error loading product: {(error as any)?.message || "Product not found"}
          </p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (template.toLowerCase()) {
      case "template4":
        return <Template4LandingPage product={product} />;
      case "template3":
        return <Template3LandingPage product={product} />;
      case "template2":
        return <Template2LandingPage product={product} />;
      case "template1":
      default:
        return <Template1LandingPage product={product} />;
    }
  };

  return renderTemplate();
};

export default LandingPageContainer;
