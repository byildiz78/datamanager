import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/toast/use-toast";
import axios from "@/lib/axios";
import { encrypt } from "@/utils/encryption";

interface QueryCheckButtonProps {
    query: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export function QueryCheckButton({ query, onSuccess, onError }: QueryCheckButtonProps) {
    const [isChecking, setIsChecking] = useState(false);

    const handleCheck = async () => {
        if (!query?.trim()) {
            toast({
                title: "Hata!",
                description: "Lütfen bir SQL sorgusu girin.",
                variant: "destructive",
            });
            return;
        }
        setIsChecking(true);
        try {
            const encryptedQuery = encrypt(query);
            const response = await axios.post('/api/settings/reports/settings_check_report', {
                reportQuery: encryptedQuery
            });
            if (response.data.success) {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="font-semibold text-emerald-500">Başarılı!</span>
                        </div>
                    ),
                    description: "Rapor sorgusu başarıyla çalıştırıldı.",
                    className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
                });
                onSuccess?.();
            }
        } catch (error: any) {
            console.error('Error details:', error);
            toast({
                title: "Hata!",
                description: error.response?.data?.details || "Sorgu çalıştırılırken bir hata oluştu.",
                variant: "destructive",
            });
            onError?.(error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCheck}
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white hover:text-white border-orange-500 hover:border-orange-600 transition-colors w-[160px]"
            disabled={isChecking}
        >
            {isChecking ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Kontrol Ediliyor...
                </>
            ) : (
                <>
                    <ShieldCheck className="w-4 h-4" />
                    Sorguyu Kontrol Et
                </>
            )}
        </Button>
    );
}
