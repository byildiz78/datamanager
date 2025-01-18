'use client';

import { useEffect, useState } from "react";
import { User, Shield, Store, FileText, Save, X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
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
import { toast } from "@/components/ui/toast/use-toast";
import { useRouter } from "next/navigation";
import { encrypt } from "@/pages/api/auth/login";
import { useTabStore } from "@/stores/tab-store";
import { useUsersStore } from "@/stores/settings/users/users-store";
import { categoryToNumber, numberToCategory } from "./lib";

interface UserFormProps {
  onClose?: () => void;
  data?: Efr_Users;
}

export default function UserForm(props: UserFormProps) {
  const { data } = props;
  const { selectedFilter } = useFilterStore();
  const { addUser, updateUser } = useUsersStore();
  const [webreportMenuItems, setWebreportMenuItems] = React.useState<RawReportData[]>([]);
  const [efr_tags, setEfr_tags] = React.useState<Efr_Tags[]>([]);
  const { removeTab, setActiveTab } = useTabStore();
  const [activeTab, setActivesTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Efr_Users>(() => {
    if (data) {
      const nameParts = data.Name ? data.Name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      let categoryValue: number;
      if (typeof data.Category === 'string') {
        categoryValue = categoryToNumber[data.Category] || 1;
      } else if (typeof data.Category === 'number') {
        categoryValue = data.Category;
      } else {
        categoryValue = 1;
      }

      const initialData = {
        ...data,
        Name: firstName,
        SurName: lastName,
        Category: categoryValue,
        EncryptedPass: ""
      };
      return initialData;
    }

    return {
      UserName: "",
      Name: "",
      SurName: "",
      PhoneCode: "+90",
      PhoneNumber: "",
      EMail: "",
      EncryptedPass: "",
      DefaultCountry: "Türkiye",
      Category: 1,
      UserBranchs: "",
      TaxNo: "",
      IsActive: true,
      DisableNotification: false,
      DisableMailSettings: false,
      DisableLangaugeEditor: false,
      DisableBranchMessage: false,
      DisableBranchControlForm: false,
      DisableDashboardReport: false,
      SmsRequired: false,
      PwdCantChange: false,
      TicketUser: false,
      ExpoToken: "",
      ExpoTokenUpdatedDate: new Date(),
    };
  });

  // data prop'u değiştiğinde formData'yı güncelle
  React.useEffect(() => {
    if (data) {
      const nameParts = data.Name ? data.Name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Kategori dönüşümü
      let categoryValue: number;
      if (typeof data.Category === 'string') {
        categoryValue = categoryToNumber[data.Category] || 1;
      } else if (typeof data.Category === 'number') {
        categoryValue = data.Category;
      } else {
        categoryValue = 1;
      }
      setFormData(prev => ({
        ...prev,
        ...data,
        Name: firstName,
        SurName: lastName,
        Category: categoryValue,
        EncryptedPass: ""
      }));
    }
  }, [data]);

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

  const validateForm = () => {
    if (!formData.UserName) {
      toast({
        title: "Hata!",
        description: "Kullanıcı adı boş olamaz.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.Name) {
      toast({
        title: "Hata!",
        description: "İsim boş olamaz.",
        variant: "destructive",
      });
      return false;
    }

    // Şifre kontrolü sadece yeni kullanıcı için
    if (!data && !formData.EncryptedPass) {
      toast({
        title: "Hata!",
        description: "Şifre alanı boş olamaz.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.EMail) {
      toast({
        title: "Hata!",
        description: "E-posta adresi boş olamaz.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== "permissions") {
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
      const dataToSend = {
        ...formData,
        Category: formData.Category
      };

      if (!data) {
        // Yeni kullanıcı oluşturma
        const encryptedPass = encrypt(formData.EncryptedPass || '');
        if (!encryptedPass) {
          toast({
            title: "Hata!",
            description: "Şifre alanı boş olamaz.",
            variant: "destructive",
          });
          return;
        }
        dataToSend.UserPWD = encryptedPass?.toString();
        dataToSend.EncryptedPass = encryptedPass?.toString();
      } else {
        // Mevcut kullanıcı
        if (formData.EncryptedPass) {
          // Şifre girilmişse güncelle
          const encryptedPass = encrypt(formData.EncryptedPass);
          dataToSend.UserPWD = encryptedPass?.toString();
          dataToSend.EncryptedPass = encryptedPass?.toString();
        } else {
          // Şifre girilmemişse mevcut şifreleri koru
          dataToSend.UserPWD = data.UserPWD;
          dataToSend.EncryptedPass = data.EncryptedPass;
        }
      }
      // API endpoint ve method seçimi
      const endpoint = data
        ? '/api/settings/users/settings_efr_users_update'
        : '/api/settings/users/settings_efr_users_create';

      const response = await (data
        ? axios.put(endpoint, dataToSend)
        : axios.post(endpoint, dataToSend));

      if (response.data.success) {
        // Category mapping
        const categoryMap: { [key: number]: string } = {
          1: 'Standart',
          2: 'Çoklu Şube',
          3: 'Bölge Sorumlusu',
          4: 'Yönetici',
          5: 'Süper Admin',
          6: 'Op. Sorumlusu',
          7: 'Müşteri Hizmetleri',
          8: 'İnsan Kaynakları',
          9: 'İş Geliştirme',
          10: 'IT',
          11: 'Pazarlama',
          12: 'Şube'
        };

        const userData = {
          ...dataToSend,
          UserID: data ? formData.UserID : response.data.userId,
          Category: categoryMap[dataToSend.Category as number] || 'Bilinmiyor',
          Name: `${dataToSend.Name} ${dataToSend.SurName}`
        };

        // Store güncelleme
        if (data) {
          updateUser(userData);
        } else {
          addUser(userData);
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
                Kullanıcı başarıyla {data ? 'güncellendi' : 'kaydedildi'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.UserName} kullanıcısı {data ? 'güncellendi' : 'oluşturuldu'}.
              </p>
            </div>
          ),
          className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          duration: 5000,
        });

        // Tab kapatma
        const tabId = data ? `edit-user-${data.UserID}` : 'new-user-form';
        removeTab(tabId);
        setActiveTab('users-list');

      } else {
        toast({
          title: "Hata!",
          description: response.data.message || `Kullanıcı ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Hata!",
        description: `Kullanıcı ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu. Lütfen tekrar deneyin.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
      label: "Rapor İzinleri"
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 md:p-2 pt-6 h-[calc(90vh-12rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {data ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
          </h2>
          <p className="text-muted-foreground">
            {data ? 'Kullanıcı bilgilerini düzenleyin' : 'Yeni bir sistem kullanıcısı oluşturun'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const tabId = data ? `edit-user-${data.UserID}` : 'new-user-form';
            removeTab(tabId);
            setActiveTab('users-list');
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
                disabled={activeTab === "permissions" && isSaving}
              >
                {activeTab !== "permissions" ? (
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