import * as usersRepository from "@/db/repositories/users.repository";
import * as votesRepository from "@/db/repositories/votes.repository";
import { UserValidator } from "@/libs/validators/users.validator";
import {
  CreateVoteDto,
  CreateVoteValidator,
} from "@/libs/validators/votes.validator";
import { Request, Response } from "express";

export const vote = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userDto = UserValidator.parse(req.body.user);
  const createVoteDto: CreateVoteDto = CreateVoteValidator.parse(req.body);

  const author = await usersRepository.getOrCreateUser(userDto);

  // 이미 유저가 vote 했는지 확인.
  const exVote = await votesRepository.getOneVoteById(author.id, postId);

  if (!exVote) {
    // 기존 투표가 없다면, 투표 생성
    await votesRepository.createVote(author.id, postId, createVoteDto);

    return res.status(201).json({
      ok: true,
      msg: "투표 성공",
    });
  }

  if (exVote?.isFirst === createVoteDto.isFirst) {
    // 기존 투표 타입과 요청한 투표 타입이 같다면, 삭제
    await votesRepository.deleteVote(author.id, postId);
    return res.status(204).end();
  } else {
    // 기존 투표 타입과 요청한 투표 타입이 다르다면, 수정
    await votesRepository.updateVote(author.id, postId, createVoteDto.isFirst);
    return res.status(204).end();
  }
};
