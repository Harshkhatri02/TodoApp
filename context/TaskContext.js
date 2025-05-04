import React, { createContext, useState, useEffect, useContext } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

// Mock data for development when API is not available
const MOCK_TASKS = [
  {
    id: 1,
    title: 'Complete project setup',
    description: 'Finish setting up the project structure',
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    isRecurring: false
  },
  {
    id: 2,
    title: 'Learn Prisma',
    description: 'Study Prisma ORM for database interactions',
    completed: false,
    dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    isRecurring: true,
    frequency: 'WEEKLY',
    interval: 1,
    weekDays: [1, 3, 5], // Monday, Wednesday, Friday
  }
];

export const TaskProvider = ({ children }) => {
  // Initialize with mock data by default
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('Using demo data. Connect to backend for real data.');
  const [editingTask, setEditingTask] = useState(null);
  const [usesMockData, setUsesMockData] = useState(true);

  useEffect(() => {
    // Try to fetch real data, but don't worry if it fails
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      setLoading(true);
      
      // Use a timeout to prevent hanging if the server is unreachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/api/todos`, {
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);
      
      // If fetch failed or returned a non-OK response, just keep using mock data
      if (!response || !response.ok) {
        return;
      }

      const data = await response.json();
      setTasks(data);
      setError(null);
      setUsesMockData(false);
    } catch (err) {
      // Just silently fail and continue using mock data
      console.log('Using mock data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (usesMockData) {
      // Just refresh the mock data we already have
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 300);
      return;
    }
    
    try {
      setLoading(true);
      
      // Use a timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/api/todos`, {
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);
      
      if (!response || !response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      // Fall back to mock data
      setTasks(MOCK_TASKS);
      setUsesMockData(true);
      setError('Using demo data. Backend server is not connected.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      
      if (usesMockData) {
        // Create mock task when in demo mode
        const newTask = {
          id: Math.max(0, ...tasks.map(t => t.id)) + 1,
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setTasks([newTask, ...tasks]);
        return newTask;
      }
      
      // Try to add to the real API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      
      // If we were using the API but it failed, switch to mock mode
      if (!usesMockData) {
        setUsesMockData(true);
        setError('Connection to server lost. Using demo data.');
        
        // Add the task to mock data
        const newTask = {
          id: Math.max(0, ...tasks.map(t => t.id)) + 1,
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setTasks([newTask, ...tasks]);
        return newTask;
      }
      
      setError('Failed to add task. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setLoading(true);
      console.log('Updating task ID:', id, 'Type:', typeof id);
      
      // Convert id to integer if it's a string
      const taskId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      if (usesMockData) {
        // Update mock task when in demo mode
        const updatedTask = {
          ...tasks.find(t => t.id === taskId),
          ...taskData,
          updatedAt: new Date().toISOString()
        };
        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        return updatedTask;
      }
      
      // Try to update in the real API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      console.log('Sending update to API for taskId:', taskId);
      const response = await fetch(`${API_URL}/api/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      
      // If we were using the API but it failed, switch to mock mode
      if (!usesMockData) {
        setUsesMockData(true);
        setError('Connection to server lost. Using demo data.');
        
        // Update the task in mock data
        const taskId = typeof id === 'string' ? parseInt(id, 10) : id;
        const updatedTask = {
          ...tasks.find(t => t.id === taskId),
          ...taskData,
          updatedAt: new Date().toISOString()
        };
        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        return updatedTask;
      }
      
      setError('Failed to update task. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      
      if (usesMockData) {
        // Delete mock task when in demo mode
        setTasks(tasks.filter(task => task.id !== id));
        return true;
      }
      
      // Try to delete in the real API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      
      // If we were using the API but it failed, switch to mock mode
      if (!usesMockData) {
        setUsesMockData(true);
        setError('Connection to server lost. Using demo data.');
        
        // Delete the task from mock data
        setTasks(tasks.filter(task => task.id !== id));
        return true;
      }
      
      setError('Failed to delete task. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      setLoading(true);
      
      if (usesMockData) {
        // Toggle mock task completion when in demo mode
        const task = tasks.find(t => t.id === id);
        const updatedTask = {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString()
        };
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        return updatedTask;
      }
      
      // Try to toggle in the real API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/api/todos/${id}/toggle`, {
        method: 'PATCH',
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        throw new Error('Failed to toggle task completion');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      console.error('Error toggling task completion:', err);
      
      // If we were using the API but it failed, switch to mock mode
      if (!usesMockData) {
        setUsesMockData(true);
        setError('Connection to server lost. Using demo data.');
        
        // Toggle the task in mock data
        const task = tasks.find(t => t.id === id);
        const updatedTask = {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString()
        };
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        return updatedTask;
      }
      
      setError('Failed to update task. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = (id) => {
    return tasks.find(task => task.id === parseInt(id));
  };

  const startEditingTask = (task) => {
    setEditingTask(task);
  };

  const stopEditingTask = () => {
    setEditingTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        usesMockData,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTaskById,
        editingTask,
        startEditingTask,
        stopEditingTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;