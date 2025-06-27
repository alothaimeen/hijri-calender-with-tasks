
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

  const dayHeaders = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

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
          <h3>{hijriMonths[monthIndex]} {hijriYear} هـ</h3>
        </div>
        
        <div className="calendar-grid">
          {/* Day headers */}
          {dayHeaders.map((day, index) => (
            <div key={`header-${monthIndex}-${index}`} className="day-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={`day-${monthIndex}-${index}`}
              className={`day-cell ${!day.isCurrentMonth ? 'other-month' : ''} ${
                day.isToday ? 'today' : ''
              }`}
            >
              <div className="day-number">
                <span className="hijri-day">{day.hijriDate.hijriDay}</span>
                <span className="gregorian-day">{day.hijriDate.gregorianDate.getDate()}</span>
              </div>
              
              <div className="events-container">
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={`event-${monthIndex}-${index}-${eventIndex}`}
                    className={`event-item ${
                      event.type === 'occasion' ? 'occasion' : 
                      event.completed ? 'task-completed' : 'task'
                    }`}
                  >
                    {event.title.length > 12 
                      ? event.title.substring(0, 12) + '...' 
                      : event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="more-events">+{day.events.length - 2}</div>
                )}
              </div>
              
              <div className="manual-space"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPage = (startMonth: number, pageNumber: number) => (
    <div key={`page-${pageNumber}`} className="print-page">
      <div className="page-header">
        <h1>التقويم الهجري {hijriYear} هـ</h1>
        <h2>
          {hijriMonths[startMonth]} - {hijriMonths[Math.min(startMonth + 3, 11)]} {hijriYear} هـ
        </h2>
      </div>
      
      <div className="months-grid">
        {[0, 1, 2, 3].map(offset => {
          const monthIndex = startMonth + offset;
          if (monthIndex > 11) return null;
          return renderMonth(monthIndex);
        })}
      </div>
      
      <div className="page-footer">
        <p>الخط في أسفل كل يوم مخصص للمهام اليدوية</p>
        <p>صفحة {pageNumber} من 3</p>
      </div>
    </div>
  );

  return (
    <div className="yearly-print-calendar">
      <style>
        {`
        @page {
          size: A4 landscape;
          margin: 1cm;
        }
        
        .yearly-print-calendar {
          font-family: 'Arial', sans-serif;
          color: #000;
          background: white;
          direction: rtl;
          width: 100%;
          height: 100vh;
        }
        
        .print-page {
          page-break-after: always;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0.5cm;
        }
        
        .print-page:last-child {
          page-break-after: avoid;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 1cm;
          border-bottom: 3px solid #2D5A27;
          padding-bottom: 0.5cm;
        }
        
        .page-header h1 {
          font-size: 24px;
          font-weight: bold;
          color: #2D5A27;
          margin: 0 0 0.3cm 0;
        }
        
        .page-header h2 {
          font-size: 16px;
          color: #555;
          margin: 0;
        }
        
        .months-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8cm;
          flex: 1;
        }
        
        .month-container {
          border: 2px solid #2D5A27;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }
        
        .month-header {
          background: linear-gradient(135deg, #2D5A27, #3A6B32);
          color: white;
          text-align: center;
          padding: 0.3cm;
        }
        
        .month-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        
        .day-header {
          background: #F0F8F0;
          border: 1px solid #DDD;
          text-align: center;
          padding: 0.2cm;
          font-weight: bold;
          font-size: 10px;
          color: #2D5A27;
        }
        
        .day-cell {
          border: 1px solid #DDD;
          min-height: 2.2cm;
          padding: 0.1cm;
          position: relative;
          background: white;
        }
        
        .day-cell.other-month {
          background: #F8F8F8;
          opacity: 0.6;
        }
        
        .day-cell.today {
          background: #FFF9C4;
          border: 2px solid #F57C00;
        }
        
        .day-number {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.1cm;
        }
        
        .hijri-day {
          font-weight: bold;
          font-size: 11px;
          color: #2D5A27;
        }
        
        .gregorian-day {
          font-size: 8px;
          color: #666;
        }
        
        .events-container {
          flex: 1;
        }
        
        .event-item {
          font-size: 7px;
          margin: 0.05cm 0;
          padding: 0.05cm;
          border-radius: 2px;
          line-height: 1.2;
        }
        
        .event-item.occasion {
          background: #FFF3CD;
          border-left: 2px solid #F57C00;
          font-weight: bold;
        }
        
        .event-item.task {
          background: #E3F2FD;
          border-left: 2px solid #1976D2;
        }
        
        .event-item.task-completed {
          background: #E8F5E8;
          border-left: 2px solid #388E3C;
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .more-events {
          font-size: 6px;
          color: #666;
          text-align: center;
        }
        
        .manual-space {
          position: absolute;
          bottom: 0.1cm;
          left: 0.1cm;
          right: 0.1cm;
          height: 0.3cm;
          border-bottom: 1px solid #CCC;
        }
        
        .page-footer {
          text-align: center;
          margin-top: 0.5cm;
          padding-top: 0.3cm;
          border-top: 1px solid #DDD;
          font-size: 10px;
          color: #666;
        }
        
        .page-footer p {
          margin: 0.1cm 0;
        }
        `}
      </style>
      
      {/* الصفحة الأولى: محرم - ربيع الثاني */}
      {renderPage(0, 1)}
      
      {/* الصفحة الثانية: جمادى الأولى - شعبان */}
      {renderPage(4, 2)}
      
      {/* الصفحة الثالثة: رمضان - ذو الحجة */}
      {renderPage(8, 3)}
    </div>
  );
};

export default YearlyPrintableCalendar;
