import { storage } from '../../server/storage.js';

// Helper function to handle CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Helper function to parse request body
async function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

// Helper function to send response
function sendResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

// Main handler function
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;
  const body = await parseBody(event);

  console.log(`${method} ${path}`);

  try {
    // Route handling
    if (path === '/subjects' && method === 'GET') {
      const subjects = await storage.getSubjects();
      return sendResponse(200, subjects);
    }

    if (path === '/subjects' && method === 'POST') {
      const subject = await storage.createSubject(body);
      return sendResponse(201, subject);
    }

    if (path.match(/^\/subjects\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[2]);
      await storage.deleteSubject(id);
      return sendResponse(200, { success: true });
    }

    if (path === '/chapters' && method === 'GET') {
      const chapters = await storage.getChapters();
      return sendResponse(200, chapters);
    }

    if (path === '/chapters' && method === 'POST') {
      const chapter = await storage.createChapter(body);
      return sendResponse(201, chapter);
    }

    if (path.match(/^\/chapters\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[2]);
      await storage.deleteChapter(id);
      return sendResponse(200, { success: true });
    }

    if (path.match(/^\/subjects\/\d+\/chapters$/) && method === 'GET') {
      const subjectId = parseInt(path.split('/')[2]);
      const chapters = await storage.getChaptersBySubject(subjectId);
      return sendResponse(200, chapters);
    }

    if (path.match(/^\/questions\/chapter\/\d+$/) && method === 'GET') {
      const chapterId = parseInt(path.split('/')[3]);
      const questions = await storage.getQuestionsByChapter(chapterId);
      return sendResponse(200, questions);
    }

    if (path === '/questions/bulk' && method === 'POST') {
      const { chapterId, questions } = body;
      
      if (!chapterId || !questions || !Array.isArray(questions)) {
        return sendResponse(400, { error: 'Invalid data: chapterId and questions array required' });
      }

      const formattedQuestions = questions.map(q => ({
        chapterId: chapterId,
        question: q.question,
        optionA: q.options[0],
        optionB: q.options[1],
        optionC: q.options[2], 
        optionD: q.options[3],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "No explanation provided",
        difficulty: q.difficulty || "medium"
      }));

      const result = await storage.createBulkQuestions(formattedQuestions);
      return sendResponse(201, result);
    }

    if (path === '/files' && method === 'GET') {
      const files = await storage.getFiles();
      return sendResponse(200, files);
    }

    if (path === '/files' && method === 'POST') {
      const file = await storage.createFile(body);
      return sendResponse(201, file);
    }

    if (path.match(/^\/files\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[2]);
      await storage.deleteFile(id);
      return sendResponse(200, { success: true });
    }

    if (path === '/folders' && method === 'GET') {
      const folders = await storage.getFolders();
      return sendResponse(200, folders);
    }

    if (path === '/folders' && method === 'POST') {
      const folder = await storage.createFolder(body);
      return sendResponse(201, folder);
    }

    if (path.match(/^\/folders\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[2]);
      await storage.deleteFolder(id);
      return sendResponse(200, { success: true });
    }

    if (path === '/messages' && method === 'GET') {
      const messages = await storage.getMessages();
      return sendResponse(200, messages);
    }

    if (path === '/messages' && method === 'POST') {
      const message = await storage.createMessage(body);
      return sendResponse(201, message);
    }

    if (path.match(/^\/messages\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[2]);
      await storage.deleteMessage(id);
      return sendResponse(200, { success: true });
    }

    if (path === '/messages' && method === 'DELETE') {
      await storage.clearMessages();
      return sendResponse(200, { success: true });
    }

    // Default 404 response
    return sendResponse(404, { error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return sendResponse(500, { error: 'Internal server error', message: error.message });
  }
}