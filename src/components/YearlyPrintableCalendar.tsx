
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
      <div className="month-container">
        <div className="month-header">
          {hijriMonths[monthIndex]} {hijriYear} هـ
        </div>
        
        <div className="calendar-grid">
          {dayHeaders.map((day, index) => (
            <div key={`header-${monthIndex}-${index}`} className="day-header">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div key={`day-${monthIndex}-${index}`} className="calendar-day">
              <div className="hijri-day">
                {day.hijriDate.hijriDay}
              </div>
              <div className="gregorian-day">
                {day.hijriDate.gregorianDate.getDate()}
              </div>
              <div className="events-container">
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div 
                    key={`event-${monthIndex}-${index}-${eventIndex}`} 
                    className={`event-item ${
                      event.type === 'occasion' 
                        ? 'occasion-event' 
                        : 'task-event'
                    }`}
                  >
                    {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="more-events">
                    +{day.events.length - 2}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="yearly-print-calendar" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="main-title">
        <h1>التقويم الهجري {hijriYear} هـ</h1>
        <p>تقويم أم القرى الشريف</p>
      </div>
      
      {/* الصفحة الأولى - الأشهر 1-4 */}
      <div className="print-page page-1">
        <div className="months-grid">
          {renderMonth(0)}
          {renderMonth(1)}
          {renderMonth(2)}
          {renderMonth(3)}
        </div>
      </div>
      
      {/* الصفحة الثانية - الأشهر 5-8 */}
      <div className="print-page page-2">
        <div className="months-grid">
          {renderMonth(4)}
          {renderMonth(5)}
          {renderMonth(6)}
          {renderMonth(7)}
        </div>
      </div>
      
      {/* الصفحة الثالثة - الأشهر 9-12 */}
      <div className="print-page page-3">
        <div className="months-grid">
          {renderMonth(8)}
          {renderMonth(9)}
          {renderMonth(10)}
          {renderMonth(11)}
        </div>
      </div>
      
      {/* تذييل */}
      <div className="footer">
        <p>طُبع من التقويم الهجري الإلكتروني - {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default YearlyPrintableCalendar;
