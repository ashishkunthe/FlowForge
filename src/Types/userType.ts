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

export const ideaSchema = z.object({
  title: z.string().min(6).max(20),
  mainIdea: z.string().min(10).max(100),
  motivation: z.string().min(10).max(100),
  howToAchieve: z.string().min(10).max(100),
});
