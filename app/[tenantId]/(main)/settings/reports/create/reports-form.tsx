'use client';

import { useEffect, useState } from "react";
import { Save, X, RefreshCcw, FileText, BarChart3, Folder, Shield, Smartphone, Laptop, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/toast/use-toast";
import { useTabStore } from "@/stores/tab-store";
import { useReportsStore } from "@/stores/settings/reports/reports-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { WebReport } from "@/pages/api/settings/reports/types";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportFormProps {
  onClose?: () => void;
  data?: any;
}

export default function ReportForm(props: ReportFormProps) {
  const { data } = props;
  const { removeTab, setActiveTab } = useTabStore();
  const { addReport, updateReport } = useReportsStore();
  const [groups, setGroups] = useState<any[]>([]);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<WebReport>(() => {
    if (data) {
      return {
        ...data,
        ShowDesktop: data.ShowDesktop === true ? 1 : data.ShowDesktop === false ? 0 : data.ShowDesktop,
        ShowMobile: data.ShowMobile === true ? 1 : data.ShowMobile === false ? 0 : data.ShowMobile,
      };
    }

    return {
      AutoID: "",
      ReportID: "",
      GroupID: "",
      GroupName: "",
      ReportName: "",
      ReportType: "",
      ShowDesktop: 0,
      ShowMobile: 0,
      DisplayOrderID: "",
      SecurityLevel: "",
      ReportQuery: "",
      ReportIcon: "",
      QueryDayLimit: 0,
    }
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const generateRandomId = () => {
    const uuid = uuidv4();
    const numericId = parseInt(uuid.replace(/-/g, '').substring(0, 8), 16);
    const finalId = numericId % 1000000000;
    setFormData(prev => ({ ...prev, ReportID: finalId }));
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/settings/reports/settings_web_report_group');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Hata!",
        description: "Gruplar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const endpoint = data
        ? '/api/settings/reports/settings_web_reports_update'
        : '/api/settings/reports/settings_web_reports_create';

      const response = await (data
        ? axios.put(endpoint, formData)
        : axios.post(endpoint, formData));

      if (response.data.success) {

        const userData = {
          ...formData,
          AutoID: data ? formData.AutoID : response.data.autoId // Yeni kayıt için API'den gelen AutoID'yi kullan
        };

        // Store güncelleme
        if (data) {
          updateReport(userData);
        } else {
          addReport(userData);
        }

        // Başarı mesajı
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-emerald-500">Başarılı!</span>
            </div>
          ),
          description: (
            <div className="ml-6">
              <p className="text-gray-600 dark:text-gray-300">
                Rapor başarıyla {data ? 'güncellendi' : 'kaydedildi'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {data?.ReportName} raporu {data ? 'güncellendi' : 'oluşturuldu'}.
              </p>
            </div>
          ),
          className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          duration: 5000,
        });

        // Tab kapatma
        const tabId = data ? `edit-reports-${data.ReportID}` : 'new-reports-form';
        removeTab(tabId);
        setActiveTab('reports-list');

      } else {
        toast({
          title: "Hata!",
          description: response.data?.message || `Rapor ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Hata!",
        description: `Rapor ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(90vh-6rem)] overflow-y-auto">
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {data ? 'Rapor Düzenle' : 'Yeni Rapor'}
          </h2>
          <p className="text-muted-foreground">
            {data ? 'Rapor bilgilerini düzenleyin' : 'Yeni bir rapor oluşturun'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const tabId = data ? `edit-reports-${data.ReportID}` : 'new-reports-form';
            removeTab(tabId);
            setActiveTab('reports-list');
          }}
          className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Rapor ID
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.ReportID}
                  onChange={(e) => setFormData({ ...formData, ReportID: parseInt(e.target.value) || 0 })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateRandomId}
                  className="flex-none"
                  title="Rastgele ID Oluştur"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4" />
                Sıra
              </label>
              <Input
                type="number"
                value={formData.DisplayOrderID}
                onChange={(e) => setFormData({ ...formData, DisplayOrderID: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="col-span-3">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Rapor Adı
              </label>
              <Input
                value={formData.ReportName || ''}
                onChange={(e) => setFormData({ ...formData, ReportName: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Folder className="w-4 h-4" />
                Grup
              </label>
              <Select
                value={formData.GroupID?.toString()}
                onValueChange={(value) => {
                  const selectedGroup = groups.find(g => String(g.GroupAutoID) === value);
                  if (selectedGroup) {
                    setFormData(prev => ({
                      ...prev,
                      GroupID: Number(selectedGroup.GroupAutoID),
                      GroupName: selectedGroup.GroupName
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {formData.GroupName || "Grup Seçiniz"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.GroupAutoID} value={String(group.GroupAutoID)}>
                      {group.GroupName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4" />
                Rapor Tipi
              </label>
              <Select
                value={formData.ReportType?.toString()}
                onValueChange={(value) => setFormData({ ...formData, ReportType: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rapor Tipi Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="1">Tasarım</SelectItem> */}
                  <SelectItem value="2">Liste</SelectItem>
                  {/* <SelectItem value="4">Pivot</SelectItem>
                  <SelectItem value="5">Özel Sayfa</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Sorgu Gün Sınırı
              </label>
              <Input
                type="number"
                min="0"
                value={formData.QueryDayLimit}
                onChange={(e) => setFormData({ ...formData, QueryDayLimit: parseInt(e.target.value) || 0 })}
                placeholder="0 = Sınırsız"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                Güvenlik Seviyesi
              </label>
              <Input
                type="number"
                value={formData.SecurityLevel}
                onChange={(e) => setFormData({ ...formData, SecurityLevel: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="col-span-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="showMobile"
                  checked={formData.ShowMobile === 1 || formData.ShowMobile === true}
                  onCheckedChange={(checked) => setFormData({ ...formData, ShowMobile: checked ? 1 : 0 })}
                />
                <label htmlFor="showMobile" className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobilde Göster
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="showDesktop"
                  checked={formData.ShowDesktop === 1 || formData.ShowDesktop === true}
                  onCheckedChange={(checked) => setFormData({ ...formData, ShowDesktop: checked ? 1 : 0 })}
                />
                <label htmlFor="showDesktop" className="text-sm font-medium flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  Masaüstünde Göster
                </label>
              </div>
            </div>

            <div className="col-span-12">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </>
                )}
              </Button>
            </div>

            <div className="col-span-12">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                SQL Sorgusu
              </label>
              <div className="border rounded-md overflow-hidden">
                <CodeMirror
                  value={formData.ReportQuery || ''}
                  height="380px"
                  theme={vscodeDark}
                  extensions={[sql()]}
                  onChange={value => setFormData(prev => ({ ...prev, ReportQuery: value }))}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightSpecialChars: true,
                    history: true,
                    foldGutter: true,
                    drawSelection: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    syntaxHighlighting: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    crosshairCursor: true,
                    highlightActiveLine: true,
                    highlightSelectionMatches: true,
                    closeBracketsKeymap: true,
                    defaultKeymap: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                    lintKeymap: true,
                  }}
                  className="min-h-[380px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
    </ScrollArea>
  );
}