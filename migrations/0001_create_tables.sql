
-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create subtopics table
CREATE TABLE IF NOT EXISTS subtopics (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT,
  path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  sender TEXT NOT NULL
);

-- Insert default subjects for NEET
INSERT INTO subjects (name, color) VALUES 
  ('Physics', '#3B82F6'),
  ('Chemistry', '#10B981'),
  ('Biology', '#F59E0B')
ON CONFLICT (name) DO NOTHING;

-- Insert default chapters
INSERT INTO chapters (subject_id, title, description, difficulty) VALUES 
  (1, 'Mechanics', 'Laws of motion, forces, and kinematics', 'medium'),
  (1, 'Thermodynamics', 'Heat, work, and energy transfer', 'hard'),
  (1, 'Electromagnetism', 'Electric and magnetic fields', 'medium'),
  (2, 'Atomic Structure', 'Structure of atoms and molecules', 'medium'),
  (2, 'Chemical Bonding', 'Types of chemical bonds and interactions', 'medium'),
  (2, 'Organic Chemistry', 'Carbon compounds and reactions', 'hard'),
  (3, 'Cell Biology', 'Structure and function of cells', 'easy'),
  (3, 'Genetics', 'Heredity and genetic variation', 'medium'),
  (3, 'Ecology', 'Organisms and their environment', 'easy')
ON CONFLICT DO NOTHING;
