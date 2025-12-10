import express from "express";
import mongoose from "mongoose";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "server is running",
  });
});

async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("mongoDB conection successful");
  app.listen(5000, () => {
    console.log("server is serving at port 5000");
  });
};
