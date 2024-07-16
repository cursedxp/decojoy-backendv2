import express from "express";
import routes from "./routes/index.js";
const app = express();

app.use(express.json());
routes.forEach((route) => {
  app.use(`/api/${route.path}`, route.router);
});

export default app;
