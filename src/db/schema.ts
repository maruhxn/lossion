import { InferModel, relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  ip: varchar("user_ip", { length: 20 }).notNull(),
  nickname: varchar("nickname", { length: 10 }).notNull(),
  agent: varchar("agent", { length: 255 }).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  comments: many(comment),
  vote: many(vote),
}));

export const post = pgTable("post", {
  id: varchar("id", { length: 26 }).primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: varchar("author_id", { length: 36 }).notNull(),
  password: varchar("password", { length: 80 }).notNull(),
  firstChoice: varchar("first_choice", { length: 100 }).notNull(),
  secondChoice: varchar("second_choice", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  references: many(reference),
  votes: many(vote),
  comments: many(comment),
}));

export const referenceTypeEnum = pgEnum("reference_type", [
  "image, link, video",
]);

export const reference = pgTable("reference", {
  id: varchar("id", { length: 26 }).primaryKey().notNull(),
  postId: varchar("post_id", { length: 36 }).notNull(),
  type: referenceTypeEnum("reference_type").notNull(),
  url: text("reference_url").notNull(),
  annotation: text("annotation"),
});

export const referenceRelations = relations(reference, ({ one }) => ({
  post: one(post, {
    fields: [reference.postId],
    references: [post.id],
  }),
}));

export const comment = pgTable("comment", {
  id: varchar("id", { length: 26 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  postId: varchar("post_id", { length: 36 }).notNull(),
  content: text("content").notNull(),
  password: varchar("password", { length: 80 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  replyToId: varchar("reply_to_id", { length: 36 }).references(
    (): AnyPgColumn => comment.id
  ),
});

export const replyRelations = relations(comment, ({ one, many }) => ({
  topLevelComment: one(comment, {
    fields: [comment.replyToId],
    references: [comment.id],
    relationName: "replyRelations",
  }),
  replies: many(comment, { relationName: "replyRelations" }),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
}));

export const vote = pgTable("vote", {
  id: varchar("id", { length: 26 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  postId: varchar("post_id", { length: 36 }).notNull(),
  isFirst: boolean("is_fisrt"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const voteRelations = relations(vote, ({ one }) => ({
  user: one(user, {
    fields: [vote.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [vote.postId],
    references: [post.id],
  }),
}));

export type User = InferModel<typeof user>;
export type Post = InferModel<typeof post>;
export type Reference = InferModel<typeof reference>;
export type Comment = InferModel<typeof comment>;
export type Vote = InferModel<typeof vote>;
