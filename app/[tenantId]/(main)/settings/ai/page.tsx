'use client';

import * as React from 'react';
import { UserPlus, Pencil, Trash2, Mail, Phone, Calendar, Clock, Plus, BarChart3, Folder, FileText, 
  Laptop, Smartphone, Shield, Building, DollarSign, Users, Award, Crown, Store, Coffee, Percent, 
  Play, Bot, MessageSquare, Brain, Cpu, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios from "@/lib/axios";
import { toast } from '@/components/ui/toast/use-toast';
import { Ai } from '@/pages/api/settings/ai/types';
import { useAiStore } from '@/stores/settings/ai/ai-store';

export default function AiPage() {
  const { ai, setAi } = useAiStore();
  const { addTab, setActiveTab } = useTabStore();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChatbots = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/settings/ai/settings_ai');
        setAi(data);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
        toast({
          title: "Hata!",
          description: "Chatbotlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatbots();
  }, [setAi]);

  const handleEditChatbot = (chatbot: Ai) => {
    const tabId = `edit-chatbot-${chatbot.AutoID}`;
    const tab = {
      id: tabId,
      title: `Chatbot Düzenle - ${chatbot.AnalysisTitle}`,
      props: { data: chatbot },
      lazyComponent: () => import('./create/ai-form').then(module => ({
        default: (props: any) => {
          const Component = module.default;
          const tabProps = useTabStore.getState().getTabProps(tabId);
          return <Component {...tabProps} />;
        }
      }))
    };
    addTab(tab);
    setActiveTab(tabId);
  };

  const handleAddChatbotClick = () => {
    const tabId = "new-chatbot-form";
    addTab({
      id: tabId,
      title: "Yeni Chatbot",
      lazyComponent: () => import('./create/ai-form').then(module => ({
        default: (props: any) => <module.default {...props} />
      }))
    });
    setActiveTab(tabId);
  };

  const columns = [
    {
      key: 'AnalysisTitle' as keyof Ai,
      title: 'Chatbot Adı',
      width: '300px',
      fixed: 'left' as const,
      sortable: true,
      render: (chatbot: Ai) => {
        const IconComponent = getIconComponent(chatbot.Icon);
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary dark:bg-primary/90 flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-background" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{chatbot.AnalysisTitle}</span>
              <span className="text-xs text-muted-foreground">ID: {chatbot.ChatBotID}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'ChatbotRole' as keyof Ai,
      title: 'Rol',
      width: '200px',
      sortable: true,
      render: (chatbot: Ai) => (
        <span className="text-sm">
          {chatbot.ChatbotRole}
        </span>
      )
    }
  ];

  const filters = [
    {
      key: 'ChatbotRole' as keyof Ai,
      title: 'Rol',
      options: [
        { label: 'Sistem', value: 'system' },
        { label: 'Asistan', value: 'assistant' },
        { label: 'Kullanıcı', value: 'user' }
      ]
    }
  ];

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Bot;

    const icons: { [key: string]: any } = {
      UserPlus, Pencil, Trash2, Mail, Phone, Calendar, 
      Clock, Plus, BarChart3, Folder, FileText, 
      Laptop, Smartphone, Shield, Building, DollarSign, 
      Users, Award, Crown, Store, Coffee, Percent, Play,
      Bot, MessageSquare, Brain, Cpu, HandCoins
    };

    return icons[iconName] || Bot;
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-4 md:p-2 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Chatbot Yönetimi</h1>
          <p className="text-muted-foreground">
            AI destekli chatbotları görüntüleyin ve yönetin
          </p>
        </div>
        <Button
          onClick={handleAddChatbotClick}
          className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Chatbot
        </Button>
      </div>

      <DataTable
        data={ai}
        columns={columns}
        filters={filters}
        searchFields={['AnalysisTitle', 'ChatBotID', 'ChatbotRole']}
        idField="AutoID"
        isLoading={isLoading}
        renderActions={(chatbot) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:scale-105 hover:bg-violet-500/10 hover:text-violet-600 transition-all"
              onClick={() => handleEditChatbot(chatbot)}
            >
              <Pencil className="w-4 h-4" />
              <span className="sr-only">Düzenle</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
}
