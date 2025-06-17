import type { SubjectDB, ChapterDB, File, FolderDB, MessageDB } from "@shared/schema";

const API_BASE = '/api';

// Subject API functions
export async function getSubjects(): Promise<SubjectDB[]> {
  try {
    const response = await fetch(`${API_BASE}/subjects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subjects: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting subjects:', error);
    throw error;
  }
}

export async function createSubject(subjectData: { name: string; color: string }): Promise<SubjectDB> {
  try {
    const response = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subjectData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create subject: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
}

export async function deleteSubject(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/subjects/${id}`, {
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

// Chapter API functions
export async function getChapters(): Promise<ChapterDB[]> {
  try {
    const response = await fetch(`${API_BASE}/chapters`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapters: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting chapters:', error);
    throw error;
  }
}

export async function getChaptersBySubject(subjectId: number): Promise<ChapterDB[]> {
  try {
    const response = await fetch(`${API_BASE}/subjects/${subjectId}/chapters`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapters by subject: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting chapters by subject:', error);
    throw error;
  }
}

export async function createChapter(chapterData: {
  subjectId: number;
  title: string;
  description: string;
  progress?: number;
  totalQuestions?: number;
  difficulty: string;
}): Promise<ChapterDB> {
  try {
    const response = await fetch(`${API_BASE}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...chapterData,
        progress: chapterData.progress || 0,
        totalQuestions: chapterData.totalQuestions || 0,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create chapter: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
}

export async function deleteChapter(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/chapters/${id}`, {
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





// File API functions
export async function getFiles(): Promise<File[]> {
  try {
    const response = await fetch(`${API_BASE}/files`);
    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting files:', error);
    throw error;
  }
}

export async function createFile(fileData: {
  name: string;
  type: string;
  size?: string;
  path: string;
}): Promise<File> {
  try {
    const response = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create file: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

export async function deleteFile(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Folder API functions
export async function getFolders(): Promise<FolderDB[]> {
  try {
    const response = await fetch(`${API_BASE}/folders`);
    if (!response.ok) {
      throw new Error(`Failed to fetch folders: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting folders:', error);
    throw error;
  }
}

export async function createFolder(folderData: {
  name: string;
  path: string;
}): Promise<FolderDB> {
  try {
    const response = await fetch(`${API_BASE}/folders`, {
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

export async function deleteFolder(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete folder: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
}

// Message API functions
export async function getMessages(): Promise<MessageDB[]> {
  try {
    const response = await fetch(`${API_BASE}/messages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

export async function createMessage(messageData: {
  text: string;
  sender: string;
}): Promise<MessageDB> {
  try {
    const response = await fetch(`${API_BASE}/messages`, {
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

export async function clearMessages(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to clear messages: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error clearing messages:', error);
    throw error;
  }
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