import Layout from "./Layout/PublicLayout/Layout";
import { HeroUIProvider } from "@heroui/react";
import TrackingManager from "./components/common/TrackingManager";

function App() {
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
