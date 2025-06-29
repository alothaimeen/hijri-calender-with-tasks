
import React from 'react';
import { CalendarDay } from '@/types/calendar';
import { generateHijriCalendarMonth, convertTasksToCalendarEvents, getIslamicOccasions } from '@/utils/hijriCalendar';
import { Task } from '@/types/task';

interface YearlyPrintableCalendarProps {
  tasks: Task[];
  hijriYear: number;
}

const YearlyPrintableCalendar = ({ tasks, hijriYear }: YearlyPrintableCalendarProps) => {
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const dayHeaders = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const generateMonthData = (year: number, month: number) => {
    const days = generateHijriCalendarMonth(year, month);
    const calendarEvents = convertTasksToCalendarEvents(tasks);
    
    days.forEach(day => {
      day.events = calendarEvents.filter(event => 
        event.date.toDateString() === day.hijriDate.gregorianDate.toDateString()
      );
      
      const occasions = getIslamicOccasions(day.hijriDate.hijriMonth, day.hijriDate.hijriDay);
      occasions.forEach(occasion => {
        day.events.push({
          id: `occasion-${day.hijriDate.gregorianDate.toISOString()}`,
          title: occasion,
          type: 'occasion',
          date: day.hijriDate.gregorianDate
        });
      });
    });
    
    return days;
  };

  const renderMonth = (monthIndex: number) => {
    const days = generateMonthData(hijriYear, monthIndex);
    
    return (
      <div key={`month-${monthIndex}`} className="month-container">
        <div className="month-header">
          {hijriMonths[monthIndex]} {hijriYear} هـ
        </div>
        
        {dayHeaders.map((day, index) => (
          <div key={`header-${index}`} className="day-header">{day}</div>
        ))}
        
        {days.map((day, index) => (
          <div key={`day-${monthIndex}-${index}`} className="calendar-day">
            <div>
              {day.hijriDate.hijriDay}
            </div>
            <div>
              {day.hijriDate.gregorianDate.getDate()}
            </div>
            {day.events.slice(0, 2).map((event, eventIndex) => (
              <div 
                key={`event-${monthIndex}-${index}-${eventIndex}`} 
                style={{
                  background: event.type === 'occasion' ? '#ffffcc' : '#e6f3ff'
                }}
              >
                {event.title.substring(0, 15)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="yearly-print-calendar">
      <div className="print-page">
        <h1>التقويم الهجري {hijriYear} هـ</h1>
        <div className="month-grid">
          {renderMonth(0)}
          {renderMonth(1)}
          {renderMonth(2)}
          {renderMonth(3)}
        </div>
      </div>
      
      <div className="print-page">
        <div className="month-grid">
          {renderMonth(4)}
          {renderMonth(5)}
          {renderMonth(6)}
          {renderMonth(7)}
        </div>
      </div>
      
      <div className="print-page">
        <div className="month-grid">
          {renderMonth(8)}
          {renderMonth(9)}
          {renderMonth(10)}
          {renderMonth(11)}
        </div>
      </div>
    </div>
  );
};

export default YearlyPrintableCalendar;
