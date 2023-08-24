import { vote } from "@/controllers/votes.controller";
import catchAsync from "@/libs/catch-async";
import { AuthJWT } from "@/middlewares/auth.guard";
import express from "express";

const router = express.Router();

router.put("/:postId", AuthJWT, catchAsync(vote));

export default router;
