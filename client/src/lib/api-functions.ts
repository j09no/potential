import type {
  Subject,
  Chapter,
  Question,
  QuizSession,
  QuizAnswer,
  QuizStat,
  FileItem,
  StudySession,
  ScheduleEvent
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
    const subjects = await response.json();
    
    // Convert database format to expected format
    return subjects.map((subject: any) => ({
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
    
    const subject = await response.json();
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
    const chapters = await response.json();
    
    // Convert database format to expected format
    return chapters.map((chapter: any) => ({
      id: chapter.id,
      subjectId: chapter.subjectId,
      title: chapter.title,
      description: chapter.description || '',
      progress: 0, // Calculate from questions if needed
      totalQuestions: 0, // Will be updated when questions are loaded
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
    const chapters = await response.json();
    
    // Convert database format to expected format
    return chapters.map((chapter: any) => ({
      id: chapter.id,
      subjectId: chapter.subjectId,
      title: chapter.title,
      description: chapter.description || '',
      progress: 0, // Calculate from questions if needed
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
    await ensureInitialized();
    return await indexedDB.getById('chapters', id);
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
      body: JSON.stringify(chapterData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create chapter: ${response.statusText}`);
    }
    
    const chapter = await response.json();
    return {
      id: chapter.id,
      subjectId: chapter.subjectId,
      title: chapter.title,
      description: chapter.description || '',
      progress: 0,
      totalQuestions: 0,
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
    await ensureInitialized();
    return await indexedDB.getAll('questions');
  } catch (error) {
    console.error('Error getting questions:', error);
    return [];
  }
}

// export async function getQuestionsByChapter(chapterId: number): Promise<Question[]> {
//   try {
//     await ensureInitialized();
//     return await indexedDB.getByIndex('questions', 'chapterId', chapterId);
//   } catch (error) {
//     console.error('Error getting questions by chapter:', error);
//     return [];
//   }
// }

export async function createQuestion(questionData: {
  chapterId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}): Promise<Question> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('questions');
    const newQuestion: Question = {
      id,
      chapterId: questionData.chapterId,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      difficulty: questionData.difficulty
    };

    const question = await indexedDB.add('questions', newQuestion);

    // Update chapter's total questions count
    const chapter = await getChapterById(questionData.chapterId);
    if (chapter) {
      chapter.totalQuestions += 1;
      await indexedDB.put('chapters', chapter);
    }

    return question;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
}

// export async function createBulkQuestionsAPI(questionsData: {
//   chapterId: number;
//   questions: Array<{
//     question: string;
//     options: string[];
//     correctAnswer: number;
//     explanation: string;
//     difficulty: "easy" | "medium" | "hard";
//   }>;
// }): Promise<Question[]> {
//   try {
//     await ensureInitialized();
//     const createdQuestions: Question[] = [];

//     for (const questionData of questionsData.questions) {
//       const id = await indexedDB.getNextId('questions');
//       const newQuestion: Question = {
//         id,
//         chapterId: questionsData.chapterId,
//         question: questionData.question,
//         options: questionData.options,
//         correctAnswer: questionData.correctAnswer,
//         explanation: questionData.explanation,
//         difficulty: questionData.difficulty
//       };

//       const question = await indexedDB.add('questions', newQuestion);
//       createdQuestions.push(question);
//     }

//     // Update chapter's total questions count
//     const chapter = await getChapterById(questionsData.chapterId);
//     if (chapter) {
//       chapter.totalQuestions += questionsData.questions.length;
//       await indexedDB.put('chapters', chapter);
//     }

//     return createdQuestions;
//   } catch (error) {
//     console.error('Error creating bulk questions:', error);
//     throw error;
//   }
// }

// Quiz Sessions
export async function createQuizSession(sessionData: {
  chapterId: number;
  totalQuestions: number;
}): Promise<QuizSession> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('quizSessions');
    const newSession: QuizSession = {
      id,
      chapterId: sessionData.chapterId,
      totalQuestions: sessionData.totalQuestions,
      currentQuestion: 0,
      score: 0,
      isCompleted: false,
      createdAt: new Date()
    };

    return await indexedDB.add('quizSessions', newSession);
  } catch (error) {
    console.error('Error creating quiz session:', error);
    throw error;
  }
}

export async function getQuizSession(id: number): Promise<QuizSession | undefined> {
  try {
    await ensureInitialized();
    return await indexedDB.getById('quizSessions', id);
  } catch (error) {
    console.error('Error getting quiz session:', error);
    return undefined;
  }
}

export async function updateQuizSession(id: number, sessionData: Partial<QuizSession>): Promise<QuizSession | undefined> {
  try {
    await ensureInitialized();
    const session = await indexedDB.getById('quizSessions', id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...sessionData };
    return await indexedDB.put('quizSessions', updatedSession);
  } catch (error) {
    console.error('Error updating quiz session:', error);
    return undefined;
  }
}

export async function createQuizAnswer(answerData: {
  sessionId: number;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}): Promise<QuizAnswer> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('quizAnswers');
    const newAnswer: QuizAnswer = {
      id,
      sessionId: answerData.sessionId,
      questionId: answerData.questionId,
      selectedAnswer: answerData.selectedAnswer,
      isCorrect: answerData.isCorrect
    };

    return await indexedDB.add('quizAnswers', newAnswer);
  } catch (error) {
    console.error('Error creating quiz answer:', error);
    throw error;
  }
}

export async function getQuizAnswersBySession(sessionId: number): Promise<QuizAnswer[]> {
  try {
    await ensureInitialized();
    return await indexedDB.getByIndex('quizAnswers', 'sessionId', sessionId);
  } catch (error) {
    console.error('Error getting quiz answers by session:', error);
    return [];
  }
}

// Statistics
export async function getUserStats(): Promise<{
  totalQuizzes: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  studyStreak: number;
}> {
  try {
    await ensureInitialized();
    const sessions = await indexedDB.getAll('quizSessions');
    const answers = await indexedDB.getAll('quizAnswers');

    const completedSessions = sessions.filter(s => s.isCompleted);
    const totalQuizzes = completedSessions.length;
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const averageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return {
      totalQuizzes,
      averageScore,
      totalQuestions,
      correctAnswers,
      studyStreak: 0 // Can be calculated based on dates if needed
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      studyStreak: 0
    };
  }
}

export async function createQuizStat(statData: {
  chapterTitle: string;
  subjectTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}): Promise<QuizStat> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('quizStats');
    const newStat: QuizStat = {
      id,
      date: new Date(),
      chapterTitle: statData.chapterTitle,
      subjectTitle: statData.subjectTitle,
      score: statData.score,
      totalQuestions: statData.totalQuestions,
      percentage: statData.percentage
    };

    return await indexedDB.add('quizStats', newStat);
  } catch (error) {
    console.error('Error creating quiz stat:', error);
    throw error;
  }
}

// Files
export async function getFiles(): Promise<FileItem[]> {
  try {
    await ensureInitialized();
    return await indexedDB.getAll('files');
  } catch (error) {
    console.error('Error getting files:', error);
    return [];
  }
}

export async function createFile(fileData: { 
  name: string; 
  type: string; 
  size?: string; 
  path: string 
}): Promise<FileItem> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('files');
    const newFile: FileItem = {
      id,
      name: fileData.name,
      type: fileData.type as FileItem['type'],
      size: fileData.size,
      path: fileData.path,
      createdAt: new Date()
    };

    return await indexedDB.add('files', newFile);
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

export async function deleteFile(id: number): Promise<boolean> {
  try {
    await ensureInitialized();
    return await indexedDB.delete('files', id);
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Folders
export async function getFolders(): Promise<Folder[]> {
  try {
    await ensureInitialized();
    return await indexedDB.getAll('folders');
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
}

export async function createFolder(folderData: { 
  name: string; 
  path: string 
}): Promise<Folder> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('folders');
    const newFolder: Folder = {
      id,
      name: folderData.name,
      path: folderData.path,
      createdAt: new Date()
    };

    return await indexedDB.add('folders', newFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

export async function deleteFolder(id: number): Promise<boolean> {
  try {
    await ensureInitialized();
    return await indexedDB.delete('folders', id);
  } catch (error) {
    console.error('Error deleting folder:', error);
    return false;
  }
}

// Messages
export async function getMessages(): Promise<Message[]> {
  try {
    await ensureInitialized();
    return await indexedDB.getAll('messages');
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

export async function createMessage(messageData: {
  text: string;
  sender: string;
}): Promise<Message> {
  try {
    await ensureInitialized();
    const id = await indexedDB.getNextId('messages');
    const newMessage: Message = {
      id,
      text: messageData.text,
      timestamp: new Date(),
      sender: messageData.sender as "user"
    };

    return await indexedDB.add('messages', newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

// Utility
export async function clearAllData(): Promise<void> {
  try {
    await ensureInitialized();
    await indexedDB.clear('quizAnswers');
    await indexedDB.clear('quizSessions');
    await indexedDB.clear('questions');
    await indexedDB.clear('chapters');
    await indexedDB.clear('subjects');
    await indexedDB.clear('quizStats');
    await indexedDB.clear('files');
    await indexedDB.clear('folders');
    await indexedDB.clear('messages');
    await indexedDB.clear('studySessions');
    await indexedDB.clear('scheduleEvents');
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

// Question API functions for server communication
export async function getQuestionsByChapter(chapterId: number) {
  try {
    console.log('Fetching questions for chapter:', chapterId);
    const response = await fetch(`/api/questions/chapter/${chapterId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const questions = await response.json();
    console.log('Fetched questions from API:', questions);
    
    // Convert database format to quiz format for compatibility
    const formattedQuestions = questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer, // Keep as number (0,1,2,3)
      explanation: q.explanation,
      difficulty: q.difficulty,
      chapterId: q.chapterId,
      createdAt: q.createdAt
    }));
    
    return formattedQuestions;
  } catch (error) {
    console.error('Error fetching questions from API:', error);
    throw error;
  }
}

export async function createBulkQuestions(data: { chapterId: number; questions: any[] }) {
  try {
    console.log('Creating bulk questions:', data);
    const response = await fetch(`/api/questions/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating bulk questions:', error);
    throw error;
  }
}

export async function updateUserStats(statsData: any) {
  // For now, just store in localStorage
  localStorage.setItem('userStats', JSON.stringify(statsData));
  return statsData;
}

// Initialize default subjects for NEET
export async function initializeDefaultSubjects(): Promise<void> {
  try {
    const existingSubjects = await getSubjects();
    if (existingSubjects.length > 0) {
      return; // Already initialized
    }

    const defaultSubjects = [
      { name: "Physics", color: "#3B82F6" },
      { name: "Chemistry", color: "#10B981" },
      { name: "Biology", color: "#F59E0B" }
    ];

    for (const subject of defaultSubjects) {
      await createSubject(subject);
    }
  } catch (error) {
    console.error('Error initializing default subjects:', error);
    throw error;
  }
}
// Remove all subtopic-related functions since we're removing that feature
// No subtopic functions will be exported