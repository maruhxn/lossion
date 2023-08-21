import { z } from "zod";

export const UserValidator = z.object({
  id: z.string().max(36),
  nickname: z.string().min(1).max(10),
  agent: z.string().min(1).max(255),
  ip: z.string().min(1).max(20),
});
