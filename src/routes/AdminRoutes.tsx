import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  SettingsIcon,
  PackageSearch,
  Package2,
  LayoutTemplate,
  ShoppingCart,
  Briefcase,
  Truck,
  LayoutGrid,
  BarChart3,
  MessageSquare,
} from "lucide-react";

// Lazy-loaded Admin Pages
const Settings = lazy(() => import("@/pages/Admin/Settings/Settings"));
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard/Dashboard"));
const Visitors = lazy(() => import("@/pages/Admin/Visitors/Visitors"));
const Category = lazy(() => import("@/pages/Admin/Category/Category"));
const AddProduct = lazy(() => import("@/pages/Admin/AddProduct/AddProduct"));
const Product = lazy(() => import("@/pages/Admin/Product/Product"));
const CMS = lazy(() => import("@/pages/Admin/CMS/CMS"));
const Services = lazy(() => import("@/pages/Admin/Services/Services"));
const ServiceGuide = lazy(() => import("@/pages/Admin/Services/ServiceGuide"));
const SteadfastManager = lazy(() => import("@/pages/Admin/Steadfast/SteadfastManager"));
const AllOrders = lazy(() => import("@/pages/Admin/Order/AllOrders"));
const OrderDetails = lazy(() => import("@/pages/Admin/Order/OrderDetails"));
const InvoiceContainer = lazy(() => import("@/pages/Admin/Order/Invoice/InvoiceContainer"));
const AnalyticsDashboard = lazy(() => import("@/pages/Admin/AnalyticsDashboard/AnalyticsDashboard"));
const MessagesPage = lazy(() => import("@/pages/Admin/Messages/MessagesPage"));

const AdminLoadingFallback = () => (
  <div className="flex h-[400px] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<AdminLoadingFallback />}>
    <Component />
  </Suspense>
);

export const adminRoutes = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: <LayoutDashboard />,
        path: "dashboard",
        element: withSuspense(Dashboard),
      },
      {
        label: "Messages",
        icon: <MessageSquare />,
        path: "messages",
        element: withSuspense(MessagesPage),
      },
      {
        label: "Visitors",
        icon: <Users />,
        path: "visitors",
        element: withSuspense(Visitors),
      },
      {
        label: "Analytics",
        icon: <BarChart3 />,
        path: "analytics",
        element: withSuspense(AnalyticsDashboard),
      },
    ]
  },
  {
    group: "Order Management",
    items: [
      {
        label: "All Orders",
        icon: <ShoppingCart />,
        path: "orders",
        element: withSuspense(AllOrders),
      },
      {
        path: "orders/:id",
        element: withSuspense(OrderDetails),
      },
      {
        path: "orders/invoice/:id",
        element: withSuspense(InvoiceContainer),
      },
    ]
  },
  {
    group: "Product Management",
    items: [
      {
        label: "Products",
        icon: <Package2 />,
        path: "products",
        element: withSuspense(Product),
      },
      {
        label: "Add Product",
        icon: <PackageSearch />,
        path: "add-product",
        element: withSuspense(AddProduct),
      },
      {
        label: "Categories",
        icon: <LayoutGrid />,
        path: "categories",
        element: withSuspense(Category),
      },
      {
        path: "update-product/:id",
        element: withSuspense(AddProduct),
      },
    ]
  },
  {
    group: "Configuration",
    items: [
      {
        label: "CMS",
        icon: <LayoutTemplate />,
        path: "cms",
        element: withSuspense(CMS),
      },
      {
        path: "cms/:section",
        element: withSuspense(CMS),
      },
      {
        label: "Services",
        icon: <Briefcase />,
        path: "services",
        element: withSuspense(Services),
      },
      {
        path: "services/:serviceId",
        element: <Navigate to="/admin/services" replace />,
      },
      {
        path: "services/:serviceId/guide",
        element: withSuspense(ServiceGuide),
      },
      {
        label: "Steadfast Courier",
        icon: <Truck />,
        path: "courier",
        element: withSuspense(SteadfastManager),
      },
      {
        label: "Settings",
        icon: <SettingsIcon />,
        path: "settings",
        element: withSuspense(Settings),
      },
    ]
  }
];
