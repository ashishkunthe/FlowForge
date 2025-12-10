import { email, string, z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.email(),
  password: z.string().min(8).max(16),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(16),
});
