
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
      <div key={`month-${monthIndex}`} style={{ 
        border: '2px solid #2D5A27',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'white'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #2D5A27, #3A6B32)',
          color: 'white',
          textAlign: 'center',
          padding: '0.3cm',
          margin: 0
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
            {hijriMonths[monthIndex]} {hijriYear} هـ
          </h3>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)'
        }}>
          {/* Day headers */}
          {dayHeaders.map((day, index) => (
            <div key={`header-${monthIndex}-${index}`} style={{
              background: '#F0F8F0',
              border: '1px solid #DDD',
              textAlign: 'center',
              padding: '0.2cm',
              fontWeight: 'bold',
              fontSize: '10px',
              color: '#2D5A27'
            }}>
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={`day-${monthIndex}-${index}`}
              style={{
                border: '1px solid #DDD',
                minHeight: '2.2cm',
                padding: '0.1cm',
                position: 'relative',
                background: !day.isCurrentMonth ? '#F8F8F8' : day.isToday ? '#FFF9C4' : 'white',
                opacity: !day.isCurrentMonth ? 0.6 : 1
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.1cm'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#2D5A27'
                }}>
                  {day.hijriDate.hijriDay}
                </span>
                <span style={{
                  fontSize: '8px',
                  color: '#666'
                }}>
                  {day.hijriDate.gregorianDate.getDate()}
                </span>
              </div>
              
              <div style={{ flex: 1 }}>
                {day.events.slice(0, 2).map((event, eventIndex) => (
                  <div
                    key={`event-${monthIndex}-${index}-${eventIndex}`}
                    style={{
                      fontSize: '7px',
                      margin: '0.05cm 0',
                      padding: '0.05cm',
                      borderRadius: '2px',
                      lineHeight: 1.2,
                      background: event.type === 'occasion' ? '#FFF3CD' : 
                                 event.completed ? '#E8F5E8' : '#E3F2FD',
                      borderLeft: `2px solid ${
                        event.type === 'occasion' ? '#F57C00' : 
                        event.completed ? '#388E3C' : '#1976D2'
                      }`,
                      fontWeight: event.type === 'occasion' ? 'bold' : 'normal',
                      textDecoration: event.completed ? 'line-through' : 'none',
                      opacity: event.completed ? 0.7 : 1
                    }}
                  >
                    {event.title.length > 12 
                      ? event.title.substring(0, 12) + '...' 
                      : event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div style={{
                    fontSize: '6px',
                    color: '#666',
                    textAlign: 'center'
                  }}>
                    +{day.events.length - 2}
                  </div>
                )}
              </div>
              
              <div style={{
                position: 'absolute',
                bottom: '0.1cm',
                left: '0.1cm',
                right: '0.1cm',
                height: '0.3cm',
                borderBottom: '1px solid #CCC'
              }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPage = (startMonth: number, pageNumber: number) => (
    <div key={`page-${pageNumber}`} className="print-page" style={{
      pageBreakAfter: pageNumber < 3 ? 'always' : 'avoid',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0.5cm'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '1cm',
        borderBottom: '3px solid #2D5A27',
        paddingBottom: '0.5cm'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2D5A27',
          margin: '0 0 0.3cm 0'
        }}>
          التقويم الهجري {hijriYear} هـ
        </h1>
        <h2 style={{
          fontSize: '16px',
          color: '#555',
          margin: 0
        }}>
          {hijriMonths[startMonth]} - {hijriMonths[Math.min(startMonth + 3, 11)]} {hijriYear} هـ
        </h2>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.8cm',
        flex: 1
      }}>
        {[0, 1, 2, 3].map(offset => {
          const monthIndex = startMonth + offset;
          if (monthIndex > 11) return null;
          return renderMonth(monthIndex);
        })}
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '0.5cm',
        paddingTop: '0.3cm',
        borderTop: '1px solid #DDD',
        fontSize: '10px',
        color: '#666'
      }}>
        <p style={{ margin: '0.1cm 0' }}>الخط في أسفل كل يوم مخصص للمهام اليدوية</p>
        <p style={{ margin: '0.1cm 0' }}>صفحة {pageNumber} من 3</p>
      </div>
    </div>
  );

  return (
    <div className="yearly-print-calendar" style={{
      fontFamily: 'Arial, sans-serif',
      color: '#000',
      background: 'white',
      direction: 'rtl',
      width: '100%',
      height: '100vh'
    }}>
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
