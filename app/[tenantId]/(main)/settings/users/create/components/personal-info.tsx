'use client';

import { User, Building2, Mail, Phone, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Efr_Users, UserCategory } from "@/pages/api/settings/users/types";
import { Efr_Tags } from "@/pages/api/settings/efr_tag/types";

interface PersonalInfoProps {
  formData: Efr_Users;
  setFormData: (data: Efr_Users) => void;
  efr_tags: Efr_Tags[];
}

export function PersonalInfo({ formData, setFormData, efr_tags }: PersonalInfoProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ad</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ad"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Soyad</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Soyad"
                  value={formData.SurName}
                  onChange={(e) =>
                    setFormData({ ...formData, SurName: e.target.value })
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
                    value={formData.PhoneCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        PhoneCode: e.target.value,
                      })
                    }
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="(5XX) XXX XX XX"
                    value={formData.PhoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, PhoneNumber: e.target.value })
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
                  value={formData.EMail}
                  onChange={(e) =>
                    setFormData({ ...formData, EMail: e.target.value })
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
                  value={formData.UserName}
                  onChange={(e) =>
                    setFormData({ ...formData, UserName: e.target.value })
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
                  value={formData.TaxNo}
                  onChange={(e) =>
                    setFormData({ ...formData, TaxNo: e.target.value })
                  }
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ülke</Label>
            <Select
              value={formData.DefaultCountry}
              onValueChange={(value) =>
                setFormData({ ...formData, DefaultCountry: value })
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
            <Label className="text-sm font-medium">Etiket</Label>
            <Select
              value={formData.TagID?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, TagID: parseInt(value) })
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all duration-200">
                <SelectValue placeholder="Etiket seçin" />
              </SelectTrigger>
              <SelectContent>
                {efr_tags.map((tag) => (
                  <SelectItem key={tag.TagID} value={tag.TagID.toString()}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${tag.IsDefault ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />
                      {tag.TagTitle}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Kategori</Label>
            <Select
              defaultValue="1"
              value={formData.Category ? formData.Category.toString() : "1"}
              onValueChange={(value) => {
                console.log('Selected category:', { 
                  currentValue: formData.Category,
                  newValue: value,
                  numberValue: Number(value),
                  formData: formData
                });
                setFormData(prev => ({
                  ...prev,
                  Category: Number(value)
                }));
              }}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all duration-200">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Standart
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Çoklu Şube
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Bölge Sorumlusu
                  </div>
                </SelectItem>
                <SelectItem value="4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Yönetici
                  </div>
                </SelectItem>
                <SelectItem value="5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Süper Admin
                  </div>
                </SelectItem>
                <SelectItem value="6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Op. Sorumlusu
                  </div>
                </SelectItem>
                <SelectItem value="7">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Müşteri Hizmetleri
                  </div>
                </SelectItem>
                <SelectItem value="8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    İnsan Kaynakları
                  </div>
                </SelectItem>
                <SelectItem value="9">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    İş Geliştirme
                  </div>
                </SelectItem>
                <SelectItem value="10">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    IT
                  </div>
                </SelectItem>
                <SelectItem value="11">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Pazarlama
                  </div>
                </SelectItem>
                <SelectItem value="12">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Şube
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Durum</Label>
            <Select
              value={formData.IsActive ? "Aktif" : "Pasif"}
              onValueChange={(value) =>
                setFormData({ ...formData, IsActive: value === "Aktif" })
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
  );
}
