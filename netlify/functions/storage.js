import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import ws from 'ws';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

// Database schema definitions
const files = {
  id: 'serial',
  name: 'text',
  type: 'text',
  size: 'text',
  path: 'text',
  createdAt: 'timestamp'
};

const folders = {
  id: 'serial',
  name: 'text', 
  path: 'text',
  createdAt: 'timestamp'
};

const messages = {
  id: 'serial',
  text: 'text',
  timestamp: 'timestamp',
  sender: 'text'
};

const subjects = {
  id: 'serial',
  name: 'text',
  color: 'text',
  createdAt: 'timestamp'
};

const chapters = {
  id: 'serial',
  subjectId: 'integer',
  title: 'text',
  description: 'text',
  progress: 'integer',
  totalQuestions: 'integer',
  difficulty: 'text',
  createdAt: 'timestamp'
};

const questions = {
  id: 'serial',
  chapterId: 'integer',
  question: 'text',
  optionA: 'text',
  optionB: 'text',
  optionC: 'text',
  optionD: 'text',
  correctAnswer: 'integer',
  explanation: 'text',
  difficulty: 'text',
  createdAt: 'timestamp'
};

class NetlifyStorage {
  constructor() {
    this.pool = null;
    this.db = null;
  }

  async initDB() {
    if (!this.db) {
      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
      }

      this.pool = new Pool({ connectionString: DATABASE_URL });
      this.db = drizzle({ client: this.pool });
    }
    return this.db;
  }

  // File operations
  async getFiles() {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM files ORDER BY created_at DESC');
    return result.rows;
  }

  async createFile(fileData) {
    const db = await this.initDB();
    const { name, type, size, path } = fileData;
    const result = await this.pool.query(
      'INSERT INTO files (name, type, size, path, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [name, type, size || null, path]
    );
    return result.rows[0];
  }

  async deleteFile(id) {
    const db = await this.initDB();
    await this.pool.query('DELETE FROM files WHERE id = $1', [id]);
  }

  // Folder operations
  async getFolders() {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM folders ORDER BY created_at DESC');
    return result.rows;
  }

  async createFolder(folderData) {
    const db = await this.initDB();
    const { name, path } = folderData;
    const result = await this.pool.query(
      'INSERT INTO folders (name, path, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, path]
    );
    return result.rows[0];
  }

  async deleteFolder(id) {
    const db = await this.initDB();
    await this.pool.query('DELETE FROM folders WHERE id = $1', [id]);
  }

  // Message operations
  async getMessages() {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM messages ORDER BY timestamp ASC');
    return result.rows;
  }

  async createMessage(messageData) {
    const db = await this.initDB();
    const { text, sender } = messageData;
    const result = await this.pool.query(
      'INSERT INTO messages (text, sender, timestamp) VALUES ($1, $2, NOW()) RETURNING *',
      [text, sender]
    );
    return result.rows[0];
  }

  async deleteMessage(id) {
    const db = await this.initDB();
    await this.pool.query('DELETE FROM messages WHERE id = $1', [id]);
  }

  async clearMessages() {
    const db = await this.initDB();
    await this.pool.query('DELETE FROM messages');
  }

  // Subject operations
  async getSubjects() {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM subjects ORDER BY name ASC');
    return result.rows;
  }

  async createSubject(subjectData) {
    const db = await this.initDB();
    const { name, color } = subjectData;
    const result = await this.pool.query(
      'INSERT INTO subjects (name, color, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, color]
    );
    return result.rows[0];
  }

  async deleteSubject(id) {
    const db = await this.initDB();
    // Delete related chapters and questions first
    await this.pool.query('DELETE FROM questions WHERE chapter_id IN (SELECT id FROM chapters WHERE subject_id = $1)', [id]);
    await this.pool.query('DELETE FROM chapters WHERE subject_id = $1', [id]);
    await this.pool.query('DELETE FROM subjects WHERE id = $1', [id]);
  }

  // Chapter operations
  async getChapters() {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM chapters ORDER BY title ASC');
    return result.rows;
  }

  async getChaptersBySubject(subjectId) {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM chapters WHERE subject_id = $1 ORDER BY title ASC', [subjectId]);
    return result.rows;
  }

  async createChapter(chapterData) {
    const db = await this.initDB();
    const { subjectId, title, description, progress = 0, totalQuestions = 0, difficulty } = chapterData;
    const result = await this.pool.query(
      'INSERT INTO chapters (subject_id, title, description, progress, total_questions, difficulty, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [subjectId, title, description, progress, totalQuestions, difficulty]
    );
    return result.rows[0];
  }

  async deleteChapter(id) {
    const db = await this.initDB();
    // Delete related questions first
    await this.pool.query('DELETE FROM questions WHERE chapter_id = $1', [id]);
    await this.pool.query('DELETE FROM chapters WHERE id = $1', [id]);
  }

  // Question operations
  async getQuestionsByChapter(chapterId) {
    const db = await this.initDB();
    const result = await this.pool.query('SELECT * FROM questions WHERE chapter_id = $1 ORDER BY id ASC', [chapterId]);
    return result.rows;
  }

  async createBulkQuestions(questionsData) {
    const db = await this.initDB();
    const insertedQuestions = [];
    
    for (const questionData of questionsData) {
      const { chapterId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty } = questionData;
      const result = await this.pool.query(
        'INSERT INTO questions (chapter_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
        [chapterId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty]
      );
      insertedQuestions.push(result.rows[0]);
    }
    
    return insertedQuestions;
  }
}

export const storage = new NetlifyStorage();