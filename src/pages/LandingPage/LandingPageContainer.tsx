import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/store/Api/ProductApi";
import Template1LandingPage from "./Template1/LandingPage";
import Template2LandingPage from "./Template2/LandingPage/LandingPage";
import Template3LandingPage from "./Template3/LandingPage/LandingPage";

const LandingPageContainer = () => {
  const { id } = useParams<{ id: string }>();
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
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

  // Dynamic template rendering based on product configuration
  switch (template.toLowerCase()) {
    case "template3":
      return <Template3LandingPage product={product} />;
    case "template2":
      return <Template2LandingPage product={product} />;
    case "template1":
    default:
      return <Template1LandingPage product={product} />;
  }
};

export default LandingPageContainer;
