import Settings from "@/pages/Admin/Settings/Settings";
import Dashboard from "@/pages/Admin/Dashboard/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct/AddProduct";
import { LayoutDashboard, SettingsIcon, PackageSearch } from "lucide-react";

export const adminRoutes = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard />,
    path: "dashboard",
    element: <Dashboard />,
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
];
