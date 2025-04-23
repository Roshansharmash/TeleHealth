
import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';

interface CalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const CustomCalendar = ({ selectedDate, setSelectedDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }
  
  // Add cells for all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    
    days.push(
      <button
        key={day}
        onClick={() => setSelectedDate(date)}
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
          isSelected
            ? 'bg-indigo-600 text-white'
            : isToday
            ? 'border border-indigo-500 text-indigo-400'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className="select-none">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-gray-400 hover:text-gray-200 p-1">
          &lt;
        </button>
        <h3 className="font-medium text-gray-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button onClick={nextMonth} className="text-gray-400 hover:text-gray-200 p-1">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(name => (
          <div key={name} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

export default CustomCalendar;

