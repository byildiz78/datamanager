"use client";

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
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
import { ProductSalesData } from './types';
import axios from '@/lib/axios';
import { SpecialInfoTab } from './components/SpecialInfoTab';
import { CategoryGroupTab } from './components/CategoryGroupTab';
import { HourlyTab } from './components/HourlyTab';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function ProductSales() {
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
  const [topProductsData, setTopProductsData] = useState<ProductSalesData[]>(null);
  const [categoryData, setCategoryData] = useState<ProductSalesData[]>(null);
  const [groupData, setGroupData] = useState<ProductSalesData[]>(null);
  const [hourlyData, setHourlyData] = useState<ProductSalesData[]>(null);

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
        if (reportId === 561) {
          // Top 10 products - Sort by reportValue2 (quantity) descending
          const sortedData = response.data
            .sort((a: any, b: any) => b.reportValue2 - a.reportValue2)
            .slice(0, 10);
          setTopProductsData(sortedData);
        } else if (reportId === 562) {
          // Category sales - Group by category and sum reportValue2
          const groupedData = response.data.reduce((acc: any, curr: any) => {
            const category = curr.reportValue1;
            if (!acc[category]) {
              acc[category] = { reportValue1: category, reportValue2: 0 };
            }
            acc[category].reportValue2 += parseFloat(curr.reportValue2);
            return acc;
          }, {});
          
          const categoryData = Object.values(groupedData)
            .sort((a: any, b: any) => b.reportValue2 - a.reportValue2);
          setCategoryData(categoryData);
        } else if (reportId === 563) {
          // Group sales - Group by group and sum reportValue2
          const groupedData = response.data.reduce((acc: any, curr: any) => {
            const group = curr.reportValue1;
            if (!acc[group]) {
              acc[group] = { reportValue1: group, reportValue2: 0 };
            }
            acc[group].reportValue2 += parseFloat(curr.reportValue2);
            return acc;
          }, {});
          
          const groupSalesData = Object.values(groupedData)
            .sort((a: any, b: any) => b.reportValue2 - a.reportValue2);
          setGroupData(groupSalesData);
        } else if (reportId === 564) {
          // Hourly sales - Group by hour and sum reportValue2
          const groupedData = response.data.reduce((acc: any, curr: any) => {
            const hour = curr.reportValue1;
            if (!acc[hour]) {
              acc[hour] = { reportValue1: hour, reportValue2: 0 };
            }
            acc[hour].reportValue2 += parseFloat(curr.reportValue2);
            return acc;
          }, {});
          
          const hourlyData = Object.values(groupedData)
            .sort((a: any, b: any) => a.reportValue1 - b.reportValue1);
          setHourlyData(hourlyData);
        } else {
          setWidgetData(prev => ({
            ...prev,
            [reportId]: Array.isArray(response.data) ? response.data : [response.data]
          }));
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

  // Widget listesini çek
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        setIsLoadingWidgets(true);
        const response = await axios.get<WebWidget[]>("/api/dashboard/product-sales/product-widgets", {
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
    const isDataAnalysis = activeTab === "Ürün Bazlı Satışlar";
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
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.dataset.label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: function(context: any) {
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
        formatter: (value: number) => value ? value.toLocaleString() : ''
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
        }
      }
    }
  };

  return (
    <ScrollArea className="h-[calc(90vh-8rem)]">
      <div className="space-y-8 p-4">
        <Tabs defaultValue="special" className="w-full">
          <TabsList className="w-full h-12 bg-muted/40 p-1 gap-2">
            <TabsTrigger 
              value="special"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              icon="⭐">
              <div className="flex items-center space-x-1.5">
                <span>Özel Bilgiler</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="category"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              icon="⭐">
              <div className="flex items-center space-x-1.5">
                <span>Kategori - Grup Satışları</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="hourly"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
              icon="⭐">
              <div className="flex items-center space-x-1.5">
                <span>Saatlik Satışlar</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="special" className="mt-6">
            <SpecialInfoTab
              isLoadingWidgets={isLoadingWidgets}
              hasFirstWidgetData={hasFirstWidgetData}
              widgets={widgets}
              widgetData={widgetData}
              topProductsData={topProductsData}
              options={options}
            />
          </TabsContent>

          <TabsContent value="category" className="mt-6">
            <CategoryGroupTab
              isLoadingWidgets={isLoadingWidgets}
              hasFirstWidgetData={hasFirstWidgetData}
              widgets={widgets}
              categoryData={categoryData}
              groupData={groupData}
              options={options}
            />
          </TabsContent>

          <TabsContent value="hourly" className="mt-6">
            <HourlyTab
              isLoadingWidgets={isLoadingWidgets}
              hasFirstWidgetData={hasFirstWidgetData}
              widgets={widgets}
              hourlyData={hourlyData}
              options={options}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
