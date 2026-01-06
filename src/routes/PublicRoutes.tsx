import About from "../pages/Public/About/About";
import Contact from "../pages/Public/Contact/Contact";
import Services from "@/pages/Public/Services/Services";
import Home from "@/pages/Public/Home/Home1/Home";
import TableDemo from "@/pages/TableDemo";
import FormDemo from "@/pages/FormDemo";
import Shop from "@/pages/Public/Shop/Shop";
import ProductDetails from "@/pages/Public/Shop/Components/ProductDetails/ProductDetails";

export const publicRoutes = [
  {
    label: "Home",
    index: true,
    path: "/",
    element: <Home />,
  },
  {
    label: "Shop",
    path: "/shop",
    element: <Shop />,
    children: [],
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    label: "Contact",
    path: "/contact",
    element: <Contact />,
  },
  {
    label: "Services",
    path: "/services",
    element: <Services />,
  },
];
