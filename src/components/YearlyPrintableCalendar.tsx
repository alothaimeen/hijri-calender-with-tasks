
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
      <div className="month-container border-2 border-black bg-white mb-4 break-inside-avoid">
        <div className="month-header bg-gray-200 text-center p-3 font-bold text-lg border-b-2 border-black">
          {hijriMonths[monthIndex]} {hijriYear} هـ
        </div>
        
        <div className="calendar-grid grid grid-cols-7 gap-0">
          {dayHeaders.map((day, index) => (
            <div key={`header-${index}`} className="day-header bg-gray-100 text-center p-2 font-bold text-sm border border-gray-400">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div key={`day-${monthIndex}-${index}`} className="calendar-day border border-gray-400 min-h-20 p-2 bg-white relative">
              <div className="hijri-day font-bold text-base mb-1">
                {day.hijriDate.hijriDay}
              </div>
              <div className="gregorian-day text-sm text-gray-600 mb-2">
                {day.hijriDate.gregorianDate.getDate()}
              </div>
              <div className="events-container space-y-1">
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div 
                    key={`event-${monthIndex}-${index}-${eventIndex}`} 
                    className={`event-item text-xs p-1 rounded ${
                      event.type === 'occasion' 
                        ? 'bg-yellow-200 text-yellow-900' 
                        : 'bg-blue-200 text-blue-900'
                    }`}
                  >
                    {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{day.events.length - 2} أخرى
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
    <div className="yearly-print-calendar w-full min-h-screen bg-white text-black p-4" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-black">التقويم الهجري {hijriYear} هـ</h1>
        <p className="text-lg text-gray-700">تقويم أم القرى الشريف</p>
      </div>
      
      {/* الشهور الأولى (صفحة 1) */}
      <div className="first-page mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderMonth(0)}
          {renderMonth(1)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderMonth(2)}
          {renderMonth(3)}
        </div>
      </div>
      
      {/* الشهور الوسطى (صفحة 2) */}
      <div className="second-page mb-8 page-break-before">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderMonth(4)}
          {renderMonth(5)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderMonth(6)}
          {renderMonth(7)}
        </div>
      </div>
      
      {/* الشهور الأخيرة (صفحة 3) */}
      <div className="third-page page-break-before">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderMonth(8)}
          {renderMonth(9)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderMonth(10)}
          {renderMonth(11)}
        </div>
      </div>
      
      {/* تذييل */}
      <div className="text-center mt-8 pt-4 border-t-2 border-gray-300">
        <p className="text-gray-600">طُبع من التقويم الهجري الإلكتروني - {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default YearlyPrintableCalendar;
