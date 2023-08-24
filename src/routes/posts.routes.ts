import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "@/controllers/comments.controller";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostDetail,
  updatePost,
} from "@/controllers/posts.controller";
import catchAsync from "@/libs/catch-async";
import { AuthJWT } from "@/middlewares/auth.guard";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(catchAsync(getAllPosts))
  .post(AuthJWT, catchAsync(createPost));

router
  .route("/:postId")
  .get(catchAsync(getPostDetail))
  .patch(AuthJWT, catchAsync(updatePost))
  .delete(AuthJWT, catchAsync(deletePost));

router
  .route("/:postId/comments")
  .get(catchAsync(getAllComments))
  .post(AuthJWT, catchAsync(createComment));

router
  .route("/:postId/comments/:commentId")
  .patch(AuthJWT, catchAsync(updateComment))
  .put(AuthJWT, catchAsync(deleteComment));

export default router;
