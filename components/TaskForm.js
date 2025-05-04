import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from './DatePicker';
import RecurrenceForm from './RecurrenceForm';
import { useTaskContext } from '../context/TaskContext';

const TaskForm = ({ onClose }) => {
  const { addTask, updateTask, editingTask, stopEditingTask } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [recurrenceData, setRecurrenceData] = useState({
    isRecurring: false,
    frequency: null,
    interval: null,
    weekDays: [],
    monthDay: null,
    startDate: null,
    endDate: null,
    hasEndDate: false
  });
  
  // Use memoized value to remember last editingTask to avoid unnecessary re-initialization
  const previousEditingTaskId = React.useRef(null);
  
  useEffect(() => {
    // Skip re-initialization if same task
    if (!editingTask || (previousEditingTaskId.current === editingTask.id)) {
      return;
    }
    
    previousEditingTaskId.current = editingTask.id;
    
    setTitle(editingTask.title || '');
    setDescription(editingTask.description || '');
    setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : null);
    setCompleted(editingTask.completed || false);
    
    // Handle different possible formats of weekDays
    let weekDaysArray = [];
    if (editingTask.weekDays) {
      if (Array.isArray(editingTask.weekDays)) {
        weekDaysArray = editingTask.weekDays;
      } else if (typeof editingTask.weekDays === 'string') {
        try {
          // Try parsing if it's a JSON string
          weekDaysArray = JSON.parse(editingTask.weekDays);
        } catch (e) {
          weekDaysArray = [];
        }
      }
    }
    
    // Determine if there's an end date set
    const hasEndDate = !!editingTask.endDate;
    const endDate = editingTask.endDate ? new Date(editingTask.endDate) : null;
    
    setRecurrenceData({
      isRecurring: editingTask.isRecurring || false,
      frequency: editingTask.frequency || 'DAILY',
      interval: editingTask.interval || 1,
      weekDays: weekDaysArray,
      monthDay: editingTask.monthDay || 1,
      startDate: editingTask.startDate ? new Date(editingTask.startDate) : null,
      endDate,
      hasEndDate
    });
  }, [editingTask]);

  // Memoize this callback to prevent unnecessary re-renders
  const handleRecurrenceChange = useCallback((data) => {
    setRecurrenceData(data);
  }, []);

  // Memoize the submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      dueDate,
      completed,
      ...recurrenceData
    };
    
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      stopEditingTask();
    } else {
      await addTask(taskData);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(null);
    setCompleted(false);
    setRecurrenceData({
      isRecurring: false,
      frequency: null,
      interval: null,
      weekDays: [],
      monthDay: null,
      startDate: null,
      endDate: null,
      hasEndDate: false
    });
    
    if (onClose) {
      onClose();
    }
  }, [title, description, dueDate, completed, recurrenceData, editingTask, updateTask, stopEditingTask, addTask, onClose]);

  // Memoize the cancel handler
  const handleCancel = useCallback(() => {
    if (editingTask) {
      stopEditingTask();
    }
    
    if (onClose) {
      onClose();
    }
  }, [editingTask, stopEditingTask, onClose]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Task title"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Task description"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DatePicker
            selectedDate={dueDate}
            onDateChange={setDueDate}
            label="Due Date"
          />
        </div>
        
        {editingTask && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
              Mark as completed
            </label>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Recurrence</h3>
        <RecurrenceForm 
          initialData={recurrenceData} 
          onChange={handleRecurrenceChange} 
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-5 mt-6 border-t">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default React.memo(TaskForm);