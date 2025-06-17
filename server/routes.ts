import { Router } from "express";
import { storage } from "./storage";
import { insertFileSchema, insertFolderSchema, insertMessageSchema, insertSubjectSchema, insertChapterSchema, insertQuestionSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// File routes
router.get("/api/files", async (req, res) => {
  try {
    const files = await storage.getFiles();
    res.json(files);
  } catch (error) {
    console.error("Error getting files:", error);
    res.status(500).json({ error: "Failed to get files" });
  }
});

router.post("/api/files", async (req, res) => {
  try {
    const fileData = insertFileSchema.parse(req.body);
    const file = await storage.createFile(fileData);
    res.json(file);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid file data", details: error.errors });
    } else {
      console.error("Error creating file:", error);
      res.status(500).json({ error: "Failed to create file" });
    }
  }
});

router.delete("/api/files/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }
    await storage.deleteFile(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Folder routes
router.get("/api/folders", async (req, res) => {
  try {
    const folders = await storage.getFolders();
    res.json(folders);
  } catch (error) {
    console.error("Error getting folders:", error);
    res.status(500).json({ error: "Failed to get folders" });
  }
});

router.post("/api/folders", async (req, res) => {
  try {
    const folderData = insertFolderSchema.parse(req.body);
    const folder = await storage.createFolder(folderData);
    res.json(folder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid folder data", details: error.errors });
    } else {
      console.error("Error creating folder:", error);
      res.status(500).json({ error: "Failed to create folder" });
    }
  }
});

router.delete("/api/folders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid folder ID" });
    }
    await storage.deleteFolder(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
});

// Message routes
router.get("/api/messages", async (req, res) => {
  try {
    const messages = await storage.getMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

router.post("/api/messages", async (req, res) => {
  try {
    const messageData = insertMessageSchema.parse(req.body);
    const message = await storage.createMessage(messageData);
    res.json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid message data", details: error.errors });
    } else {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  }
});

router.delete("/api/messages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid message ID" });
    }
    await storage.deleteMessage(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

router.delete("/api/messages", async (req, res) => {
  try {
    await storage.clearMessages();
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing messages:", error);
    res.status(500).json({ error: "Failed to clear messages" });
  }
});

// Subject routes
router.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  } catch (error) {
    console.error("Error getting subjects:", error);
    res.status(500).json({ error: "Failed to get subjects" });
  }
});

router.post("/api/subjects", async (req, res) => {
  try {
    const subjectData = insertSubjectSchema.parse(req.body);
    const subject = await storage.createSubject(subjectData);
    res.json(subject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid subject data", details: error.errors });
    } else {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Failed to create subject" });
    }
  }
});

router.delete("/api/subjects/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid subject ID" });
    }
    await storage.deleteSubject(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

router.get("/api/subjects/:subjectId/chapters", async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId);
    if (isNaN(subjectId)) {
      return res.status(400).json({ error: "Invalid subject ID" });
    }
    const chapters = await storage.getChaptersBySubject(subjectId);
    res.json(chapters);
  } catch (error) {
    console.error("Error getting chapters by subject:", error);
    res.status(500).json({ error: "Failed to get chapters" });
  }
});

// Chapter routes
router.get("/api/chapters", async (req, res) => {
  try {
    const chapters = await storage.getChapters();
    res.json(chapters);
  } catch (error) {
    console.error("Error getting chapters:", error);
    res.status(500).json({ error: "Failed to get chapters" });
  }
});

router.post("/api/chapters", async (req, res) => {
  try {
    const chapterData = insertChapterSchema.parse(req.body);
    const chapter = await storage.createChapter(chapterData);
    res.json(chapter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid chapter data", details: error.errors });
    } else {
      console.error("Error creating chapter:", error);
      res.status(500).json({ error: "Failed to create chapter" });
    }
  }
});

router.delete("/api/chapters/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid chapter ID" });
    }
    await storage.deleteChapter(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({ error: "Failed to delete chapter" });
  }
});

// Question routes
router.get("/api/questions/chapter/:chapterId", async (req, res) => {
  try {
    const chapterId = parseInt(req.params.chapterId);
    if (isNaN(chapterId)) {
      return res.status(400).json({ error: "Invalid chapter ID" });
    }
    const questions = await storage.getQuestionsByChapter(chapterId);
    res.json(questions);
  } catch (error) {
    console.error("Error getting questions by chapter:", error);
    res.status(500).json({ error: "Failed to get questions" });
  }
});

router.post("/api/questions/bulk", async (req, res) => {
  try {
    const { chapterId, questions } = req.body;
    
    if (!chapterId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid data: chapterId and questions array required" });
    }

    console.log(`Creating ${questions.length} questions for chapter ${chapterId}`);
    
    const formattedQuestions = questions.map(q => {
      const questionData = {
        chapterId: chapterId,
        question: q.question,
        optionA: q.options[0],
        optionB: q.options[1],
        optionC: q.options[2], 
        optionD: q.options[3],
        correctAnswer: q.correctAnswer, // This should be a number (0,1,2,3)
        explanation: q.explanation || "No explanation provided",
        difficulty: q.difficulty || "medium"
      };
      
      // Validate each question
      try {
        return insertQuestionSchema.parse(questionData);
      } catch (validationError) {
        console.error("Question validation failed:", validationError);
        throw new Error(`Invalid question data: ${validationError.message}`);
      }
    });

    const result = await storage.createBulkQuestions(formattedQuestions);
    res.json(result);
  } catch (error) {
    console.error("Error creating bulk questions:", error);
    res.status(500).json({ error: "Failed to create questions", message: error.message });
  }
});

export default router;