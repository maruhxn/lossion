import { db } from "@/configs/db";
import { User, user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * 유저가 있다면, 해당 유저로, 없다면 새롭게 생성
 * @param userDto
 * @returns resultUser
 */
export const getOrCreateUser = async (userDto: User) => {
  const { id, ip, nickname, agent } = userDto;
  let resultUser: User;
  resultUser = (await db.select().from(user).where(eq(user.id, id)))[0];

  if (!resultUser) {
    resultUser = (
      await db.insert(user).values({ id, agent, nickname, ip }).returning()
    )[0];
  }

  return resultUser;
};
