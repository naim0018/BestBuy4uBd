import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { ProductFormValues } from "./Product";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

// ============================================
// 🖼️ Images Array Component
// ============================================
interface ImagesFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function ImagesField({ control, register, errors }: ImagesFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Product Images</h3>
        <button
          type="button"
          onClick={() => append({ url: "", alt: "" })}
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-border rounded-xl bg-white shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`images.${index}.url`)}
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                  {errors.images?.[index]?.url && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.images[index]?.url?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`images.${index}.alt`)}
                    type="text"
                    placeholder="Descriptive alt text for accessibility"
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                  {errors.images?.[index]?.alt && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.images[index]?.alt?.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No images added yet</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// 🔑 Key Features Array Component
// ============================================
interface KeyFeaturesFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

export function KeyFeaturesField({ control, register }: KeyFeaturesFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "basicInfo.keyFeatures",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
        <button
          type="button"
          onClick={() => append("")}
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Feature
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <span className="flex-shrink-0 w-8 h-8 bg-primary-blue/10 text-primary-blue rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <input
              {...register(`basicInfo.keyFeatures.${index}`)}
              type="text"
              placeholder="Enter a key feature"
              className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove feature"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 🎨 Variants Array Component
// ============================================
interface VariantsFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function VariantsField({
  control,
  register,
  errors,
}: VariantsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Product Variants
        </h3>
        <button
          type="button"
          onClick={() =>
            append({ group: "", items: [{ value: "", price: 0, stock: 0 }] })
          }
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Variant Group
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, variantIndex) => (
          <VariantGroup
            key={field.id}
            variantIndex={variantIndex}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => remove(variantIndex)}
          />
        ))}
      </div>
    </div>
  );
}

// Variant Group Component
function VariantGroup({
  variantIndex,
  control,
  register,
  errors,
  onRemove,
}: {
  variantIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.items`,
  });

  return (
    <div className="p-4 border-2 border-border rounded-xl bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <input
          {...register(`variants.${variantIndex}.group`)}
          type="text"
          placeholder="Variant group name (e.g., Color, Size)"
          className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        />
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove variant group"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      {errors.variants?.[variantIndex]?.group && (
        <p className="text-xs text-red-500 mb-2">
          {errors.variants[variantIndex]?.group?.message}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-4 gap-2 p-3 bg-white rounded-lg"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                {...register(
                  `variants.${variantIndex}.items.${itemIndex}.value`
                )}
                type="text"
                placeholder="e.g., Red"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                {...register(
                  `variants.${variantIndex}.items.${itemIndex}.price`,
                  {
                    valueAsNumber: true,
                  }
                )}
                type="number"
                placeholder="0"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                {...register(
                  `variants.${variantIndex}.items.${itemIndex}.stock`,
                  {
                    valueAsNumber: true,
                  }
                )}
                type="number"
                placeholder="0"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                disabled={fields.length === 1}
                className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ value: "", price: 0, stock: 0 })}
        className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-blue hover:text-primary-blue transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}

// ============================================
// 📋 Specifications Array Component
// ============================================
interface SpecificationsFieldProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function SpecificationsField({
  control,
  register,
  errors,
}: SpecificationsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Specifications</h3>
        <button
          type="button"
          onClick={() =>
            append({ group: "", items: [{ name: "", value: "" }] })
          }
          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Specification Group
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, specIndex) => (
          <SpecificationGroup
            key={field.id}
            specIndex={specIndex}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => remove(specIndex)}
          />
        ))}
      </div>
    </div>
  );
}

// Specification Group Component
function SpecificationGroup({
  specIndex,
  control,
  register,
  errors,
  onRemove,
}: {
  specIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `specifications.${specIndex}.items`,
  });

  return (
    <div className="p-4 border-2 border-border rounded-xl bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <input
          {...register(`specifications.${specIndex}.group`)}
          type="text"
          placeholder="Specification group name (e.g., General, Display)"
          className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        />
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove specification group"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      {errors.specifications?.[specIndex]?.group && (
        <p className="text-xs text-red-500 mb-2">
          {errors.specifications[specIndex]?.group?.message}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-3 gap-2 p-3 bg-white rounded-lg"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                {...register(
                  `specifications.${specIndex}.items.${itemIndex}.name`
                )}
                type="text"
                placeholder="e.g., Screen Size"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                {...register(
                  `specifications.${specIndex}.items.${itemIndex}.value`
                )}
                type="text"
                placeholder="e.g., 6.5 inches"
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                disabled={fields.length === 1}
                className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ name: "", value: "" })}
        className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-blue hover:text-primary-blue transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}
