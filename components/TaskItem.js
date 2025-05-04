import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import RecurrenceForm from './RecurrenceForm';

const TaskItem = ({ task }) => {
  const { toggleTaskCompletion, deleteTask, startEditingTask } = useTaskContext();
  const [expanded, setExpanded] = useState(false);

  const formatDueDate = (date) => {
    if (!date) return null;
    return format(new Date(date), 'MMM d, yyyy');
  };

  const getRecurrenceText = () => {
    if (!task.isRecurring) return null;
    
    let text = 'Repeats ';
    
    switch (task.frequency) {
      case 'DAILY':
        text += task.interval === 1 ? 'daily' : `every ${task.interval} days`;
        break;
      case 'WEEKLY':
        if (!task.weekDays || task.weekDays.length === 0) {
          text += task.interval === 1 ? 'weekly' : `every ${task.interval} weeks`;
        } else {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const selectedDays = Array.isArray(task.weekDays) 
            ? task.weekDays.sort().map(day => days[day - 1])
            : [];
          text += `${task.interval === 1 ? 'weekly' : `every ${task.interval} weeks`} on ${selectedDays.join(', ')}`;
        }
        break;
      case 'MONTHLY':
        text += `monthly on day ${task.monthDay}`;
        break;
      case 'YEARLY':
        text += task.interval === 1 ? 'yearly' : `every ${task.interval} years`;
        break;
      default:
        text += 'on a schedule';
    }
    
    return text;
  };

  return (
    <div className={`border rounded-lg shadow-sm mb-3 overflow-hidden ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => toggleTaskCompletion(task.id)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 flex-1">
            <div 
              className="flex justify-between items-start"
              onClick={() => setExpanded(!expanded)}
            >
              <div>
                <h3 className={`text-md font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                {task.dueDate && (
                  <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    Due: {formatDueDate(task.dueDate)}
                  </p>
                )}
                {task.isRecurring && (
                  <p className="text-sm text-blue-600 mt-1">
                    {getRecurrenceText()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditingTask(task);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this task?')) {
                      deleteTask(task.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {expanded && task.description && (
          <div className="mt-3 ml-8 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;