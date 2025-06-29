
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import YearlyPrintableCalendar from '@/components/YearlyPrintableCalendar';
import { ArrowRight, Printer } from 'lucide-react';
import { Task } from '@/types/task';

const PrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // استقبال البيانات من الصفحة الرئيسية
  const { tasks = [], hijriYear = 1446 } = location.state || {};

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* أزرار التحكم - مخفية في الطباعة */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={handleGoBack}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
          size="sm"
        >
          <Printer className="w-4 h-4 ml-2" />
          طباعة
        </Button>
      </div>

      {/* التقويم السنوي */}
      <YearlyPrintableCalendar 
        tasks={tasks}
        hijriYear={hijriYear}
      />
    </div>
  );
};

export default PrintPage;
