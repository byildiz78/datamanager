'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Efr_Branches } from "@/pages/api/settings/branches/types";
import { Efr_Tags } from "@/pages/api/settings/efr_tag/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tag as TagIcon, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface BranchInfoProps {
  formData: Efr_Branches;
  setFormData: React.Dispatch<React.SetStateAction<Efr_Branches>>;
  efr_tags: Efr_Tags[];
  isLoading?: boolean;
}

export default function BranchInfo({ formData, setFormData, efr_tags = [], isLoading = false }: BranchInfoProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(formData.TagIDs || []);

  useEffect(() => {
    // formData'daki TagIDs değiştiğinde selectedTags'i güncelle
    setSelectedTags(formData.TagIDs || []);
  }, [formData.TagIDs]);

  const handleTagClick = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelectedTags);
    setFormData(prev => ({ ...prev, TagIDs: newSelectedTags }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sol Taraf - Form Alanları */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="branchId">Şube ID</Label>
            <Input
              id="branchId"
              type="number"
              placeholder="Şube ID"
              value={formData.BranchID}
              onChange={(e) => handleInputChange('BranchID', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchName">Şube Adı</Label>
            <Input
              id="branchName"
              placeholder="Şube Adı"
              value={formData.BranchName}
              onChange={(e) => setFormData(prev => ({ ...prev, BranchName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryName">Ülke Adı</Label>
            <Input
              id="countryName"
              placeholder="Ülke Adı"
              value={formData.CountryName}
              onChange={(e) => setFormData(prev => ({ ...prev, CountryName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currencyName">Para Birimi</Label>
            <Input
              id="currencyName"
              placeholder="Para Birimi"
              value={formData.CurrencyName}
              onChange={(e) => setFormData(prev => ({ ...prev, CurrencyName: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="externalCode">Harici Kod</Label>
              <Input
                id="externalCode"
                placeholder="Harici Kod"
                value={formData.ExternalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, ExternalCode: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoWarehouseCode">Depo Kodu</Label>
              <Input
                id="logoWarehouseCode"
                placeholder="Depo Kodu"
                value={formData.LogoWarehouseCode}
                onChange={(e) => setFormData(prev => ({ ...prev, LogoWarehouseCode: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.IsActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, IsActive: checked as boolean }))}
            />
            <Label htmlFor="isActive">Aktif</Label>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Etiketler */}
      <div className="border rounded-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Etiketler yükleniyor...</span>
          </div>
        ) : (
          <Command className="h-[400px]">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <TagIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <CommandInput placeholder="Etiket ara..." />
            </div>
            <CommandList>
              <CommandEmpty>Etiket bulunamadı.</CommandEmpty>
              <CommandGroup>
                <div className="p-2">
                  {(efr_tags || [])?.map((tag) => (
                    <CommandItem
                      key={tag.TagID}
                      value={tag.TagTitle || ""}
                      onSelect={() => handleTagClick(tag.TagID)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedTags.includes(tag.TagID) ? "bg-primary text-primary-foreground" : "opacity-50"
                        )}>
                          {selectedTags.includes(tag.TagID) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span>{tag.TagTitle}</span>
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  );
}
