# NEET Prep Pro

## Overview

NEET Prep Pro is a comprehensive study application designed for NEET exam preparation. The application is built with a modern full-stack architecture using React for the frontend, Express.js for the backend, and multiple data storage solutions. It features quiz functionality, study management, file storage, and analytics tracking, all optimized for medical entrance exam preparation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom iOS-inspired design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Storage**: IndexedDB for local data persistence

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Development**: Hot-reload enabled development server on port 5000
- **Production**: Optimized build with ESBuild bundling
- **Database**: PostgreSQL 16 (configured but application primarily uses client-side storage)
- **ORM**: Drizzle ORM configured for PostgreSQL integration

### Database Architecture
- **Primary Storage**: IndexedDB for offline-first functionality
- **Backup Storage**: SQL.js for local database operations
- **Optional**: PostgreSQL for server-side data persistence (configured but not actively used)
- **Data Persistence**: Local storage backup for critical application state

## Key Components

### Study Management System
- **Subjects**: Physics, Chemistry, Biology with color-coded organization
- **Chapters**: Hierarchical content organization with progress tracking
- **Questions**: Multiple-choice questions with NEET scoring system (+4 correct, -1 incorrect, 0 unanswered)
- **CSV Import**: Bulk question import functionality for content management

### Quiz Engine
- **Quiz Types**: Chapter-based, subtopic-based, and wrong-answers-only modes
- **Timer System**: Configurable quiz timers with pause/resume functionality
- **Scoring**: NEET-compliant scoring system with detailed analytics
- **Results**: Comprehensive quiz statistics and performance tracking

### File Management
- **Storage**: Local file storage with folder organization
- **Upload**: Support for PDF, images, and documents
- **Database Operations**: Import/export functionality for application data

### Analytics Dashboard
- **Performance Metrics**: Accuracy tracking, question counts, study streaks
- **Progress Visualization**: Charts and graphs for performance analysis
- **Historical Data**: Quiz session history and improvement tracking

### Communication Features
- **Chat System**: Local message storage with emoji support
- **Calendar**: Task scheduling and study planning

## Data Flow

### Application Initialization
1. IndexedDB initialization with default NEET subjects
2. Component mounting with TanStack Query state management
3. Local data loading and synchronization

### Quiz Flow
1. Question selection based on chapter/subtopic filters
2. Timer initialization and session tracking
3. Answer collection and NEET scoring calculation
4. Results storage and analytics update

### Data Persistence
1. Real-time IndexedDB updates during user interactions
2. Local storage backup for critical application state
3. SQL.js database for advanced local operations
4. Optional PostgreSQL synchronization (configured but unused)

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TanStack Query
- **UI Components**: Radix UI primitives, shadcn/ui component library
- **Styling**: Tailwind CSS, clsx for conditional classes
- **Development**: Vite, TypeScript, ESBuild

### Database and Storage
- **IndexedDB**: Native browser storage for offline functionality
- **SQL.js**: WebAssembly SQLite for advanced local database operations
- **Drizzle ORM**: Type-safe database operations (configured for PostgreSQL)

### Utility Libraries
- **Form Handling**: React Hook Form with Zod validation
- **Date Operations**: date-fns for date manipulation
- **File Operations**: Native File API for document management
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload on port 5000
- **Database**: Local IndexedDB with optional PostgreSQL connection
- **Environment**: Replit-optimized with cartographer plugin for debugging

### Production Deployment
- **Build Process**: Vite production build with asset optimization
- **Server**: Express.js serving static files and handling API routes
- **Database**: Client-side storage with optional server synchronization
- **Hosting**: Configured for Replit autoscale deployment

### Alternative Deployment Options
- **Netlify**: Configured with netlify.toml for static hosting
- **Custom Hosting**: Docker-ready with PostgreSQL support

## Changelog

Changelog:
- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.