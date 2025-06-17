import type {
  Subject,
  Chapter,
  Question,
  QuizSession,
  QuizAnswer,
  QuizStat,
  FileItem,
  StudySession,
  ScheduleEvent,
  SubjectDB,
  ChapterDB,
  QuestionDB,
  File,
  FolderDB,
  MessageDB
} from "@shared/schema";

// Initialization
let initializationPromise: Promise<void> | null = null;

async function initializeDefaultData() {
  // Check if subjects already exist in database
  const existingSubjects = await getSubjects();
  if (existingSubjects.length > 0) {
    return; // Already initialized
  }

  // Add default NEET subjects to database
  const defaultSubjects = [
    { name: "Physics", color: "#3B82F6" },
    { name: "Chemistry", color: "#10B981" },
    { name: "Biology", color: "#F59E0B" }
  ];

  for (const subject of defaultSubjects) {
    await createSubject(subject);
  }
}

export function ensureInitialized(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeDefaultData();
  }
  return initializationPromise;
}

// Subjects
export async function getSubjects(): Promise<Subject[]> {
  try {
    const response = await fetch('/api/subjects');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subjects: SubjectDB[] = await response.json();
    
    // Convert database format to expected format
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      color: subject.color
    }));
  } catch (error) {
    console.error('Error getting subjects:', error);
    return [];
  }
}

