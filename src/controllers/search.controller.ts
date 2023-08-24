import * as postsRepository from "@/db/repositories/posts.repository";
import { Post } from "@/db/schema";
import HttpException from "@/libs/http-exception";
import { Request, Response } from "express";

export const searchPosts = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) throw new HttpException("검색어가 존재하지 않습니다.", 400);
  if (Array.isArray(q))
    throw new HttpException("검색어를 1개만 입력해주세요.", 400);

  const searchedPosts: Post[] = await postsRepository.searchPosts(q as string);

  return res.status(200).json({
    ok: true,
    msg: `게시글 검색 성공. - (키워드: ${q})`,
    data: searchedPosts,
  });
};
