import { db } from "@/configs/db";
import { CreateCommentDto } from "@/libs/validators/comments.validator";
import { and, desc, eq, isNull } from "drizzle-orm";
import { ulid } from "ulid";
import { comment } from "../schema";

export const createComment = async (
  userId: string,
  postId: string,
  createCommentDto: CreateCommentDto
) => {
  const { content, replyToId } = createCommentDto;
  await db.insert(comment).values({
    id: ulid(),
    content,
    postId,
    userId,
    replyToId,
  });
};

export const getTopLevelComments = async (postId: string) => {
  return await db.query.comment.findMany({
    where: and(eq(comment.postId, postId), isNull(comment.replyToId)),
    with: {
      user: true,
      replies: true,
    },
    orderBy: desc(comment.createdAt),
  });
};

export const getOneCommentById = async (commentId: string) => {
  return (
    await db
      .select({ id: comment.id, userId: comment.userId })
      .from(comment)
      .where(eq(comment.id, commentId))
  )[0];
};

export const updateComment = async (commentId: string, content: string) => {
  await db.update(comment).set({ content }).where(eq(comment.id, commentId));
};

export const deleteOneComment = async (commentId: string) => {
  await db.delete(comment).where(eq(comment.id, commentId));
};

export const updateCommentVoteStatus = async (
  isFirstChoice: boolean | null,
  postId: string,
  userId: string
) => {
  console.log(isFirstChoice, postId, userId);
  await db
    .update(comment)
    .set({ isFirstChoice })
    .where(and(eq(comment.postId, postId), eq(comment.userId, userId)));
};
