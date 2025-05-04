import { useState, useEffect } from 'react';
import Head from 'next/head';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskProvider, { useTaskContext } from '../context/TaskContext';

// Wrapper component to handle editing task
const TodoApp = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { editingTask } = useTaskContext();
  
  // Open form modal when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setIsFormOpen(true);
    }
  }, [editingTask]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Todo App</title>
        <meta name="description" content="A simple todo app with recurring tasks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <TaskList />
        </div>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-grow">
              <TaskForm onClose={() => setIsFormOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component wrapped with TaskProvider
export default function Home() {
  return (
    <TaskProvider>
      <TodoApp />
    </TaskProvider>
  );
}