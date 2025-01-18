'use client';

import { useEffect, useState } from "react";
import { Store, FileText, Save, X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Efr_Branches } from "@/pages/api/settings/branches/types";
import { useFilterStore } from "@/stores/filters-store";
import React from "react";
import axios from "@/lib/axios";
import { Efr_Tags } from "@/pages/api/settings/efr_tag/types";
import { toast } from "@/components/ui/toast/use-toast";
import { useTabStore } from "@/stores/tab-store";
import { useBranchesStore } from "@/stores/settings/branch/branch-store";
import BranchInfo from "./components/branch-info";
import OtherFeatures from "./components/other-features";

interface BranchFormProps {
  onClose?: () => void;
  data?: Efr_Branches;
}

export default function BranchForm(props: BranchFormProps) {
  const { data } = props;
  const { selectedFilter } = useFilterStore();
  const { addBranch, updateBranch } = useBranchesStore();
  const [efr_tags, setEfr_tags] = React.useState<Efr_Tags[]>([]);
  const { removeTab, setActiveTab } = useTabStore();
  const [activeTab, setActivesTab] = useState("branch-info");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Efr_Branches>(() => {
    if (data) {
      return data;
    }
    return {
      BranchID: 0,
      BranchName: "",
      CountryName: "",
      CurrencyName: "",
      ExternalCode: "",
      LogoWarehouseCode: "",
      IsActive: true,
      TagIDs: [],
      OpeningTime: "",
      ClosingTime: "",
      BranchSquareMeter: "",
      NumberOfServicePersonnel: "",
      RevenueCenterCode: "",
      CustomField2: "",
      CustomField3: "",
      CustomField4: "",
      CustomField5: "",
      CustomField6: "",
      CustomField7: "",
      CustomField8: "",
      CustomField9: "",
      CustomField10: "",
      CustomField11: "",
      CustomField12: "",
      CustomField13: "",
      CustomField14: "",
      CustomField15: "",
      CustomField16: "",
      RegionalDirectorMail: "",
      RegionalManagerMail: "",
      InvestorMail: "",
      WebMails: "",
      Region: "",
      OrderNumber: ""
    };
  });

  const validateForm = () => {
    if (!formData.BranchName) {
      toast({
        title: "Hata!",
        description: "Şube adı boş olamaz.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== "other-features") {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActivesTab(tabs[currentIndex + 1].id);
      }
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const endpoint = data
        ? '/api/settings/branches/settings_efr_branches_update'
        : '/api/settings/branches/settings_efr_branches_create';

      const response = await (data
        ? axios.put(endpoint, formData)
        : axios.post(endpoint, formData));

      if (response.data.success) {
        if (data) {
          // API'den gelen güncel tag'leri kullan
          const updatedFormData = {
            ...formData,
            TagIDs: response.data.tags?.map((tag: any) => tag.TagID) || [] // Eğer tags boşsa boş array kullan
          };
          updateBranch(updatedFormData);
          setFormData(updatedFormData);
        } else {
          addBranch(formData);
        }

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
                Şube başarıyla {data ? 'güncellendi' : 'kaydedildi'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.BranchName} şubesi {data ? 'güncellendi' : 'oluşturuldu'}.
              </p>
            </div>
          ),
          className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          duration: 5000,
        });

        const tabId = data ? `edit-branches-${data.BranchID}` : 'new-branches-form';
        removeTab(tabId);
        setActiveTab('branches-list');
      } else {
        toast({
          title: "Hata!",
          description: response.data.message || `Şube ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Hata!",
        description: error.response?.data?.message || `Şube ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu. Lütfen tekrar deneyin.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchEfrTags();
  }, []);

  useEffect(() => {
    if (data && efr_tags?.length > 0 && data.TagTitles) {
      const tagTitlesArray = data.TagTitles.split(',').filter(tag => tag.trim() !== '');
      const foundTagIds = tagTitlesArray
        .map(tagTitle => {
          const foundTag = efr_tags.find(t => t.TagTitle === tagTitle.trim());
          return foundTag?.TagID || '';
        })
        .filter(id => id !== '');

      setFormData(prev => ({
        ...prev,
        ...data,
        TagIDs: foundTagIds
      }));
    }
  }, [data, efr_tags]);

  const fetchEfrTags = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Efr_Tags[]>('/api/settings/efr_tag/settings_efr_tag');
      setEfr_tags(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching efr tags:', error);
      setIsLoading(false);
    }
  }, []);

  const tabs = [
    {
      id: "branch-info",
      icon: Store,
      label: "Şube Bilgileri"
    },
    {
      id: "other-features",
      icon: FileText,
      label: "Diğer Özellikler"
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 md:p-2 pt-6 h-[calc(90vh-12rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {data ? 'Şube Düzenle' : 'Yeni Şube'}
          </h2>
          <p className="text-muted-foreground">
            {data ? 'Şube bilgilerini düzenleyin' : 'Yeni bir şube oluşturun'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const tabId = data ? `edit-branch-${data.BranchID}` : 'new-branch-form';
            removeTab(tabId);
            setActiveTab('branches-list');
          }}
          className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActivesTab} className="w-full flex-grow">
        <div className="flex-none mb-6">
          <div className="flex items-center gap-4">
            <TabsList className="w-[120vh] bg-gradient-to-b from-background/95 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl p-1.5 shadow-lg">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  icon={<tab.icon className={cn(
                    "w-4 h-4",
                    activeTab === tab.id ? "text-white" : "text-muted-foreground"
                  )} />}
                  className={cn(
                    "ml-2 relative flex items-center gap-2.5 px-6 py-3 transition-all duration-300 rounded-lg hover:bg-muted/50",
                    activeTab === tab.id && "bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md hover:text-white transition-all"
                  )}
                >
                  <span className={cn(
                    "font-medium",
                    activeTab === tab.id ? "text-white" : "text-muted-foreground"
                  )}>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-none flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    setActivesTab(tabs[currentIndex - 1].id);
                  }
                }}
                className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
                disabled={isSaving}
              >
                {activeTab !== "other-features" ? (
                  <>
                    İleri
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="branch-info">
          <div className="h-[calc(70vh-12rem)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80
            ">
            <BranchInfo formData={formData} setFormData={setFormData} efr_tags={efr_tags} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="other-features">
          <div className="h-[calc(70vh-12rem)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80
            ">
            <OtherFeatures formData={formData} setFormData={setFormData} />
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}