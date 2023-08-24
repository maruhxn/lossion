import { db } from "@/configs/db";
import { user } from "@/db/schema";
import { CreateUserDto } from "@/libs/validators/users.validator";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";

type ProviderEnum = "google" | "kakao" | "naver";

export const getUserOnLogin = async (
  profileId: string,
  provider: ProviderEnum
) => {
  return (
    await db
      .select()
      .from(user)
      .where(and(eq(user.snsId, profileId), eq(user.provider, provider)))
  )[0];
};

export const createUser = async (createUserDto: CreateUserDto) => {
  const { email, provider, snsId, username } = createUserDto;

  return (
    await db
      .insert(user)
      .values({
        id: ulid(),
        email,
        provider,
        snsId,
        username,
      })
      .returning()
  )[0];
};
