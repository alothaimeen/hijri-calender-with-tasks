
import React from 'react';
import { CalendarDay } from '@/types/calendar';
import { generateHijriCalendarMonth, convertTasksToCalendarEvents, getIslamicOccasions, getNationalOccasions } from '@/utils/hijriCalendar';
import { Task } from '@/types/task';
import moment from 'moment-hijri';

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
      
      // Add Islamic occasions
      const islamicOccasions = getIslamicOccasions(day.hijriDate.hijriMonth, day.hijriDate.hijriDay);
      islamicOccasions.forEach(occasion => {
        day.events.push({
          id: `islamic-${day.hijriDate.gregorianDate.toISOString()}`,
          title: occasion,
          type: 'occasion',
          date: day.hijriDate.gregorianDate
        });
      });
      
      // Add National occasions
      const nationalOccasions = getNationalOccasions(day.hijriDate.gregorianDate);
      nationalOccasions.forEach(occasion => {
        day.events.push({
          id: `national-${day.hijriDate.gregorianDate.toISOString()}`,
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
              <div 
                key={`header-${monthIndex}-${index}`} 
                className={`weekday-cell ${
                  index === 5 || index === 6 ? 'weekend-header' : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="days-container">
            {days.map((day, index) => {
              const isWeekend = day.hijriDate.gregorianDate.getDay() === 5 || day.hijriDate.gregorianDate.getDay() === 6;
              
              const gregorianDate = moment()
                .iYear(day.hijriDate.hijriYear)
                .iMonth(day.hijriDate.hijriMonth)
                .iDate(day.hijriDate.hijriDay)
                .toDate();
              
              // فصل المناسبات عن المهام
              const occasions = day.events.filter(event => event.type === 'occasion');
              const tasks = day.events.filter(event => event.type === 'task');
              
              return (
                <div 
                  key={`day-${monthIndex}-${index}`} 
                  className={`day-box ${isWeekend ? 'weekend-day' : ''}`}
                >
                  <div className="day-header">
                    <span className="hijri-date">{day.hijriDate.hijriDay}</span>
                    <span className="gregorian-date">{gregorianDate.getDate()}/{gregorianDate.getMonth() + 1}</span>
                  </div>
                  
                  <div className="day-content">
                    {/* عرض المناسبات بخط صغير */}
                    {occasions.map((event, eventIndex) => (
                      <div 
                        key={`occasion-${monthIndex}-${index}-${eventIndex}`} 
                        className="occasion-item"
                      >
                        <span className="occasion-text">{event.title}</span>
                      </div>
                    ))}
                    
                    {/* عرض المهام */}
                    {tasks.slice(0, 2).map((event, eventIndex) => (
                      <div 
                        key={`task-${monthIndex}-${index}-${eventIndex}`} 
                        className={`task-item ${event.type}`}
                      >
                        <span className="task-bullet">•</span>
                        <span className="task-text">{event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}</span>
                      </div>
                    ))}
                    
                    {/* خطوط فارغة لكتابة المهام */}
                    {Array.from({ length: Math.max(1, 3 - tasks.length - occasions.length) }, (_, i) => (
                      <div key={`empty-${i}`} className="empty-task-line"></div>
                    ))}
                  </div>
                </div>
              );
            })}
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
      <style>
        {`
        @media print {
          .yearly-calendar {
            color: black;
            background: white;
          }
          .calendar-page {
            page-break-after: always;
            margin: 0;
            padding: 1cm;
          }
          .months-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1cm;
          }
          .calendar-month {
            border: 1px solid #ccc;
            page-break-inside: avoid;
          }
          .month-header {
            background-color: #f0f0f0;
            text-align: center;
            padding: 0.3cm;
            font-weight: bold;
            border-bottom: 1px solid #ccc;
          }
          .weekdays-row {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background-color: #f8f8f8;
          }
          .weekday-cell {
            text-align: center;
            padding: 0.2cm;
            font-weight: bold;
            font-size: 10px;
            border: 1px solid #ddd;
          }
          .weekend-header {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .days-container {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
          }
          .day-box {
            border: 1px solid #ddd;
            min-height: 2cm;
            padding: 0.1cm;
            position: relative;
            background-color: white;
          }
          .weekend-day {
            background-color: #f0fdf4 !important;
          }
          .day-header {
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            font-weight: bold;
            margin-bottom: 0.1cm;
          }
          .hijri-date {
            font-size: 10px;
            color: #333;
          }
          .gregorian-date {
            font-size: 7px;
            color: #666;
          }
          .day-content {
            font-size: 6px;
            line-height: 1.2;
          }
          .occasion-item {
            margin: 0.02cm 0;
            font-size: 5px;
            color: #d97706;
            font-weight: bold;
            text-align: center;
            background-color: #fef3c7;
            padding: 0.02cm;
            border-radius: 1px;
          }
          .occasion-text {
            font-size: 5px;
          }
          .task-item {
            margin: 0.05cm 0;
            display: flex;
            align-items: center;
          }
          .task-bullet {
            margin-left: 0.1cm;
          }
          .empty-task-line {
            height: 0.3cm;
            border-bottom: 1px solid #ddd;
            margin: 0.05cm 0;
          }
        }
        `}
      </style>
      
      {monthGroups.map((group, groupIndex) => (
        <div key={`page-${groupIndex}`} className="calendar-page">
          <div className="months-grid">
            {group.map((monthIndex) => renderMonth(monthIndex))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearlyPrintableCalendar;
