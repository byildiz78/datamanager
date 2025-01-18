'use client';

import { useEffect, useState } from "react";
import {
  Save, X, RefreshCcw, FileText, BarChart3, Folder, Shield,
  Smartphone, Laptop, Calendar, CheckCircle2, Building, DollarSign,
  Users, Award, Crown, Store, Coffee, Percent, Play, UserPlus,
  Pencil, Trash2, Mail, Phone, Clock, Plus, FileText as FileTextIcon,
  BarChart3 as BarChart3Icon, Folder as FolderIcon, Shield as ShieldIcon,
  Smartphone as SmartphoneIcon, Laptop as LaptopIcon, Calendar as CalendarIcon,
  LucideIcon, Activity, AlertCircle, Archive, ArrowDown, ArrowUp,
  Bell, Book, Bookmark, Box, Briefcase, ChartBar, ChartPie, Check,
  CircleDollarSign, CreditCard, Database, Download, Eye, File, Filter,
  Flag, Globe, Heart, Home, Image, Info, Key, Link, List, Lock, Map,
  MessageCircle, Monitor, Moon, Package, Paperclip, PieChart, Power,
  Printer, Search, Settings, Share, ShoppingBag, ShoppingCart, Star,
  Sun, Table, Tag, Target, Terminal, ThumbsUp, Truck, Upload,
  User, Video, Wallet, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/toast/use-toast";
import { useTabStore } from "@/stores/tab-store";
import { useWidgetsStore } from "@/stores/settings/widgets/widgets-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { WebWidget } from "@/pages/api/settings/widgets/types";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WidgetFormProps {
  onClose?: () => void;
  data?: WebWidget;
}

export default function WidgetForm(props: WidgetFormProps) {
  const { data } = props;
  const { removeTab, setActiveTab } = useTabStore();
  const { addWidget, updateWidget } = useWidgetsStore();
  const [editorLoaded, setEditorLoaded] = useState(false);

  const [formData, setFormData] = useState<WebWidget>(() => {
    if (data) {
      return {
        ...data,
      };
    }

    return {
      AutoID: 0,
      ReportID: 0,
      ReportName: "",
      ReportIndex: 0,
      ReportIcon: "",
      V1Type: 0,
      V2Type: 0,
      V3Type: 0,
      V4Type: 0,
      V5Type: 0,
      V6Type: 0,
      ReportQuery: "",
      ReportQuery2: "",
      IsActive: true,
      ReportColor: "",
      BranchDetail: false,
      ReportType: "2"
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = data
        ? '/api/settings/widgets/settings_web_widgets_update'
        : '/api/settings/widgets/settings_web_widgets_create';

      const response = await (data
        ? axios.put(endpoint, formData)
        : axios.post(endpoint, formData));

      if (response.data.success) {

        const userData = {
          ...formData,
        };

        if (data) {
          updateWidget(userData);
        } else {
          addWidget(userData);
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
                Widget başarıyla {data ? 'güncellendi' : 'kaydedildi'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.ReportName} widgeti {data ? 'güncellendi' : 'oluşturuldu'}.
              </p>
            </div>
          ),
          className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          duration: 5000,
        });

        const tabId = data ? `edit-widgets-${data.ReportID}` : 'new-widget-form';
        removeTab(tabId);
        setActiveTab('widgets-list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Hata!",
        description: `Widget ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
        variant: "destructive",
      });
    }
  };

  const generateRandomId = () => {
    const uuid = uuidv4();
    const numericId = parseInt(uuid.replace(/-/g, '').substring(0, 8), 16);
    const finalId = numericId % 1000000000;
    setFormData(prev => ({ ...prev, ReportID: finalId }));
  };

  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(formData.ReportIcon || "");
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);

  const icons: { [key: string]: LucideIcon } = {
    Activity, AlertCircle, Archive, ArrowDown, ArrowUp, Award,
    Bell, Book, Bookmark, Box, Briefcase, Building,
    Calendar, ChartBar, ChartPie, Check, CheckCircle2, Clock, Coffee,
    Crown, CircleDollarSign, CreditCard, Database, DollarSign,
    Download, Eye, File, FileText, Filter, Flag, Folder,
    Globe, Heart, Home, Image, Info, Key, Laptop,
    Link, List, Lock, Mail, Map, MessageCircle,
    Monitor, Moon, Package, Paperclip, Pencil, Percent,
    Phone, PieChart, Play, Plus, Power, Printer,
    RefreshCcw, Save, Search, Settings, Share, Shield,
    ShoppingBag, ShoppingCart, Smartphone, Star, Store,
    Sun, Table, Tag, Target, Terminal, ThumbsUp,
    Trash2, Truck, Upload, User, UserPlus,
    Users, Video, Wallet, X, Zap
  };

  const lucideIcons = Object.entries(icons)
    .filter(([name]) => name.toLowerCase().includes(iconSearch.toLowerCase()))
    .map(([name, Icon]) => ({
      name,
      Icon
    }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {data ? 'Widget Düzenle' : 'Yeni Widget'}
          </h2>
          <p className="text-muted-foreground">
            {data ? 'Widget bilgilerini düzenleyin' : 'Yeni bir widget oluşturun'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const tabId = data ? `edit-widgets-${data.ReportID}` : 'new-widget-form';
            removeTab(tabId);
            setActiveTab('widgets-list');
          }}
          className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Widget ID
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.ReportID}
                  onChange={(e) => setFormData({ ...formData, ReportID: parseInt(e.target.value) || 0 })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateRandomId}
                  className="flex-none"
                  title="Rastgele ID Oluştur"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <BarChart3Icon className="w-4 h-4" />
                Sıra
              </label>
              <Select
                value={formData.ReportIndex?.toString()}
                onValueChange={(value) => setFormData({ ...formData, ReportIndex: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sıra Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-4">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileTextIcon className="w-4 h-4" />
                Widget Adı
              </label>
              <Input
                value={formData.ReportName}
                onChange={(e) => setFormData({ ...formData, ReportName: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileTextIcon className="w-4 h-4" />
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
                      {selectedIcon && React.createElement(icons[selectedIcon as keyof typeof icons], { className: "w-4 h-4" })}
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
                              setFormData({ ...formData, ReportIcon: name });
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

            <div className="col-span-4 grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1">
                  <FileTextIcon className="w-4 h-4" />
                  Durum
                </label>
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id="isActive"
                    checked={formData.IsActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, IsActive: checked })}
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aktif
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1">
                  <FileTextIcon className="w-4 h-4" />
                  Şube Detay
                </label>
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id="branchDetail"
                    checked={formData.BranchDetail}
                    onCheckedChange={(checked) => setFormData({ ...formData, BranchDetail: checked })}
                  />
                  <label
                    htmlFor="branchDetail"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aktif
                  </label>
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <Button type="submit" className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all">
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>

            <div className="col-span-12">
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileTextIcon className="w-4 h-4" />
                SQL Sorgusu
              </label>
              <div className="border rounded-md overflow-hidden">
                <CodeMirror
                  value={formData.ReportQuery || ''}
                  height="380px"
                  theme={vscodeDark}
                  extensions={[sql()]}
                  onChange={value => setFormData(prev => ({ ...prev, ReportQuery: value }))}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightSpecialChars: true,
                    history: true,
                    foldGutter: true,
                    drawSelection: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    syntaxHighlighting: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    crosshairCursor: true,
                    highlightActiveLine: true,
                    highlightSelectionMatches: true,
                    closeBracketsKeymap: true,
                    defaultKeymap: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                    lintKeymap: true,
                  }}
                  className="min-h-[380px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}