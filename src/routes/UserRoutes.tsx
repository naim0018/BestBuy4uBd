import { lazy, Suspense } from "react";
import { Settings2, TruckIcon, User } from "lucide-react";

const Dashboard = lazy(() => import("@/pages/User/Dashboard/Dashboard"));
const Order = lazy(() => import("@/pages/User/Order/Order"));
const Settings = lazy(() => import("@/pages/User/Settings/Settings"));

const UserLoadingFallback = () => (
  <div className="flex h-[300px] w-full items-center justify-center">
    <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<UserLoadingFallback />}>
    <Component />
  </Suspense>
);

export const userRoutes = [
  {
    icon: <User />,
    label: "Dashboard",
    path: "dashboard",
    element: withSuspense(Dashboard),
  },
  {
    icon: <TruckIcon />,
    label: "Track Order",
    path: "track-order",
    element: withSuspense(Order),
  },
  {
    icon: <Settings2 />,
    label: "Settings",
    path: "settings",
    element: withSuspense(Settings),
  },
];
