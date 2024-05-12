import { app, dotenv } from "./config/index.js";
import { authRouter } from "./api/index.js";
dotenv.config();
app.use("/", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
