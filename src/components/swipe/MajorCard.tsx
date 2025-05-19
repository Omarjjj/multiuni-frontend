import React from 'react';
import { motion } from 'framer-motion';
import { Major } from '@/contexts/InterestContext'; // Reverted path
import { Badge } from "@/components/ui/badge"; // Reverted path
import { ExternalLink, Info, BookOpen, TrendingUp, Percent, University, Bookmark } from 'lucide-react'; // Added icons
import { cn } from "@/lib/utils"; // Reverted path
import { Button } from '@/components/ui/button'; // Assuming Button component exists

interface MajorCardProps {
  major: Major; // Ensure Major type includes optional description: string;
  actionFeedback?: 'liked' | 'passed' | null; // New prop for swipe feedback
  // No onExit needed here, parent SwipeDeck handles dismissal
}

// Placeholder for university logos - map slug to image source
const universityLogos: { [key: string]: string } = {
  aaup: '/assets/logos/aaup.png', // Updated path
  birzeit: '/assets/logos/birzeit.png',
  ppu: '/assets/logos/ppu.png',
  'an-najah': '/assets/logos/an-najah.png', // Use consistent key format if needed
  najah: '/assets/logos/an-najah.png', // Alias if data uses 'najah'
  bethlehem: '/assets/logos/bethlehem.png',
  alquds: '/assets/logos/alquds.png',
  // Add other universities as needed
  default: '/assets/logos/default.png' // Default/fallback logo
};

