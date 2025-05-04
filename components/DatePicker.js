import React, { useState, useEffect } from 'react';
import { format, addDays, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addYears, isAfter, isBefore, isEqual } from 'date-fns';

const DatePicker = ({ selectedDate, onDateChange, minDate, maxDate, label, disabled = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDateClick = (day) => {
    onDateChange(day);
    setIsOpen(false);
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };
  
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center p-2 bg-gray-100">
        <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">
          &lt;
        </button>
        <span className="font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">
          &gt;
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 bg-gray-50">
        {days.map((day, i) => (
          <div key={i} className="text-center text-sm py-1 font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = (minDate && isBefore(cloneDay, minDate)) || 
                         (maxDate && isAfter(cloneDay, maxDate));
        
        days.push(
          <div
            key={day.toString()}
            className={`py-2 text-center cursor-pointer ${
              !isSameMonth(day, monthStart) ? 'text-gray-400' : 
              isSameDay(day, selectedDate) ? 'bg-blue-500 text-white rounded-full' : 
              'text-gray-800 hover:bg-gray-200'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isDisabled && handleDateClick(cloneDay)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={selectedDate ? format(selectedDate, 'MM/dd/yyyy') : ''}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          placeholder="Select a date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
};

export default DatePicker;