import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Major } from '@/contexts/InterestContext'; // Reverted path
import { Badge } from "@/components/ui/badge"; // Reverted path
import { ExternalLink, Info, BookOpen, TrendingUp, Percent, Sparkles, Star } from 'lucide-react'; // Added icons
import { cn } from "@/lib/utils"; // Reverted path


interface MajorCardProps {
  major: Major; // Ensure Major type includes optional description: string;
  actionFeedback?: 'liked' | 'passed' | null; // New prop for swipe feedback
  // No onExit needed here, parent SwipeDeck handles dismissal
}

// Enhanced university logos mapping
const universityLogos: { [key: string]: string } = {
  aaup: '/assets/logos/aaup.png', // Updated path
  birzeit: '/assets/logos/beirzet.png',
  ppu: '/assets/logos/polytech.png',
  'an-najah': '/assets/logos/najah.png', // Use consistent key format if needed
  najah: '/assets/logos/najah.png', // Alias if data uses 'najah'
  bethlehem: '/assets/logos/bethlahem.png',
  alquds: '/assets/logos/alquds.png',
  // Add other universities as needed
  default: '/assets/logos/logo.png' // Default/fallback logo
};

export const MajorCard: React.FC<MajorCardProps> = ({ major, actionFeedback }) => {

  // Use lowercase and handle potential variations
  const uniKey = major.university?.toLowerCase() || 'default';
  const logoSrc = universityLogos[uniKey] || universityLogos.default; // Use defined default

  // Enhanced formatting functions
  const formatFee = (fee: number | string | null | undefined): string => {
    if (fee === null || fee === undefined || fee === '') return 'غير محدد';
    if (typeof fee === 'string' && (fee.includes('دينار') || fee.includes('دولار'))) {
        return fee;
    }
    const numericFee = Number(fee);
    if (isNaN(numericFee)) return String(fee);
    return `${numericFee.toLocaleString()} شيكل`;
  };

   // Helper to format min average
   const formatAvg = (avg: number | string | null | undefined): string => {
    if (avg === null || avg === undefined || avg === '') return 'غير محدد';
    if (String(avg).toLowerCase() === 'ناجح' || avg === 0) return 'ناجح'; // Handle the "ناجح" case
    const numericAvg = Number(avg);
     if (isNaN(numericAvg)) return String(avg); // Return original string if not parseable
    return `${numericAvg.toFixed(1)}%`;
  };

  // Enhanced branch rendering with better design
  const renderBranches = (branches: string[] | undefined) => {
    if (!branches || branches.length === 0) {
      return (
        <div className="flex items-center justify-center py-4">
          <span className="text-gray-500 text-sm italic">جميع الفروع مقبولة</span>
        </div>
      );
    }
    
    const displayBranches = branches.map(b => b.replace(/^(الفرع|فرع)\s*/, '').trim());
    return (
      <div className="grid grid-cols-2 gap-2">
        {displayBranches.map((branch, index) => (
          <motion.div
            key={branch}
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Badge 
              variant="outline" 
              className="w-full justify-center text-xs px-3 py-1.5 
                         bg-gradient-to-r from-indigo-50 to-purple-50 
                         hover:from-indigo-100 hover:to-purple-100 
                         text-indigo-700 border-indigo-300 font-medium 
                         transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {branch}
            </Badge>
          </motion.div>
        ))}
      </div>
    );
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const floatingElements = [...Array(4)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-primary-300/10 rounded-full"
      style={{
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
      }}
      animate={{
        y: [-5, 5],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeInOut"
      }}
    />
  ));

  return (
    <motion.div
      className={cn(
        "relative w-full h-full rounded-3xl overflow-hidden shadow-2xl",
        "transition-all duration-500 ease-out border-2",
        // Improved background colors without black gradient
        {
          'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400': actionFeedback === 'liked',
          'bg-gradient-to-br from-rose-500 to-pink-600 border-rose-400': actionFeedback === 'passed',
          'bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 border-primary-200': !actionFeedback
        }
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ willChange: 'transform' }}
    >
      {/* Simplified glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 
                      backdrop-blur-sm rounded-3xl" />
      
      {/* Reduced floating background elements for better performance */}
      {!actionFeedback && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {floatingElements}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-200/10 to-transparent rounded-full" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent-200/10 to-transparent rounded-full" />
        </div>
      )}

      {/* Content container */}
      <div className="relative h-full flex flex-col p-6 z-10">
        
        {/* Enhanced header section */}
        <motion.div 
          className="text-center mb-6 relative"
          variants={itemVariants}
        >
          {/* Decorative top bar */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 
                          bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
          
          {/* University logo and info */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div 
              className="w-12 h-12 rounded-2xl overflow-hidden bg-white/90 p-2 shadow-lg
                         border border-primary-200/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <img 
                src={logoSrc} 
                alt={`${major.university_name || major.university} logo`}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-700 font-medium">
                {major.university_name || major.university}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-primary-500 fill-current" />
                <span className="text-xs text-gray-600">جامعة معتمدة</span>
              </div>
            </div>
          </div>

          {/* Major title */}
          <motion.h3 
            className={cn(
              "text-2xl font-bold leading-tight mb-3",
              actionFeedback ? "text-white" : "text-gray-800"
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
          >
            {major.title}
          </motion.h3>

          {/* Animated divider */}
          <motion.div
            className={cn(
              "h-1 rounded-full mx-auto transition-all duration-500",
              actionFeedback 
                ? "bg-white/50" 
                : "bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"
            )}
            initial={{ width: "20%" }}
            animate={{ width: "50%" }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        {/* Enhanced stats grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          variants={itemVariants}
        >
          {/* Fee card */}
          <motion.div 
            className={cn(
              "relative p-4 rounded-2xl border transition-all duration-300 shadow-sm",
              actionFeedback 
                ? "bg-white/20 border-white/30" 
                : "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 hover:shadow-md"
            )}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="text-center">
              <BookOpen className={cn(
                "w-6 h-6 mx-auto mb-2",
                actionFeedback ? "text-white" : "text-primary-600"
              )} />
              <span className={cn(
                "block text-xs font-medium mb-1",
                actionFeedback ? "text-white/80" : "text-gray-600"
              )}>
                رسوم الساعة
              </span>
              <span className={cn(
                "block text-lg font-bold",
                actionFeedback ? "text-white" : "text-gray-800"
              )}>
                {formatFee(major.parsed_fee)}
              </span>
            </div>
          </motion.div>

          {/* Average card */}
          <motion.div 
            className={cn(
              "relative p-4 rounded-2xl border transition-all duration-300 shadow-sm",
              actionFeedback 
                ? "bg-white/20 border-white/30" 
                : "bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200 hover:shadow-md"
            )}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="text-center">
              <Percent className={cn(
                "w-6 h-6 mx-auto mb-2",
                actionFeedback ? "text-white" : "text-accent-600"
              )} />
              <span className={cn(
                "block text-xs font-medium mb-1",
                actionFeedback ? "text-white/80" : "text-gray-600"
              )}>
                أقل معدل
              </span>
              <span className={cn(
                "block text-lg font-bold",
                actionFeedback ? "text-white" : "text-gray-800"
              )}>
                {formatAvg(major.parsed_min_avg)}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced branches section */}
        {major.parsed_branches && major.parsed_branches.length > 0 && (
          <motion.div 
            className={cn(
              "mb-6 p-4 rounded-2xl border transition-all duration-300 shadow-sm",
              actionFeedback 
                ? "bg-white/20 border-white/30" 
                : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
            )}
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className={cn(
                "w-5 h-5",
                actionFeedback ? "text-white" : "text-indigo-600"
              )} />
              <span className={cn(
                "text-sm font-semibold",
                actionFeedback ? "text-white" : "text-gray-700"
              )}>
                الفروع المقبولة
              </span>
            </div>
            {renderBranches(major.parsed_branches)}
          </motion.div>
        )}

        {/* Enhanced description section */}
        {major.description && (
          <motion.div 
            className="flex-grow mb-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className={cn(
                "w-5 h-5",
                actionFeedback ? "text-white" : "text-primary-600"
              )} />
              <span className={cn(
                "text-sm font-semibold",
                actionFeedback ? "text-white" : "text-gray-700"
              )}>
                نبذة عن التخصص
              </span>
            </div>
            
            <motion.div 
              className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed border shadow-sm",
                actionFeedback 
                  ? "bg-white/20 border-white/30 text-white/90" 
                  : "bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-700"
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1,
                height: "auto",
                transition: { duration: 0.4, ease: "easeOut" } 
              }}
            >
              <p className="text-justify line-clamp-4">
                {major.description}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced details link */}
        {major.url && (
          <motion.div 
            className="mt-auto pt-4 border-t border-opacity-20"
            style={{ 
              borderColor: actionFeedback ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' 
            }}
            variants={itemVariants}
          >
            <motion.a
              href={major.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl",
                "text-sm font-medium transition-all duration-300 shadow-lg",
                actionFeedback 
                  ? "bg-white/20 hover:bg-white/30 text-white border border-white/30" 
                  : "bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>تفاصيل أكثر</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </motion.div>
        )}

        {/* Simplified action feedback overlay */}
        <AnimatePresence>
          {actionFeedback && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20
                         bg-black/10 backdrop-blur-sm rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {actionFeedback === 'liked' ? (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <span className="text-white text-lg font-bold">ممتاز!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <TrendingUp className="w-8 h-8 text-white" />
                    </motion.div>
                    <span className="text-white text-lg font-bold">التالي</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 