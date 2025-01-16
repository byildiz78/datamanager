'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, BarChart3, FileText, Laptop, Smartphone, Shield, FileCode, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common';
import { useTabStore } from "@/stores/tab-store";
import axios, { isAxiosError } from "@/lib/axios";
import { WebReport } from '@/pages/api/settings/reports/types';

export default function ReportsPage() {
    const [reports, setReports] = React.useState<WebReport[]>([]);
    const { addTab, setActiveTab } = useTabStore();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get('/api/settings/reports/settings_web_reports');
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                if (isAxiosError(error)) {
                    console.error('Axios error:', error.response?.data);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleEditReport = (report: WebReport) => {
        // TODO: Implement edit functionality
        console.log('Edit report:', report);
    };

    const handleDeleteReport = (id: number) => {
        // TODO: Implement delete functionality
        console.log('Delete report:', id);
    };

    const handleAddReportClick = () => {
        const tabId = "new-report-form";
        addTab({
            id: tabId,
            title: "Yeni Rapor",
            lazyComponent: () => import("./reports-form").then(mod => ({
                default: () => (
                    <div className="p-8">
                        <div className="rounded-lg border bg-card p-6">
                            <mod.ReportsForm
                                onSubmit={(reportData) => {
                                    setReports(prev => [...prev, reportData]);
                                    setActiveTab("reports-list");
                                }}
                                onClose={() => setActiveTab("reports-list")}
                            />
                        </div>
                    </div>
                )
            }))
        });
        setActiveTab(tabId);
    };

    const getReportTypeLabel = (type?: number) => {
        switch (type) {
            case 1: return 'Standart';
            case 2: return 'Detaylı';
            case 3: return 'Özet';
            case 4: return 'Grafik';
            default: return 'Tanımsız';
        }
    };

    const columns = [
        {
            key: 'ReportName' as keyof WebReport,
            title: 'Rapor Adı',
            width: '300px',
            fixed: 'left' as const,
            sortable: true,
            render: (report: WebReport) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/5 via-primary/5 to-blue-500/5 flex items-center justify-center ring-1 ring-border/50">
                            {report.ReportIcon ? (
                                <span className="text-lg text-primary/60">{report.ReportIcon}</span>
                            ) : (
                                <BarChart3 className="w-4 h-4 text-primary/40" />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{report.ReportName}</span>
                        <span className="text-xs text-muted-foreground">ID: {report.ReportID}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'GroupName' as keyof WebReport,
            title: 'Grup',
            width: '200px',
            render: (report: WebReport) => (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-indigo-500/10 to-blue-500/10 ring-1 ring-indigo-500/20">
                        <Folder className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-700">
                            {report.GroupName || 'Grupsuz'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'ReportType' as keyof WebReport,
            title: 'Tip',
            width: '150px',
            sortable: true,
            render: (report: WebReport) => (
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/10 via-primary/10 to-blue-500/10 text-primary ring-1 ring-primary/20">
                    <FileText className="w-3.5 h-3.5" />
                    {getReportTypeLabel(report.ReportType)}
                </span>
            )
        },
        {
            key: 'ShowDesktop' as keyof WebReport,
            title: 'Platform',
            width: '200px',
            render: (report: WebReport) => (
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
            ${report.ShowDesktop
                            ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20'
                            : 'bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20'}`}
                    >
                        <Laptop className="w-3.5 h-3.5" />
                        Desktop
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
            ${report.ShowMobile
                            ? 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20'
                            : 'bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20'}`}
                    >
                        <Smartphone className="w-3.5 h-3.5" />
                        Mobile
                    </div>
                </div>
            )
        },
        {
            key: 'SecurityLevel' as keyof WebReport,
            title: 'Güvenlik',
            width: '150px',
            sortable: true,
            render: (report: WebReport) => (
                <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-violet-500" />
                    <span className="text-sm">Seviye {report.SecurityLevel || 0}</span>
                </div>
            )
        },
        {
            key: 'DisplayOrderID' as keyof WebReport,
            title: 'Sıralama',
            width: '120px',
            sortable: true,
            render: (report: WebReport) => (
                <span className="text-sm font-medium">
                    {report.DisplayOrderID || '-'}
                </span>
            )
        }
    ];

    const filters = [
        {
            key: 'ReportType' as keyof WebReport,
            title: 'Rapor Tipi',
            options: [
                { label: 'Standart', value: '1' },
                { label: 'Detaylı', value: '2' },
                { label: 'Özet', value: '3' },
                { label: 'Grafik', value: '4' }
            ]
        },
        {
            key: 'ShowDesktop' as keyof WebReport,
            title: 'Platform',
            options: [
                { label: 'Desktop', value: '1' },
                { label: 'Mobile', value: '1' }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-2 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Rapor Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Sistem raporlarını görüntüleyin ve yönetin
                    </p>
                </div>
                <Button
                    onClick={handleAddReportClick}
                    className="bg-gradient-to-r from-violet-500 via-primary to-blue-500 text-white hover:from-violet-600 hover:via-primary/90 hover:to-blue-600 hover:shadow-md transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Rapor
                </Button>
            </div>

            <DataTable
                data={reports}
                columns={columns}
                filters={filters}
                searchFields={['ReportName', 'ReportID', 'ReportQuery']}
                idField="AutoID"
                isLoading={isLoading}
                renderActions={(report) => (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:scale-105 hover:bg-violet-500/10 hover:text-violet-600 transition-all"
                            onClick={() => handleEditReport(report)}
                        >
                            <Pencil className="w-4 h-4" />
                            <span className="sr-only">Düzenle</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:scale-105 hover:bg-red-500/10 hover:text-red-600 transition-all"
                            onClick={() => handleDeleteReport(report.AutoID)}
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
