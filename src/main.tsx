import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HeroUIProvider>
      <RouterProvider router={routes} />
      <Toaster richColors position="bottom-right" />
    </HeroUIProvider>
  </Provider>
);
