import {
  createComment,
  deleteComment,
  getOneComment,
  getTopLevelComments,
  updateComment,
} from "@/controllers/comments.controller";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostDetail,
  updatePost,
} from "@/controllers/posts.controller";
import { vote } from "@/controllers/votes.controller";
import catchAsync from "@/libs/catch-async";
import express from "express";

const router = express.Router();

router.route("/").get(catchAsync(getAllPosts)).post(catchAsync(createPost));

router
  .route("/:postId")
  .get(catchAsync(getPostDetail))
  .patch(catchAsync(updatePost))
  .put(catchAsync(deletePost));

router
  .route("/:postId/comments")
  .get(catchAsync(getTopLevelComments))
  .post(catchAsync(createComment));

router
  .route("/:postId/comments/:commentId")
  .get(catchAsync(getOneComment))
  .patch(catchAsync(updateComment))
  .put(catchAsync(deleteComment));

router.route("/:postId/votes").put(catchAsync(vote));

export default router;
