# Todo App with Recurring Tasks

A simple todo application built with Next.js, Express, and PostgreSQL that supports recurring tasks.

## Features

- Create, read, update, and delete tasks
- Add recurring tasks with various frequencies:
  - Daily
  - Weekly
  - Monthly
  - Yearly
- Set custom recurrence patterns
- Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd todo-app
```

2. Install dependencies:
```bash
# Install frontend dependencies
#This will properly install the current packages used in the project 
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up the database:
- Create a PostgreSQL database
- Copy `.env.example` to `.env` and update the `DATABASE_URL` with your database connection string
- Run Prisma migrations:
```bash
cd server
npx prisma migrate dev
```

4. Start the development servers:
```bash
# Start the backend server (from the server directory)
npm run serve:api

# Start the frontend development server (from the root directory)
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

6. The App is ready to use with the database !

## Tech Stack

- Frontend:
  - Next.js
  - React Context API
  - Tailwind CSS
- Backend:
  - Express.js
  - Prisma ORM
- Database:
  - PostgreSQL 
