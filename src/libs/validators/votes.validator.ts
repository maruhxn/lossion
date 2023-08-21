import { z } from "zod";

export const CreateVoteValidator = z.object({
  isFirst: z.boolean(),
});

export type CreateVoteDto = z.infer<typeof CreateVoteValidator>;