export async function createSubject(subjectData: { name: string; color: string }): Promise<Subject> {
  try {
    const response = await fetch('/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subjectData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create subject: ${response.statusText}`);
    }
    
    const subject: SubjectDB = await response.json();
    return {
      id: subject.id,
      name: subject.name,
      color: subject.color
    };
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
}

export async function deleteSubject(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/subjects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete subject: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
}

// Chapters
export async function getChapters(): Promise<Chapter[]> {
  try {
    const response = await fetch('/api/chapters');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const chapters: ChapterDB[] = await response.json();
    
    // Convert database format to expected format
    return chapters.map((chapter) => ({
      id: chapter.id,
      subjectId: chapter.subjectId,
      title: chapter.title,
      description: chapter.description || '',
      progress: chapter.progress || 0,
      totalQuestions: chapter.totalQuestions || 0,
      difficulty: chapter.difficulty || 'medium'
    }));
  } catch (error) {
    console.error('Error getting chapters:', error);
    return [];
  }
}

export async function getChaptersBySubject(subjectId: number): Promise<Chapter[]> {
  try {
    const response = await fetch(`/api/subjects/${subjectId}/chapters`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const chapters: ChapterDB[] = await response.json();
    
    // Convert database format to expected format
    return chapters.map((chapter) => ({
      id: chapter.id,
      subjectId: chapter.subjectId,
      title: chapter.title,
      description: chapter.description || '',
      progress: chapter.progress || 0,
      totalQuestions: chapter.totalQuestions || 0,
      difficulty: chapter.difficulty || 'medium'
    }));
  } catch (error) {
    console.error('Error getting chapters by subject:', error);
    return [];
  }
}

export async function getChapterById(id: number): Promise<Chapter | undefined> {
  try {
    const chapters = await getChapters();
    return chapters.find(chapter => chapter.id === id);
  } catch (error) {
    console.error('Error getting chapter by id:', error);
    return undefined;
  }
}

export async function createChapter(chapterData: {
  subjectId: number;
  title: string;
  description: string;
  difficulty: string;
}): Promise<Chapter> {
  try {
    const response = await fetch('/api/chapters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...chapterData,
        progress: 0,
        totalQuestions: 0
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create chapter: ${response.statusText}`);
    }
    
    const chapter: ChapterDB = await response.json();
    return {
      id: chapter.id,
      subjectId: chapter.subjectId,
      title: chapter.title,
      description: chapter.description || '',
      progress: chapter.progress || 0,
      totalQuestions: chapter.totalQuestions || 0,
      difficulty: chapter.difficulty || 'medium'
    };
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
}

export async function deleteChapter(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/chapters/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete chapter: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
}

// Questions
export async function getQuestions(): Promise<Question[]> {
  try {
    const chapters = await getChapters();
    const allQuestions: Question[] = [];
    
    for (const chapter of chapters) {
      const questions = await getQuestionsByChapter(chapter.id);
      allQuestions.push(...questions);
    }
    
    return allQuestions;
  } catch (error) {
    console.error('Error getting questions:', error);
    return [];
  }
}

export async function getQuestionsByChapter(chapterId: number): Promise<Question[]> {
  try {
    const response = await fetch(`/api/questions/chapter/${chapterId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const questions: QuestionDB[] = await response.json();
    
    // Convert database format to expected format
    return questions.map((question) => ({
      id: question.id,
      chapterId: question.chapterId,
      question: question.question,
      options: [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD
      ],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      difficulty: (question.difficulty as 'easy' | 'medium' | 'hard') || 'medium'
    }));
  } catch (error) {
    console.error('Error getting questions by chapter:', error);
    return [];
  }
}

export async function createQuestion(questionData: {
  chapterId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}): Promise<Question> {
  try {
    const response = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapterId: questionData.chapterId,
        questions: [{
          question: questionData.question,
          optionA: questionData.options[0],
          optionB: questionData.options[1],
          optionC: questionData.options[2],
          optionD: questionData.options[3],
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty
        }]
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create question: ${response.statusText}`);
    }
    
    const result = await response.json();
    const createdQuestion = result.questions[0];
    
    return {
      id: createdQuestion.id,
      chapterId: createdQuestion.chapterId,
      question: createdQuestion.question,
      options: [
        createdQuestion.optionA,
        createdQuestion.optionB,
        createdQuestion.optionC,
        createdQuestion.optionD
      ],
      correctAnswer: createdQuestion.correctAnswer,
      explanation: createdQuestion.explanation || '',
      difficulty: createdQuestion.difficulty || 'medium'
    };
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
}

export async function createBulkQuestions(data: { chapterId: number; questions: any[] }): Promise<Question[]> {
  try {
    const response = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create bulk questions: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Convert to expected format
    return result.questions.map((question: QuestionDB) => ({
      id: question.id,
      chapterId: question.chapterId,
      question: question.question,
      options: [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD
      ],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      difficulty: question.difficulty || 'medium'
    }));
  } catch (error) {
    console.error('Error creating bulk questions:', error);
    throw error;
  }
}

// Quiz Sessions (Local storage for now, can be moved to DB later)
export async function createQuizSession(sessionData: {
  chapterId: number;
  totalQuestions: number;
  currentQuestion: number;
  score: number;
  isCompleted: boolean;
}): Promise<QuizSession> {
  const newSession: QuizSession = {
    id: Date.now(),
    ...sessionData,
    createdAt: new Date()
  };
  
  const sessions = JSON.parse(localStorage.getItem('quizSessions') || '[]');
  sessions.push(newSession);
  localStorage.setItem('quizSessions', JSON.stringify(sessions));
  
  return newSession;
}

export async function getQuizSession(id: number): Promise<QuizSession | undefined> {
  const sessions: QuizSession[] = JSON.parse(localStorage.getItem('quizSessions') || '[]');
  return sessions.find(session => session.id === id);
}

export async function updateQuizSession(id: number, sessionData: Partial<QuizSession>): Promise<QuizSession | undefined> {
  const sessions: QuizSession[] = JSON.parse(localStorage.getItem('quizSessions') || '[]');
  const sessionIndex = sessions.findIndex(session => session.id === id);
  
  if (sessionIndex !== -1) {
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...sessionData };
    localStorage.setItem('quizSessions', JSON.stringify(sessions));
    return sessions[sessionIndex];
  }
  
  return undefined;
}

export async function createQuizAnswer(answerData: {
  sessionId: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}): Promise<QuizAnswer> {
  const newAnswer: QuizAnswer = {
    id: Date.now(),
    ...answerData
  };
  
  const answers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
  answers.push(newAnswer);
  localStorage.setItem('quizAnswers', JSON.stringify(answers));
  
  return newAnswer;
}

export async function getQuizAnswersBySession(sessionId: number): Promise<QuizAnswer[]> {
  const answers: QuizAnswer[] = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
  return answers.filter(answer => answer.sessionId === sessionId);
}

// Statistics
export async function getUserStats(): Promise<{
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  studyStreak: number;
  totalStudyTimeMinutes: number;
  quizStats: QuizStat[];
}> {
  const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
  return {
    totalQuestionsSolved: stats.totalQuestionsSolved || 0,
    totalCorrectAnswers: stats.totalCorrectAnswers || 0,
    studyStreak: stats.studyStreak || 0,
    totalStudyTimeMinutes: stats.totalStudyTimeMinutes || 0,
    quizStats: stats.quizStats || []
  };
}

export async function createQuizStat(statData: {
  date: Date;
  chapterTitle: string;
  subjectTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}): Promise<QuizStat> {
  const newStat: QuizStat = {
    id: Date.now(),
    ...statData
  };
  
  const currentStats = await getUserStats();
  currentStats.quizStats.push(newStat);
  localStorage.setItem('userStats', JSON.stringify(currentStats));
  
  return newStat;
}

export async function updateUserStats(statsData: any): Promise<void> {
  const currentStats = await getUserStats();
  const updatedStats = { ...currentStats, ...statsData };
  localStorage.setItem('userStats', JSON.stringify(updatedStats));
}

// Files
export async function getFiles(): Promise<FileItem[]> {
  try {
    const response = await fetch('/api/files');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const files: File[] = await response.json();
    
    // Convert database format to expected format
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      type: file.type as "folder" | "pdf" | "image" | "document",
      size: file.size || undefined,
      path: file.path,
      createdAt: file.createdAt
    }));
  } catch (error) {
    console.error('Error getting files:', error);
    return [];
  }
}

export async function createFile(fileData: { 
  name: string; 
  type: "folder" | "pdf" | "image" | "document"; 
  size?: string; 
  path: string; 
}): Promise<FileItem> {
  try {
    const response = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create file: ${response.statusText}`);
    }
    
    const file: File = await response.json();
    return {
      id: file.id,
      name: file.name,
      type: file.type as "folder" | "pdf" | "image" | "document",
      size: file.size || undefined,
      path: file.path,
      createdAt: file.createdAt
    };
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

export async function deleteFile(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/files/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Folders
export async function getFolders(): Promise<FolderDB[]> {
  try {
    const response = await fetch('/api/folders');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
}

export async function createFolder(folderData: { 
  name: string; 
  path: string; 
}): Promise<FolderDB> {
  try {
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(folderData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

export async function deleteFolder(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete folder: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting folder:', error);
    return false;
  }
}

// Messages
export async function getMessages(): Promise<MessageDB[]> {
  try {
    const response = await fetch('/api/messages');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

export async function createMessage(messageData: {
  text: string;
  sender: string;
}): Promise<MessageDB> {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    // Clear messages
    const response = await fetch('/api/messages', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.warn('Failed to clear messages from database');
    }
    
    // Clear local storage
    localStorage.removeItem('quizSessions');
    localStorage.removeItem('quizAnswers');
    localStorage.removeItem('userStats');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}

// Initialize default subjects
export async function initializeDefaultSubjects(): Promise<void> {
  await ensureInitialized();
}