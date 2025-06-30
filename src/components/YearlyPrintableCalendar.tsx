
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
      <div className="professional-month">
        <div className="month-title">
          <h3>{hijriMonths[monthIndex]} {hijriYear} هـ</h3>
        </div>
        
        <div className="month-calendar">
          <div className="weekdays">
            {dayHeaders.map((day, index) => (
              <div key={`header-${monthIndex}-${index}`} className="weekday">
                {day}
              </div>
            ))}
          </div>
          
          <div className="days-grid">
            {days.map((day, index) => (
              <div key={`day-${monthIndex}-${index}`} className="day-cell">
                <div className="day-numbers">
                  <span className="hijri-number">{day.hijriDate.hijriDay}</span>
                  <span className="gregorian-number">{day.hijriDate.gregorianDate.getDate()}</span>
                </div>
                <div className="day-events">
                  {day.events.slice(0, 2).map((event, eventIndex) => (
                    <div 
                      key={`event-${monthIndex}-${index}-${eventIndex}`} 
                      className={`event-dot ${event.type === 'occasion' ? 'occasion' : 'task'}`}
                      title={event.title}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="professional-calendar">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-content">
          <h1>التقويم الهجري {hijriYear} هـ</h1>
          <div className="header-subtitle">
            <p>تقويم أم القرى الشريف</p>
            <div className="header-ornament"></div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-content">
        <div className="months-container">
          {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
        </div>
      </div>

      {/* Footer */}
      <div className="calendar-footer">
        <div className="footer-ornament"></div>
        <p>تم إنشاؤه بعناية - التقويم الهجري الإلكتروني {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default YearlyPrintableCalendar;
