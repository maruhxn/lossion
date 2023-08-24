import * as commentsRepository from "@/db/repositories/comments.repository";
import HttpException from "@/libs/http-exception";
import {
  CreateCommentDto,
  CreateCommentValidator,
  UpdateCommentValidator,
} from "@/libs/validators/comments.validator";
import { Request, Response } from "express";

export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const createCommentDto: CreateCommentDto = CreateCommentValidator.parse(
    req.body
  );

  await commentsRepository.createComment(
    req.user?.userId as string,
    postId,
    createCommentDto
  );

  return res.status(201).end();
};

export const getAllComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await commentsRepository.getTopLevelComments(postId);

  if (!comments) throw new HttpException("댓글 정보가 없습니다", 404);
  return res.status(200).json({
    ok: true,
    msg: "전체 댓글 조회 성공",
    data: comments,
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content } = UpdateCommentValidator.parse(req.body);

  const exComment = await commentsRepository.getOneCommentById(commentId);

  if (!exComment) throw new HttpException("댓글 정보가 없습니다.", 404);
  if (exComment.userId !== req.user?.userId)
    throw new HttpException("권한이 없습니다.", 403);

  await commentsRepository.updateComment(commentId, content);

  return res.status(204).end();
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const exComment = await commentsRepository.getOneCommentById(commentId);

  if (!exComment) throw new HttpException("댓글 정보가 없습니다.", 404);
  if (exComment.userId !== req.user?.userId)
    throw new HttpException("권한이 없습니다.", 403);

  await commentsRepository.deleteOneComment(commentId);

  return res.status(204).end();
};
