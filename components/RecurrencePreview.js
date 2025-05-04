import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import { addDays, addWeeks, addMonths, addYears, startOfMonth, getDay, format, isSameDay } from 'date-fns';

const RecurrencePreview = ({ recurrenceData, previewMonths = 1 }) => {
  const [previewDates, setPreviewDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!recurrenceData || !recurrenceData.isRecurring) {
      setPreviewDates([]);
      return;
    }

    const { frequency, interval, weekDays, monthDay, startDate, endDate } = recurrenceData;
    const dates = [];
    const maxDates = 30; // Limit to prevent performance issues
    
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : addYears(new Date(), 1); // Default to 1 year ahead if no end date
    
    let currentDate = new Date(start);
    
    switch (frequency) {
      case 'DAILY':
        while (currentDate <= end && dates.length < maxDates) {
          dates.push(new Date(currentDate));
          currentDate = addDays(currentDate, interval || 1);
        }
        break;
        
      case 'WEEKLY':
        if (weekDays && weekDays.length > 0) {
          while (currentDate <= end && dates.length < maxDates) {
            const dayOfWeek = getDay(currentDate) === 0 ? 7 : getDay(currentDate); // Convert Sunday from 0 to 7
            
            if (weekDays.includes(dayOfWeek)) {
              dates.push(new Date(currentDate));
            }
            
            currentDate = addDays(currentDate, 1);
            
            // After we've processed a full week, jump ahead by (interval-1) weeks
            if (getDay(currentDate) === getDay(start) && interval > 1) {
              currentDate = addWeeks(currentDate, interval - 1);
            }
          }
        } else {
          while (currentDate <= end && dates.length < maxDates) {
            dates.push(new Date(currentDate));
            currentDate = addWeeks(currentDate, interval || 1);
          }
        }
        break;
        
      case 'MONTHLY':
        while (currentDate <= end && dates.length < maxDates) {
          // For monthly recurrence, set the day of the month
          if (monthDay) {
            const monthStart = startOfMonth(currentDate);
            const targetDate = new Date(monthStart);
            targetDate.setDate(monthDay);
            
            // Only add if the date is valid and within our range
            if (targetDate.getMonth() === monthStart.getMonth() && targetDate >= start && targetDate <= end) {
              dates.push(new Date(targetDate));
            }
          } else {
            dates.push(new Date(currentDate));
          }
          
          currentDate = addMonths(currentDate, interval || 1);
        }
        break;
        
      case 'YEARLY':
        while (currentDate <= end && dates.length < maxDates) {
          dates.push(new Date(currentDate));
          currentDate = addYears(currentDate, interval || 1);
        }
        break;
    }
    
    setPreviewDates(dates);
  }, [recurrenceData]);

  if (!recurrenceData || !recurrenceData.isRecurring || previewDates.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Next {previewDates.length > 10 ? 10 : previewDates.length} occurrences:</h3>
      
      <div className="mb-4">
        <ul className="space-y-1">
          {previewDates.slice(0, 10).map((date, index) => (
            <li key={index} className="text-sm text-gray-600">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </li>
          ))}
        </ul>
      </div>
      
      <h3 className="text-sm font-medium text-gray-700 mb-2">Calendar preview:</h3>
      <MiniCalendar 
        selectedDates={previewDates} 
        month={previewDates[0] || new Date()} 
      />
    </div>
  );
};

export default RecurrencePreview;