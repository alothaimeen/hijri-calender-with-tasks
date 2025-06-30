
import React, { useEffect } from 'react';
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
    // إخفاء الأزرار قبل الطباعة
    const buttons = document.querySelector('.print-controls');
    if (buttons) buttons.style.display = 'none';
    
    window.print();
    
    // إظهار الأزرار بعد الطباعة
    setTimeout(() => {
      if (buttons) buttons.style.display = 'flex';
    }, 1000);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // تأكد من تحميل الصفحة بشكل صحيح
  useEffect(() => {
    console.log('Print page loaded with data:', { tasks: tasks.length, hijriYear });
  }, [tasks, hijriYear]);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* أزرار التحكم */}
      <div className="print-controls print:hidden fixed top-4 right-4 z-50 flex gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <Button
          onClick={handleGoBack}
          variant="outline"
          size="lg"
          className="bg-white shadow-md hover:shadow-lg"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          العودة للرئيسية
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
          size="lg"
        >
          <Printer className="w-5 h-5 ml-2" />
          طباعة التقويم
        </Button>
      </div>

      {/* رسالة ترحيب مرئية */}
      <div className="print:hidden bg-emerald-50 border-b border-emerald-200 p-4 text-center">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          التقويم الهجري {hijriYear} هـ جاهز للطباعة
        </h2>
        <p className="text-emerald-700">
          اضغط على زر "طباعة التقويم" أعلاه لطباعة التقويم السنوي كاملاً
        </p>
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
