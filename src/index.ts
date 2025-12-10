import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "server is running",
  });
});

app.use("/auth", authRoutes);

app.listen(5000, () => {
  mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
      console.log("mongoDB conection successful");
    })
    .then(() => {
      console.log("server is serving at port 5000");
    })
    .catch((e) => console.log(e));
});

export default app;
