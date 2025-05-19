import React from 'react';
import { useInterest, Major } from '@/contexts/InterestContext';
import {
    Sheet, SheetContent, SheetHeader,
    SheetTitle, SheetTrigger, SheetFooter, SheetDescription
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, ExternalLink } from 'lucide-react';

// Helper to format fee (can be shared or duplicated)
const formatFee = (fee: number | null | undefined): string => {
    if (fee === null || fee === undefined) return 'غير معروف';
    return `${fee} شيكل`; // Assuming شيكل
};

export const InterestDrawer: React.FC = () => {
    const { likedMajors, removeMajor } = useInterest();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-6 right-6 rounded-full shadow-lg w-12 h-12 bg-white hover:bg-gray-50 z-40 border-gray-300"
                >
                    <Heart className="w-5 h-5 text-rose-500" />
                    {likedMajors.length > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full">
                            {likedMajors.length}
                        </Badge>
                    )}
                    <span className="sr-only">الاهتمامات المحفوظة</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[350px] sm:w-[450px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>💖 اهتماماتي</SheetTitle>
                    <SheetDescription>
                        قائمة التخصصات يلي عجبتك. بتقدر ترجع تشوف تفاصيلها أو تحذفها.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {likedMajors.length === 0 ? (
                        <p className="text-center text-gray-500 pt-10">ما في إشي لسا. جرب اعمل لايك لبعض التخصصات! 👍</p>
                    ) : (
                        likedMajors.map((major: Major) => (
                            <Card key={major.id} className="overflow-hidden">
                                <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base leading-tight">{major.title}</CardTitle>
                                        <CardDescription className="text-xs text-gray-500">
                                            {major.university.toUpperCase()} - رسوم الساعة: {formatFee(typeof major.parsed_fee === 'string' ? parseFloat(major.parsed_fee) : major.parsed_fee)}
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0" onClick={() => removeMajor(major.id)}>
                                        <Trash2 className="w-4 h-4" />
                                        <span className="sr-only">إزالة</span>
                                    </Button>
                                </CardHeader>
                                {/* Optionally add more details or just a link in content/footer */}
                                 <CardContent className="p-4 pt-0">
                                     <a
                                        href={major.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            عرض التفاصيل
                                            <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                 </CardContent>
                            </Card>
                        ))
                    )}
                </div>
                 <SheetFooter className="mt-auto pt-4 border-t">
                     <p className="text-xs text-gray-500 text-center">
                         {likedMajors.length} {likedMajors.length === 1 ? 'تخصص محفوظ' : likedMajors.length === 2 ? 'تخصصين محفوظين' : 'تخصصات محفوظة'}
                     </p>
                 </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}; 