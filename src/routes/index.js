import roomRoutes from "./room.route.js";
import styleRoutes from "./style.route.js";
import conceptRoutes from "./concept.route.js";
import productRoutes from "./product.route.js";
import productCategoryRoutes from "./productCategory.route.js";
import userRoutes from "./user.route.js";
import likeRoutes from "./like.route.js";
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
  {
    path: "users",
    router: userRoutes,
  },
  {
    path: "like",
    router: likeRoutes,
  },
];

export default routes;
