# LittleScribler

LittleScribler is an interactive daycare learning platform for kids built with React, TypeScript, and Express.

## Features

- Interactive learning categories:
  - Alphabets: Learn A to Z with fun sounds
  - Numbers: Count from 1 to 20
  - Shapes: Discover colorful shapes
  - Animals: Meet animal friends with fun sounds
- Progress tracking
- Kid-friendly UI design
- Interactive learning cards

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Express
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS with custom kid-friendly design

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```
npm run dev
```

The application will be available at http://localhost:5000

### Production Mode

To build and run the application in production mode:

```
npm run build
npm run start
```

## Project Structure

- `client/`: Frontend React application
  - `src/`: Source code
    - `components/`: React components
    - `hooks/`: Custom React hooks
    - `lib/`: Utility functions and data
    - `pages/`: Page components
- `server/`: Backend Express server
- `shared/`: Shared types and schemas 