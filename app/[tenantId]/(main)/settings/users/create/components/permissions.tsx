'use client';

import { Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface PermissionsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function Permissions({ formData, setFormData }: PermissionsProps) {
  const permissionsList = [
    {
      key: "canViewNotifications",
      label: "Uyarı Bildirimlerini Görebilir",
      description: "Kullanıcı sistem bildirimlerini görüntüleyebilir",
    },
    {
      key: "canAccessEmail",
      label: "Mail Ayarlarına Erişebilir",
      description: "Kullanıcı e-posta ayarlarına erişebilir",
    },
    {
      key: "canAccessLanguageEditor",
      label: "Dil Editörüne Erişebilir",
      description: "Kullanıcı dil editörünü kullanabilir",
    },
    {
      key: "canAccessBranchMessages",
      label: "Şube Mesajlarına Erişebilir",
      description: "Kullanıcı şube mesajlarına erişebilir",
    },
    {
      key: "canAccessBranchForms",
      label: "Şube Kontrol Formlarına Erişebilir",
      description: "Kullanıcı şube kontrol formlarına erişebilir",
    },
    {
      key: "canViewAllBranches",
      label: "Tüm Şubeleri Görebilir",
      description: "Kullanıcı tüm şubeleri görüntüleyebilir",
    },
    {
      key: "requiresSMSVerification",
      label: "SMS Doğrulama Gerektirir",
      description: "Kullanıcı girişi için SMS doğrulaması gerekir",
    },
    {
      key: "canViewDashboard",
      label: "DashBoard Verilerini Görebilir",
      description: "Kullanıcı dashboard verilerini görüntüleyebilir",
    },
    {
      key: "canChangePassword",
      label: "Şifre Değiştirebilir",
      description: "Kullanıcı şifresini değiştirebilir",
    },
    {
      key: "isTicketUser",
      label: "Ticket Kullanıcısı",
      description: "Kullanıcı ticket sistemini kullanabilir",
    },
  ];

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm overflow-hidden">
      <CardContent className="pt-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {permissionsList.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 bg-background/40 border border-border/10 hover:border-border/20 group"
            >
              <Checkbox
                id={key}
                checked={formData.permissions[key]}
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
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
