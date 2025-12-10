import { Router } from "express";
import { signinSchema, signupSchema } from "../Types/userType";
import { User } from "../modules/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const route = Router();

route.post("/signup", async (req, res) => {
  const data = signupSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "invalid inputs",
    });
    return;
  }
  try {
    const { username, password, email } = data.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.json({
        message: "user already exist pls signin",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email,
      username,
      password: hashedPassword,
    });

    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );

    res.json({
      message: "User signup completed",
      status_code: 200,
      token: token,
    });
  } catch (error) {
    console.log("failed to signup", error);
    res.json({
      message: "internal server error",
    });
  }
});

route.post("/signin", async (req, res) => {
  const data = signinSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Invalid inputs",
    });
    return;
  }
  const { email, password } = data.data;
  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      res.json({
        message: "user is not registered",
      });
      return;
    }

    const passwordCheck = await bcrypt.compare(password, userExist.password);

    if (!passwordCheck) {
      res.json({
        message: "wrong password",
      });
      return;
    }

    const token = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRET as string
    );

    res.json({
      message: "user signedIn",
      status_code: 200,
      token: token,
    });
  } catch (error) {
    console.log("failed to signin", error);
    res.json({
      message: "internal server error",
    });
  }
});

export default route;
