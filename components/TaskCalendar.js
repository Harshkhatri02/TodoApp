import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const MiniCalendar = ({ selectedDates = [], onDateClick, month = new Date() }) => {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentDates, setCurrentDates] = useState([]);

  useEffect(() => {
    setCurrentMonth(month);
  }, [month]);

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateArray = [];
    let day = startDate;

    while (day <= endDate) {
      dateArray.push(day);
      day = addDays(day, 1);
    }

    setCurrentDates(dateArray);
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const dateIsSelected = (day) => {
    return selectedDates.some(date => isSameDay(day, new Date(date)));
  };

  return (
    <div className="mini-calendar w-full bg-white rounded-lg shadow p-2">
      <div className="header flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="text-gray-500 hover:text-gray-800">
          &lt;
        </button>
        <span className="text-sm font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button onClick={nextMonth} className="text-gray-500 hover:text-gray-800">
          &gt;
        </button>
      </div>
      <div className="days grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="dates grid grid-cols-7 gap-1">
        {currentDates.map((day, i) => (
          <div
            key={i}
            className={`text-center p-1 text-xs rounded-full cursor-pointer
              ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : 'text-gray-700'}
              ${dateIsSelected(day) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
            `}
            onClick={() => onDateClick && onDateClick(day)}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;