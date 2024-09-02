import app from "./app.js";
import { dotenv, mongoose } from "./config/index.js";
dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("🗄️ Connected to the database");
      app.listen(port, () => {
        console.log(`🏃‍➡️ Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("🚨 Failed to connect to the database", error);
      process.exit(1);
    });
};

startServer();
