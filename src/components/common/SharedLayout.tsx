import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TrackingManager from "./TrackingManager";
import VisitorTracker from "@/components/VisitorTracker/VisitorTracker";
import { useGetHost } from "@/utils/useGetHost";

const SharedLayout = () => {
  const { pathname } = useLocation();
  const brand = useGetHost();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Synchronize site title & favicon dynamically across ALL routes (including /:id landing pages)
  useEffect(() => {
    if (brand.title && !document.title.includes(brand.title)) {
      // If document.title is empty or just generic, initialize with brand title
      if (!document.title || document.title === "{{SITE_TITLE}}" || document.title === "BestBuy4uBd") {
        document.title = brand.title;
      }
    }

    if (brand.logo) {
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = brand.logo;
      }
    }
  }, [brand]);

  return (
    <>
      <VisitorTracker />
      <TrackingManager />
      <Outlet />
    </>
  );
};

export default SharedLayout;
