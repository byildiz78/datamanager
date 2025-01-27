'use client';

import { useEffect, useState } from "react";
import {
  Save, X, Bot, MessageSquare, Brain, Cpu, HandCoins,
  LucideIcon, Activity, AlertCircle, Archive, ArrowDown, ArrowUp,
  Bell, Book, Bookmark, Box, Briefcase, ChartBar, ChartPie, Check,
  CircleDollarSign, CreditCard, Database, Download, Eye, File,
  Flag, Globe, Heart, Home, Image, Info, Key, Link, List, Lock,
  MessageCircle, Monitor, Moon, Package, Paperclip, PieChart, Power,
  Printer, Search, Settings, Share, ShoppingBag, ShoppingCart, Star,
  Sun, Table, Tag, Target, Terminal, ThumbsUp, Truck, Upload,
  User, Video, Wallet, Zap, CheckCircle2,
  FileChartColumn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/toast/use-toast";
import { useTabStore } from "@/stores/tab-store";
import { useAiStore } from "@/stores/settings/ai/ai-store";
import { Input } from "@/components/ui/input";
import { Ai } from "@/pages/api/settings/ai/types";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AiFormProps {
  onClose?: () => void;
  data?: Ai;
}

export default function AiForm(props: AiFormProps) {
  const { data } = props;
  const { removeTab, setActiveTab } = useTabStore();
  const { addAi, updateAi } = useAiStore();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Ai>(() => {
    if (data) {
      return { ...data };
    }
    return {
      AutoID: 0,
      ChatBotID: '',
      AnalysisTitle: '',
      ChatbotRole: 'system',
      ChatbotQuery: '',
      ChatbotContent: '',
      ChatbotQueryParams: null,
      Icon: null
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const endpoint = data
        ? '/api/settings/ai/settings_ai_update'
        : '/api/settings/ai/settings_ai_create';

      const response = await (data
        ? axios.put(endpoint, formData)
        : axios.post(endpoint, formData));

      if (response.data.success) {
        const chatbotData = {
          ...formData,
          AutoID: data ? formData.AutoID : response.data.autoId
        };

        if (data) {
          updateAi(chatbotData);
        } else {
          addAi(chatbotData);
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
                Chatbot başarıyla {data ? 'güncellendi' : 'kaydedildi'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.AnalysisTitle} chatbotu {data ? 'güncellendi' : 'oluşturuldu'}.
              </p>
            </div>
          ),
          className: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          duration: 5000,
        });

        const tabId = data ? `edit-chatbot-${data.AutoID}` : 'new-chatbot-form';
        removeTab(tabId);
        setActiveTab('ai-list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Hata!",
        description: `Chatbot ${data ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(formData.Icon || "");
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);

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
    Bot, MessageSquare, Brain, Cpu, HandCoins,FileChartColumn
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
              {data ? 'Chatbot Düzenle' : 'Yeni Chatbot'}
            </h2>
            <p className="text-muted-foreground">
              {data ? 'Chatbot bilgilerini düzenleyin' : 'Yeni bir chatbot oluşturun'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all mr-5"
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                const tabId = data ? `edit-chatbot-${data.AutoID}` : 'new-chatbot-form';
                removeTab(tabId);
                setActiveTab('ai-list');
              }}
              className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <File className="w-4 h-4" />
                  Chatbot ID
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.ChatBotID}
                    onChange={(e) => setFormData({ ...formData, ChatBotID: e.target.value })}
                    className="flex-1"
                    placeholder="Chatbot ID"
                  />
                </div>
              </div>

              <div className="col-span-5">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Chatbot Adı
                </label>
                <Input
                  value={formData.AnalysisTitle}
                  onChange={(e) => setFormData({ ...formData, AnalysisTitle: e.target.value })}
                  placeholder="Chatbot Adı"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4" />
                  Rol
                </label>
                <Select
                  value={formData.ChatbotRole}
                  onValueChange={(value) => setFormData({ ...formData, ChatbotRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rol Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Sistem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
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
                  <Database className="w-4 h-4" />
                  SQL Sorgusu
                </label>
                <div className="border rounded-md overflow-hidden">
                  <CodeMirror
                    value={formData.ChatbotQuery || ''}
                    height="200px"
                    theme={vscodeDark}
                    extensions={[sql()]}
                    onChange={value => setFormData(prev => ({ ...prev, ChatbotQuery: value }))}
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
                  />
                </div>
              </div>

              <div className="col-span-12">
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Chatbot İçeriği
                </label>
                <Textarea
                  value={formData.ChatbotContent || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ChatbotContent: e.target.value }))}
                  placeholder="Chatbot içeriğini buraya yazın..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </ScrollArea>
  );
}