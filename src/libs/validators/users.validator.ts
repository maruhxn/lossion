import { z } from "zod";

export const UserValidator = z.object({
  id: z.string().max(36),
  nickname: z.string().min(1).max(10),
  agent: z.string().min(1).max(255),
  ip: z.string().min(1).max(20),
});

export const CreateUserValidator = z.object({
  email: z.string().max(50),
  snsId: z.string().max(30),
  provider: z.enum(["google", "kakao", "naver"]),
  username: z.string().max(20),
});

export type CreateUserDto = z.infer<typeof CreateUserValidator>;
