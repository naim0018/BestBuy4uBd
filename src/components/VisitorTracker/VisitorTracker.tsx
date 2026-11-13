import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { websiteTrackingService } from "@/utils/websiteTrackingService";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api/v1";
    }
  }
  return "https://api.bestbuy4ubd.com/api/v1";
};

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // We only track actual customers, not administration panel activity
    const path = location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/staff")) {
      return;
    }

    // 1. Resolve or generate session token (persists as long as browser tab is open)
    let sessionToken = sessionStorage.getItem("visitor_session_token");
    if (!sessionToken) {
      sessionToken = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("visitor_session_token", sessionToken);
    }

    // 2. Resolve returning visitor status (persists across browser restarts)
    let isReturning = false;
    if (localStorage.getItem("visitor_seen")) {
      isReturning = true;
    } else {
      localStorage.setItem("visitor_seen", "true");
    }

    const sendHeartbeat = async () => {
      try {
        await fetch(`${getBaseUrl()}/visitor-tracking/heartbeat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionToken,
            page: path,
            pageTitle: document.title || "BestBuy Store",
            referrer: document.referrer || "",
            isReturning,
          }),
        });
      } catch (err) {
        // Fail silently in background
        console.debug("Heartbeat tracking failed:", err);
      }
    };

    // Trigger heartbeat immediately on route change
    sendHeartbeat();

    // Log page_view interaction event on route transition (e.g. Home '/', '/shop', etc.)
    // Avoid double firing if page is landing page /:id which logs view_item
    const isLandingPage = /^\/[a-f0-9]{24}$/i.test(path);
    if (!isLandingPage) {
      websiteTrackingService.logEvent("page_view", {
        page_path: path,
        page_title: document.title || (path === "/" ? "Home Page" : path),
      });
    }

    // Setup interval to keep reporting active status (every 15 seconds)
    const intervalId = setInterval(sendHeartbeat, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [location.pathname]);

  return null;
}
