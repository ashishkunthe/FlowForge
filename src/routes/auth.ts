import { Router } from "express";
import { signupSchema } from "../Types/userType";

const route = Router();

route.post("/signup", async (req, res) => {
  const data = signupSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "invalid inputs",
    });
  }
  return;
});

export default route;
