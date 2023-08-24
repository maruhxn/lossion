import HttpException from "@/libs/http-exception";
import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { z } from "zod";

const ErrorFilter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { stack, status = 500, message = "Server Error" } = err;
  console.error(stack);
  if (err instanceof HttpException) {
    return res.status(status).json({
      ok: false,
      status,
      msg: message,
    });
  } else if (err instanceof MulterError) {
    return res.status(400).json({
      ok: false,
      status: 400,
      msg: "파일 용량이 너무 큽니다",
    });
  } else if (err instanceof z.ZodError) {
    return res.status(400).json({
      ok: false,
      status: 400,
      msg: err.message,
    });
  } else {
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: "서버 오류입니다. 잠시 후에 다시 시도해주세요.",
    });
  }
};

export default ErrorFilter;
