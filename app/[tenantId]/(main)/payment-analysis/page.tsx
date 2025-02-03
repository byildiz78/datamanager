'use client';

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Star, Search, DollarSign, ArrowUpDown, ChevronLeft, ChevronRight, Building2, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import { WebWidget } from "@/types/tables";
import { useTabStore } from "@/stores/tab-store";
import { useFilterStore } from "@/stores/filters-store";
import { useFilterEventStore } from "@/stores/filter-event-store";
import { useRefreshStore } from "@/stores/refresh-store";
import { DataLoader } from "../data-analysis/components/DataLoader";
import { StatsCard } from "../data-analysis/components/StatsCard";
import { DataTable } from '@/components/common';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentData {
  SUBE: string;
  "ÖDEME TİPİ": string;
  GenelTOPLAM: number;
}

interface ChartData {
  reportValue1: string;
  reportValue2: number;
}

export default function PaymentAnalysis() {
  const [widgets, setWidgets] = useState<WebWidget[]>([]);
  const { activeTab } = useTabStore();
  const { selectedFilter } = useFilterStore();
  const [widgetData, setWidgetData] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  const [hasFetched, setHasFetched] = useState(false);
  const { filterApplied, setFilterApplied } = useFilterEventStore();
  const { shouldFetch, setShouldFetch } = useRefreshStore();
  const [isDataAnalysisTab, setIsDataAnalysisTab] = useState(false);
  const prevFilterRef = useRef(selectedFilter);
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);
  const [hasFirstWidgetData, setHasFirstWidgetData] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchWidgetData = useCallback(async (reportId: number, isInitial = false) => {
    if (!isDataAnalysisTab) return;

    const branches = selectedFilter.selectedBranches.length > 0
      ? selectedFilter.selectedBranches
      : selectedFilter.branches;

    if (!branches || branches.length === 0) return;

    try {
      if (isInitial) {
        setIsLoading(prev => ({ ...prev, [reportId]: true }));
      } else {
        setIsUpdating(prev => ({ ...prev, [reportId]: true }));
      }

      const response = await axios.post("/api/widgetreport", {
        date1: selectedFilter.date.from,
        date2: selectedFilter.date.to,
        branches: branches.map((item) => item.BranchID),
        reportId: [reportId]
      });

      if (response.status === 200) {
        if (reportId === 555) {
          setPaymentData(response.data);
        } else if (reportId === 558) {
          setChartData(response.data);
        }

        setWidgetData(prev => ({
          ...prev,
          [reportId]: Array.isArray(response.data) ? response.data : [response.data]
        }));
        setHasFetched(true);

        if (!hasFirstWidgetData && response.data) {
          setHasFirstWidgetData(true);
        }
      }
    } catch (error) {
      console.error(`Error fetching data for widget ${reportId}:`, error);
    } finally {
      if (isInitial) {
        setIsLoading(prev => ({ ...prev, [reportId]: false }));
      } else {
        setIsUpdating(prev => ({ ...prev, [reportId]: false }));
      }
    }
  }, [isDataAnalysisTab, selectedFilter.date, selectedFilter.branches, selectedFilter.selectedBranches, hasFirstWidgetData]);

  // Widget listesini çek
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        setIsLoadingWidgets(true);
        const response = await axios.get<WebWidget[]>("/api/dashboard/payment-analysis/payment-widgets", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setWidgets(response.data);
      } catch (error) {
        console.error("Error fetching widgets:", error);
      } finally {
        setIsLoadingWidgets(false);
      }
    };
    fetchWidgets();
  }, []);

  // Tab değişimini takip et
  useEffect(() => {
    const isDataAnalysis = activeTab === "Kazanç Özetleri";
    setIsDataAnalysisTab(isDataAnalysis);
  }, [activeTab]);

  // Widget verilerini çek
  useEffect(() => {
    if (!isDataAnalysisTab || !widgets.length || document.hidden) return;

    const branches = selectedFilter.selectedBranches.length > 0
      ? selectedFilter.selectedBranches
      : selectedFilter.branches;

    if (!branches || branches.length === 0) return;

    if (!hasFetched) {
      widgets.forEach(widget => {
        fetchWidgetData(widget.ReportID, true);
      });
      return;
    }

    if (shouldFetch || filterApplied) {
      widgets.forEach(widget => {
        fetchWidgetData(widget.ReportID, false);
      });

      if (filterApplied) {
        setFilterApplied(false);
      }
      if (shouldFetch) {
        setShouldFetch(false);
      }
    }
  }, [
    isDataAnalysisTab,
    widgets,
    hasFetched,
    shouldFetch,
    filterApplied,
    fetchWidgetData,
    setFilterApplied,
    setShouldFetch,
  ]);

  // Filtre değişimini takip et
  useEffect(() => {
    const filterChanged =
      prevFilterRef.current.date.from !== selectedFilter.date.from ||
      prevFilterRef.current.date.to !== selectedFilter.date.to ||
      prevFilterRef.current.branches !== selectedFilter.branches ||
      prevFilterRef.current.selectedBranches !== selectedFilter.selectedBranches;

    if (isDataAnalysisTab && hasFetched && filterChanged) {
      setFilterApplied(true);
    }

    prevFilterRef.current = selectedFilter;
  }, [isDataAnalysisTab, hasFetched, selectedFilter, setFilterApplied]);

  // Pie chart data hazırla
  const pieData = {
    labels: chartData.map(item => item.reportValue1),
    datasets: [{
      data: chartData.map(item => item.reportValue2),
      backgroundColor: [
        'rgb(66, 133, 244)',   // VISA
        'rgb(52, 168, 83)',    // YEMEKSEPETI
        'rgb(251, 188, 4)',    // NAKIT
        'rgb(234, 67, 53)',    // TRENDYOL
        'rgb(255, 64, 129)',   // SODEXO
        'rgb(171, 71, 188)',   // GETIR
        'rgb(0, 150, 136)',    // TICKET
        'rgb(63, 81, 181)',    // MULTINET
        'rgb(121, 85, 72)',    // SETCARD
        'rgb(158, 158, 158)',  // METROPOL
      ],
      borderWidth: 1,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: { size: 12 },
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString('tr-TR')} (${percentage}%)`;
          }
        }
      }
    }
  };

  const columns = [
    {
      key: 'SUBE' as keyof PaymentData,
      title: 'Şube',
      width: '200px',
      fixed: 'left' as const,
      sortable: true,
      searchable: true,
      render: (item: PaymentData) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/5 via-primary/5 to-blue-500/5 flex items-center justify-center ring-1 ring-border/50">
              <Building2 className="w-4 h-4 text-primary/40" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{item.SUBE}</span>
          </div>
        </div>
      )
    },
    {
      key: 'ÖDEME TİPİ' as keyof PaymentData,
      title: 'Ödeme Tipi',
      width: '250px',
      sortable: true,
      searchable: true,
      render: (item: PaymentData) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-violet-500" />
          <span>{item["ÖDEME TİPİ"]}</span>
        </div>
      )
    },
    {
      key: 'GenelTOPLAM' as keyof PaymentData,
      title: 'Tutar',
      width: '150px',
      sortable: true,
      searchable: true,
      render: (item: PaymentData) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 ring-1 ring-red-500/20">
          {item.GenelTOPLAM.toLocaleString('tr-TR')} ₺
        </span>
      )
    }
  ];

  const filters = [
    {
      key: 'SUBE' as keyof PaymentData,
      title: 'Şube',
      options: Array.from(new Set(paymentData?.map(item => item.SUBE) ?? [])).map(sube => ({
        label: sube,
        value: sube
      }))
    },
    {
      key: 'ÖDEME TİPİ' as keyof PaymentData,
      title: 'Ödeme Tipi',
      options: Array.from(new Set(paymentData?.map(item => item["ÖDEME TİPİ"]) ?? [])).map(tip => ({
        label: tip,
        value: tip
      }))
    }
  ];

  return (
    <ScrollArea className="h-[calc(90vh-8rem)]">
      <div className="space-y-6 p-6">
        {(isLoadingWidgets || !hasFirstWidgetData) ? (
          <DataLoader fullscreen={false} />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Table */}
            {widgets.find(widget => widget.ReportID === 555) && (
              <div className="col-span-7 overflow-x-hidden overflow-y-hidden">
                <Card>
                  <CardHeader>
                    <CardTitle>Ödeme İşlemleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={paymentData ?? []}
                      columns={columns}
                      filters={filters}
                      searchFields={['SUBE', 'ÖDEME TİPİ', 'GenelTOPLAM']}
                      pageSize={10}
                      searchPlaceholder="Ödemelerde ara..."
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Right Column - Stats and Chart */}
            <div className="col-span-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {widgets.find(widget => widget.ReportID === 556) && (
                  <StatsCard
                    title={widgets.find(widget => widget.ReportID === 556)?.ReportName || ""}
                    value={widgetData[556]?.[0]?.reportValue1.toLocaleString('tr-TR') + " ₺"}
                    subtitle="Tüm Ödeme Yöntemleri"
                    icon={<Star className="w-4 h-4" />}
                    color="purple"
                  />
                )}
                {widgets.find(widget => widget.ReportID === 557) && (
                  <StatsCard
                    title={widgets.find(widget => widget.ReportID === 557)?.ReportName || ""}
                    value={widgetData[557]?.[0]?.reportValue1.toLocaleString('tr-TR') + " ₺"}
                    subtitle="Toplam Nakit Ödemeler"
                    icon={<DollarSign className="w-4 h-4" />}
                    color="green"
                  />
                )}
              </div>

              {/* Pie Chart */}
              {widgets.find(widget => widget.ReportID === 558) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ödeme Dağılımı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                      <Pie data={pieData} options={{
                        ...pieOptions,
                        plugins: {
                          ...pieOptions.plugins,
                          legend: {
                            ...pieOptions.plugins.legend,
                            position: 'bottom' as const,
                          }
                        }
                      }} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
