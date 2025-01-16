'use client';

import { useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  Key,
  Shield,
  Store,
  FileText,
  AlertCircle,
  Search,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface UserFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  selectedUser?: any;
}

export function UserForm({ onSubmit, onClose, selectedUser }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: selectedUser?.name || "",
    surname: selectedUser?.surname || "",
    countryCode: "+90",
    phone: selectedUser?.phone || "",
    email: selectedUser?.email || "",
    username: selectedUser?.username || "",
    password: "",
    country: "Türkiye",
    category: "Standart",
    branchAccess: [],
    taxNumber: "",
    status: "Aktif",
    permissions: {
      canViewNotifications: false,
      canAccessEmail: false,
      canAccessLanguageEditor: false,
      canAccessBranchMessages: false,
      canAccessBranchForms: false,
      canViewAllBranches: false,
      requiresSMSVerification: false,
      canViewDashboard: false,
      canChangePassword: false,
      isTicketUser: false,
    },
    activeTab: "personal",
  });

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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-xl"
        style={{ zIndex: -1 }}
      />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start mb-8 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl p-1.5 shadow-lg">
          <TabsTrigger
            value="personal"
             className={cn(
              "relative gap-2.5 px-4 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/80 data-[state=active]:to-primary  data-[state=active]:shadow-md transition-all duration-300 rounded-lg data-[state=active]:scale-105 hover:bg-muted/50 data-[state=active]:hover:bg-none",
               formData.activeTab === "personal" && "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-md scale-105"
            )}
          >
            <div className="p-1.5 rounded-lg bg-background/10 data-[state=active]:bg-white/20" data-state={formData.activeTab === 'personal' ? 'active' : ''}>
              <User className="w-4 h-4" />
            </div>
            <span className={cn("font-medium", formData.activeTab === "personal" && "text-primary-foreground")}>Kişisel Bilgiler</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
             className={cn(
              "relative gap-2.5 px-4 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/80 data-[state=active]:to-primary  data-[state=active]:shadow-md transition-all duration-300 rounded-lg data-[state=active]:scale-105 hover:bg-muted/50 data-[state=active]:hover:bg-none",
              formData.activeTab === "security" && "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-md scale-105"
            )}
          >
            <div className="p-1.5 rounded-lg bg-background/10 data-[state=active]:bg-white/20" data-state={formData.activeTab === 'security' ? 'active' : ''}>
              <Shield className="w-4 h-4" />
            </div>
            <span className={cn("font-medium", formData.activeTab === "security" && "text-primary-foreground")}>Güvenlik</span>
          </TabsTrigger>
          <TabsTrigger
            value="branches"
             className={cn(
              "relative gap-2.5 px-4 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/80 data-[state=active]:to-primary  data-[state=active]:shadow-md transition-all duration-300 rounded-lg data-[state=active]:scale-105 hover:bg-muted/50 data-[state=active]:hover:bg-none",
              formData.activeTab === "branches" && "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-md scale-105"
            )}
          >
            <div className="p-1.5 rounded-lg bg-background/10 data-[state=active]:bg-white/20" data-state={formData.activeTab === 'branches' ? 'active' : ''}>
              <Store className="w-4 h-4" />
            </div>
            <span className={cn("font-medium", formData.activeTab === "branches" && "text-primary-foreground")}>Şube Yetkileri</span>
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className={cn(
              "relative gap-2.5 px-4 py-2.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/80 data-[state=active]:to-primary  data-[state=active]:shadow-md transition-all duration-300 rounded-lg data-[state=active]:scale-105 hover:bg-muted/50 data-[state=active]:hover:bg-none",
               formData.activeTab === "permissions" && "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-md scale-105"
            )}
          >
           <div className="p-1.5 rounded-lg bg-background/10 data-[state=active]:bg-white/20" data-state={formData.activeTab === 'permissions' ? 'active' : ''}>
              <FileText className="w-4 h-4" />
            </div>
            <span className={cn("font-medium", formData.activeTab === "permissions" && "text-primary-foreground")}>İzinler</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-lg opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent rounded-lg opacity-30" />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Adı</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Kullanıcı adı"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Soyadı</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Kullanıcı soyadı"
                        value={formData.surname}
                        onChange={(e) =>
                          setFormData({ ...formData, surname: e.target.value })
                        }
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Telefon</Label>
                    <div className="flex gap-3">
                      <div className="relative w-24">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.countryCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              countryCode: e.target.value,
                            })
                          }
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="(5XX) XXX XX XX"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">E-Posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="ornek@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Kullanıcı Adı</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Kullanıcı adı"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Vergi No</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Vergi numarası"
                        value={formData.taxNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, taxNumber: e.target.value })
                        }
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ülke</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all duration-200">
                      <SelectValue placeholder="Ülke seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Türkiye">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Türkiye
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all duration-200">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standart">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Standart
                        </div>
                      </SelectItem>
                      <SelectItem value="Premium">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Premium
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Durum</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all duration-200">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" />
                          Aktif
                        </div>
                      </SelectItem>
                      <SelectItem value="Pasif">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-500" />
                          Pasif
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-lg opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent rounded-lg opacity-30" />
            <CardContent className="pt-6 relative">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary/80" />
                    Şifre
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        checkPasswordRules(e.target.value);
                      }}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      rule: "length",
                      label: "En az 8 karakter",
                      icon: <AlertCircle className="w-4 h-4" />,
                    },
                    {
                      rule: "lowercase",
                      label: "En az 1 küçük harf",
                      icon: <Key className="w-4 h-4" />,
                    },
                    {
                      rule: "uppercase",
                      label: "En az 1 büyük harf",
                      icon: <Key className="w-4 h-4" />,
                    },
                    {
                      rule: "number",
                      label: "En az 1 rakam",
                      icon: <Key className="w-4 h-4" />,
                    },
                    {
                      rule: "symbol",
                      label: "En az 1 özel karakter",
                      icon: <Key className="w-4 h-4" />,
                    },
                  ].map(({ rule, label, icon }) => (
                    <div
                      key={rule}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg transition-all duration-300",
                        passwordRules[rule as keyof typeof passwordRules]
                          ? "text-green-500 bg-green-500/10 border border-green-500/20"
                          : "text-muted-foreground bg-muted/10 border border-border/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                            passwordRules[rule as keyof typeof passwordRules]
                              ? "bg-green-500"
                              : "bg-muted-foreground"
                          )}
                        />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-lg opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent rounded-lg opacity-30" />
            <CardContent className="pt-6 relative">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/90 rounded-lg -z-10" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Şubelerde ara..."
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20">
                  {[
                    {
                      id: "01-m1",
                      name: "01 ADANA M1",
                      location: "TÜRKİYE",
                      currency: "TL",
                    },
                    {
                      id: "01-tb",
                      name: "01 ADANA TÜRKMENBAŞI",
                      location: "TÜRKİYE",
                      currency: "TL",
                    },
                    {
                      id: "02-m",
                      name: "02 BURSA",
                      location: "TÜRKİYE",
                      currency: "TL",
                    },
                  ].map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 bg-background/40 border border-border/10 hover:border-border/20 group"
                    >
                      <Checkbox
                        id={branch.id}
                        checked={formData.branchAccess.includes(branch.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              branchAccess: [...formData.branchAccess, branch.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              branchAccess: formData.branchAccess.filter(
                                (id) => id !== branch.id
                              ),
                            });
                          }
                        }}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={branch.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <Store className="w-4 h-4 text-primary/80" />
                          {branch.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          {branch.location}
                        </p>
                      </div>
                      <div className="text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                        {branch.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-lg opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent rounded-lg opacity-30" />
            <CardContent className="pt-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 bg-background/40 border border-border/10 hover:border-border/20 group"
                  >
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            [key]: checked,
                          },
                        });
                      }}
                      className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-primary/80" />
                        {[
                          {
                            key: "canViewNotifications",
                            label: "Uyarı Bildirimlerini Görebilir",
                          },
                          {
                            key: "canAccessEmail",
                            label: "Mail Ayarlarına Erişebilir",
                          },
                          {
                            key: "canAccessLanguageEditor",
                            label: "Dil Editörüne Erişebilir",
                          },
                          {
                            key: "canAccessBranchMessages",
                            label: "Şube Mesajlarına Erişebilir",
                          },
                          {
                            key: "canAccessBranchForms",
                            label: "Şube Kontrol Formlarına Erişebilir",
                          },
                          {
                            key: "canViewAllBranches",
                            label: "Tüm Şubeleri Görebilir",
                          },
                          {
                            key: "requiresSMSVerification",
                            label: "SMS Doğrulama Gerektirir",
                          },
                          {
                            key: "canViewDashboard",
                            label: "DashBoard Verilerini Görebilir",
                          },
                          {
                            key: "canChangePassword",
                            label: "Şifre Değiştirebilir",
                          },
                          {
                            key: "isTicketUser",
                            label: "Ticket Kullanıcısı",
                          },
                        ].find((item) => item.key === key)?.label}
                      </Label>
                      <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                        {[
                          {
                            key: "canViewNotifications",
                            description:
                              "Kullanıcı sistem bildirimlerini görüntüleyebilir",
                          },
                          {
                            key: "canAccessEmail",
                            description: "Kullanıcı e-posta ayarlarına erişebilir",
                          },
                          {
                            key: "canAccessLanguageEditor",
                            description: "Kullanıcı dil editörünü kullanabilir",
                          },
                          {
                            key: "canAccessBranchMessages",
                            description: "Kullanıcı şube mesajlarına erişebilir",
                          },
                          {
                            key: "canAccessBranchForms",
                            description:
                              "Kullanıcı şube kontrol formlarına erişebilir",
                          },
                          {
                            key: "canViewAllBranches",
                            description:
                              "Kullanıcı tüm şubeleri görüntüleyebilir",
                          },
                          {
                            key: "requiresSMSVerification",
                            description:
                              "Kullanıcı girişi için SMS doğrulaması gerekir",
                          },
                          {
                            key: "canViewDashboard",
                            description:
                              "Kullanıcı dashboard verilerini görüntüleyebilir",
                          },
                          {
                            key: "canChangePassword",
                            description: "Kullanıcı şifresini değiştirebilir",
                          },
                          {
                            key: "isTicketUser",
                            description: "Kullanıcı ticket sistemini kullanabilir",
                          },
                        ].find((item) => item.key === key)?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 mt-8">
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
          className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {selectedUser ? "Güncelle" : "Kaydet"}
          </span>
        </Button>
      </div>
    </form>
  );
}