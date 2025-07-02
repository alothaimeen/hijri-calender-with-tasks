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

// إضافة المناسبات الإسلامية والوطنية
export function getIslamicOccasions(hijriMonth: number, hijriDay: number): string[] {
  const occasions: string[] = [];
  
  // المناسبات الهجرية
  if (hijriMonth === 0 && hijriDay === 10) {
    occasions.push('يوم عاشوراء');
  }
  if (hijriMonth === 1 && hijriDay === 23) {
    occasions.push('عودة المعلمين');
  }
  if (hijriMonth === 2 && hijriDay === 1) {
    occasions.push('بداية العام الدراسي');
  }
  if (hijriMonth === 8 && hijriDay === 23) {
    occasions.push('بداية إجازة رمضان');
  }
  if (hijriMonth === 9 && hijriDay === 1) {
    occasions.push('عيد الفطر');
  }
  if (hijriMonth === 11 && hijriDay === 10) {
    occasions.push('عيد الأضحى');
  }
  
  return occasions;
}

// إضافة المناسبات الوطنية
export function getNationalOccasions(gregorianDate: Date): string[] {
  const occasions: string[] = [];
  const month = gregorianDate.getMonth() + 1; // الشهر يبدأ من 0
  const day = gregorianDate.getDate();
  
  if (month === 9 && day === 23) {
    occasions.push('اليوم الوطني');
  }
  if (month === 2 && day === 22) {
    occasions.push('يوم التأسيس');
  }
  
  return occasions;
}

export function convertTasksToCalendarEvents(tasks: Task[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  tasks.forEach(task => {
    // إضافة المهمة فقط بتاريخها المحدد
    events.push({
      id: task.id,
      title: task.title,
      type: 'task' as const,
      date: task.createdAt,
      completed: task.completed
    });
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
