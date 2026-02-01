
/**
 * Custom hook for Google Tag Manager and GA4 Tracking
 * Follows GA4 Ecommerce schema
 */
export const useTracking = () => {
  const pushToDataLayer = (eventData: any) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
    }
  };

  const trackEvent = (event: string, params: Record<string, any> = {}) => {
    pushToDataLayer({
      event,
      ...params,
    });
  };

  const trackAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    brand?: string;
    variant?: string;
    quantity: number;
  }) => {
    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            item_variant: product.variant,
            price: product.price,
            quantity: product.quantity,
          },
        ],
      },
    });
  };

  const trackPurchase = (order: {
    transaction_id: string;
    value: number;
    tax?: number;
    shipping?: number;
    currency?: string;
    coupon?: string;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
      item_category?: string;
      item_variant?: string;
    }>;
    user_data?: {
      email?: string;
      phone_number?: string;
      address?: {
        first_name?: string;
        last_name?: string;
        street?: string;
        city?: string;
        region?: string;
        postal_code?: string;
        country?: string;
      };
    };
  }) => {
    pushToDataLayer({
      event: "purchase",
      ecommerce: {
        transaction_id: order.transaction_id,
        value: order.value,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        currency: order.currency || "BDT",
        coupon: order.coupon || "",
        items: order.items,
      },
      user_data: order.user_data,
    });
  };

  const trackViewItem = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    pushToDataLayer({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          },
        ],
      },
    });
  };

  const trackBeginCheckout = (items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
    variant?: string;
  }[], value: number, coupon?: string) => {
    pushToDataLayer({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: value,
        coupon: coupon,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          item_variant: item.variant,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });
  };

  const trackAddToWishlist = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    pushToDataLayer({
      event: "add_to_wishlist",
      ecommerce: {
        currency: "BDT",
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          }
        ]
      }
    });
  };

  const trackRemoveFromCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
  }) => {
    pushToDataLayer({
      event: "remove_from_cart",
      ecommerce: {
        currency: "BDT",
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_variant: product.variant,
            price: product.price,
            quantity: product.quantity,
          }
        ]
      }
    });
  };

  return {
    trackEvent,
    trackAddToCart,
    trackPurchase,
    trackViewItem,
    trackBeginCheckout,
    trackAddToWishlist,
    trackRemoveFromCart,
    pushToDataLayer
  };
};
