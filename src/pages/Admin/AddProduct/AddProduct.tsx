import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProductFormNew from "./Components/ProductFormNew"; // New form using field configs
import ProductPreviewNew from "./Components/ProductPreviewNew";
import { ProductFormValues } from "./Components/Product";
import {
  useAddProductMutation,
  useGetProductByIdQuery,
} from "@/store/Api/ProductApi";


export default function ProductAdminPage() {
  const { id } = useParams<{ id: string }>();
  const isAdd = id === "new";

  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState<ProductFormValues | null>(null);
  const [defaultValues, setDefaultValues] = useState<
    Partial<ProductFormValues> | undefined
  >(undefined);

  // Fetch existing product (only if updating)
  const { data: existing, isLoading } = useGetProductByIdQuery({ id: id! }, {
    skip: isAdd,
  });

  // RTK Mutation for create/update
  const [saveProduct, { isLoading: isSaving }] = useAddProductMutation();

  // When existing product loads, set it as default values
  useEffect(() => {
    if (existing) setDefaultValues(existing.data as unknown as ProductFormValues);
  }, [existing]);

  const handleSubmit = (values: ProductFormValues) => {
    setDraft(values);
    setPreview(true);
  };

  const handleConfirm = async () => {
    if (!draft) return;
    try {
      // Transform the form data to match the API payload structure
      const productData = {
        basicInfo: {
          productCode: draft.basicInfo.productCode,
          title: draft.basicInfo.title,
          brand: draft.basicInfo.brand,
          category: draft.basicInfo.category,
          subcategory: draft.basicInfo.subcategory,
          description: draft.basicInfo.description,
          keyFeatures: draft.basicInfo.keyFeatures?.filter(
            (feature) => feature.trim() !== ""
          ) || [],
        },
        price: {
          regular: Number(draft.price.regular),
          discounted: draft.price.discounted
            ? Number(draft.price.discounted)
            : undefined,
          savings: draft.price.savings ? Number(draft.price.savings) : undefined,
          savingsPercentage: draft.price.savingsPercentage 
            ? Number(draft.price.savingsPercentage) 
            : undefined,
          selectedVariants: draft.price.selectedVariants,
        },
        addDeliveryCharge: draft.basicInfo.addDeliveryCharge || false,
        deliveryChargeInsideDhaka: draft.basicInfo.deliveryChargeInsideDhaka 
          ? Number(draft.basicInfo.deliveryChargeInsideDhaka) 
          : 0,
        deliveryChargeOutsideDhaka: draft.basicInfo.deliveryChargeOutsideDhaka 
          ? Number(draft.basicInfo.deliveryChargeOutsideDhaka) 
          : 0,
        stockStatus: draft.stockStatus,
        stockQuantity: draft.stockQuantity ? Number(draft.stockQuantity) : 0,
        sold: draft.sold ? Number(draft.sold) : 0,
        images: draft.images.filter((image) => image.url.trim() !== ""),
        variants: draft.variants
          ?.filter((variant) => variant.group.trim() !== "")
          .map((variant) => ({
            group: variant.group,
            items: variant.items
              .filter((item) => item.value.trim() !== "")
              .map((item) => ({
                value: item.value,
                price: item.price ? Number(item.price) : 0,
                stock: item.stock ? Number(item.stock) : 0,
                image: item.image ? {
                  url: item.image.url || "",
                  alt: item.image.alt || "",
                } : undefined,
              })),
          })) || [],
        specifications: draft.specifications
          ?.filter((spec) => spec.group.trim() !== "")
          .map((spec) => ({
            group: spec.group,
            items: spec.items
              .filter(
                (item) => item.name.trim() !== "" && item.value.trim() !== ""
              )
              .map((item) => ({
                name: item.name,
                value: item.value,
              })),
          })) || [],
        shippingDetails: {
          length: Number(draft.shippingDetails.length),
          width: Number(draft.shippingDetails.width),
          height: Number(draft.shippingDetails.height),
          weight: Number(draft.shippingDetails.weight),
          dimensionUnit: draft.shippingDetails.dimensionUnit,
          weightUnit: draft.shippingDetails.weightUnit,
        },
        additionalInfo: {
          freeShipping: Boolean(draft.additionalInfo?.freeShipping),
          isFeatured: Boolean(draft.additionalInfo?.isFeatured),
          isOnSale: Boolean(draft.additionalInfo?.isOnSale),
          estimatedDelivery: draft.additionalInfo?.estimatedDelivery,
          returnPolicy: draft.additionalInfo?.returnPolicy,
          warranty: draft.additionalInfo?.warranty,
        },
        seo: {
          metaTitle: draft.seo?.metaTitle || undefined,
          metaDescription: draft.seo?.metaDescription || undefined,
          slug: draft.seo?.slug || undefined,
        },
        tags: draft.tags?.filter((tag) => tag.trim() !== "") || [],
      };

      console.log("Sending product data:", productData); // Debug log
      await saveProduct(productData).unwrap();
      alert(isAdd ? "Product created" : "Product updated");
      setPreview(false);
    } catch (err) {
      console.error("Save product error:", err);
      alert("Failed to save product");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  // Preview mode
  if (preview && draft) {
    return (
      <div className="p-4">
        <ProductPreviewNew data={draft as ProductFormValues} />
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white"
            disabled={isSaving}
          >
            {isAdd ? "Create" : "Save"}
          </button>
          <button
            onClick={() => setPreview(false)}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Back to edit
          </button>
        </div>
      </div>
    );
  }

  // Form mode
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isAdd ? "Add Product" : "Edit Product"}
      </h1>
      <ProductFormNew defaultValues={defaultValues} onSubmit={handleSubmit} />
    </div>
  );
}
