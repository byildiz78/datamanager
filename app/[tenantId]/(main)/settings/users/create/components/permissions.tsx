'use client';

import { FileText, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Efr_Users } from "@/pages/api/settings/users/types";
import { useState } from "react";

interface PermissionsProps {
  formData: Efr_Users;
  setFormData: (data: Efr_Users) => void;
}

// Örnek rapor grupları
const reportGroups = [
  {
    id: "financial",
    name: "Finansal Raporlar",
    reports: [
      { id: "income", name: "Gelir Raporu" },
      { id: "expense", name: "Gider Raporu" },
      { id: "profit", name: "Kar/Zarar Raporu" },
      { id: "balance", name: "Bilanço" },
    ],
  },
  {
    id: "operational",
    name: "Operasyonel Raporlar",
    reports: [
      { id: "daily", name: "Günlük İşlem Raporu" },
      { id: "weekly", name: "Haftalık Performans" },
      { id: "monthly", name: "Aylık Özet" },
    ],
  },
  {
    id: "customer",
    name: "Müşteri Raporları",
    reports: [
      { id: "satisfaction", name: "Memnuniyet Anketi" },
      { id: "feedback", name: "Geri Bildirimler" },
      { id: "complaints", name: "Şikayet Analizi" },
    ],
  },
  {
    id: "inventory",
    name: "Envanter Raporları",
    reports: [
      { id: "stock", name: "Stok Durumu" },
      { id: "movement", name: "Stok Hareketleri" },
      { id: "valuation", name: "Değerleme Raporu" },
    ],
  },
];

export function Permissions({ formData, setFormData }: PermissionsProps) {
  const [hiddenReports, setHiddenReports] = useState<string[]>(
    formData.HiddenReports ? formData.HiddenReports.split(",") : []
  );

  const toggleReport = (reportId: string) => {
    const newHiddenReports = hiddenReports.includes(reportId)
      ? hiddenReports.filter((id) => id !== reportId)
      : [...hiddenReports, reportId];

    setHiddenReports(newHiddenReports);
    setFormData({
      ...formData,
      HiddenReports: newHiddenReports.join(","),
    });
  };

  const toggleGroup = (groupId: string) => {
    const groupReports = reportGroups
      .find((group) => group.id === groupId)
      ?.reports.map((report) => report.id) || [];

    const allGroupReportsHidden = groupReports.every((reportId) =>
      hiddenReports.includes(reportId)
    );

    const newHiddenReports = allGroupReportsHidden
      ? hiddenReports.filter((id) => !groupReports.includes(id))
      : [...new Set([...hiddenReports, ...groupReports])];

    setHiddenReports(newHiddenReports);
    setFormData({
      ...formData,
      HiddenReports: newHiddenReports.join(","),
    });
  };

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Rapor İzinleri</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Kullanıcının görebileceği raporları seçin
            </p>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {reportGroups.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className="border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-t-lg [&[data-state=open]>div]:bg-muted/50 [&[data-state=open]]:rounded-b-none transition-all">
                  <div className="flex items-center justify-between flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-2 px-2 py-1 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(group.id);
                        }}
                      >
                        {group.reports.every((report) =>
                          hiddenReports.includes(report.id)
                        ) ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Tümünü Göster</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Tümünü Gizle</span>
                          </>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-3 pt-3">
                    {group.reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      >
                        <Label
                          htmlFor={report.id}
                          className="text-sm cursor-pointer"
                        >
                          {report.name}
                        </Label>
                        <Switch
                          id={report.id}
                          checked={!hiddenReports.includes(report.id)}
                          onCheckedChange={() => toggleReport(report.id)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
