import React from 'react';
import { useInterest } from '@/contexts/InterestContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const SavedInterests: React.FC = () => {
  const { likedMajors } = useInterest();

  if (likedMajors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              اهتماماتك المحفوظة
            </CardTitle>
            <Badge variant="secondary" className="ml-2 bg-rose-100 text-rose-700">
              {likedMajors.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {likedMajors.map((major) => (
              <motion.div
                key={major.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {major.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {major.university_name || major.university}
                  </p>
                </div>
                <a
                  href={major.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="sr-only">عرض التفاصيل</span>
                </a>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 