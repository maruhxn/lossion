import { db } from "@/configs/db";
import { CreateVoteDto } from "@/libs/validators/votes.validator";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { vote } from "../schema";

export const getOneVoteById = async (userId: string, postId: string) => {
  return await db.query.vote.findFirst({
    where: and(eq(vote.userId, userId), eq(vote.postId, postId)),
  });
};

export const createVote = async (
  userId: string,
  postId: string,
  createVoteDto: CreateVoteDto
) => {
  const { isFirstChoice } = createVoteDto;
  await db.insert(vote).values({
    id: ulid(),
    postId,
    userId,
    isFirstChoice,
  });
};

export const updateVote = async (
  userId: string,
  postId: string,
  isFirstChoice: boolean
) => {
  await db
    .update(vote)
    .set({ isFirstChoice })
    .where(and(eq(vote.userId, userId), eq(vote.postId, postId)));
};

export const deleteVote = async (userId: string, postId: string) => {
  await db
    .delete(vote)
    .where(and(eq(vote.userId, userId), eq(vote.postId, postId)));
};
