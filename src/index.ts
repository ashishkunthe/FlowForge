import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth";
import ideaRoutes from "./routes/idea";
import userRoutes from "./routes/user";

import { startScheduler } from "./services/scheduler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "server is running",
  });
});

app.use("/auth", authRoutes);
app.use("/idea", ideaRoutes);
app.use("/user", userRoutes);

startScheduler();

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
