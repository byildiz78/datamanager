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
import { RawReportData } from "@/types/tables";

interface PermissionsProps {
  formData: Efr_Users;
  setFormData: (data: Efr_Users) => void;
  webreportMenuItems: RawReportData[];
}

export function Permissions({ formData, setFormData, webreportMenuItems }: PermissionsProps) {
  const [hiddenReports, setHiddenReports] = useState<string[]>(
    formData.HiddenReports ? formData.HiddenReports.split(",") : []
  );

  const toggleReport = (reportId: number) => {
    const reportIdString = reportId.toString();
    const newHiddenReports = hiddenReports.includes(reportIdString)
      ? hiddenReports.filter((id) => id !== reportIdString)
      : [...hiddenReports, reportIdString];

    setHiddenReports(newHiddenReports);
    setFormData({
      ...formData,
      HiddenReports: newHiddenReports.join(","),
    });
  };

  const toggleGroup = (groupId: number) => {
    const group = webreportMenuItems.find((item) => item.Group.GroupAutoID === groupId);
    if (!group) return;

    const groupReports = group.Reports.map((report) => report.ReportID.toString());
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
            {webreportMenuItems.map((group) => (
              <AccordionItem
                key={group.Group.GroupAutoID}
                value={group.Group.GroupAutoID.toString()}
                className="border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-t-lg [&[data-state=open]>div]:bg-muted/50 [&[data-state=open]]:rounded-b-none transition-all">
                  <div className="flex items-center justify-between flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{group.Group.GroupName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center gap-2 px-2 py-1 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(group.Group.GroupAutoID);
                        }}
                      >
                        {group.Reports.every((report) =>
                          hiddenReports.includes(report.ReportID.toString())
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
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-3 pt-3">
                    {group.Reports
                      .sort((a, b) => (a.DisplayOrderID || 0) - (b.DisplayOrderID || 0))
                      .map((report) => (
                        <div
                          key={report.AutoID}
                          className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        >
                          <Label
                            htmlFor={report.AutoID.toString()}
                            className="text-sm cursor-pointer"
                          >
                            {report.ReportName}
                          </Label>
                          <Switch
                            id={report.AutoID.toString()}
                            checked={!hiddenReports.includes(report.ReportID.toString())}
                            onCheckedChange={() => toggleReport(report.ReportID)}
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
