import { z } from "zod";

export const CreatePostValidator = z.object({
  title: z.string(),
  description: z.string(),
  password: z.string(),
  firstChoice: z.string().min(1).max(100),
  secondChoice: z.string().min(1).max(100),
});

export const UpdatePostValidator = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  password: z.string(),
  updatedPassword: z.string().optional(),
  firstChoice: z.string().min(1).max(100).optional(),
  secondChoice: z.string().min(1).max(100).optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostValidator>;
export type UpdatePostDto = z.infer<typeof UpdatePostValidator>;
