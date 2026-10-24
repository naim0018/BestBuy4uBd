import { lazy, Suspense } from "react";
import Home from "@/pages/Public/Home/Home1/Home";

const Shop = lazy(() => import("@/pages/Public/Shop/Shop"));
const ProductDetails = lazy(() => import("@/pages/Public/Shop/Components/ProductDetails/ProductDetails"));
const Checkout = lazy(() => import("@/pages/Public/Checkout/Checkout"));
const Contact = lazy(() => import("../pages/Public/Contact/Contact"));
const OrderTrack = lazy(() => import("@/pages/Public/OrderTracking/OrderTrack"));
const Cart = lazy(() => import("@/pages/Public/Cart/Cart"));

const PageLoadingFallback = () => (
  <div className="flex h-[400px] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Component />
  </Suspense>
);

export const publicRoutes = [
  {
    label: "Home",
    index: true,
    path: "/",
    element: <Home />,
  },
  {
    label: "Shop",
    path: "/shop",
    element: withSuspense(Shop),
    children: [],
  },
  {
    path: "/product/:id",
    element: withSuspense(ProductDetails),
  },
  {
    path: "/checkout",
    element: withSuspense(Checkout),
  },
  {
    label: "Contact",
    path: "/contact",
    element: withSuspense(Contact),
  },
  {
    path: "/order-track",
    element: withSuspense(OrderTrack),
  },
  {
    label: "Cart",
    path: "/cart",
    element: withSuspense(Cart),
  },
];
