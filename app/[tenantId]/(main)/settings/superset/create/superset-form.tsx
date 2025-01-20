'use client';

import { useEffect, useState } from "react";
import {
  Save, X, RefreshCcw, Layout, ExternalLink, Monitor,
  LucideIcon, Activity, AlertCircle, Archive, ArrowDown, ArrowUp,
  Bell, Book, Bookmark, Box, Briefcase, ChartBar, ChartPie, Check,
  CircleDollarSign, CreditCard, Database, Download, Eye, File,
  Flag, Globe, Heart, Home, Image, Info, Key, Link, List, Lock,
  MessageCircle, Moon, Package, Paperclip, PieChart, Power,
  Printer, Search, Settings, Share, ShoppingBag, ShoppingCart, Star,
  Sun, Table, Tag, Target, Terminal, ThumbsUp, Truck, Upload,
  User, Video, Wallet, Zap, CheckCircle2, BarChart3, BarChart4,
  BarChart2, BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/toast/use-toast";
import { useTabStore } from "@/stores/tab-store";
import { useSupersetStore } from "@/stores/settings/superset/superset-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SupersetDashboard } from "@/pages/api/settings/superset/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface SupersetFormProps {
  onClose?: () => void;
  data?: SupersetDashboard;
}

export default function SupersetForm(props: SupersetFormProps) {
  const { data } = props;
  const { removeTab, setActiveTab } = useTabStore();
  const { addSuperset, updateSuperset } = useSupersetStore();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<SupersetDashboard>(() => {
    if (data) {
      return {
        AutoID: data.AutoID || 0,
        DashboardID: data.DashboardID || '',
        Title: data.Title || '',
        Standalone: typeof data.Standalone === 'number' ? data.Standalone : 0,
        ExtraParams: data.ExtraParams || '',
        Icon: data.Icon || null
      };
    }
    return {
      AutoID: 0,
      DashboardID: '',
      Title: '',
      Standalone: 0,
      ExtraParams: '',
      Icon: null
    };
  });

  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(formData.Icon || "");
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const endpoint = data
        ? '/api/settings/superset/settings_superset_update'
        : '/api/settings/superset/settings_superset_create';

      const response = await (data
        ? axios.put(endpoint, formData)
        : axios.post(endpoint, formData));

      if (response.data.success) {
        const dashboardData = {
          ...formData,
          AutoID: data ? formData.AutoID : response.data.autoId
        };

        if (data) {
          updateSuperset(dashboardData);
        } else {
          addSuperset(dashboardData);
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
                Dashboard başarıyla {data ? 'güncellendi' : 'kaydedildi'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.Title} dashboard {data ? 'güncellendi' : 'oluşturuldu'}.
              </p>
            </div>
          ),
          className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          duration: 5000,
        });

        const tabId = data ? `edit-dashboard-${data.AutoID}` : 'new-dashboard-form';
        removeTab(tabId);
        setActiveTab('superset-list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Hata!",
        description: `Dashboard ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const icons: { [key: string]: LucideIcon } = {
    Activity, AlertCircle, Archive, ArrowDown, ArrowUp,
    Bell, Book, Bookmark, Box, Briefcase, ChartBar, ChartPie,
    CircleDollarSign, CreditCard, Database, Download, Eye,
    Flag, Globe, Heart, Home, Image, Info, Key,
    Link, List, Lock, MessageCircle, Monitor, Moon,
    Package, Paperclip, PieChart, Power, Printer,
    Search, Settings, Share, ShoppingBag, ShoppingCart,
    Star, Sun, Table, Tag, Target, Terminal,
    ThumbsUp, Truck, Upload, User, Video, Wallet, Zap,
    BarChart, BarChart2, BarChart3, BarChart4,
    ChartColumnDecreasing: BarChart3
  };

  const lucideIcons = Object.entries(icons)
    .filter(([name]) => name.toLowerCase().includes(iconSearch.toLowerCase()))
    .map(([name, Icon]) => ({
      name,
      Icon
    }));

  return (
    <ScrollArea className="h-[calc(90vh-6rem)] overflow-y-auto">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {data ? 'Dashboard Düzenle' : 'Yeni Dashboard'}
            </h2>
            <p className="text-muted-foreground">
              {data ? 'Dashboard bilgilerini düzenleyin' : 'Yeni bir dashboard oluşturun'}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              const tabId = data ? `edit-dashboard-${data.AutoID}` : 'new-dashboard-form';
              removeTab(tabId);
              setActiveTab('superset-list');
            }}
            className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <File className="w-4 h-4" />
                  Dashboard ID
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.DashboardID}
                    onChange={(e) => setFormData({ ...formData, DashboardID: e.target.value })}
                    className="flex-1"
                    placeholder="Lütfen Superset Panelindeki DashboardID Giriniz!"
                  />
                </div>
              </div>

              <div className="col-span-5">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4" />
                  Dashboard Adı
                </label>
                <Input
                  value={formData.Title}
                  onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4" />
                  Görünüm
                </label>
                <Select
                  value={String(formData.Standalone)}
                  onValueChange={(value) => setFormData({ ...formData, Standalone: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Görünüm Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Tam Ekran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4" />
                  İkon
                </label>
                <Dialog open={isIconDialogOpen} onOpenChange={setIsIconDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setIsIconDialogOpen(true)}
                    >
                      <div className="flex items-center gap-2">
                        {selectedIcon && icons[selectedIcon as keyof typeof icons] && 
                          React.createElement(icons[selectedIcon as keyof typeof icons], { className: "w-4 h-4" })}
                        <span>{selectedIcon || "İkon Seç"}</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>İkon Seç</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <Input
                        placeholder="İkon ara..."
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        className="sticky top-0 bg-background"
                      />
                      <ScrollArea className="h-[60vh] rounded-md border">
                        <div className="grid grid-cols-6 gap-4 p-4">
                          {lucideIcons.map(({ name, Icon }) => (
                            <Button
                              key={name}
                              variant="outline"
                              className={`flex h-24 w-full flex-col items-center justify-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground ${selectedIcon === name ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => {
                                setSelectedIcon(name);
                                setFormData({ ...formData, Icon: name });
                                setIsIconDialogOpen(false);
                              }}
                            >
                              <Icon className="h-8 w-8" />
                              <span className="text-xs text-center line-clamp-2">{name}</span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="col-span-12">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4" />
                  Extra Parametreler
                </label>
                <Input
                  value={formData.ExtraParams}
                  onChange={(e) => setFormData({ ...formData, ExtraParams: e.target.value })}
                  placeholder="Extra parametreleri buraya giriniz"
                />
              </div>

              <div className="col-span-12">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
                  disabled={isSaving}
                >
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
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </ScrollArea>
  );
}