import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from './DatePicker';

const RecurrenceForm = ({ initialData, onChange }) => {
  // Stable references for form state to prevent flickering
  const [formState, setFormState] = useState({
    isRecurring: initialData?.isRecurring || false,
    frequency: initialData?.frequency || 'DAILY',
    interval: initialData?.interval || 1,
    weekDays: initialData?.weekDays || [],
    monthDay: initialData?.monthDay || 1,
    startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    hasEndDate: initialData?.hasEndDate || !!initialData?.endDate
  });

  // Destructure for convenience
  const { 
    isRecurring, frequency, interval, weekDays, 
    monthDay, startDate, endDate, hasEndDate 
  } = formState;

  // Update state in a single operation to prevent flickering
  const updateFormState = useCallback((updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  // Use useCallback for handlers to prevent recreation on each render
  const handleWeekDayToggle = useCallback((day) => {
    setFormState(prev => {
      const newWeekDays = [...prev.weekDays];
      const index = newWeekDays.indexOf(day);
      if (index !== -1) {
        newWeekDays.splice(index, 1);
      } else {
        newWeekDays.push(day);
      }
      return { ...prev, weekDays: newWeekDays };
    });
  }, []);

  // Only update state from props when initialData reference changes
  useEffect(() => {
    if (!initialData) return;
    
    setFormState({
      isRecurring: initialData.isRecurring || false,
      frequency: initialData.frequency || 'DAILY',
      interval: initialData.interval || 1,
      weekDays: initialData.weekDays || [],
      monthDay: initialData.monthDay || 1,
      startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData.endDate ? new Date(initialData.endDate) : null,
      hasEndDate: initialData.hasEndDate || !!initialData.endDate
    });
  }, [initialData]);

  // Memoize the data to send to parent to avoid unnecessary onChange calls
  const recurrenceData = useMemo(() => {
    if (!isRecurring) {
      return {
        isRecurring: false,
        frequency: null,
        interval: null,
        weekDays: [],
        monthDay: null,
        startDate: null,
        endDate: null,
        hasEndDate: false
      };
    }
    
    return {
      isRecurring,
      frequency,
      interval,
      weekDays,
      monthDay: frequency === 'MONTHLY' ? monthDay : null,
      startDate,
      endDate: hasEndDate ? endDate : null,
      hasEndDate
    };
  }, [isRecurring, frequency, interval, weekDays, monthDay, startDate, endDate, hasEndDate]);

  // Call onChange only when recurrenceData changes, with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(recurrenceData);
    }, 50); // Small debounce to prevent flickering
    
    return () => clearTimeout(handler);
  }, [recurrenceData, onChange]);

  // Memoize the preview text to avoid recalculations on every render
  const previewText = useMemo(() => {
    if (!isRecurring) return '';
    
    let text = `Repeats `;
    
    switch (frequency) {
      case 'DAILY':
        text += interval === 1 ? 'every day' : `every ${interval} days`;
        break;
      case 'WEEKLY':
        if (weekDays.length === 0) {
          text += interval === 1 ? 'weekly' : `every ${interval} weeks`;
        } else {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const selectedDays = [...weekDays].sort().map(day => days[day - 1]);
          text += `every ${interval === 1 ? '' : `${interval} `}week${interval === 1 ? '' : 's'} on ${selectedDays.join(', ')}`;
        }
        break;
      case 'MONTHLY':
        text += `on day ${monthDay} of ${interval === 1 ? 'every month' : `every ${interval} months`}`;
        break;
      case 'YEARLY':
        text += interval === 1 ? 'annually' : `every ${interval} years`;
        break;
      default:
        text += 'on a schedule';
    }
    
    if (startDate) {
      text += ` starting ${startDate.toLocaleDateString()}`;
    }
    
    if (hasEndDate && endDate) {
      text += ` until ${endDate.toLocaleDateString()}`;
    }
    
    return text;
  }, [isRecurring, frequency, interval, weekDays, monthDay, startDate, endDate, hasEndDate]);

  // Handle checkbox toggle with stabilized behavior
  const handleRecurringToggle = useCallback((e) => {
    const newValue = e.target.checked;
    updateFormState({ isRecurring: newValue });
  }, [updateFormState]);

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={handleRecurringToggle}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
          Make this task recurring
        </label>
      </div>
      
      {isRecurring && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => updateFormState({ frequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repeat every
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => updateFormState({ interval: parseInt(e.target.value) || 1 })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-700">
                {frequency === 'DAILY' && (interval === 1 ? 'day' : 'days')}
                {frequency === 'WEEKLY' && (interval === 1 ? 'week' : 'weeks')}
                {frequency === 'MONTHLY' && (interval === 1 ? 'month' : 'months')}
                {frequency === 'YEARLY' && (interval === 1 ? 'year' : 'years')}
              </span>
            </div>
          </div>
          
          {frequency === 'WEEKLY' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat on
              </label>
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleWeekDayToggle(index + 1)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      weekDays.includes(index + 1)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {frequency === 'MONTHLY' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={monthDay}
                onChange={(e) => updateFormState({ monthDay: parseInt(e.target.value) || 1 })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <div>
            <DatePicker
              selectedDate={startDate}
              onDateChange={(date) => updateFormState({ startDate: date })}
              label="Start date"
            />
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="hasEndDate"
              checked={hasEndDate}
              onChange={(e) => updateFormState({ hasEndDate: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasEndDate" className="ml-2 block text-sm text-gray-700">
              End date
            </label>
          </div>
          
          {hasEndDate && (
            <div>
              <DatePicker
                selectedDate={endDate || new Date()}
                onDateChange={(date) => updateFormState({ endDate: date })}
                minDate={startDate}
                disabled={!hasEndDate}
              />
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="text-sm font-medium text-blue-700">Preview</h4>
            <p className="text-sm text-blue-800 mt-1">{previewText}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(RecurrenceForm);