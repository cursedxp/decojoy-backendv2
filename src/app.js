import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

routes.forEach((route) => {
  app.use(`/api/${route.path}`, route.router);
});

export default app;
