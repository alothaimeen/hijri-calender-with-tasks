
export interface HijriDate {
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  gregorianDate: Date;
  dayName: string;
  monthName: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'task' | 'occasion';
  date: Date;
  completed?: boolean;
}

export interface CalendarDay {
  hijriDate: HijriDate;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}
