import { useEffect } from "react";
import { useGetTrackingSettingsQuery } from "@/store/Api/TrackingApi";
import { useLocation } from "react-router-dom";

const TrackingManager = () => {
  const { data: trackingData, isLoading } = useGetTrackingSettingsQuery({});
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize dataLayer globally immediately
    window.dataLayer = window.dataLayer || [];

    if (isLoading || !trackingData?.data) {
      return;
    }

    const settings = trackingData.data;

    // -------------------------------------------------------------
    // 0. Google Tag Manager (GTM)
    // -------------------------------------------------------------
    const rawGtm =
      settings.gtmId ||
      (settings.googleAnalyticsId?.startsWith("GTM-")
        ? settings.googleAnalyticsId
        : null);

    const gtmMatch = rawGtm ? String(rawGtm).match(/GTM-[A-Z0-9]+/i) : null;
    const gtmId = gtmMatch ? gtmMatch[0].toUpperCase() : rawGtm?.trim() || null;

    if (gtmId && !document.querySelector(`script[data-gtm-id="${gtmId}"]`)) {
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-gtm-id", gtmId);
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }

      const noscript = document.createElement("noscript");
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = "0";
      iframe.width = "0";
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      noscript.appendChild(iframe);
      document.body.prepend(noscript);
    }

    if (gtmId) {
      const pagePath = location.pathname + location.search;
      const pageTitle = document.title;
      // Push both GA4 standard "page_view" and GTM custom "pageview"
      window.dataLayer.push({
        event: "page_view",
        page_path: pagePath,
        page_title: pageTitle,
      });
      window.dataLayer.push({
        event: "pageview",
        page_path: pagePath,
        page_title: pageTitle,
      });
    }

    // -------------------------------------------------------------
    // 1. Google Analytics 4 (GA4) or Google Tag (GT-)
    // -------------------------------------------------------------
    const rawGa = settings.googleAnalyticsId ? String(settings.googleAnalyticsId).trim() : null;
    const googleTagId = rawGa?.startsWith("GT-") ? rawGa : null;
    const gaId = (rawGa?.startsWith("G-") ? rawGa : null) || googleTagId;

    if (gaId) {
      // Ensure window.gtag is available as a real function directly
      if (!window.gtag) {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
      }

      // Inject the external gtag script once
      if (!document.querySelector(`script[data-ga-id="${gaId}"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-ga-id", gaId);
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
      }

      // Send the current pageview
      window.gtag("config", gaId, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }

    // -------------------------------------------------------------
    // 2. Facebook Pixel
    // -------------------------------------------------------------
    const pixelId = settings.facebookPixelId ? String(settings.facebookPixelId).trim() : null;
    if (pixelId) {
      if (!document.querySelector(`script[data-pixel-id="${pixelId}"]`)) {
        (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod
              ? n.callMethod.apply(n, arguments)
              : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.setAttribute("data-pixel-id", pixelId);
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(
          window,
          document,
          "script",
          "https://connect.facebook.net/en_US/fbevents.js",
        );

        if (window.fbq) {
          window.fbq("init", pixelId);
        }
      }

      if (window.fbq) {
        window.fbq("track", "PageView");
      }
    }

    // -------------------------------------------------------------
    // 3. TikTok Pixel
    // -------------------------------------------------------------
    const tiktokId = settings.tiktokPixelId ? String(settings.tiktokPixelId).trim() : null;
    if (tiktokId) {
      if (!document.querySelector(`script[data-tiktok-id="${tiktokId}"]`)) {
        (function (w: any, d: any, t: any) {
          w.TiktokAnalyticsObject = t;
          const ttq = (w[t] = w[t] || []);
          ttq.methods = [
            "page",
            "track",
            "identify",
            "instances",
            "debug",
            "on",
            "off",
            "once",
            "ready",
            "alias",
            "group",
            "enableCookie",
            "disableCookie",
          ];
          ttq.setAndDefer = function (target: any) {
            target.methods.forEach(function (method: any) {
              target[method] = function () {
                const args = Array.prototype.slice.call(arguments);
                target.queue = target.queue || [];
                target.queue.push([method, args]);
              };
            });
          };
          ttq.setAndDefer(ttq);
          ttq.load = function (e: any, n?: any) {
            const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
            ttq._i = ttq._i || {};
            ttq._i[e] = [];
            ttq._i[e]._u = i;
            ttq._t = ttq._t || {};
            ttq._t[e] = +new Date();
            ttq._o = ttq._o || {};
            ttq._o[e] = n || {};
            const script = d.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.setAttribute("data-tiktok-id", tiktokId);
            script.src = i + "?sdkid=" + e + "&lib=" + t;
            const first = d.getElementsByTagName("script")[0];
            if (first && first.parentNode) {
              first.parentNode.insertBefore(script, first);
            } else {
              d.head.appendChild(script);
            }
          };
          ttq.load(tiktokId);
        })(window, document, "ttq");
      }

      if (window.ttq && typeof window.ttq.page === "function") {
        try {
          window.ttq.page();
        } catch (e) {
          console.error("TikTok pixel page error:", e);
        }
      }
    }

    // -------------------------------------------------------------
    // 4. Microsoft Clarity
    // -------------------------------------------------------------
    const clarityId = settings.clarityId ? String(settings.clarityId).trim() : null;
    if (clarityId) {
      if (!document.querySelector(`script[data-clarity-id="${clarityId}"]`)) {
        (function (c: any, l: any, a: any, r: any, i: any) {
          c[a] =
            c[a] ||
            function () {
              (c[a].q = c[a].q || []).push(arguments);
            };
          const t = l.createElement(r);
          t.async = 1;
          t.setAttribute("data-clarity-id", clarityId);
          t.src = "https://www.clarity.ms/tag/" + i;
          const y = l.getElementsByTagName(r)[0];
          y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", clarityId);
      }
    }

    // -------------------------------------------------------------
    // 5. Google Search Console Verification
    // -------------------------------------------------------------
    const searchConsoleCode = settings.searchConsoleVerificationCode ? String(settings.searchConsoleVerificationCode).trim() : null;
    if (searchConsoleCode) {
      if (!document.querySelector('meta[name="google-site-verification"]')) {
        const meta = document.createElement("meta");
        meta.name = "google-site-verification";
        meta.content = searchConsoleCode;
        document.head.appendChild(meta);
      }
    }
  }, [trackingData, location, isLoading]);

  return null;
};

// Global declarations for window
declare global {
  interface Window {
    fbq: any;
    ttq: any;
    clarity: any;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default TrackingManager;
