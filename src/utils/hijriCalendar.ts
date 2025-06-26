
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
  const hijriMoment = moment(gregorianDate).iYear();
  const hijriMonth = moment(gregorianDate).iMonth();
  const hijriDay = moment(gregorianDate).iDate();
  
  return {
    hijriDay: hijriDay,
    hijriMonth: hijriMonth,
    hijriYear: hijriMoment,
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

export function getIslamicOccasions(hijriMonth: number, hijriDay: number): string[] {
  const occasions: { [key: string]: string } = {
    '0-1': 'رأس السنة الهجرية',
    '0-10': 'يوم عاشوراء',
    '2-12': 'مولد النبي محمد ﷺ',
    '6-27': 'الإسراء والمعراج',
    '7-15': 'ليلة النصف من شعبان',
    '8-1': 'بداية شهر رمضان',
    '8-27': 'ليلة القدر',
    '9-1': 'عيد الفطر',
    '11-9': 'يوم عرفة',
    '11-10': 'عيد الأضحى'
  };
  
  const key = `${hijriMonth}-${hijriDay}`;
  return occasions[key] ? [occasions[key]] : [];
}

export function convertTasksToCalendarEvents(tasks: Task[]): CalendarEvent[] {
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    type: 'task' as const,
    date: task.createdAt,
    completed: task.completed
  }));
}