export const MajorCard: React.FC<MajorCardProps> = ({ major, actionFeedback }) => {

  // Use lowercase and handle potential variations
  const uniKey = major.university?.toLowerCase() || 'default';
  const logoSrc = universityLogos[uniKey] || universityLogos.default; // Use defined default

  // Helper to format fee
  const formatFee = (fee: number | string | null | undefined): string => {
    if (fee === null || fee === undefined || fee === '') return 'غير محدد';
    // Check if it includes currency explicitly
    if (typeof fee === 'string' && (fee.includes('دينار') || fee.includes('دولار'))) {
        return fee;
    }
    // Assume شيكل if just a number
    const numericFee = Number(fee);
    if (isNaN(numericFee)) return String(fee); // Return original string if not parseable
    return `${numericFee} شيكل`;
  };

   // Helper to format min average
   const formatAvg = (avg: number | string | null | undefined): string => {
    if (avg === null || avg === undefined || avg === '') return 'غير محدد';
    if (String(avg).toLowerCase() === 'ناجح' || avg === 0) return 'ناجح'; // Handle the "ناجح" case
    const numericAvg = Number(avg);
     if (isNaN(numericAvg)) return String(avg); // Return original string if not parseable
    return `${numericAvg.toFixed(1)}%`;
  };

  // Helper to render branches
  const renderBranches = (branches: string[] | undefined) => {
    if (!branches || branches.length === 0) return <span className="text-gray-500">غير محدد</span>;
    // Simplify common branches
    const displayBranches = branches.map(b => b.replace(/^(الفرع|فرع)\s*/, '').trim()); // Remove prefix and trim
    return displayBranches.map((branch) => (
        <motion.div
          key={branch}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Badge 
            variant="outline" 
            className="text-xs px-2 py-0.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 text-gray-700 border-gray-300 font-normal transition-all"
          >
            {branch}
          </Badge>
        </motion.div>
    ));
  };

  // Card content animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={cn(
        "absolute inset-0", // Base structural class
        // Conditional background based on actionFeedback - TEST COLORS
        {
          'bg-lime-500': actionFeedback === 'liked', // Test: Bright opaque green
          'bg-rose-500': actionFeedback === 'passed',   // Test: Bright opaque red
          'bg-sky-100': !actionFeedback          // Test: Light blue default
        },
        // Remaining structural and styling classes
        "p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700", // Keep dark:border for consistency if needed elsewhere
        "flex flex-col overflow-y-auto",
        "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800",
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full",
        "scrollbar-gutter-stable" // Reserves space for scrollbar, reducing layout shift
      )}
      style={{ willChange: 'transform' }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
        {/* Header: Title with decorative element */}
        <motion.div 
          className="flex flex-col mb-6 relative items-center text-center"
          variants={itemVariants}
        >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full"></div>
            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-50 mb-2 mt-5 tracking-tight">{major.title}</h3>
            <div className={cn(
                "flex items-center text-sm text-gray-500 dark:text-gray-400 py-1 px-3 rounded-full w-fit shadow-sm",
                actionFeedback ? "bg-transparent" : "bg-gray-100 dark:bg-gray-700/50"
            )}>
                <University className="w-4 h-4 ml-1.5 text-cyan-500 dark:text-cyan-400" />
                <span>{major.university_name || major.university}</span>
            </div>
        </motion.div>

        {/* Details Grid with animations */}
        <motion.div 
          className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm mb-6"
          variants={itemVariants}
        >
           <motion.div 
             className={cn(
                "flex flex-col items-center justify-center text-gray-700 dark:text-gray-300 p-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-sky-200 dark:border-sky-700",
                actionFeedback ? "bg-transparent" : "bg-sky-50 dark:bg-sky-900/30"
             )}
             whileHover={{ scale: 1.03, y: -3 }}
           >
             <BookOpen className="w-5 h-5 mb-1.5 text-sky-500 dark:text-sky-400" />
             <span className="font-semibold text-xs text-gray-500 dark:text-gray-400">رسوم الساعة</span>
             <span className="font-mono text-base font-bold mt-0.5">{formatFee(major.parsed_fee)}</span>
           </motion.div>
           <motion.div 
             className={cn(
                "flex flex-col items-center justify-center text-gray-700 dark:text-gray-300 p-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-teal-200 dark:border-teal-700",
                actionFeedback ? "bg-transparent" : "bg-teal-50 dark:bg-teal-900/30"
             )}
             whileHover={{ scale: 1.03, y: -3 }}
           >
             <Percent className="w-5 h-5 mb-1.5 text-teal-500 dark:text-teal-400" />
             <span className="font-semibold text-xs text-gray-500 dark:text-gray-400">أقل معدل</span>
             <span className="font-mono text-base font-bold mt-0.5">{formatAvg(major.parsed_min_avg)}</span>
           </motion.div>
         </motion.div>

        {/* Branches */}
        {major.parsed_branches && major.parsed_branches.length > 0 && (
           <motion.div 
             className={cn(
                "mb-6 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
                actionFeedback ? "bg-transparent" : "bg-gray-100 dark:bg-gray-800/60"
             )}
             variants={itemVariants}
           >
             <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5">
                 <TrendingUp className="w-5 h-5 ml-2 text-purple-500 dark:text-purple-400" />
                 <span>الفروع المقبولة</span>
             </div>
             <div className="flex flex-wrap gap-2.5">
                 {renderBranches(major.parsed_branches)}
             </div>
           </motion.div>
         )}

        {/* Description */}
        {major.description && (
          <motion.div 
            className="mb-5 pt-4 border-t border-gray-200 dark:border-gray-700/80"
            variants={itemVariants}
          >
             <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5">
                 <Info className="w-5 h-5 ml-2 text-indigo-500 dark:text-indigo-400" />
                 <span>نبذة عن التخصص</span>
             </div>
            <motion.p 
              className={cn(
                "text-sm text-gray-700 dark:text-gray-300 leading-relaxed p-4 rounded-lg shadow-inner text-justify",
                actionFeedback ? "bg-transparent" : "bg-white dark:bg-gray-700/40"
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1,
                height: "auto",
                transition: { duration: 0.5 } 
              }}
            >
              {major.description}
            </motion.p>
          </motion.div>
        )}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Details Link - with animation */}
        {major.url && (
         <motion.div 
           className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/80 text-center"
           variants={itemVariants}
         >
             <motion.a
               href={major.url}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 bg-sky-100 hover:bg-sky-200 dark:bg-sky-800/70 dark:hover:bg-sky-700/90 px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
               whileHover={{ scale: 1.05, letterSpacing: "0.2px" }}
               whileTap={{ scale: 0.98 }}
             >
               زيارة صفحة التخصص
               <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
             </motion.a>
         </motion.div>
        )}
    </motion.div>
  );
}; 