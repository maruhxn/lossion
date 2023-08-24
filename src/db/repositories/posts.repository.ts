import CONFIGS from "@/configs/config";
import { db } from "@/configs/db";
import {
  CreatePostDto,
  UpdatePostDto,
} from "@/libs/validators/posts.validator";
import { asc, desc, eq, like, sql } from "drizzle-orm";
import { ulid } from "ulid";
import { post, reference, user, vote } from "../schema";

type IPOST = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  firstChoice: string;
  secondChoice: string;
  createdAt: string;
  updatedAt: string;
  voteAmt: string;
  votes: {
    id: string;
    isFirstChice: boolean;
  };
  reference: {
    id: string;
    imagePath: string;
  };
  author: {
    email: string;
    username: string;
  };
};

/** TODO - GET ALL POSTS */
export const getAllPosts = async (skipPage: number, sortQuery: string) => {
  const results = await db
    .select({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      firstChoice: post.firstChoice,
      secondChoice: post.secondChoice,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      voteAmt: sql<number>`count(vote.id)`.as("vote_amt"),
      vote: {
        id: vote.id,
        isFirstChice: vote.isFirstChoice,
      },
      reference: {
        id: reference.id,
        imagePath: reference.imagePath,
      },
      author: {
        email: user.email,
        username: user.username,
      },
    })
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(reference, eq(post.id, reference.postId))
    .leftJoin(vote, eq(post.id, vote.postId))
    .groupBy(post.id, post.title, vote.id, user.id, reference.id)
    .limit(CONFIGS.POSTS_PAGESIZE)
    .offset(skipPage)
    .orderBy(
      sortQuery === "popular"
        ? sql`vote_amt DESC`
        : sortQuery === "latest"
        ? desc(post.updatedAt)
        : asc(post.updatedAt)
    );

  const posts = results.reduce<Record<number, IPOST>>((acc, row) => {
    const {
      id,
      title,
      content,
      authorId,
      firstChoice,
      secondChoice,
      createdAt,
      updatedAt,
      voteAmt,
      vote,
      reference,
      author,
    } = row;
    /** @ts-ignore */
    let foundObjIndex = acc.findIndex((post) => post.id === id);

    if (foundObjIndex === -1) {
      /** @ts-ignore */
      acc.push({
        id,
        title,
        content,
        authorId,
        firstChoice,
        secondChoice,
        createdAt,
        updatedAt,
        voteAmt,
        votes: [],
        references: [],
        author,
      });

      /** @ts-ignore */
      foundObjIndex = acc.length - 1;
      console.log(vote);
    }

    /** @ts-ignore */
    if (vote) acc[foundObjIndex].votes.push(vote);

    /** @ts-ignore */
    if (reference) acc[foundObjIndex].references.push(reference);

    return acc;
  }, []);

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
