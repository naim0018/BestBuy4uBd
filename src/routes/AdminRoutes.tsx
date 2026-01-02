import Settings from "@/pages/Admin/Settings/Settings";
import Dashboard from "@/pages/Admin/Dashboard/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct/AddProduct";
import {
  LayoutDashboard,
  SettingsIcon,
  PackageSearch,
  Package2,
} from "lucide-react";
import Product from "@/pages/Admin/Product/Product";

export const adminRoutes = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard />,
    path: "dashboard",
    element: <Dashboard />,
  },
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
    label: "Settings",
    icon: <SettingsIcon />,
    path: "settings",
    element: <Settings />,
  },
  {
    path: "update-product/:id",
    element: <AddProduct />,
  },
];
