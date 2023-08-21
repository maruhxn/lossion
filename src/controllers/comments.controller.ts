import * as commentsRepository from "@/db/repositories/comments.repository";
import * as usersRepository from "@/db/repositories/users.repository";
import HttpException from "@/libs/http-exception";
import {
  CreateCommentDto,
  CreateCommentValidator,
  UpdateCommentValidator,
} from "@/libs/validators/comments.validator";
import { UserValidator } from "@/libs/validators/users.validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

// export const getAllComments = async (req: Request, res: Response) => {
//   const { page = 1 } = req.query;
//   /* @ts-ignore */
//   if (isNaN(page)) throw new HttpException("올바르지 않은 쿼리입니다.", 400);
//   const skipPage = (+page - 1) * CONFIGS.COMMENTS_PAGESIZE;

//   const comments = await commentsRepository.getAllComments(skipPage);

//   return res.status(200).json({
//     ok: true,
//     msg: "전체 댓글 조회 성공",
//     data: comments,
//   });
// };

export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userDto = UserValidator.parse(req.body.user);
  const createCommentDto: CreateCommentDto = CreateCommentValidator.parse(
    req.body
  );

  const author = await usersRepository.getOrCreateUser(userDto);

  await commentsRepository.createComment(author, postId, createCommentDto);

  return res.status(201).json({
    ok: true,
    msg: "댓글 생성 성공",
  });
};

export const getTopLevelComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const topLevelComments = await commentsRepository.getTopLevelComments(postId);
  console.log(topLevelComments);
  if (!topLevelComments) throw new HttpException("댓글 정보가 없습니다", 404);
  return res.status(200).json({
    ok: true,
    msg: `댓글(${postId}) 조회 성공`,
    data: topLevelComments,
  });
};

export const getOneComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const foundedComment = await commentsRepository.getCommentDetail(commentId);

  if (!foundedComment) throw new HttpException("댓글 정보가 없습니다.", 404);

  return res.status(200).json({
    ok: true,
    msg: `댓글(${commentId}) 조회 성공`,
    data: foundedComment,
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content, password } = UpdateCommentValidator.parse(req.body);

  const exComment = await commentsRepository.getOneCommentById(commentId);

  if (!exComment) throw new HttpException("댓글 정보가 없습니다.", 404);

  if (!(await bcrypt.compare(password, exComment.password)))
    throw new HttpException("비밀번호가 일치하지 않습니다.", 400);
  await commentsRepository.updateComment(commentId, content);

  return res.status(204).end();
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { password } = req.body;

  const exComment = await commentsRepository.getOneCommentById(commentId);

  if (!exComment) throw new HttpException("댓글 정보가 없습니다.", 404);

  if (!(await bcrypt.compare(password, exComment.password)))
    throw new HttpException("비밀번호가 일치하지 않습니다.", 400);

  await commentsRepository.deleteOneComment(commentId);

  return res.status(204).end();
};
