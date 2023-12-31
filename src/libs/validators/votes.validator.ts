import { z } from "zod";

export const CreateVoteValidator = z.object({
  isFirstChoice: z.boolean(),
});

export type CreateVoteDto = z.infer<typeof CreateVoteValidator>;
