import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Form from "@/pages/Form";
import { adminRoutes } from "./AdminRoutes";
import { publicRoutes } from "./PublicRoutes";
import NotFound from "@/pages/NotFound";
import { routesGenerator } from "@/utils/Generator/RoutesGenerator";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";
import { userRoutes } from "./UserRoutes";
import ProtectedRoute from "./ProtectedRoute";
import SharedLayout from "@/components/common/SharedLayout";

const Login = lazy(() => import("@/pages/Auth/Login"));
const Signup = lazy(() => import("@/pages/Auth/Signup"));
const LandingPageContainer = lazy(() => import("@/pages/LandingPage/LandingPageContainer"));

const RouteSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    }
  >
    {children}
  </Suspense>
);

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          ...routesGenerator(publicRoutes),
          {
            path: "/form",
            element: <Form />,
          },
        ],
      },
      {
        path: "/login",
        element: (
          <RouteSuspense>
            <Login />
          </RouteSuspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <RouteSuspense>
            <Signup />
          </RouteSuspense>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...routesGenerator(adminRoutes),
        ],
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...routesGenerator(userRoutes),
        ],
      },
      {
        path: "/:id",
        element: (
          <RouteSuspense>
            <LandingPageContainer />
          </RouteSuspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default routes;
