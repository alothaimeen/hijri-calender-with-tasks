
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarHeaderProps {
  currentHijriDate: { year: number; month: number };
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const CalendarHeader = ({ currentHijriDate, onNavigateMonth }: CalendarHeaderProps) => {
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  return (
    <Card className="mb-6 shadow-xl border-0 bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateMonth('next')}
              className="hover:bg-emerald-100 text-emerald-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-emerald-800 mb-1">
              {hijriMonths[currentHijriDate.month]} {currentHijriDate.year} هـ
            </h2>
            <p className="text-sm text-emerald-600 flex items-center justify-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              التقويم الهجري - أم القرى
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateMonth('prev')}
            className="hover:bg-emerald-100 text-emerald-700"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CalendarHeader;
