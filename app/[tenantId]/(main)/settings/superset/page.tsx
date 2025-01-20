'use client';

import * as React from 'react';
import { BarChart3, Pencil, Plus, Layout, ExternalLink, Monitor, PieChart, BarChart, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios from "@/lib/axios";
import { toast } from '@/components/ui/toast/use-toast';
import { SupersetDashboard } from '@/pages/api/settings/superset/types';
import { useSupersetStore } from '@/stores/settings/superset/superset-store';

export default function SupersetPage() {
    const { dashboards, setDashboards } = useSupersetStore();
    const { addTab, setActiveTab } = useTabStore();
    const [isLoading, setIsLoading] = React.useState(true);


    React.useEffect(() => {
        const fetchDashboards = async () => {
          try {
            setIsLoading(true);
            const response = await axios.get('/api/settings/superset/settings_superset');
            setDashboards(response.data);
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
    
        fetchDashboards();
      }, [setDashboards]);

    const handleEditDashboard = (dashboard: SupersetDashboard) => {
        const tabId = `edit-dashboard-${dashboard.AutoID}`;
        const tab = {
            id: tabId,
            title: `Dashboard Düzenle - ${dashboard.Title}`,
            props: { data: dashboard },
            lazyComponent: () => import('./create/superset-form').then(module => ({
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
    
    const handleAddDashboard = () => {
        const tabId = "new-dashboard-form";
        addTab({
            id: tabId,
            title: "Yeni Dashboard",
            lazyComponent: () => import('./create/superset-form').then(module => ({
                default: (props: any) => <module.default {...props} />
            }))
        });
        setActiveTab(tabId);
    };

    const getIconComponent = (iconName?: string | null) => {
        switch (iconName?.toLowerCase()) {
            case 'piechart':
                return <PieChart className="w-4 h-4 text-primary/60" />;
            case 'barchart':
                return <BarChart className="w-4 h-4 text-primary/60" />;
            case 'linechart':
                return <LineChart className="w-4 h-4 text-primary/60" />;
            default:
                return <Layout className="w-4 h-4 text-primary/40" />;
        }
    };

    const columns = [
        {
            key: 'Title' as keyof SupersetDashboard,
            title: 'Dashboard Adı',
            width: '300px',
            fixed: 'left' as const,
            sortable: true,
            render: (dashboard: SupersetDashboard) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/5 via-primary/5 to-blue-500/5 flex items-center justify-center ring-1 ring-border/50">
                            {getIconComponent(dashboard.Icon)}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{dashboard.Title}</span>
                        <span className="text-xs text-muted-foreground">ID: {dashboard.DashboardID}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'Standalone' as keyof SupersetDashboard,
            title: 'Görünüm',
            width: '150px',
            render: (dashboard: SupersetDashboard) => (
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                        ${dashboard.Standalone === 1
                            ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20'}`}
                    >
                        {dashboard.Standalone === 1 ? (
                            <>
                                <ExternalLink className="w-3.5 h-3.5" />
                                Standalone
                            </>
                        ) : (
                            <>
                                <Monitor className="w-3.5 h-3.5" />
                                Embedded
                            </>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'ExtraParams' as keyof SupersetDashboard,
            title: 'Parametreler',
            width: '200px',
            render: (dashboard: SupersetDashboard) => (
                <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                        {dashboard.ExtraParams || '-'}
                    </span>
                </div>
            )
        }
    ];

    const filters = [
        {
            key: 'Standalone' as keyof SupersetDashboard,
            title: 'Görünüm',
            options: [
                { label: 'Standalone', value: '1' },
                { label: 'Embedded', value: '0' }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-2 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Superset dashboardlarını görüntüleyin ve yönetin
                    </p>
                </div>
                <Button
                    onClick={handleAddDashboard}
                    className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Dashboard
                </Button>
            </div>

            <DataTable
                data={dashboards}
                columns={columns}
                filters={filters}
                searchFields={['Title', 'DashboardID', 'ExtraParams']}
                idField="AutoID"
                isLoading={isLoading}
                renderActions={(dashboard) => (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:scale-105 hover:bg-violet-500/10 hover:text-violet-600 transition-all"
                            onClick={() => handleEditDashboard(dashboard)}
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
