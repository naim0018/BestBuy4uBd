import Layout from "./Layout/PublicLayout/Layout";
import { HeroUIProvider } from "@heroui/react";
import TrackingManager from "./components/common/TrackingManager";
import { useEffect } from "react";
import { useGetHost } from "./utils/useGetHost";

function App() {

  useEffect(() => {
  const brand = useGetHost();
  document.title = brand.title;

  const favicon = document.querySelector(
    "link[rel='icon']"
  ) as HTMLLinkElement | null;

  if (favicon) {
    favicon.href = brand.logo;
  }
}, []);

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
