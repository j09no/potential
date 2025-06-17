
from flask import Flask, request, jsonify
import sqlite3
import os
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database files
CHAT_DB_FILE = 'chat_messages.db'
FILES_DB_FILE = 'files_storage.db'
FOLDERS_DB_FILE = 'folders_storage.db'
CHAPTERS_DB_FILE = 'chapters_storage.db'
QUESTIONS_DB_FILE = 'questions_storage.db'

def init_db():
    """Initialize the SQLite databases and create all tables"""
    # Chat database
    conn = sqlite3.connect(CHAT_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            sender TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

    # Files database
    conn = sqlite3.connect(FILES_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            size TEXT,
            path TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

    # Folders database
    conn = sqlite3.connect(FOLDERS_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

    # Chapters database
    conn = sqlite3.connect(CHAPTERS_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chapters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL UNIQUE,
            description TEXT,
            subjectId INTEGER NOT NULL,
            difficulty TEXT DEFAULT 'medium',
            progress INTEGER DEFAULT 0,
            totalQuestions INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

    # Questions database
    conn = sqlite3.connect(QUESTIONS_DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chapterId INTEGER NOT NULL,
            question TEXT NOT NULL,
            optionA TEXT NOT NULL,
            optionB TEXT NOT NULL,
            optionC TEXT NOT NULL,
            optionD TEXT NOT NULL,
            correctAnswer TEXT NOT NULL,
            explanation TEXT,
            difficulty TEXT DEFAULT 'medium',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

    print("✅ All databases initialized successfully")

# Chat API Routes
@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get all messages from chat database"""
    try:
        conn = sqlite3.connect(CHAT_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT id, text, sender, timestamp FROM messages ORDER BY timestamp ASC')
        rows = cursor.fetchall()
        conn.close()

        messages = []
        for row in rows:
            messages.append({
                'id': row[0],
                'text': row[1],
                'sender': row[2],
                'timestamp': row[3]
            })

        return jsonify(messages)
    except Exception as e:
        print(f"Error getting messages: {e}")
        return jsonify({'error': 'Failed to get messages'}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    """Save a new message to chat database"""
    try:
        data = request.get_json()
        text = data.get('text')
        sender = data.get('sender', 'user')

        if not text:
            return jsonify({'error': 'Message text is required'}), 400

        conn = sqlite3.connect(CHAT_DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO messages (text, sender, timestamp) VALUES (?, ?, ?)',
            (text, sender, datetime.now().isoformat())
        )
        message_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return jsonify({
            'id': message_id,
            'text': text,
            'sender': sender,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error creating message: {e}")
        return jsonify({'error': 'Failed to create message'}), 500

# Files API Routes
@app.route('/api/files', methods=['GET'])
def get_files():
    """Get all files from files database"""
    try:
        conn = sqlite3.connect(FILES_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, type, size, path, timestamp FROM files ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        conn.close()

        files = []
        for row in rows:
            files.append({
                'id': row[0],
                'name': row[1],
                'type': row[2],
                'size': row[3],
                'path': row[4],
                'createdAt': row[5]
            })

        return jsonify(files)
    except Exception as e:
        print(f"Error getting files: {e}")
        return jsonify({'error': 'Failed to get files'}), 500

@app.route('/api/files', methods=['POST'])
def create_file():
    """Save a new file to files database"""
    try:
        data = request.get_json()
        name = data.get('name')
        file_type = data.get('type')
        size = data.get('size', '')
        path = data.get('path')

        if not name or not file_type or not path:
            return jsonify({'error': 'Name, type, and path are required'}), 400

        conn = sqlite3.connect(FILES_DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO files (name, type, size, path, timestamp) VALUES (?, ?, ?, ?, ?)',
            (name, file_type, size, path, datetime.now().isoformat())
        )
        file_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return jsonify({
            'id': file_id,
            'name': name,
            'type': file_type,
            'size': size,
            'path': path,
            'createdAt': datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error creating file: {e}")
        return jsonify({'error': 'Failed to create file'}), 500

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    """Delete a file from files database"""
    try:
        conn = sqlite3.connect(FILES_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM files WHERE id = ?', (file_id,))
        conn.commit()
        conn.close()

        return jsonify({'success': True})
    except Exception as e:
        print(f"Error deleting file: {e}")
        return jsonify({'error': 'Failed to delete file'}), 500

# Folders API Routes
@app.route('/api/folders', methods=['GET'])
def get_folders():
    """Get all folders from folders database"""
    try:
        conn = sqlite3.connect(FOLDERS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, path, timestamp FROM folders ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        conn.close()

        folders = []
        for row in rows:
            folders.append({
                'id': row[0],
                'name': row[1],
                'path': row[2],
                'createdAt': row[3]
            })

        return jsonify(folders)
    except Exception as e:
        print(f"Error getting folders: {e}")
        return jsonify({'error': 'Failed to get folders'}), 500

@app.route('/api/folders', methods=['POST'])
def create_folder():
    """Save a new folder to folders database"""
    try:
        data = request.get_json()
        name = data.get('name')
        path = data.get('path')

        if not name or not path:
            return jsonify({'error': 'Name and path are required'}), 400

        conn = sqlite3.connect(FOLDERS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO folders (name, path, timestamp) VALUES (?, ?, ?)',
            (name, path, datetime.now().isoformat())
        )
        folder_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return jsonify({
            'id': folder_id,
            'name': name,
            'path': path,
            'createdAt': datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error creating folder: {e}")
        return jsonify({'error': 'Failed to create folder'}), 500

@app.route('/api/folders/<int:folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    """Delete a folder from folders database"""
    try:
        conn = sqlite3.connect(FOLDERS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM folders WHERE id = ?', (folder_id,))
        conn.commit()
        conn.close()

        return jsonify({'success': True})
    except Exception as e:
        print(f"Error deleting folder: {e}")
        return jsonify({'error': 'Failed to delete folder'}), 500

# Chapters API Routes
@app.route('/api/chapters', methods=['GET'])
def get_chapters():
    """Get all chapters from chapters database"""
    try:
        conn = sqlite3.connect(CHAPTERS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT id, title, description, subjectId, difficulty, progress, totalQuestions, timestamp FROM chapters ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        conn.close()

        chapters = []
        for row in rows:
            chapters.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'subjectId': row[3],
                'difficulty': row[4],
                'progress': row[5],
                'totalQuestions': row[6],
                'createdAt': row[7]
            })

        return jsonify(chapters)
    except Exception as e:
        print(f"Error getting chapters: {e}")
        return jsonify({'error': 'Failed to get chapters'}), 500

@app.route('/api/chapters', methods=['POST'])
def create_chapter():
    """Save a new chapter to chapters database"""
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description', '')
        subject_id = data.get('subjectId')
        difficulty = data.get('difficulty', 'medium')

        if not title or not subject_id:
            return jsonify({'error': 'Title and subjectId are required'}), 400

        conn = sqlite3.connect(CHAPTERS_DB_FILE)
        cursor = conn.cursor()
        
        # Check if chapter with same title already exists
        cursor.execute('SELECT id FROM chapters WHERE title = ?', (title,))
        existing = cursor.fetchone()
        if existing:
            conn.close()
            return jsonify({'error': 'Chapter with this title already exists'}), 400

        cursor.execute(
            'INSERT INTO chapters (title, description, subjectId, difficulty, progress, totalQuestions, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (title, description, subject_id, difficulty, 0, 0, datetime.now().isoformat())
        )
        chapter_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return jsonify({
            'id': chapter_id,
            'title': title,
            'description': description,
            'subjectId': subject_id,
            'difficulty': difficulty,
            'progress': 0,
            'totalQuestions': 0,
            'createdAt': datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error creating chapter: {e}")
        return jsonify({'error': 'Failed to create chapter'}), 500

@app.route('/api/chapters/<int:chapter_id>', methods=['DELETE'])
def delete_chapter(chapter_id):
    """Delete a chapter and all its questions from databases"""
    try:
        # Delete all questions for this chapter first
        conn = sqlite3.connect(QUESTIONS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM questions WHERE chapterId = ?', (chapter_id,))
        conn.commit()
        conn.close()

        # Delete the chapter
        conn = sqlite3.connect(CHAPTERS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM chapters WHERE id = ?', (chapter_id,))
        conn.commit()
        conn.close()

        return jsonify({'success': True})
    except Exception as e:
        print(f"Error deleting chapter: {e}")
        return jsonify({'error': 'Failed to delete chapter'}), 500

# Questions API Routes
@app.route('/api/questions/chapter/<int:chapter_id>', methods=['GET'])
def get_questions_by_chapter(chapter_id):
    """Get all questions for a specific chapter"""
    try:
        conn = sqlite3.connect(QUESTIONS_DB_FILE)
        cursor = conn.cursor()
        cursor.execute('SELECT id, chapterId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty, timestamp FROM questions WHERE chapterId = ? ORDER BY timestamp ASC', (chapter_id,))
        rows = cursor.fetchall()
        conn.close()

        questions = []
        for row in rows:
            questions.append({
                'id': row[0],
                'chapterId': row[1],
                'question': row[2],
                'optionA': row[3],
                'optionB': row[4],
                'optionC': row[5],
                'optionD': row[6],
                'correctAnswer': row[7],
                'explanation': row[8],
                'difficulty': row[9],
                'createdAt': row[10]
            })

        return jsonify(questions)
    except Exception as e:
        print(f"Error getting questions: {e}")
        return jsonify({'error': 'Failed to get questions'}), 500

@app.route('/api/questions/bulk', methods=['POST'])
def create_bulk_questions():
    """Save multiple questions from CSV upload"""
    try:
        data = request.get_json()
        chapter_id = data.get('chapterId')
        questions = data.get('questions', [])

        if not chapter_id or not questions:
            return jsonify({'error': 'chapterId and questions are required'}), 400

        conn = sqlite3.connect(QUESTIONS_DB_FILE)
        cursor = conn.cursor()

        created_questions = []
        for q in questions:
            cursor.execute(
                'INSERT INTO questions (chapterId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                (
                    chapter_id,
                    q.get('question'),
                    q.get('optionA'),
                    q.get('optionB'), 
                    q.get('optionC'),
                    q.get('optionD'),
                    q.get('correctAnswer'),
                    q.get('explanation', 'No explanation provided'),
                    q.get('difficulty', 'medium'),
                    datetime.now().isoformat()
                )
            )
            question_id = cursor.lastrowid
            created_questions.append({
                'id': question_id,
                'chapterId': chapter_id,
                'question': q.get('question'),
                'optionA': q.get('optionA'),
                'optionB': q.get('optionB'),
                'optionC': q.get('optionC'),
                'optionD': q.get('optionD'),
                'correctAnswer': q.get('correctAnswer'),
                'explanation': q.get('explanation', 'No explanation provided'),
                'difficulty': q.get('difficulty', 'medium'),
                'createdAt': datetime.now().isoformat()
            })

        conn.commit()
        
        # Update chapter's total questions count
        total_questions = len(created_questions)
        conn_chapters = sqlite3.connect(CHAPTERS_DB_FILE)
        cursor_chapters = conn_chapters.cursor()
        cursor_chapters.execute('UPDATE chapters SET totalQuestions = (SELECT COUNT(*) FROM questions WHERE chapterId = ?) WHERE id = ?', (chapter_id, chapter_id))
        conn_chapters.commit()
        conn_chapters.close()
        
        conn.close()

        return jsonify({
            'success': True,
            'created_count': len(created_questions),
            'questions': created_questions
        })
    except Exception as e:
        print(f"Error creating bulk questions: {e}")
        return jsonify({'error': 'Failed to create questions'}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask Chat Server...")
    init_db()
    app.run(host='0.0.0.0', port=5001, debug=True)
