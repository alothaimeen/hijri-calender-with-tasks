
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RecurringOptions } from '@/types/task';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (options: RecurringOptions) => void;
  taskTitle: string;
}

const RecurringModal = ({ isOpen, onClose, onSubmit, taskTitle }: RecurringModalProps) => {
  const [recurringType, setRecurringType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [recurringCount, setRecurringCount] = useState(1);

  const handleSubmit = () => {
    onSubmit({
      type: recurringType,
      count: recurringType === 'none' ? 0 : recurringCount
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">خيارات التكرار للمهمة</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">المهمة: {taskTitle}</Label>
          </div>
          
          <div>
            <Label htmlFor="recurring-type" className="text-sm font-medium text-gray-700">
              نوع التكرار
            </Label>
            <Select value={recurringType} onValueChange={(value: any) => setRecurringType(value)}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="اختر نوع التكرار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون تكرار</SelectItem>
                <SelectItem value="daily">يومي</SelectItem>
                <SelectItem value="weekly">أسبوعي</SelectItem>
                <SelectItem value="monthly">شهري</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {recurringType !== 'none' && (
            <div>
              <Label htmlFor="count" className="text-sm font-medium text-gray-700">
                عدد التكرارات
              </Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="365"
                value={recurringCount}
                onChange={(e) => setRecurringCount(parseInt(e.target.value) || 1)}
                className="mt-1 text-right"
                dir="rtl"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2 justify-start">
          <Button onClick={onClose} variant="outline">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringModal;
