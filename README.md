# NEET Prep Pro - Netlify Deployment

## Overview
NEET Prep Pro is a comprehensive study application for NEET exam preparation, now optimized for Netlify deployment with serverless functions.

## Deployment Instructions

### 1. Database Setup
The app uses Neon PostgreSQL database. Run the migration script to set up tables:

```sql
-- Execute the SQL in migrations/0001_create_tables.sql in your Neon database console
```

### 2. Environment Variables
Set these environment variables in your Netlify dashboard:

```
DATABASE_URL=postgresql://neondb_owner:npg_7HfabeDdGUX8@ep-quiet-sunset-a54qddli.us-east-2.aws.neon.tech/neondb?sslmode=require
PGDATABASE=neondb
PGPORT=5432
PGHOST=ep-quiet-sunset-a54qddli.us-east-2.aws.neon.tech
PGPASSWORD=npg_7HfabeDdGUX8
PGUSER=neondb_owner
```

### 3. Deploy to Netlify

#### Option A: GitHub Integration
1. Push this code to a GitHub repository
2. Connect the repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist/public`
5. Add environment variables in Netlify dashboard
6. Deploy

#### Option B: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist/public
```

### 4. API Endpoints
All API endpoints are available at `https://your-site.netlify.app/api/`

- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `GET /api/chapters` - Get all chapters
- `POST /api/chapters` - Create chapter
- `GET /api/questions/chapter/:id` - Get questions by chapter
- `POST /api/questions/bulk` - Bulk create questions
- And more...

### 5. Features
- ✅ Quiz system with NEET scoring
- ✅ Chapter and subject management
- ✅ CSV question import
- ✅ File storage system
- ✅ Chat functionality
- ✅ Calendar and scheduling
- ✅ Analytics dashboard
- ✅ Offline-first with IndexedDB
- ✅ PostgreSQL backend via Netlify Functions

### 6. Architecture
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Netlify Functions (serverless)
- **Database**: Neon PostgreSQL
- **Deployment**: Netlify with automatic builds

### 7. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5000`

### 8. Troubleshooting
- Ensure all environment variables are set correctly
- Check Netlify function logs for API errors
- Verify database connection in Neon dashboard
- Make sure migration script has been executed

### 9. Database Schema
The app uses these main tables:
- `subjects` - Physics, Chemistry, Biology
- `chapters` - Study chapters within subjects
- `questions` - MCQ questions with NEET scoring
- `files` - File storage metadata
- `folders` - Folder organization
- `messages` - Chat messages

All tables are automatically created by the migration script.