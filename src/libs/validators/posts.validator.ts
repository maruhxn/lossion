import { z } from "zod";

export const CreatePostValidator = z.object({
  title: z.string(),
  content: z.string(),
  firstChoice: z.string().min(1).max(255),
  secondChoice: z.string().min(1).max(255),
});

export const UpdatePostValidator = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  firstChoice: z.string().min(1).max(255).optional(),
  secondChoice: z.string().min(1).max(255).optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostValidator>;
export type UpdatePostDto = z.infer<typeof UpdatePostValidator>;
