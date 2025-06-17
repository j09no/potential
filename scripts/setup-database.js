
import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Found' : 'Missing');
    
    // Test connection first
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/0001_create_tables.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📁 Migration file loaded successfully');
    
    // Execute migration
    await pool.query(migrationSQL);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Created tables: subjects, chapters, subtopics, questions, files, folders, messages');
    console.log('📝 Inserted default NEET subjects and chapters');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
