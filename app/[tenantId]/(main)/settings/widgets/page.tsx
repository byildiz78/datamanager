'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, Building, DollarSign, Users, Award, Crown, Clipboard, Store, Coffee, Percent, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios, { isAxiosError } from "@/lib/axios";
import { WebWidget } from '@/pages/api/settings/widgets/types';

export default function WidgetsPage() {
  const [widgets, setWidgets] = React.useState<WebWidget[]>([]);
  const { addTab, setActiveTab } = useTabStore();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWidgets = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/settings/widgets/settings_widget');
        setWidgets(data);
      } catch (error) {
        console.error('Error fetching widgets:', error);
        if (isAxiosError(error)) {
          console.error('Axios error:', error.response?.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchWidgets();
  }, []);

  const handleEditWidget = (widget: WebWidget) => {
    // TODO: Implement edit functionality
    console.log('Edit widget:', widget);
  };

  const handleDeleteWidget = (id: number) => {
    // TODO: Implement delete functionality
    console.log('Delete widget:', id);
  };

  const handleAddWidgetClick = () => {
    const tabId = "new-widget-form";
    addTab({
      id: tabId,
      title: "Yeni Widget",
      lazyComponent: () => import("./widgets-form").then(mod => ({
        default: () => (
          <div className="p-8">
            <div className="rounded-lg border bg-card p-6">
              <mod.WidgetsForm
                onSubmit={(widgetData) => {
                  setWidgets(prev => [...prev, widgetData]);
                  setActiveTab("widgets-list");
                }}
                onClose={() => setActiveTab("widgets-list")}
              />
            </div>
          </div>
        )
      }))
    });
    setActiveTab(tabId);
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Building': return Building;
      case 'DollarSign': return DollarSign;
      case 'Users': return Users;
      case 'Award': return Award;
      case 'Crown': return Crown;
      case 'Clipboard': return Clipboard;
      case 'Store': return Store;
      case 'Coffee': return Coffee;
      case 'Percent': return Percent;
      case 'Play': return Play;
      default: return Building;
    }
  };

  const columns = [
    {
      key: 'ReportName' as keyof WebWidget,
      title: 'Widget Adı',
      width: '300px',
      fixed: 'left' as const,
      sortable: true,
      render: (widget: WebWidget) => {
        const IconComponent = getIconComponent(widget.ReportIcon);
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-9 h-9 rounded-full ${widget.ReportColor || 'bg-primary/5'} flex items-center justify-center`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background shadow-sm flex items-center justify-center ring-1 ring-border/50">
                <div className={`w-2 h-2 rounded-full ${
                  widget.IsActive 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{widget.ReportName}</span>
              <span className="text-xs text-muted-foreground">ID: {widget.ReportID}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'ReportIndex' as keyof WebWidget,
      title: 'Sıralama',
      width: '100px',
      sortable: true,
      render: (widget: WebWidget) => (
        <span className="text-sm font-medium">
          #{widget.ReportIndex}
        </span>
      )
    },
    {
      key: 'IsActive' as keyof WebWidget,
      title: 'Durum',
      width: '120px',
      sortable: true,
      render: (widget: WebWidget) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
          ${widget.IsActive 
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20' 
            : 'bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-600 ring-1 ring-gray-500/20'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            widget.IsActive 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-gray-400 to-gray-500'
          }`} />
          {widget.IsActive ? 'Aktif' : 'Pasif'}
        </span>
      )
    }
  ];

  const filters = [
    {
      key: 'IsActive' as keyof WebWidget,
      title: 'Durum',
      options: [
        { label: 'Aktif', value: 'true' },
        { label: 'Pasif', value: 'false' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4 p-4 md:p-2 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Widget Yönetimi</h1>
          <p className="text-muted-foreground">
            Dashboard widgetlarını görüntüleyin ve yönetin
          </p>
        </div>
        <Button 
          onClick={handleAddWidgetClick}
          className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Widget
        </Button>
      </div>

      <DataTable
        data={widgets}
        columns={columns}
        filters={filters}
        searchFields={['ReportName', 'ReportID']}
        idField="AutoID"
        isLoading={isLoading}
        renderActions={(widget) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:scale-105 hover:bg-violet-500/10 hover:text-violet-600 transition-all"
              onClick={() => handleEditWidget(widget)}
            >
              <Pencil className="w-4 h-4" />
              <span className="sr-only">Düzenle</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
              onClick={() => handleDeleteWidget(widget.AutoID)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Sil</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
}
