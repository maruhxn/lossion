import CONFIGS from "@/configs/config";
import { db } from "@/configs/db";
import { CreateCommentDto } from "@/libs/validators/comments.validator";
import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { User, comment } from "../schema";

export const getAllComments = async (skipPage: number) => {
  return await db
    .select({
      id: comment.id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
    })
    .from(comment)
    .orderBy(comment.createdAt)
    .limit(CONFIGS.COMMENTS_PAGESIZE)
    .offset(skipPage);
};

export const createComment = async (
  author: User,
  postId: string,
  createCommentDto: CreateCommentDto
) => {
  const { content, password, replyToId } = createCommentDto;
  await db.insert(comment).values({
    id: ulid(),
    content,
    password: await bcrypt.hash(password, 12),
    postId,
    userId: author.id,
    replyToId,
  });
};

export const getCommentDetail = async (commentId: string) => {
  return await db.query.comment.findFirst({
    where: eq(comment.id, commentId),
    columns: { password: false },
    with: {
      user: true,
      replies: {
        columns: { password: false },
      },
    },
  });
};

export const getTopLevelComments = async (postId: string) => {
  return await db.query.comment.findMany({
    where: and(eq(comment.postId, postId)),
    columns: { password: false },
    with: {
      user: true,
      replies: {
        columns: { password: false },
      },
    },
  });
};

export const getOneCommentById = async (commentId: string) => {
  return (
    await db
      .select({ id: comment.id, password: comment.password })
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
