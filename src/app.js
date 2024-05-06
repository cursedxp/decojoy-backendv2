import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.get("/", () => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
