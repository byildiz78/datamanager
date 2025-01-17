'use client';

import { useEffect, useState } from "react";
import { User, Shield, Store, FileText, Save, X, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PersonalInfo } from "./components/personal-info";
import { SecurityInfo } from "./components/security-info";
import { BranchAccess } from "./components/branch-access";
import { Permissions } from "./components/permissions";
import { Efr_Users, UserCategory } from "@/pages/api/settings/users/types";
import { useFilterStore } from "@/stores/filters-store";
import React from "react";
import axios from "@/lib/axios";
import { RawReportData } from "@/types/tables";
import { Efr_Tags } from "@/pages/api/settings/efr_tag/types";

interface UserFormProps {
  onSubmit: (data: Efr_Users) => void;
  onClose: () => void;
  selectedUser?: Efr_Users;
}

export function UserForm({ onSubmit, onClose, selectedUser }: UserFormProps) {
  const { selectedFilter } = useFilterStore();
  const [webreportMenuItems, setWebreportMenuItems] = React.useState<RawReportData[]>([]);
  const [efr_tags, setEfr_tags] = React.useState<Efr_Tags[]>([]);

  const [formData, setFormData] = useState<Efr_Users>({
    UserName: selectedUser?.UserName || "",
    Name: selectedUser?.Name || "",
    SurName: selectedUser?.SurName || "",
    PhoneCode: selectedUser?.PhoneCode || "+90",
    PhoneNumber: selectedUser?.PhoneNumber || "",
    EMail: selectedUser?.EMail || "",
    EncryptedPass: "",
    DefaultCountry: selectedUser?.DefaultCountry || "Türkiye",
    Category: selectedUser?.Category || UserCategory.Standart,
    UserBranchs: selectedUser?.UserBranchs || "",
    TaxNo: selectedUser?.TaxNo || "",
    IsActive: selectedUser?.IsActive ?? true,
    DisableNotification: selectedUser?.DisableNotification || false,
    DisableMailSettings: selectedUser?.DisableMailSettings || false,
    DisableLangaugeEditor: selectedUser?.DisableLangaugeEditor || false,
    DisableBranchMessage: selectedUser?.DisableBranchMessage || false,
    DisableBranchControlForm: selectedUser?.DisableBranchControlForm || false,
    DisableDashboardReport: selectedUser?.DisableDashboardReport || false,
    SmsRequired: selectedUser?.SmsRequired || false,
    PwdCantChange: selectedUser?.PwdCantChange || false,
    TicketUser: selectedUser?.TicketUser || false,
    ExpoToken: "",
    ExpoTokenUpdatedDate: new Date(),
  });

  const [activeTab, setActiveTab] = useState("personal");

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    symbol: false,
  });

  const checkPasswordRules = (password: string) => {
    setPasswordRules({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== "permissions") {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
      return;
    }
    onSubmit(formData);
  };

  useEffect(() => {
    fetchReportMenuItems();
    fetchEfrTags();
  }, []);

  const fetchReportMenuItems = React.useCallback(async () => {
    try {
      const response = await axios.get<RawReportData[]>('/api/webreportlist');
      setWebreportMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching report list items:', error);
    }
  }, []);

  const fetchEfrTags = React.useCallback(async () => {
    try {
      const response = await axios.get<Efr_Tags[]>('/api/settings/efr_tag/settings_efr_tag');
      setEfr_tags(response.data);
    } catch (error) {
      console.error('Error fetching efr tags:', error);
    }
  }, []);

  const tabs = [
    {
      id: "personal",
      icon: User,
      label: "Kişisel Bilgiler"
    },
    {
      id: "security",
      icon: Shield,
      label: "Güvenlik"
    },
    {
      id: "branches",
      icon: Store,
      label: "Şube Yetkileri"
    },
    {
      id: "permissions",
      icon: FileText,
      label: "İzinler"
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-[calc(90vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Yeni Kullanıcı</h2>
          <p className="text-muted-foreground">
            Yeni bir sistem kullanıcısı oluşturun
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow">
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
                      setActiveTab(tabs[currentIndex - 1].id);
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
              >
                {activeTab !== "permissions" ? (
                  <>
                    İleri
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="personal">
            <PersonalInfo formData={formData} setFormData={setFormData} efr_tags={efr_tags} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityInfo
            formData={formData}
            setFormData={setFormData}
            passwordRules={passwordRules}
            checkPasswordRules={checkPasswordRules}
          />
        </TabsContent>

        <TabsContent value="branches">
          <div className="h-[calc(70vh-12rem)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80
            ">
            <BranchAccess
              formData={formData}
              setFormData={setFormData}
              selectedFilter={selectedFilter}
            />
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <div className="h-[calc(70vh-12rem)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80
            ">
            <Permissions
              formData={formData}
              setFormData={setFormData}
              webreportMenuItems={webreportMenuItems}
            />
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}