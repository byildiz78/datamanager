'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface SecurityInfoProps {
  formData: any;
  setFormData: (data: any) => void;
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
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    checkPasswordRules(newPassword);
  };

  const rules = [
    { key: "length", text: "En az 8 karakter" },
    { key: "lowercase", text: "En az 1 küçük harf" },
    { key: "uppercase", text: "En az 1 büyük harf" },
    { key: "number", text: "En az 1 rakam" },
    { key: "symbol", text: "En az 1 özel karakter" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handlePasswordChange}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {rules.map((rule) => (
            <div
              key={rule.key}
              className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                passwordRules[rule.key as keyof typeof passwordRules]
                  ? "bg-green-500/10 text-green-700"
                  : "bg-red-500/10 text-red-700"
              }`}
            >
              {passwordRules[rule.key as keyof typeof passwordRules] ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
