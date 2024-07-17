import roomRoutes from "./room.route.js";
import styleRoutes from "./style.route.js";

const routes = [
  { path: "rooms", router: roomRoutes },
  {
    path: "styles",
    router: styleRoutes,
  },
];

export default routes;
