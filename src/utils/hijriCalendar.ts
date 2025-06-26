
import moment from 'moment';
import 'moment/locale/ar-sa';
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
  const momentDate = moment(gregorianDate);
  
  // تحويل تقريبي للتاريخ الهجري (يمكن تحسينه لاحقاً بمكتبة أكثر دقة)
  const hijriYear = Math.floor((gregorianDate.getFullYear() - 622) * 1.030684);
  const dayOfYear = Math.floor((gregorianDate.getTime() - new Date(gregorianDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const hijriMonth = Math.floor(dayOfYear / 30) % 12;
  const hijriDay = (dayOfYear % 30) + 1;
  
  return {
    hijriDay: hijriDay,
    hijriMonth: hijriMonth,
    hijriYear: hijriYear + 1400,
    gregorianDate: gregorianDate,
    dayName: arabicDays[gregorianDate.getDay()],
    monthName: hijriMonths[hijriMonth]
  };
}

export function generateCalendarMonth(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // البداية من يوم الأحد
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  
  // إنشاء 42 يوم (6 أسابيع × 7 أيام)
  for (let i = 0; i < 42; i++) {
    const hijriDate = getHijriDate(currentDate);
    const isCurrentMonth = currentDate.getMonth() === month;
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

export function getIslamicOccasions(hijriMonth: number, hijriDay: number): string[] {
  const occasions: { [key: string]: string } = {
    '1-1': 'رأس السنة الهجرية',
    '1-10': 'يوم عاشوراء',
    '3-12': 'مولد النبي محمد ﷺ',
    '7-27': 'الإسراء والمعراج',
    '8-15': 'ليلة النصف من شعبان',
    '9-1': 'بداية شهر رمضان',
    '9-27': 'ليلة القدر',
    '10-1': 'عيد الفطر',
    '12-9': 'يوم عرفة',
    '12-10': 'عيد الأضحى'
  };
  
  const key = `${hijriMonth + 1}-${hijriDay}`;
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
