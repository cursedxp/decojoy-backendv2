import roomRoutes from "./room.route.js";
import styleRoutes from "./style.route.js";
import conceptRoutes from "./concept.route.js";
import productRoutes from "./product.route.js";
import productCategoryRoutes from "./productCategory.route.js";

const routes = [
  { path: "rooms", router: roomRoutes },
  {
    path: "styles",
    router: styleRoutes,
  },
  {
    path: "concepts",
    router: conceptRoutes,
  },
  {
    path: "products",
    router: productRoutes,
  },
  {
    path: "product/categories",
    router: productCategoryRoutes,
  },
];

export default routes;
