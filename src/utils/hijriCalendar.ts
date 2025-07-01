
import moment from 'moment-hijri';
import { HijriDate, CalendarDay, CalendarEvent } from '@/types/calendar';
import { Task } from '@/types/task';

// تعيين اللغة العربية
moment.locale('ar-sa');

const hijriMonths = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function getHijriDate(gregorianDate: Date): HijriDate {
  const hijriMoment = moment(gregorianDate);
  const hijriYear = hijriMoment.iYear();
  const hijriMonth = hijriMoment.iMonth();
  const hijriDay = hijriMoment.iDate();
  
  return {
    hijriDay: hijriDay,
    hijriMonth: hijriMonth,
    hijriYear: hijriYear,
    gregorianDate: gregorianDate,
    dayName: arabicDays[gregorianDate.getDay()],
    monthName: hijriMonths[hijriMonth]
  };
}

export function generateHijriCalendarMonth(hijriYear: number, hijriMonth: number): CalendarDay[] {
  // الحصول على أول يوم في الشهر الهجري
  const firstHijriDay = moment().iYear(hijriYear).iMonth(hijriMonth).iDate(1);
  const firstGregorianDate = firstHijriDay.toDate();
  
  // الحصول على آخر يوم في الشهر الهجري
  const lastHijriDay = moment().iYear(hijriYear).iMonth(hijriMonth + 1).iDate(0);
  const lastGregorianDate = lastHijriDay.toDate();
  
  // البداية من يوم الأحد
  const startDate = new Date(firstGregorianDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  
  // إنشاء 42 يوم (6 أسابيع × 7 أيام)
  for (let i = 0; i < 42; i++) {
    const hijriDate = getHijriDate(currentDate);
    const isCurrentMonth = hijriDate.hijriMonth === hijriMonth;
    const isToday = currentDate.toDateString() === new Date().toDateString();
    
    days.push({
      hijriDate,
      events: [],
      isCurrentMonth,
      isToday
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

export function getCurrentHijriDate(): { year: number; month: number } {
  const now = moment();
  return {
    year: now.iYear(),
    month: now.iMonth()
  };
}

// إزالة دالة المناسبات الإسلامية
export function getIslamicOccasions(hijriMonth: number, hijriDay: number): string[] {
  return []; // إرجاع مصفوفة فارغة لإزالة المناسبات
}

export function convertTasksToCalendarEvents(tasks: Task[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  tasks.forEach(task => {
    // إضافة المهمة الأساسية
    events.push({
      id: task.id,
      title: task.title,
      type: 'task' as const,
      date: task.createdAt,
      completed: task.completed
    });
    
    // إضافة التكرار الأسبوعي إذا كان مطلوباً
    if (task.recurring === 'weekly') {
      const originalDate = new Date(task.createdAt);
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);
      
      // إنشاء المهام المكررة أسبوعياً
      let currentDate = new Date(originalDate);
      let weekCount = 0;
      
      while (currentDate <= oneYearFromNow && weekCount < 52) {
        // إضافة 7 أيام للحصول على التكرار الأسبوعي
        currentDate = new Date(originalDate);
        currentDate.setDate(originalDate.getDate() + (7 * (weekCount + 1)));
        
        if (currentDate <= oneYearFromNow) {
          events.push({
            id: `${task.id}-week-${weekCount + 1}`,
            title: task.title,
            type: 'task' as const,
            date: new Date(currentDate),
            completed: false
          });
        }
        
        weekCount++;
      }
    }
  });
  
  return events;
}

// دالة مساعدة للتحويل من التاريخ الهجري إلى الميلادي
export function hijriToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
  return moment().iYear(hijriYear).iMonth(hijriMonth).iDate(hijriDay).toDate();
}

// دالة مساعدة للتحويل من التاريخ الميلادي إلى الهجري
export function gregorianToHijri(gregorianDate: Date): { year: number; month: number; day: number } {
  const hijriMoment = moment(gregorianDate);
  return {
    year: hijriMoment.iYear(),
    month: hijriMoment.iMonth(),
    day: hijriMoment.iDate()
  };
}

// دالة للحصول على عدد أيام الشهر الهجري
export function getDaysInHijriMonth(hijriYear: number, hijriMonth: number): number {
  return moment().iYear(hijriYear).iMonth(hijriMonth).endOf('iMonth').iDate();
}
