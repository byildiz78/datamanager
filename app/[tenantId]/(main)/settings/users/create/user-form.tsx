'use client';

import { useState } from "react";
import { User, Shield, Store, FileText, Save, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PersonalInfo } from "./components/personal-info";
import { SecurityInfo } from "./components/security-info";
import { BranchAccess } from "./components/branch-access";
import { Permissions } from "./components/permissions";
import { Efr_Users, UserCategory } from "@/pages/api/settings/users/types";
import { useFilterStore } from "@/stores/filters-store";

interface UserFormProps {
  onSubmit: (data: Efr_Users) => void;
  onClose: () => void;
  selectedUser?: Efr_Users;
}

export function UserForm({ onSubmit, onClose, selectedUser }: UserFormProps) {
  const { selectedFilter } = useFilterStore();
  const [formData, setFormData] = useState<Efr_Users>({
    UserName: selectedUser?.UserName || "",
    Name: selectedUser?.Name || "",
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
        <TabsList className="w-full justify-start mb-4 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl p-1.5 shadow-lg">
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
                activeTab === tab.id && "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md scale-105"
              )}
            >
              <span className={cn(
                "font-medium",
                activeTab === tab.id ? "text-white" : "text-muted-foreground"
              )}>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

          <TabsContent value="personal">
            <PersonalInfo formData={formData} setFormData={setFormData} />
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
            <div className="h-[calc(65vh-12rem)] overflow-y-auto
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
            <div className="h-[calc(65vh-12rem)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-thumb]:bg-gray-300/50
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80
            ">
              <Permissions formData={formData} setFormData={setFormData} />
            </div>
          </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 mt-auto pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-border/50 hover:bg-background/80 hover:border-border transition-all duration-200"
        >
          İptal
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
    </form>
  );
}