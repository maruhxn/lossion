import CONFIGS from "@/configs/config";
import * as postsRepository from "@/db/repositories/posts.repository";
import * as usersRepository from "@/db/repositories/users.repository";
import { User } from "@/db/schema";
import HttpException from "@/libs/http-exception";
import {
  CreatePostDto,
  CreatePostValidator,
  UpdatePostDto,
  UpdatePostValidator,
} from "@/libs/validators/posts.validator";
import { UserValidator } from "@/libs/validators/users.validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

/* GET /api/posts?page={number} */
export const getAllPosts = async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  /* @ts-ignore */
  if (isNaN(page)) throw new HttpException("올바르지 않은 쿼리입니다.", 400);
  const skipPage = (+page - 1) * CONFIGS.POSTS_PAGESIZE;

  const posts = await postsRepository.getAllPosts(skipPage);

  return res.status(200).json({
    ok: true,
    msg: "전체 게시글 조회 성공",
    data: posts,
  });
};

/* POST /api/posts */
export const createPost = async (req: Request, res: Response) => {
  const userDto = UserValidator.parse(req.body.user);
  const createPostDto: CreatePostDto = CreatePostValidator.parse(req.body);

  const author: User = await usersRepository.getOrCreateUser(userDto);

  await postsRepository.createPost(author, createPostDto);

  return res.status(201).json({
    ok: true,
    msg: "게시글 생성 성공",
  });
};

/* GET /api/posts/:postId */
export const getPostDetail = async (req: Request, res: Response) => {
  const { postId } = req.params;

  const foundedPost = await postsRepository.getPostDetail(postId);

  if (!foundedPost) throw new HttpException("게시글 정보가 없습니다.", 404);

  return res.status(200).json({
    ok: true,
    msg: `게시글(${postId}) 조회 성공`,
    data: foundedPost,
  });
};

/* PATCH /api/posts/:postId */
export const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const updatePostDto: UpdatePostDto = UpdatePostValidator.parse(req.body);

  // postId에 해당하는 post를 찾고, 비밀번호 일치여부 확인.
  const exPost = await postsRepository.getOnePostById(postId);

  if (!exPost) throw new HttpException("게시글 정보가 없습니다.", 404);

  if (!(await bcrypt.compare(updatePostDto.password, exPost.password)))
    throw new HttpException("비밀번호가 일치하지 않습니다.", 400);

  await postsRepository.updatePost(postId, updatePostDto);

  return res.status(204).end();
};

/* PUT /api/posts/:postId */
export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { password } = req.body;

  const exPost = await postsRepository.getOnePostById(postId);

  if (!exPost) throw new HttpException("게시글 정보가 없습니다.", 404);

  if (!(await bcrypt.compare(password, exPost.password)))
    throw new HttpException("비밀번호가 일치하지 않습니다.", 400);

  await postsRepository.deleteOnePost(postId);

  return res.status(204).end();
};
