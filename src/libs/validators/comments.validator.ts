import { z } from "zod";

export const CreateCommentValidator = z.object({
  content: z.string(),
  password: z.string(),
  replyToId: z.string().optional(),
});

export const UpdateCommentValidator = z.object({
  content: z.string(),
  password: z.string(),
});

export type CreateCommentDto = z.infer<typeof CreateCommentValidator>;
export type UpdateCommentDto = z.infer<typeof UpdateCommentValidator>;
