import * as commentsRepository from "@/db/repositories/comments.repository";
import * as votesRepository from "@/db/repositories/votes.repository";
import {
  CreateVoteDto,
  CreateVoteValidator,
} from "@/libs/validators/votes.validator";
import { Request, Response } from "express";

export const vote = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const createVoteDto: CreateVoteDto = CreateVoteValidator.parse(req.body);

  // 이미 유저가 vote 했는지 확인.
  const exVote = await votesRepository.getOneVoteById(
    req.user?.userId as string,
    postId
  );

  if (!exVote) {
    // 기존 투표가 없다면, 투표 생성
    await votesRepository.createVote(
      req.user?.userId as string,
      postId,
      createVoteDto
    );

    await commentsRepository.updateCommentVoteStatus(
      createVoteDto.isFirstChoice,
      postId,
      req.user?.userId!
    );
    return res.status(201).end();
  }

  if (exVote?.isFirstChoice === createVoteDto.isFirstChoice) {
    // 기존 투표 타입과 요청한 투표 타입이 같다면, 삭제
    await votesRepository.deleteVote(req.user?.userId as string, postId);
    await commentsRepository.updateCommentVoteStatus(
      null,
      postId,
      req.user?.userId!
    );
    return res.status(204).end();
  } else {
    // 기존 투표 타입과 요청한 투표 타입이 다르다면, 수정
    await votesRepository.updateVote(
      req.user?.userId as string,
      postId,
      createVoteDto.isFirstChoice
    );
    await commentsRepository.updateCommentVoteStatus(
      createVoteDto.isFirstChoice,
      postId,
      req.user?.userId!
    );
    return res.status(204).end();
  }
};
