import { db } from "@/configs/db";
import { CreateVoteDto } from "@/libs/validators/votes.validator";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { vote } from "../schema";

export const getOneVoteById = async (authorId: string, postId: string) => {
  return await db.query.vote.findFirst({
    where: and(eq(vote.userId, authorId), eq(vote.postId, postId)),
  });
};

export const createVote = async (
  authorId: string,
  postId: string,
  createVoteDto: CreateVoteDto
) => {
  const { isFirst } = createVoteDto;
  await db.insert(vote).values({
    id: ulid(),
    postId,
    userId: authorId,
    isFirst,
  });
};

export const updateVote = async (
  authorId: string,
  postId: string,
  isFirst: boolean
) => {
  await db
    .update(vote)
    .set({ isFirst })
    .where(and(eq(vote.userId, authorId), eq(vote.postId, postId)));
};

export const deleteVote = async (authorId: string, postId: string) => {
  await db
    .delete(vote)
    .where(and(eq(vote.userId, authorId), eq(vote.postId, postId)));
};
