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
    ProductFormValues | undefined
  >(undefined);

  // Fetch existing product (only if updating)
  const { data: existing, isLoading } = useGetProductByIdQuery(id!, {
    skip: isAdd,
  });

  // RTK Mutation for create/update
  const [saveProduct, { isLoading: isSaving }] = useAddProductMutation();

  // When existing product loads, set it as default values
  useEffect(() => {
    if (existing) setDefaultValues(existing);
  }, [existing]);

  const handleSubmit = (values: ProductFormValues) => {
    setDraft(values);
    setPreview(true);
  };

  const handleConfirm = async () => {
    if (!draft) return;
    try {
      await saveProduct({ id: isAdd ? undefined : id, data: draft }).unwrap();
      alert(isAdd ? "Product created" : "Product updated");
      setPreview(false);
    } catch (err) {
      console.error(err);
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
