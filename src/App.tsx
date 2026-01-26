import Layout from "./Layout/PublicLayout/Layout";
import { HeroUIProvider } from "@heroui/react";
import TrackingManager from "./components/common/TrackingManager";
import { useEffect } from "react";
import { useGetStoreConfigQuery } from "@/store/Api/StoreApi";
import { useDispatch } from "react-redux";
import { setStoreConfig } from "@/store/Slices/StoreSlice";

function App() {
  const { data: storeResponse, isSuccess } = useGetStoreConfigQuery(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && storeResponse?.data) {
      const storeConfig = storeResponse.data;
      dispatch(setStoreConfig(storeConfig));

      // 1. Dynamic Identity
      document.title = storeConfig.name;
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = storeConfig.identity.faviconUrl;
      }

      // 2. Dynamic Theme (CSS Variables)
      const root = document.documentElement;
      root.style.setProperty('--primary', storeConfig.identity.primaryColor);
      root.style.setProperty('--secondary', storeConfig.identity.secondaryColor);
      
      // Also update metadata
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Welcome to ${storeConfig.name}. Your trusted online shop.`);
      }
    }
  }, [isSuccess, storeResponse, dispatch]);

  return (
    <>
      <HeroUIProvider>
        <TrackingManager />
        <Layout />
      </HeroUIProvider>
    </>
  );
}

export default App;
