import { email, string, z } from "zod";

export const signupSchema = z.object({
  username: { type: string, min: 2, max: 8 },
  email: { type: email },
  password: { type: string, min: 2, max: 8 },
});

export const signinSchema = z.object({
  email: { type: email },
  password: { type: string, min: 2, max: 8 },
});
