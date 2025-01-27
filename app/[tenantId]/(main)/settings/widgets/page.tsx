'use client';

import * as React from 'react';
import { UserPlus, Pencil, Trash2, Mail, Phone, Calendar, Clock, Plus, BarChart3, Folder, FileText, Laptop, Smartphone, Shield, Building, DollarSign, Users, Award, Crown, Store, Coffee, Percent, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios from "@/lib/axios";
import { toast } from '@/components/ui/toast/use-toast';
import { WebWidget } from '@/pages/api/settings/widgets/types';
import { useWidgetsStore } from '@/stores/settings/widgets/widgets-store';

export default function WidgetsPage() {
  const { widgets, setWidgets } = useWidgetsStore();
  const { addTab, setActiveTab, removeTab } = useTabStore();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWidgets = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/settings/widgets/settings_widget');
        setWidgets(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Hata!",
          description: "Kullanıcılar yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWidgets();
  }, [setWidgets]);

  const handleEditWidget = (widget: WebWidget) => {
    const tabId = `edit-widgets-${widget.ReportID}`;
    const tab = {
      id: tabId,
      title: `Widget Düzenle - ${widget.ReportName}`,
      props: { data: widget },
      lazyComponent: () => import('./create/widgets-form').then(module => ({
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

  const handleAddWidgetClick = () => {
    const tabId = "new-widget-form";
    addTab({
      id: tabId,
      title: "Yeni Widget",
      lazyComponent: () => import('./create/widgets-form').then(module => ({
        default: (props: any) => <module.default {...props} />
      }))
    });
    setActiveTab(tabId);
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
              <div className={`w-9 h-9 rounded-full ${widget.ReportColor || 'bg-primary dark:bg-primary/90'} flex items-center justify-center`}>
                <IconComponent className="w-4 h-4 text-background" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background shadow-sm flex items-center justify-center ring-1 ring-border/50">
                <div className={`w-2 h-2 rounded-full ${widget.IsActive
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
          <span className={`w-1.5 h-1.5 rounded-full ${widget.IsActive
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

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Building;

    const icons: { [key: string]: any } = {
      UserPlus, Pencil, Trash2, Mail, Phone, Calendar, 
      Clock, Plus, BarChart3, Folder, FileText, 
      Laptop, Smartphone, Shield, Building, DollarSign, 
      Users, Award, Crown, Store, Coffee, Percent, Play
    };

    return icons[iconName] || Building;
  };

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
          </div>
        )}
      />
    </div>
  );
}
