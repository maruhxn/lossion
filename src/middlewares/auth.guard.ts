import HttpException from "@/libs/http-exception";
import { UserInfo } from "@/passport/passport";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AuthJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) throw new HttpException("로그인이 필요합니다.", 401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as UserInfo;
    next();
  });
};
