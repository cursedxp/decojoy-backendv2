import roomRoutes from "./room.route.js";
import styleRoutes from "./style.route.js";
import conceptRoutes from "./concept.route.js";
import productRoutes from "./product.route.js";

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
];

export default routes;
