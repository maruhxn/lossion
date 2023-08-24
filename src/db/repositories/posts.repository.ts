import { db } from "@/configs/db";
import {
  CreatePostDto,
  UpdatePostDto,
} from "@/libs/validators/posts.validator";
import { eq, like, sql } from "drizzle-orm";
import { ulid } from "ulid";
import { post, vote } from "../schema";

/** TODO - GET ALL POSTS */
export const getAllPosts = async (skipPage: number, sortQuery: string) => {
  // const posts = await db.query.post.findMany({
  //   extras: {
  //     voteAmt: sql<number>`count(${vote.id})`.as("vote_amt"),
  //   },
  //   with: {
  //     references: true,
  //     author: {
  //       columns: {
  //         id: true,
  //         username: true,
  //       },
  //     },
  //     votes: true,
  //   },
  //   limit: CONFIGS.POSTS_PAGESIZE,
  //   offset: skipPage,
  //   orderBy:
  //     sortQuery === "popular"
  //       ? sql`vote_amt DESC`
  //       : sortQuery === "latest"
  //       ? desc(post.updatedAt)
  //       : asc(post.updatedAt),
  // });

  const posts = await db
    .select({
      id: post.id,
      title: post.title,
      content: post.content,
      firstChoice: post.firstChoice,
      secondChoice: post.secondChoice,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      voteAmt: sql<number>`count(${vote.id})`.as("vote_amt"),
    })
    .from(post)
    .leftJoin(vote, eq(post.id, vote.postId))
    .groupBy(post.id, post.title)
    .orderBy(sql`vote_amt DESC`);
  return posts;
};

export const createPost = async (
  authorId: string,
  createPostDto: CreatePostDto
) => {
  const { title, content, firstChoice, secondChoice } = createPostDto;

  await db.insert(post).values({
    id: ulid(),
    title,
    content,
    authorId,
    firstChoice,
    secondChoice,
    updatedAt: new Date(),
  });
};

export const getOnePostById = async (postId: string) => {
  return (
    await db
      .select({ id: post.id, authorId: post.authorId })
      .from(post)
      .where(eq(post.id, postId))
  )[0];
};

export const getPostDetail = async (postId: string) => {
  const foundedPost = await db.query.post.findFirst({
    where: eq(post.id, postId),
    with: {
      references: true,
      author: {
        columns: {
          id: true,
          username: true,
        },
      },
      votes: {
        columns: {
          postId: false,
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
  const { title, content, firstChoice, secondChoice } = updatePostDto;
  await db
    .update(post)
    .set({
      title,
      content,
      firstChoice,
      secondChoice,
      updatedAt: new Date(),
    })
    .where(eq(post.id, postId));
};

export const deleteOnePost = async (postId: string) => {
  await db.delete(post).where(eq(post.id, postId));
};

export const searchPosts = async (searchQuery: string) => {
  return await db.query.post.findMany({
    where: like(post.title, `%${searchQuery}%`),
    with: {
      author: true,
      votes: true,
      references: true,
    },
  });
};
