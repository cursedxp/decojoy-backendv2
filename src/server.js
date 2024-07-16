import app from "./app.js";
import { dotenv, mongoose } from "./config/index.js";
dotenv.config();

const startServer = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("🗄️ Connected to the database");
      app.listen(process.env.PORT, () => {
        console.log(`🏃‍➡️ Server is running on port ${process.env.PORT}`);
      });
    })
    .catch((error) => {
      console.error("🚨 Failed to connect to the database", error);
      process.exit(1);
    });
};

startServer();
