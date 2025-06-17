import { db } from "./db";
import { files, folders, messages, subjects, chapters, type File, type FolderDB, type MessageDB, type SubjectDB, type ChapterDB, type InsertFile, type InsertFolder, type InsertMessage, type InsertSubject, type InsertChapter } from "@shared/schema";
import { eq } from "drizzle-orm";
import { questions, type QuestionDB, type InsertQuestion } from "@shared/schema"; // Import questions schema

export interface IStorage {
  // File operations
  getFiles(): Promise<File[]>;
  createFile(fileData: InsertFile): Promise<File>;
  deleteFile(id: number): Promise<void>;

  // Folder operations
  getFolders(): Promise<FolderDB[]>;
  createFolder(folderData: InsertFolder): Promise<FolderDB>;
  deleteFolder(id: number): Promise<void>;

  // Message operations
  getMessages(): Promise<MessageDB[]>;
  createMessage(messageData: InsertMessage): Promise<MessageDB>;
  deleteMessage(id: number): Promise<void>;
  clearMessages(): Promise<void>;

  // Subject operations
  getSubjects(): Promise<SubjectDB[]>;
  createSubject(subjectData: InsertSubject): Promise<SubjectDB>;
  deleteSubject(id: number): Promise<void>;

  // Chapter operations
  getChapters(): Promise<ChapterDB[]>;
  getChaptersBySubject(subjectId: number): Promise<ChapterDB[]>;
  createChapter(chapterData: InsertChapter): Promise<ChapterDB>;
  deleteChapter(id: number): Promise<void>;

  // Question operations
  getQuestionsByChapter(chapterId: number): Promise<QuestionDB[]>;
  createBulkQuestions(questionsData: InsertQuestion[]): Promise<QuestionDB[]>;
  deleteQuestionsByChapter(chapterId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // File operations
  async getFiles(): Promise<File[]> {
    return await db.select().from(files);
  }

  async createFile(fileData: InsertFile): Promise<File> {
    const [file] = await db
      .insert(files)
      .values(fileData)
      .returning();
    return file;
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  // Folder operations
  async getFolders(): Promise<FolderDB[]> {
    return await db.select().from(folders);
  }

  async createFolder(folderData: InsertFolder): Promise<FolderDB> {
    const [folder] = await db
      .insert(folders)
      .values(folderData)
      .returning();
    return folder;
  }

  async deleteFolder(id: number): Promise<void> {
    await db.delete(folders).where(eq(folders.id, id));
  }

  // Message operations
  async getMessages(): Promise<MessageDB[]> {
    return await db.select().from(messages);
  }

  async createMessage(messageData: InsertMessage): Promise<MessageDB> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  async clearMessages(): Promise<void> {
    await db.delete(messages);
  }

  // Subject operations
  async getSubjects(): Promise<SubjectDB[]> {
    return await db.select().from(subjects);
  }

  async createSubject(subjectData: InsertSubject): Promise<SubjectDB> {
    const [subject] = await db
      .insert(subjects)
      .values(subjectData)
      .returning();
    return subject;
  }

  async deleteSubject(id: number): Promise<void> {
    // Delete all related chapters first
    const relatedChapters = await db.select().from(chapters).where(eq(chapters.subjectId, id));

    for (const chapter of relatedChapters) {
      // Delete questions associated with this chapter
      await db.delete(questions).where(eq(questions.chapterId, chapter.id));
    }

    await db.delete(chapters).where(eq(chapters.subjectId, id));
    await db.delete(subjects).where(eq(subjects.id, id));
  }

  // Chapter operations
  async getChapters(): Promise<ChapterDB[]> {
    return await db.select().from(chapters);
  }

  async getChaptersBySubject(subjectId: number): Promise<ChapterDB[]> {
    return await db.select().from(chapters).where(eq(chapters.subjectId, subjectId));
  }

  async createChapter(chapterData: InsertChapter): Promise<ChapterDB> {
    const [chapter] = await db
      .insert(chapters)
      .values(chapterData)
      .returning();
    return chapter;
  }

  async deleteChapter(id: number): Promise<void> {
    // First delete all questions associated with this chapter
    await this.deleteQuestionsByChapter(id);
    // Then delete the chapter
    await db.delete(chapters).where(eq(chapters.id, id));
  }

  // Question operations
  async getQuestionsByChapter(chapterId: number): Promise<QuestionDB[]> {
    return await db.select().from(questions).where(eq(questions.chapterId, chapterId));
  }

  async createBulkQuestions(questionsData: InsertQuestion[]): Promise<QuestionDB[]> {
    const insertedQuestions = await db
      .insert(questions)
      .values(questionsData)
      .returning();
    return insertedQuestions;
  }

  async deleteQuestionsByChapter(chapterId: number): Promise<void> {
    await db.delete(questions).where(eq(questions.chapterId, chapterId));
  }
}

export const storage = new DatabaseStorage();