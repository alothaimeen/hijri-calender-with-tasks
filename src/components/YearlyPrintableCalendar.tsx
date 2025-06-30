
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
      <div className="calendar-month">
        <div className="month-header">
          <h3>{hijriMonths[monthIndex]} {hijriYear} هـ</h3>
        </div>
        
        <div className="month-grid">
          <div className="weekdays-row">
            {dayHeaders.map((day, index) => (
              <div key={`header-${monthIndex}-${index}`} className="weekday-cell">
                {day}
              </div>
            ))}
          </div>
          
          <div className="days-container">
            {days.map((day, index) => (
              <div key={`day-${monthIndex}-${index}`} className="day-box">
                <div className="day-header">
                  <span className="hijri-date">{day.hijriDate.hijriDay}</span>
                  <span className="gregorian-date">{day.hijriDate.gregorianDate.getDate()}</span>
                </div>
                
                <div className="day-content">
                  {/* عرض المهام والمناسبات الموجودة */}
                  {day.events.slice(0, 2).map((event, eventIndex) => (
                    <div 
                      key={`event-${monthIndex}-${index}-${eventIndex}`} 
                      className={`task-item ${event.type}`}
                    >
                      <span className="task-bullet">•</span>
                      <span className="task-text">{event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}</span>
                    </div>
                  ))}
                  
                  {/* خطوط فارغة لكتابة المهام */}
                  {Array.from({ length: Math.max(1, 3 - day.events.length) }, (_, i) => (
                    <div key={`empty-${i}`} className="empty-task-line"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // تقسيم الأشهر إلى مجموعات من 4
  const monthGroups = [];
  for (let i = 0; i < 12; i += 4) {
    monthGroups.push(Array.from({ length: 4 }, (_, j) => i + j));
  }

  return (
    <div className="yearly-calendar">
      {monthGroups.map((group, groupIndex) => (
        <div key={`page-${groupIndex}`} className="calendar-page">
          {/* العنوان في أول صفحة فقط */}
          {groupIndex === 0 && (
            <div className="page-header">
              <h1>التقويم الهجري {hijriYear} هـ</h1>
              <p className="subtitle">تقويم أم القرى الشريف</p>
              <div className="header-divider"></div>
            </div>
          )}
          
          <div className="months-grid">
            {group.map((monthIndex) => renderMonth(monthIndex))}
          </div>
          
          {/* تذييل في آخر صفحة فقط */}
          {groupIndex === monthGroups.length - 1 && (
            <div className="page-footer">
              <div className="footer-divider"></div>
              <p>تم إنشاؤه بعناية - التقويم الهجري الإلكتروني {new Date().getFullYear()}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default YearlyPrintableCalendar;
