'use client';

import { Lock, Shield, Bell, Mail, MessageSquare, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Efr_Users } from "@/pages/api/settings/users/types";

interface SecurityInfoProps {
  formData: Efr_Users;
  setFormData: (data: Efr_Users) => void;
  passwordRules: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    symbol: boolean;
  };
  checkPasswordRules: (password: string) => void;
}

export function SecurityInfo({
  formData,
  setFormData,
  passwordRules,
  checkPasswordRules,
}: SecurityInfoProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.EncryptedPass}
                  onChange={(e) => {
                    setFormData({ ...formData, EncryptedPass: e.target.value });
                    checkPasswordRules(e.target.value);
                  }}
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordRules.length
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    En az 8 karakter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordRules.uppercase
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    Büyük harf (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordRules.lowercase
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    Küçük harf (a-z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordRules.number
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    Rakam (0-9)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      passwordRules.symbol
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    Özel karakter (!@#$%^&*)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Şifre Değiştirme</Label>
                  <p className="text-xs text-muted-foreground">
                    Kullanıcının şifre değiştirmesini engelle
                  </p>
                </div>
                <Switch
                  checked={formData.PwdCantChange}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, PwdCantChange: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">SMS Doğrulama</Label>
                  <p className="text-xs text-muted-foreground">
                    Giriş için SMS doğrulaması gerekli
                  </p>
                </div>
                <Switch
                  checked={formData.SmsRequired}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, SmsRequired: checked })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Bildirimler</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bildirim ayarlarını devre dışı bırak
                  </p>
                </div>
                <Switch
                  checked={formData.DisableNotification}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, DisableNotification: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Mail Ayarları</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mail ayarlarını devre dışı bırak
                  </p>
                </div>
                <Switch
                  checked={formData.DisableMailSettings}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, DisableMailSettings: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Şube Mesajları</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Şube mesajlarını devre dışı bırak
                  </p>
                </div>
                <Switch
                  checked={formData.DisableBranchMessage}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, DisableBranchMessage: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Kontrol Formu</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Şube kontrol formunu devre dışı bırak
                  </p>
                </div>
                <Switch
                  checked={formData.DisableBranchControlForm}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      DisableBranchControlForm: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Dashboard</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dashboard raporlarını devre dışı bırak
                  </p>
                </div>
                <Switch
                  checked={formData.DisableDashboardReport}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      DisableDashboardReport: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
