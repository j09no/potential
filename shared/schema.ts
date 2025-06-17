import { z } from "zod";
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// PostgreSQL Database Tables
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "folder" | "pdf" | "image" | "document"
  size: text("size"),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sender: text("sender").notNull(), // "user"
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  progress: integer("progress").default(0).notNull(),
  totalQuestions: integer("total_questions").default(0).notNull(),
  difficulty: text("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subtopics = pgTable("subtopics", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull(),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: integer("correct_answer").notNull(), // 0,1,2,3 for A,B,C,D
  explanation: text("explanation"),
  difficulty: text("difficulty").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drizzle Zod Schemas
export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true });
export const insertFolderSchema = createInsertSchema(folders).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true, createdAt: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true, createdAt: true });
export const insertSubtopicSchema = createInsertSchema(subtopics).omit({ id: true, createdAt: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true, createdAt: true });

// Insert Types
export type InsertFile = z.infer<typeof insertFileSchema>;
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type InsertSubtopic = z.infer<typeof insertSubtopicSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

// Select Types
export type File = typeof files.$inferSelect;
export type FolderDB = typeof folders.$inferSelect;
export type MessageDB = typeof messages.$inferSelect;
export type SubjectDB = typeof subjects.$inferSelect;
export type ChapterDB = typeof chapters.$inferSelect;
export type SubtopicDB = typeof subtopics.$inferSelect;
export type QuestionDB = typeof questions.$inferSelect;

// TypeScript interfaces for IndexedDB storage (legacy - will be removed)
export interface Subject {
  id: number;
  name: string;
  color: string;
}

export interface Chapter {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  progress: number;
  totalQuestions: number;
  difficulty: string;
}

export interface Question {
  id: number;
  chapterId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizSession {
  id: number;
  chapterId: number;
  totalQuestions: number;
  currentQuestion: number;
  score: number;
  isCompleted: boolean;
  createdAt: Date;
}

export interface QuizAnswer {
  id: number;
  sessionId: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizStat {
  id: number;
  date: Date;
  chapterTitle: string;
  subjectTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

// Legacy interfaces (keeping for compatibility during migration)
export interface FileItem {
  id: number;
  name: string;
  type: "folder" | "pdf" | "image" | "document";
  size?: string;
  path: string;
  createdAt: Date;
}

export interface StudySession {
  id: number;
  chapterId: number;
  duration: number;
  date: Date;
}

export interface ScheduleEvent {
  id: number;
  title: string;
  description?: string;
  date: Date;
  time: string;
  type: string;
}