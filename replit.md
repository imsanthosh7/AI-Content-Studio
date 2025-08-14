# GrammarFix - AI Grammar Correction Application

## Overview

A clean, modern web application for AI-powered grammar correction using Google's Gemini Flash model. The app features a simple two-panel interface where users input text with errors on the left and receive corrected text on the right. Built with React, TypeScript, and Express.js, focusing on simplicity and user experience with modern UI/UX design principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Design**: Modern, clean two-panel layout with gradient backgrounds and glass-morphism effects
- **Styling**: Tailwind CSS with custom gradients, shadows, and responsive design
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Features**: Copy to clipboard, text clearing, character counting, loading states
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging middleware
- **Real-time Processing**: Asynchronous grammar checking with batch processing capabilities
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema versioning
- **Connection**: Neon serverless PostgreSQL for cloud deployment
- **In-Memory Fallback**: Memory storage implementation for development and testing

### Authentication and Authorization
- **Session-based Authentication**: Server-side sessions stored in PostgreSQL
- **User Management**: Username/password authentication with secure password handling
- **Preference Management**: Per-user settings for grammar sensitivity, auto-correction, and language preferences

### AI Integration Architecture
- **AI Provider**: Google Gemini Flash model for natural language processing
- **Processing Pipeline**: Structured grammar analysis with confidence scoring and detailed suggestions
- **Error Classification**: Categorized suggestions (grammar, style, spelling) with severity levels
- **Batch Processing**: Optimized handling of multiple text inputs for improved performance

### Data Models
- **Users**: Basic user accounts with authentication credentials
- **Corrections**: Historical record of grammar checks with original text, corrections, and metadata
- **User Preferences**: Configurable settings for grammar sensitivity, real-time checking, and language options
- **Grammar Suggestions**: Structured feedback with position tracking, confidence scores, and explanations

### Development Architecture
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reloading**: Vite development server with HMR for rapid development
- **Code Organization**: Clean separation between client, server, and shared code
- **Path Aliases**: Configured import paths for better code organization

## External Dependencies

### Core Dependencies
- **@google/genai**: Google Generative AI SDK for Gemini Flash model integration
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **express**: Web application framework for Node.js
- **react**: Frontend UI library with hooks and modern patterns

### AI and Language Processing
- **Gemini Flash API**: Advanced grammar correction and natural language understanding
- **Structured Response Processing**: JSON-based AI responses with detailed grammar analysis

### Database and Storage
- **PostgreSQL**: Primary database for user data, corrections, and preferences
- **Drizzle Kit**: Database migrations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **shadcn/ui**: Pre-built component library with consistent design patterns
- **Lucide React**: Icon library for consistent visual elements

### Development Tools
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast build tool and development server
- **TanStack Query**: Server state management with caching and synchronization
- **Zod**: Runtime type validation and schema definition
- **Wouter**: Lightweight routing solution for React

### Mobile Integration Preparation
The application is designed to serve as the backend for an Android keyboard application, with API endpoints structured for mobile consumption and real-time grammar checking capabilities that can be integrated into keyboard input methods.