# LittleScribler - Interactive Learning Platform for Kids

## Overview

LittleScribler is an interactive educational React application designed for young children learning in daycare environments. The platform provides a fun, colorful interface for learning alphabets, numbers, shapes, colors, and animals through interactive cards, sounds, and engaging animations. The application emphasizes a kid-friendly design with rounded buttons, bright colors, and playful interactions to make learning enjoyable and accessible.

## User Preferences

- Preferred communication style: Simple, everyday language.
- Requested all buttons to be fully functional
- Added timer functionality to games (30 seconds per game)
- Added "Better luck next time" modals for incorrect answers
- Changed fonts to be more kid-friendly (Comic Neue, Fredoka, Bubblegum Sans)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with dedicated pages for each learning category
- **State Management**: React Context API for progress tracking and user preferences, with React Query for server state management
- **UI Framework**: Tailwind CSS with custom kid-friendly color palette and design system
- **Component Library**: Radix UI primitives with shadcn/ui components for accessibility and consistent design
- **Animation**: Framer Motion for smooth, engaging animations and transitions that appeal to children
- **Audio**: Web Audio API through custom hooks for educational sounds, letter pronunciation, and interactive feedback

### Design System
- **Typography**: Kid-friendly fonts including 'Fredoka' for headings and 'Comic Neue' for body text, with 'Bubblegum Sans' as additional kid-friendly option
- **Color Palette**: Bright, engaging colors (kidblue, kidorange, kidpink, kidpurple, kidgreen) designed for children
- **Components**: Custom learning cards with 3D effects, interactive modals, and progress tracking elements
- **Responsive Design**: Mobile-first approach optimized for tablets and touch devices commonly used by children

### Data Architecture
- **Schema Management**: Zod schemas for type-safe data validation and transformation
- **Progress Tracking**: Local storage-based persistence for user progress, stars earned, and completion tracking
- **Learning Content**: Structured data for alphabets (A-Z with phonetic examples), numbers (1-20 with visual representations), shapes, and animals with facts

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for API endpoints and server-side logic
- **Database Integration**: Drizzle ORM configured for PostgreSQL with migration support
- **Session Management**: Express sessions with PostgreSQL session store for user persistence
- **Storage Interface**: Abstracted storage layer supporting both in-memory development and production database implementations

### Build and Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Development Environment**: Hot module replacement with error overlay for improved developer experience
- **Type Checking**: Comprehensive TypeScript configuration with strict mode enabled
- **Code Quality**: ESLint and path aliases for clean, maintainable code structure

### Performance and User Experience
- **Local Storage**: Progress persistence without requiring user authentication
- **Audio Management**: Efficient Web Audio API implementation for educational sounds and feedback
- **Animation Performance**: Optimized Framer Motion animations with proper cleanup and performance considerations
- **Mobile Optimization**: Touch-friendly interface designed for young children using tablets and mobile devices

## External Dependencies

### UI and Design
- **Radix UI**: Comprehensive set of accessible React primitives for building the user interface
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for kid-friendly design
- **Framer Motion**: Animation library for creating engaging, smooth transitions and interactive effects
- **Lucide React**: Icon library providing consistent, scalable icons throughout the application

### Development and Build Tools
- **Vite**: Next-generation frontend build tool with fast development server and optimized production builds
- **TypeScript**: Static type checking for improved code quality and developer experience
- **React Query**: Server state management and caching for efficient data fetching and synchronization

### Backend Infrastructure
- **Express.js**: Web application framework for building the API server and handling HTTP requests
- **Drizzle ORM**: TypeScript-first ORM for database operations with type-safe query building
- **PostgreSQL**: Primary database for production data storage and persistence (@neondatabase/serverless for cloud deployment)
- **Zod**: Schema validation library for runtime type checking and data transformation

### Audio and Interaction
- **Web Audio API**: Browser-native audio capabilities for educational sounds, letter pronunciation, and interactive feedback
- **Background Music Toggle**: Functional background music system with loop capability
- **Sound Effects Management**: Global sound management with enable/disable functionality

### Game Features
- **Timed Games**: 30-second timer challenges across all learning sections
- **Interactive Math Game**: Addition problems with randomized answers and score tracking
- **Shape Matching Game**: Drag-and-drop color matching with visual feedback
- **Letter Recognition Game**: Find-the-letter challenges with scoring system
- **Animal Sound Game**: Audio-based animal identification with hint system
- **Better Luck Modals**: Encouraging feedback for incorrect answers
- **Progress Tracking**: Local storage-based achievement system with stars and completion tracking
- **React Hook Form**: Form handling library with validation support for any future user input requirements