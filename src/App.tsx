import Layout from "./Layout/PublicLayout/Layout";
import { HeroUIProvider } from "@heroui/react";

function App() {
  return (
    <>
      <HeroUIProvider>
        <Layout />
      </HeroUIProvider>
    </>
  );
}

export default App;
