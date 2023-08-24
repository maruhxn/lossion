import { InferModel, relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  char,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider", ["google", "kakao", "naver"]);

export const user = pgTable("user", {
  id: char("id", { length: 26 }).notNull().primaryKey(),
  username: varchar("username", { length: 20 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  snsId: varchar("sns_id", { length: 30 }).notNull(),
  provider: providerEnum("provider"),
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  comments: many(comment),
  vote: many(vote),
}));

export const post = pgTable("post", {
  id: char("id", { length: 26 }).primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: char("author_id", { length: 26 })
    .notNull()
    .references((): AnyPgColumn => user.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  firstChoice: varchar("first_choice", { length: 255 }).notNull(),
  secondChoice: varchar("second_choice", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const reference = pgTable("reference", {
  id: varchar("id", { length: 26 }).primaryKey().notNull(),
  postId: char("post_id", { length: 26 })
    .notNull()
    .references((): AnyPgColumn => post.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  imagePath: text("image_path").notNull(),
});

export const referenceRelations = relations(reference, ({ one }) => ({
  post: one(post, {
    fields: [reference.postId],
    references: [post.id],
  }),
}));

export const comment = pgTable("comment", {
  id: char("id", { length: 26 }).primaryKey().notNull(),
  userId: char("user_id", { length: 26 })
    .notNull()
    .references((): AnyPgColumn => user.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  postId: char("post_id", { length: 26 })
    .notNull()
    .references((): AnyPgColumn => post.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  content: text("content").notNull(),
  isFirstChoice: boolean("is_first_choice"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  replyToId: char("reply_to_id", { length: 26 }).references(
    (): AnyPgColumn => comment.id,
    { onUpdate: "cascade", onDelete: "cascade" }
  ),
});

export const replyRelations = relations(comment, ({ many }) => ({
  replies: many(comment, { relationName: "replyRelations" }),
}));

export const commentRelations = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
  topLevelComment: one(comment, {
    fields: [comment.replyToId],
    references: [comment.id],
    relationName: "replyRelations",
  }),
}));

export const vote = pgTable("vote", {
  id: char("id", { length: 26 }).primaryKey().notNull(),
  userId: char("user_id", { length: 26 })
    .notNull()
    .references((): AnyPgColumn => user.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  postId: char("post_id", { length: 26 })
    .notNull()
    .references((): AnyPgColumn => post.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  isFirstChoice: boolean("is_first_choice"),
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
