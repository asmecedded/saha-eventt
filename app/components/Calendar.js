"use client";

import { useState } from 'react';

export default function Calendar({ selectedDate, onSelectDate, datesIndisponibles = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  
  // getDay() returns 0 for Sunday. Let's adjust to make Monday the first day (optional, but common in Europe/Algeria)
  let firstDay = getFirstDayOfMonth(year, month);
  firstDay = firstDay === 0 ? 6 : firstDay - 1; // 0 (Mon) to 6 (Sun)

  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Helper pour formater la date en YYYY-MM-DD
  const formatDate = (d) => {
    const offset = d.getTimezoneOffset();
    const adjustedDate = new Date(d.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12 w-full"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateOfThisDay = new Date(year, month, day);
    const dateString = formatDate(dateOfThisDay);
    
    const isPast = dateOfThisDay < today;
    const isUnavailable = datesIndisponibles.includes(dateString);
    const isSelected = selectedDate === dateString;
    const isToday = dateString === formatDate(today);

    let buttonClass = "h-10 w-full flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 border ";

    if (isPast) {
      buttonClass += "text-slate-300 border-transparent cursor-not-allowed bg-slate-50";
    } else if (isUnavailable) {
      buttonClass += "text-red-500 bg-red-50 border-red-100 cursor-not-allowed relative overflow-hidden";
    } else if (isSelected) {
      buttonClass += "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 font-bold scale-105";
    } else {
      buttonClass += "text-slate-700 bg-white border-slate-100 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 cursor-pointer";
    }

    days.push(
      <button
        key={day}
        type="button"
        disabled={isPast || isUnavailable}
        onClick={() => onSelectDate(dateString)}
        className={buttonClass}
      >
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 rotate-45 pointer-events-none">
            <div className="w-full h-[2px] bg-red-600"></div>
          </div>
        )}
        <span className={isToday && !isSelected ? "text-blue-600 font-extrabold" : ""}>
          {day}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <button 
          type="button" 
          onClick={prevMonth}
          className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-slate-800 tracking-wide capitalize">
          {monthNames[month]} {year}
        </h3>
        <button 
          type="button" 
          onClick={nextMonth}
          className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
      
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 justify-center">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-white border border-slate-200"></span> Disponible</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-200 flex items-center justify-center"><div className="w-full h-px bg-red-300 rotate-45"></div></span> Réservé</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-500/30"></span> Sélectionné</div>
      </div>
    </div>
  );
}
