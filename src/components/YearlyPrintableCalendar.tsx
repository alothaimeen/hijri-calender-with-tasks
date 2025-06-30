
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
      <div className="month-container border-2 border-black bg-white mb-4">
        <div className="month-header bg-gray-200 text-center p-2 font-bold text-sm border-b-2 border-black">
          {hijriMonths[monthIndex]} {hijriYear} هـ
        </div>
        
        <div className="calendar-grid grid grid-cols-7 gap-0">
          {dayHeaders.map((day, index) => (
            <div key={`header-${index}`} className="day-header bg-gray-100 text-center p-1 font-bold text-xs border border-gray-400">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div key={`day-${monthIndex}-${index}`} className="calendar-day border border-gray-400 min-h-16 p-1 bg-white relative">
              <div className="hijri-day font-bold text-xs mb-1">
                {day.hijriDate.hijriDay}
              </div>
              <div className="gregorian-day text-xs text-gray-600 mb-1">
                {day.hijriDate.gregorianDate.getDate()}
              </div>
              <div className="events-container space-y-1">
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div 
                    key={`event-${monthIndex}-${index}-${eventIndex}`} 
                    className={`event-item text-xs p-1 rounded ${
                      event.type === 'occasion' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {event.title.substring(0, 12)}...
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-gray-500">
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
    <div className="yearly-print-calendar w-full bg-white text-black" dir="rtl">
      {/* الصفحة الأولى */}
      <div className="print-page">
        <h1 className="text-center text-2xl font-bold mb-6">التقويم الهجري {hijriYear} هـ</h1>
        <div className="month-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderMonth(0)}
          {renderMonth(1)}
          {renderMonth(2)}
          {renderMonth(3)}
        </div>
      </div>
      
      {/* الصفحة الثانية */}
      <div className="print-page">
        <div className="month-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderMonth(4)}
          {renderMonth(5)}
          {renderMonth(6)}
          {renderMonth(7)}
        </div>
      </div>
      
      {/* الصفحة الثالثة */}
      <div className="print-page">
        <div className="month-grid grid grid-cols-1 md:grid-cols-2 gap-4">
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
