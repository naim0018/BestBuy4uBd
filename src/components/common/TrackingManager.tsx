import { useEffect } from 'react';
import { useGetGoogleAnalyticsQuery, useGetFacebookPixelQuery } from '@/store/Api/TrackingApi';

const TrackingManager = () => {
  const { data: gaData } = useGetGoogleAnalyticsQuery();
  const { data: fbData } = useGetFacebookPixelQuery();

  useEffect(() => {
    // 1. Handle Google Analytics
    if (gaData?.data?.googleAnalyticsId) {
      const gaId = gaData.data.googleAnalyticsId;

      // Add Script Tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Initialize gtag
      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // 2. Handle Facebook Pixel
    if (fbData?.data?.pixelId) {
      const pixelId = fbData.data.pixelId;

      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);

      // No-script fallback (optional, but good for completeness)
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, [gaData, fbData]);

  return null; // This component doesn't render anything
};

export default TrackingManager;
