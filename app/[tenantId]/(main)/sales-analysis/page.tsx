"use client";

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, BarChart2, Star } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "next/navigation";
import { DataLoader } from '../data-analysis/components/DataLoader';
import { useFilterStore } from '@/stores/filters-store';
import { useTabStore } from '@/stores/tab-store';
import { useFilterEventStore } from "@/stores/filter-event-store";
import { useRefreshStore } from "@/stores/refresh-store";
import { WebWidget } from '@/types/tables';
import axios from '@/lib/axios';
import { DailyTab } from './components/DailyTab';
import { WeeklyTab } from './components/WeeklyTab';
import { MonthlyTab } from './components/MonthlyTab';
import { StatsCard } from "../data-analysis/components/StatsCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function SalesAnalysis() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { activeTab } = useTabStore();
  const { selectedFilter } = useFilterStore();
  const { filterApplied, setFilterApplied } = useFilterEventStore();
  const { shouldFetch, setShouldFetch } = useRefreshStore();
  const [widgets, setWidgets] = useState<WebWidget[]>([]);
  const [widgetData, setWidgetData] = useState<{ [key: number]: any[] }>({});
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(true);
  const [hasFirstWidgetData, setHasFirstWidgetData] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isDataAnalysisTab, setIsDataAnalysisTab] = useState(false);
  const prevFilterRef = useRef(selectedFilter);
  const [statsData, setStatsData] = useState<{
    dailyAvg?: any;
    highestSale?: any;
    totalSale?: any;
    saleDistribution?: any;
  }>({});
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

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
        if (reportId === 565) {
          // Daily Average
          setStatsData(prev => ({ ...prev, dailyAvg: response.data[0] }));
        } else if (reportId === 566) {
          // Highest Sale
          setStatsData(prev => ({ ...prev, highestSale: response.data[0] }));
        } else if (reportId === 567) {
          // Total Sale
          setStatsData(prev => ({ ...prev, totalSale: response.data[0] }));
        } else if (reportId === 568) {
          // Sale Distribution
          setStatsData(prev => ({ ...prev, saleDistribution: response.data[0] }));
        } else {
          // Tüm satış verileri
          const allData = response.data;
          
          // Günlük veriler
          const dailyData = allData.filter((item: any) => item.reportValue2 === "Günlük");
          setDailyData(dailyData);
          
          // Haftalık veriler
          const weeklyData = allData.filter((item: any) => item.reportValue2 === "Haftalık");
          setWeeklyData(weeklyData);
          
          // Aylık veriler
          const monthlyData = allData.filter((item: any) => item.reportValue2 === "Aylık");
          setMonthlyData(monthlyData);
        }

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

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        setIsLoadingWidgets(true);
        const response = await axios.get<WebWidget[]>("/api/dashboard/sales-analysis/sales-widgets", {
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

  useEffect(() => {
    const isDataAnalysis = activeTab === "Günlük-Haftalık-Aylık Satış";
    setIsDataAnalysisTab(isDataAnalysis);
  }, [activeTab]);

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 13, family: 'Inter' },
        cornerRadius: 4,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value.toLocaleString()}M (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: function (context: any) {
          return context.dataset.data[context.dataIndex] !== null &&
            context.dataset.data[context.dataIndex] !== undefined;
        },
        color: '#6B7280',
        anchor: 'end',
        align: 'top',
        offset: -5,
        font: {
          size: 12,
          weight: '500',
          family: 'Inter'
        },
        formatter: (value: number) => value ? value.toLocaleString() + 'M' : ''
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: { size: 12, family: 'Inter' },
          color: '#6B7280',
          padding: 8,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          display: true,
          drawBorder: false,
          color: 'rgba(226, 232, 240, 0.5)',
        },
        ticks: {
          font: { size: 12, family: 'Inter', weight: '500' },
          color: '#374151',
          padding: 12,
          callback: function (value: any) {
            return value + 'M';
          }
        }
      }
    }
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('tr-TR').format(value);
  }

  return (
    <ScrollArea className="h-[calc(90vh-8rem)]">
      <div className="space-y-8 p-2">
        {(isLoadingWidgets || !hasFirstWidgetData) ? (
          <DataLoader fullscreen={false} />
        ) : (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title={widgets.find(widget => widget.ReportID === 565)?.ReportName || ""}
                value={statsData.dailyAvg ? `${formatNumber(statsData.dailyAvg.reportValue1)}` : "Yükleniyor..."}
                subtitle="Son 5 günün ortalaması"
                icon={<TrendingUp className="w-4 h-4" />}
                color="blue"
                className="shadow-sm hover:shadow-md transition-all duration-200" 
              />
              <StatsCard
                title={widgets.find(widget => widget.ReportID === 566)?.ReportName || ""}
                value={statsData.highestSale ? `${formatNumber(statsData.highestSale.reportValue1)}` : "Yükleniyor..."}
                subtitle={statsData.highestSale ? statsData.highestSale.reportValue2 : ""}
                icon={<BarChart2 className="w-4 h-4" />}
                color="purple"
                className="shadow-sm hover:shadow-md transition-all duration-200"
              />
              <StatsCard
                title={widgets.find(widget => widget.ReportID === 567)?.ReportName || ""}
                value={statsData.totalSale ? `${formatNumber(statsData.totalSale.reportValue1)}` : "Yükleniyor..."}
                subtitle="Son 5 günlük toplam"
                icon={<Star className="w-4 h-4" />}
                color="pink"
                className="shadow-sm hover:shadow-md transition-all duration-200"
              />
              <StatsCard
                title={widgets.find(widget => widget.ReportID === 568)?.ReportName || ""}
                value={statsData.saleDistribution ? formatNumber(statsData.saleDistribution.reportValue1) : "Yükleniyor..."}
                subtitle="Farklı satış türü"
                icon={<Calendar className="w-4 h-4" />}
                color="orange"
                className="shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>
  
            {/* Chart Section */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 mt-10">
              <CardHeader className="pb-4">
                <div className="flex flex-col space-y-1.5">
                  <CardTitle className="text-xl font-semibold leading-none tracking-tight">
                    Satış Detayları
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Günlük, haftalık ve aylık satış verilerini görüntüleyin
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="daily" className="w-full">
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <TabsList className="w-full h-12 bg-muted/40 p-1 gap-2">
                      <TabsTrigger
                        value="daily"
                        className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                        icon="⭐">
                        Günlük
                      </TabsTrigger>
                      <TabsTrigger
                        value="weekly"
                        className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                        icon="⭐">
                        Haftalık
                      </TabsTrigger>
                      <TabsTrigger
                        value="monthly"
                        className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                        icon="⭐">
                        Aylık
                      </TabsTrigger>
                    </TabsList>
                  </div>
  
                  <TabsContent value="daily" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                    <DailyTab
                      widgets={widgets}
                      dailyData={dailyData}
                      options={options}
                    />
                  </TabsContent>
  
                  <TabsContent value="weekly" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                    <WeeklyTab
                      widgets={widgets}
                      weeklyData={weeklyData}
                      options={options}
                    />
                  </TabsContent>
  
                  <TabsContent value="monthly" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                    <MonthlyTab
                      widgets={widgets}
                      monthlyData={monthlyData}
                      options={options}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};