import React, { useState } from "react";
import KeyFeatures from "./KeyFeatures";

import ProductDescription from "./ProductDescription";
import PolicyAndShipping from "./PolicyAndShipping";
import CustomerReviews from "./CustomerReviews";
import { Product, ProductImage } from '@/types/Product/Product';
import Specifications from "./Specifications";

interface LandingPageProductDetailsProps {
  product: Product;
  currentPrice: number;
  currentImage: ProductImage | null;
  selectedVariants: Map<string, any>;
  quantity: number;
  hasDiscount: boolean;
  savings: number;
  savingsPercent: number;
  scrollToCheckout: () => void;
}

const LandingPageProductDetails: React.FC<LandingPageProductDetailsProps> = ({
  product,
}) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "বিস্তারিত", icon: "📝" },
    { id: "specifications", label: "স্পেসিফিকেশন", icon: "⚙️" },
    { id: "reviews", label: "রিভিউ", icon: "⭐" },
    { id: "shipping", label: "শিপিং ও রিটার্ন", icon: "🚚" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <ProductDescription description={product.basicInfo.description} />;
      case "specifications":
        return <Specifications specifications={product.specifications || []} />;
      case "reviews":
        return <CustomerReviews reviews={product.reviews || []} />;
      case "shipping":
        return <PolicyAndShipping shippingDetails={product.shippingDetails} additionalInfo={product.additionalInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-12">
        <div className=" space-y-8">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            {renderTabContent()}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <KeyFeatures features={product.basicInfo.keyFeatures || []} />
          
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">🕒</span>
              দ্রুত ডেলিভারি
            </h3>
            <p className="text-blue-800 leading-relaxed">
              আপনার অর্ডার করার ২৪-৪৮ ঘণ্টার মধ্যে আমরা পণ্য ডেলিভারি নিশ্চিত করি। 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageProductDetails;
