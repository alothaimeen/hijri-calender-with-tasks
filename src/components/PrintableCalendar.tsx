
import React from 'react';
import { CalendarDay } from '@/types/calendar';
import { generateHijriCalendarMonth, convertTasksToCalendarEvents, getIslamicOccasions } from '@/utils/hijriCalendar';
import { Task } from '@/types/task';

interface PrintableCalendarProps {
  tasks: Task[];
  startYear: number;
  startMonth: number;
}

const PrintableCalendar = ({ tasks, startYear, startMonth }: PrintableCalendarProps) => {
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const dayHeaders = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const generateMonthData = (year: number, month: number) => {
    const monthKey = `${year}-${month}`;
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
    
    return { days, monthKey };
  };

  const getMonthsToShow = () => {
    const months = [];
    let currentYear = startYear;
    let currentMonth = startMonth;
    
    for (let i = 0; i < 4; i++) {
      months.push({ year: currentYear, month: currentMonth });
      
      if (currentMonth === 11) {
        currentYear++;
        currentMonth = 0;
      } else {
        currentMonth++;
      }
    }
    
    return months;
  };

  const monthsToShow = getMonthsToShow();

  return (
    <div className="print-calendar hidden print:block bg-white text-black">
      <style>
        {`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          .print-calendar {
            display: block !important;
            font-size: 8px;
            line-height: 1.2;
          }
          .month-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5cm;
            page-break-inside: avoid;
          }
          .month-container {
            border: 1px solid #ccc;
            page-break-inside: avoid;
          }
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px;
          }
          .day-cell {
            border: 1px solid #ddd;
            min-height: 2.5cm;
            padding: 2px;
            position: relative;
          }
          .day-header {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
            padding: 3px 2px;
            border: 1px solid #ccc;
          }
          .task-item {
            font-size: 6px;
            background-color: #f8f9fa;
            margin: 1px 0;
            padding: 1px 2px;
            border-radius: 2px;
          }
          .occasion-item {
            font-size: 6px;
            background-color: #fff3cd;
            margin: 1px 0;
            padding: 1px 2px;
            border-radius: 2px;
            font-weight: bold;
          }
          .manual-task-space {
            position: absolute;
            bottom: 2px;
            left: 2px;
            right: 2px;
            height: 8px;
            border-bottom: 1px solid #ccc;
          }
        }
        `}
      </style>
      
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold">التقويم الهجري - أم القرى</h1>
        <p className="text-sm">
          من {hijriMonths[monthsToShow[0].month]} {monthsToShow[0].year} هـ 
          إلى {hijriMonths[monthsToShow[3].month]} {monthsToShow[3].year} هـ
        </p>
      </div>

      <div className="month-grid">
        {monthsToShow.map(({ year, month }) => {
          const { days } = generateMonthData(year, month);
          
          return (
            <div key={`${year}-${month}`} className="month-container">
              <div className="text-center bg-gray-100 p-2 font-bold">
                {hijriMonths[month]} {year} هـ
              </div>
              
              <div className="calendar-grid">
                {/* Day headers */}
                {dayHeaders.map(day => (
                  <div key={day} className="day-header">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`day-cell ${!day.isCurrentMonth ? 'opacity-50' : ''} ${
                      day.isToday ? 'bg-yellow-100' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-xs">
                        {day.hijriDate.hijriDay}
                      </div>
                      <div className="text-xs text-gray-600">
                        {day.hijriDate.gregorianDate.getDate()}
                      </div>
                    </div>
                    
                    {/* Events and tasks */}
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={
                            event.type === 'occasion'
                              ? 'occasion-item'
                              : event.completed
                                ? 'task-item line-through opacity-60'
                                : 'task-item'
                          }
                        >
                          {event.title.length > 15 
                            ? event.title.substring(0, 15) + '...' 
                            : event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{day.events.length - 2}
                        </div>
                      )}
                    </div>
                    
                    {/* Space for manual task */}
                    <div className="manual-task-space"></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center mt-4 text-xs text-gray-600">
        <p>الخط في أسفل كل يوم مخصص لكتابة مهمة يدوياً</p>
      </div>
    </div>
  );
};

export default PrintableCalendar;
