import Settings from "@/pages/Admin/Settings/Settings";
import Dashboard from "@/pages/Admin/Dashboard/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct/AddProduct";
import Product from "@/pages/Admin/Product/Product";
import CMS from "@/pages/Admin/CMS/CMS";
import Services from "@/pages/Admin/Services/Services";
import AllOrders from "@/pages/Admin/Order/AllOrders";
import OrderDetails from "@/pages/Admin/Order/OrderDetails";
import {
  LayoutDashboard,
  SettingsIcon,
  PackageSearch,
  Package2,
  LayoutTemplate,
  Activity,
  ShoppingCart,
} from "lucide-react";

export const adminRoutes = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: <LayoutDashboard />,
        path: "dashboard",
        element: <Dashboard />,
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
        element: <AllOrders />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
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
        element: <Product />,
      },
      {
        label: "Add Product",
        icon: <PackageSearch />,
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "update-product/:id",
        element: <AddProduct />,
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
        element: <CMS />,
      },
      {
        label: "External Services",
        icon: <Activity />,
        path: "services",
        element: <Services />,
      },
      {
        label: "Settings",
        icon: <SettingsIcon />,
        path: "settings",
        element: <Settings />,
      },
    ]
  }
];
