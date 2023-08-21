import CONFIGS from "@/configs/config";
import { db } from "@/configs/db";
import {
  CreatePostDto,
  UpdatePostDto,
} from "@/libs/validators/posts.validator";
import bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { ulid } from "ulid";
import { User, post, vote } from "../schema";

export const getAllPosts = async (skipPage: number) => {
  const posts = await db
    .select({
      id: post.id,
      title: post.title,
      description: post.description,
      authorId: post.authorId,
      firstChoice: post.firstChoice,
      secondChoice: post.secondChoice,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      firstVoteAmt: sql<number>`SUM(CASE WHEN ${vote.isFirst} = true THEN 1 ELSE 0 END)`,
      secondVoteAmt: sql<number>`SUM(CASE WHEN ${vote.isFirst} = false THEN 1 ELSE 0 END)`,
    })
    .from(post)
    .leftJoin(vote, eq(post.id, vote.postId))
    .groupBy(post.id)
    .limit(CONFIGS.POSTS_PAGESIZE)
    .offset(skipPage);
  return posts;
};

export const createPost = async (
  author: User,
  createPostDto: CreatePostDto
) => {
  const { title, description, password, firstChoice, secondChoice } =
    createPostDto;

  await db.insert(post).values({
    id: ulid(),
    title,
    description,
    authorId: author.id,
    password: await bcrypt.hash(password, CONFIGS.SALT_ROUNDS),
    firstChoice,
    secondChoice,
    updatedAt: new Date(),
  });
};

export const getOnePostById = async (postId: string) => {
  return (
    await db
      .select({ id: post.id, password: post.password })
      .from(post)
      .where(eq(post.id, postId))
  )[0];
};

export const getPostDetail = async (postId: string) => {
  const foundedPost = await db.query.post.findFirst({
    where: eq(post.id, postId),
    columns: {
      password: false,
    },
    with: {
      author: true,
      comments: {
        columns: {
          id: true,
          content: true,
          createdAt: true,
        },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
      references: true,
      votes: {
        columns: {
          isFirst: true,
        },
      },
    },
  });

  return foundedPost;
};

export const updatePost = async (
  postId: string,
  updatePostDto: UpdatePostDto
) => {
  const { title, description, updatedPassword, firstChoice, secondChoice } =
    updatePostDto;
  await db
    .update(post)
    .set({
      title,
      description,
      firstChoice,
      secondChoice,
      password:
        updatedPassword &&
        (await bcrypt.hash(updatedPassword, CONFIGS.SALT_ROUNDS)),
      updatedAt: new Date(),
    })
    .where(eq(post.id, postId));
};

export const deleteOnePost = async (postId: string) => {
  await db.delete(post).where(eq(post.id, postId));
};
