import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { School, Bookmark, Book, GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define types based on backend expectations
interface StudentInfo {
  min_avg: number;
  branch: string;
  field?: string; // Field is optional
}

interface StudentInfoModalProps {
  universitySlug: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentInfo) => void; // Callback with collected data
  isLoading?: boolean; // To show loading state on submit button
}

// Structured branch data with icons and translations
const BRANCHES = [
  { id: "علمي", label: "علمي", description: "Science" },
  { id: "أدبي", label: "أدبي", description: "Literature" },
  { id: "صناعي", label: "صناعي", description: "Industrial" },
  { id: "تجاري", label: "تجاري", description: "Commercial" },
  { id: "زراعي", label: "زراعي", description: "Agricultural" },
  { id: "شرعي", label: "شرعي", description: "Religious" },
  { id: "فندقي", label: "فندقي", description: "Hospitality" },
  { id: "اقتصاد منزلي", label: "اقتصاد منزلي", description: "Home Economics" },
  { id: "تكنولوجي", label: "تكنولوجي", description: "Technology" },
  { id: "ريادة وأعمال", label: "ريادة وأعمال", description: "Entrepreneurship" }
];

// Structured field data with icons and translations
const FIELDS = [
  { id: "tech", label: "تكنولوجيا", description: "Technology", icon: <School className="w-4 h-4 mr-2 text-blue-500"/> },
  { id: "medical", label: "طبي", description: "Medical Sciences", icon: <School className="w-4 h-4 mr-2 text-red-500"/> },
  { id: "business", label: "أعمال", description: "Business", icon: <School className="w-4 h-4 mr-2 text-amber-500"/> },
  { id: "engineering", label: "هندسة", description: "Engineering", icon: <School className="w-4 h-4 mr-2 text-indigo-500"/> },
  { id: "arts", label: "فنون", description: "Arts & Humanities", icon: <School className="w-4 h-4 mr-2 text-pink-500"/> },
  { id: "other", label: "أخرى", description: "Other Fields", icon: <School className="w-4 h-4 mr-2 text-gray-500"/> }
];

export const StudentInfoModal: React.FC<StudentInfoModalProps> = ({
  universitySlug,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [average, setAverage] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [field, setField] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeSection, setActiveSection] = useState<number>(0); // Track form section
  
  // Get formatted university name
  const formattedUniName = universitySlug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleSubmit = () => {
    setError('');
    
    if (activeSection === 0) {
      // Validate first section (average input)
      const avgNum = parseFloat(average);
      if (isNaN(avgNum) || avgNum < 0 || avgNum > 100) {
        setError('الرجاء إدخال معدل صحيح بين 0 و 100.');
        return;
      }
      setActiveSection(1); // Move to branch selection
      return;
    } 
    
    if (activeSection === 1) {
      // Validate branch selection
      if (!branch) {
        setError('الرجاء اختيار فرع التوجيهي.');
        return;
      }
      setActiveSection(2); // Move to field selection (optional)
      return;
    }
    
    // Final submission (after field selection - optional)
    const avgNum = parseFloat(average);
    onSubmit({
      min_avg: avgNum,
      branch: branch,
      field: field || undefined, // Send field only if selected
    });
  };
  
  const handleBack = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    } else {
      onClose();
    }
  };

  // Reset form when modal is closed/opened
  React.useEffect(() => {
    if (isOpen) {
      setAverage('');
      setBranch('');
      setField('');
      setError('');
      setActiveSection(0);
    }
  }, [isOpen]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] shadow-lg border-0">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-sm"></div>
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-700">
            <GraduationCap className="h-5 w-5" />
            <span>معلومات الطالب</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            <span className="text-indigo-600 font-medium">{formattedUniName}</span> ساعدنا نلاقي التخصصات المناسبة إلك في جامعة
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={`section-${activeSection}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="py-4"
          >
            {activeSection === 0 && (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="mb-2">
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm flex items-start">
                    <Sparkles className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>ادخل معدلك بالتوجيهي لنساعدك بإيجاد التخصصات المناسبة</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="average" className="text-right text-gray-700">
                    المعدل
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="average"
                      type="number"
                      value={average}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAverage(e.target.value)}
                      placeholder="مثال: 85.5"
                      className="pr-12 transition-all focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeSection === 1 && (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="mb-2">
                  <div className="bg-indigo-50 text-indigo-700 p-3 rounded-md text-sm flex items-start">
                    <Book className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>اختر فرع دراستك في الثانوية العامة (التوجيهي)</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="branch" className="text-right text-gray-700">
                    الفرع
                  </Label>
                  <div className="col-span-3">
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="transition-all focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500">
                        <SelectValue placeholder="اختر فرع التوجيهي" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {BRANCHES.map((b) => (
                          <SelectItem 
                            key={b.id} 
                            value={b.id}
                            className="cursor-pointer hover:bg-indigo-50"
                          >
                            <div className="flex items-center">
                              <span>{b.label}</span>
                              <span className="text-xs text-gray-500 mr-2">({b.description})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeSection === 2 && (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="mb-2">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start">
                    <Bookmark className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>يمكنك اختيار المجال المفضل لديك (اختياري)</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field" className="text-right text-gray-700">
                    المجال المفضل
                  </Label>
                  <div className="col-span-3">
                    <Select value={field} onValueChange={setField}>
                      <SelectTrigger className="transition-all focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500">
                        <SelectValue placeholder="(اختياري) اختر مجالاً" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS.map((f) => (
                          <SelectItem 
                            key={f.id} 
                            value={f.id}
                            className="cursor-pointer hover:bg-green-50"
                          >
                            <div className="flex items-center">
                              {f.icon}
                              <span>{f.label}</span>
                              <span className="text-xs text-gray-500 mr-2">({f.description})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="text-center mt-4 text-xs text-gray-500">
                  تخطي هذه الخطوة للاطلاع على جميع التخصصات المتاحة حسب معدلك وفرعك
                </motion.div>
              </motion.div>
            )}
            
            {error && (
              <motion.p 
                className="text-sm text-red-600 mt-2 text-center bg-red-50 p-2 rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 my-2">
          {[0, 1, 2].map((step) => (
            <motion.div
              key={step}
              className={cn(
                "h-2 rounded-full transition-all", 
                activeSection === step 
                  ? "w-6 bg-stone-700"
                  : activeSection > step 
                    ? "w-2 bg-stone-500"
                    : "w-2 bg-gray-200"
              )}
              animate={{
                width: activeSection === step ? 24 : 8,
                backgroundColor: activeSection >= step 
                  ? activeSection === step ? "rgba(68, 64, 60, 0.7)" : "#78716c"
                  : "#e5e7eb"
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <motion.div 
            className="w-full flex justify-between gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="transition-all hover:bg-gray-100"
              >
                {activeSection === 0 ? 'إلغاء' : 'رجوع'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                type="submit" 
                onClick={handleSubmit} 
                disabled={isLoading}
                className={cn(
                  "transition-all font-medium",
                  "bg-white border border-indigo-200 hover:bg-gray-50 text-indigo-700"
                )}
              >
                <span className="text-indigo-700">
                  {isLoading ? 'جاري البحث...' : 
                  activeSection === 2 ? 'ابحث عن تخصصات' : 'التالي'}
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 