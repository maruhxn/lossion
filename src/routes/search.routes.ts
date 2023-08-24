import { searchPosts } from "@/controllers/search.controller";
import catchAsync from "@/libs/catch-async";
import express from "express";

const router = express.Router();

router.get("/search", catchAsync(searchPosts));

export default router;
