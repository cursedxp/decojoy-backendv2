import express from "express";
import routes from "./routes/index.js";
const app = express();

app.use(express.json());
routes.forEach((route) => {
  app.use(`/api/${route.path}`, route.router);
}); // Add routes to the app

export default app;
