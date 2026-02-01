
import { useCreateOrderMutation } from "@/store/Api/OrderApi";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearCart } from "@/store/Slices/CartSlice";


// Types for props and return values
export interface Variant {
    value: string;
    price?: number;
    image?: { url: string; alt?: string };
}

export interface Product {
    _id: string;
    basicInfo: {
        title: string;
        category?: string;
    };
    price: {
        regular: number;
        discounted?: number;
    };
    images: { url: string; alt?: string }[];
    variants?: {
        group: string;
        items: Variant[];
    }[];
    stockStatus: string;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        slug?: string;
    };
}

export interface CheckoutFormData {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
    courierCharge: string;
    notes?: string;
    email?: string; // Optional email
}

export const useCheckout = (product: Product | undefined, productId: string) => {
    const dispatch = useDispatch();
    const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

    // State
    const [selectedVariants, setSelectedVariants] = useState<Map<string, Variant>>(new Map());
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [currentImage, setCurrentImage] = useState<{ url: string; alt?: string } | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // Coupon State
    const [couponCode, setCouponCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number }>({ code: "", discount: 0 });
    const [discount, setDiscount] = useState<number>(0);

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [successOrderDetails, setSuccessOrderDetails] = useState<any>(null); // Type this better if possible

    // Initialize state when product loads
    useEffect(() => {
        if (product) {
            const initialPrice = product.price.discounted || product.price.regular;
            setCurrentPrice(typeof initialPrice === "number" && !isNaN(initialPrice) ? initialPrice : 0);
            setSelectedVariants(new Map());
            setCurrentImage(product.images[0]);
        }
        return () => {
            if (product) dispatch(clearCart());
        };
    }, [product, dispatch]);

    // Persist applied coupon
    useEffect(() => {
        localStorage.setItem("appliedCoupon", JSON.stringify({ code: appliedCoupon.code, discount: appliedCoupon.discount }))
    }, [appliedCoupon])

    // --- Actions ---

    const handleVariantSelect = (groupName: string, variant: Variant) => {
        const newSelectedVariants = new Map(selectedVariants);
        if (selectedVariants.get(groupName)?.value === variant.value) {
            newSelectedVariants.delete(groupName);
        } else {
            newSelectedVariants.set(groupName, {
                value: variant.value,
                price: variant.price,
                image: variant.image,
            });
        }

        // Price calculation
        let newPrice = product?.price.discounted || product?.price.regular || 0;
        newSelectedVariants.forEach((v) => {
            if (typeof v.price === "number" && !isNaN(v.price)) newPrice = v.price!;
        });
        setCurrentPrice(newPrice);

        // Image update
        const lastWithImage = Array.from(newSelectedVariants.values())
            .reverse()
            .find((v) => v.image?.url);
        setCurrentImage(lastWithImage?.image || product?.images[0] || null);

        setSelectedVariants(newSelectedVariants);
    };

    const handleIncrement = () => setQuantity((q) => q + 1);
    const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
    const handleQuantityChange = (newQuantity: number) => setQuantity(newQuantity > 0 ? newQuantity : 1);

    const applyCoupon = () => {
        const availableCoupons: Record<string, number> = {
            FreeShippingDhaka: 80,
            FreeShippingBD: 150,
            BestBuy: 50,
        };

        if (availableCoupons[couponCode]) {
            const newDiscount = availableCoupons[couponCode];
            setDiscount(newDiscount);
            setAppliedCoupon({ code: couponCode, discount: newDiscount });
            toast.success(`Successfully applied coupon: ${couponCode}`);
        } else {
            setDiscount(0);
            setAppliedCoupon({ code: "", discount: 0 });
            toast.error("Invalid coupon code.");
        }
    };

    const calculateTotalAmount = (courierChargeType?: string, currentDiscount: number = discount) => {
        const productTotal = currentPrice * quantity;
        const deliveryCharge = courierChargeType === "insideDhaka" ? 80 : 150;
        // If courierChargeType is null/undefined (e.g. initial render), default to 80 for display or handle gracefully
        const safeDeliveryCharge = deliveryCharge;

        const total = productTotal + safeDeliveryCharge - currentDiscount;
        return total > 0 ? total : 0;
    };

    const handleSubmit = async (formData: CheckoutFormData) => {
        try {
            const totalAmount = calculateTotalAmount(formData.courierCharge, discount);

            const selectedVariantsObj = Object.fromEntries(
                Array.from(selectedVariants.entries()).map(([group, variant]) => [
                    group,
                    { value: variant.value, price: variant.price || 0 },
                ]),
            );

            const orderData = {
                body: {
                    items: [
                        {
                            product: productId,
                            image: currentImage?.url,
                            quantity,
                            itemKey: `${productId}-${Date.now()}`,
                            price: currentPrice,
                            selectedVariants: selectedVariantsObj,
                        },
                    ],
                    totalAmount: totalAmount,
                    status: "pending",
                    billingInformation: {
                        name: formData.name,
                        email: formData.email || "no-email@example.com",
                        phone: formData.phone,
                        address: formData.address,
                        country: "Bangladesh",
                        paymentMethod: formData.paymentMethod,
                        notes: formData.notes || "",
                    },
                    courierCharge: formData.courierCharge,
                    cuponCode: appliedCoupon.code || "",
                    discount: appliedCoupon.discount || 0,
                },
            };

            const response = await createOrder(orderData).unwrap();

            setSuccessOrderDetails({
                orderId: response.data._id,
                productPrice: currentPrice * quantity,
                deliveryCharge: formData.courierCharge === "insideDhaka" ? 80 : 150,
                totalAmount: totalAmount,
                appliedCoupon: appliedCoupon,
                billingInformation: orderData.body.billingInformation,
            });

            setShowSuccessModal(true);

            // Reset form/state
            setQuantity(1);
            setSelectedVariants(new Map());
            if (product) {
                setCurrentPrice(product.price.discounted || product.price.regular);
                setCurrentImage(product.images[0]);
            }
            setCouponCode("");
            setAppliedCoupon({ code: "", discount: 0 });
            setDiscount(0);

        } catch (error: any) {
            // Toast is handled in UI usually, but we can trigger it here or return error state
            // For consistency with Template 2, we can't render JSX in hook, so we return error logic or use simple toast string
            console.error("Order Error:", error);
            toast.error(error.data?.message || "Sad! Order could not be completed.");
        }
    };

    // Helper calculations
    const hasDiscount = product?.price.discounted && product.price.discounted < product.price.regular;
    const savings = hasDiscount ? (product!.price.regular - product!.price.discounted!) : 0;
    const savingsPercent = hasDiscount ? Math.round((savings / product!.price.regular) * 100) : 0;
    const stockStatusColor = {
        "In Stock": "text-green-600",
        "Out of Stock": "text-red-500",
        "Pre-order": "text-yellow-500",
    }[product?.stockStatus || ""] || "text-gray-500";


    return {
        state: {
            selectedVariants,
            currentPrice,
            currentImage,
            quantity,
            couponCode,
            discount,
            appliedCoupon,
            showSuccessModal,
            successOrderDetails,
            isOrderLoading
        },
        actions: {
            setQuantity: handleQuantityChange,
            handleIncrement,
            handleDecrement,
            handleVariantSelect,
            setCouponCode,
            applyCoupon,
            setShowSuccessModal,
            handleSubmit
        },
        calculations: {
            calculateTotalAmount,
            hasDiscount,
            savings,
            savingsPercent,
            stockStatusColor
        }
    };
};
