"use client";

import { ScrollArea } from "@/components/ui/scroll-area"
import { useCallback, useEffect, useState, useRef } from "react"
import axios from "@/lib/axios"
import { WebWidget } from "@/types/tables"
import { useTabStore } from "@/stores/tab-store"
import { useFilterStore } from "@/stores/filters-store"
import { useFilterEventStore } from "@/stores/filter-event-store"
import { useRefreshStore } from "@/stores/refresh-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/common"
import { Star, XCircle } from "lucide-react"
import { StatsCard } from "../data-analysis/components/StatsCard"
import { DataLoader } from "../data-analysis/components/DataLoader"
import { Building2, Package, UserCircle, UserX, AlertCircle, Clock } from "lucide-react"

interface CancellationData {
  Şube?: string;
  "ÇEK NO"?: number;
  ÜRÜN?: string;
  ADET?: number;
  TUTAR?: number;
  "İPTAL EDEN KULLANICI"?: string;
  SEBEP?: string;
  "EKLEYEN KULLANICI"?: string;
  TARİH?: string;
  "SİPARİŞ SAATİ"?: string;
  "İPTAL SAATİ"?: string;
  Adres?: string | null;
}

export default function CancellationAnalysis() {
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
  const [cancellationData, setCancellationData] = useState<CancellationData[]>([]);

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
        if (reportId === 554) {
          setCancellationData(response.data);
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
        const response = await axios.get<WebWidget[]>("/api/dashboard/cancellation-analysis/cancellation-widgets", {
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
    const isDataAnalysis = activeTab === "İptal İşlemleri";
    setIsDataAnalysisTab(isDataAnalysis);
  }, [activeTab]);

  // Widget verilerini çek
  useEffect(() => {
    if (!isDataAnalysisTab || !widgets.length || document.hidden) return;

    const branches = selectedFilter.selectedBranches.length > 0
      ? selectedFilter.selectedBranches
      : selectedFilter.branches;

    if (!branches || branches.length === 0) return;

    // İlk yükleme
    if (!hasFetched) {
      widgets.forEach(widget => {
        fetchWidgetData(widget.ReportID, true);
      });
      return;
    }

    // Sadece filtre değişimi veya yenileme
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

  // Sadece filtre değişiminde filterApplied'ı true yap
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

  const columns = [
    {
      key: 'Şube' as keyof CancellationData,
      title: 'Şube',
      width: '100px',
      fixed: 'left' as const,
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/5 via-primary/5 to-blue-500/5 flex items-center justify-center ring-1 ring-border/50">
              <Building2 className="w-4 h-4 text-primary/40" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{item.Şube}</span>
          </div>
        </div>
      )
    },
    {
      key: 'TARİH' as keyof CancellationData,
      title: 'Tarih',
      width: '100px',
      sortable: true,
      render: (item: CancellationData) => (
        <span>{new Date(item.TARİH).toLocaleDateString('tr-TR')}</span>
      )
    },
    {
      key: 'ÇEK NO' as keyof CancellationData,
      title: 'No',
      width: '100px',
      sortable: true,
    },
    {
      key: 'ÜRÜN' as keyof CancellationData,
      title: 'Ürün',
      width: '200px',
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-violet-500" />
          <span>{item.ÜRÜN}</span>
        </div>
      )
    },
    {
      key: 'ADET' as keyof CancellationData,
      title: 'Adet',
      width: '50px',
      sortable: true,
      render: (item: CancellationData) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/10 via-primary/10 to-blue-500/10 text-primary ring-1 ring-primary/20">
          {item.ADET}
        </span>
      )
    },
    {
      key: 'EKLEYEN KULLANICI' as keyof CancellationData,
      title: 'Ekleyen Kullanıcı',
      width: '150px',
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-2">
          <UserCircle className="w-4 h-4 text-blue-500" />
          <span>{item["EKLEYEN KULLANICI"]}</span>
        </div>
      )
    },
    {
      key: 'İPTAL EDEN KULLANICI' as keyof CancellationData,
      title: 'İptal Eden Kullanıcı',
      width: '150px',
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-2">
          <UserX className="w-4 h-4 text-red-500" />
          <span>{item["İPTAL EDEN KULLANICI"]}</span>
        </div>
      )
    },
    {
      key: 'SEBEP' as keyof CancellationData,
      title: 'Sebep',
      width: '200px',
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span>{item.SEBEP}</span>
        </div>
      )
    },
    {
      key: 'İPTAL SAATİ' as keyof CancellationData,
      title: 'İptal Saati',
      width: '100px',
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          <span>{item["İPTAL SAATİ"]}</span>
        </div>
      )
    },
    {
      key: 'SİPARİŞ SAATİ' as keyof CancellationData,
      title: 'Sipariş Saati',
      width: '120px',
      sortable: true,
      render: (item: CancellationData) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-500" />
          <span>{item["SİPARİŞ SAATİ"]}</span>
        </div>
      )
    },
    {
      key: 'TUTAR' as keyof CancellationData,
      title: 'Tutar',
      width: '120px',
      sortable: true,
      render: (item: CancellationData) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 ring-1 ring-red-500/20">
          {item.TUTAR.toLocaleString('tr-TR')} ₺
        </span>
      )
    }
  ];

  const filters = [
    {
      key: 'Şube' as keyof CancellationData,
      title: 'Şube',
      options: Array.from(new Set(cancellationData.map(item => item.Şube))).map(sube => ({
        label: sube,
        value: sube
      }))
    },
    {
      key: 'EKLEYEN KULLANICI' as keyof CancellationData,
      title: 'Ekleyen Kullanıcı',
      options: Array.from(new Set(cancellationData.map(item => item["EKLEYEN KULLANICI"]))).map(user => ({
        label: user,
        value: user
      }))
    },
    {
      key: 'İPTAL EDEN KULLANICI' as keyof CancellationData,
      title: 'İptal Eden Kullanıcı',
      options: Array.from(new Set(cancellationData.map(item => item["İPTAL EDEN KULLANICI"]))).map(user => ({
        label: user,
        value: user
      }))
    }
  ];

  return (
    <ScrollArea className="h-[calc(90vh-8rem)]">
      <div className="space-y-6 p-6">
        {(isLoadingWidgets || !hasFirstWidgetData) ? (
          <DataLoader fullscreen={false} />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
              {widgets.find(widget => widget.ReportID === 552) && (
                <StatsCard
                  title="İptal İşlemleri Toplam"
                  value={(widgetData[552]?.[0]?.reportValue1 ?? 0).toLocaleString('tr-TR') + " ₺"}
                  subtitle="toplam iptal tutarı"
                  icon={<Star className="w-4 h-4" />}
                  color="red"
                />
              )}
              {widgets.find(widget => widget.ReportID === 553) && (
                <StatsCard
                  title="İptal İşlemleri Toplam Adet"
                  value={widgetData[553]?.[0]?.reportValue1.toLocaleString('tr-TR')}
                  subtitle="adet ürün"
                  icon={<XCircle className="w-4 h-4" />}
                  color="red"
                />
              )}
            </div>

            {/* Table Section */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle>İptal İşlemleri Liste</CardTitle>
              </CardHeader>
              <CardContent>
                {widgets.find(widget => widget.ReportID === 554) && (
                  <DataTable
                    data={cancellationData}
                    columns={columns}
                    filters={filters}
                    searchFields={['Şube', 'ÜRÜN', 'EKLEYEN KULLANICI', 'İPTAL EDEN KULLANICI', 'SEBEP']}
                    isLoading={isLoadingWidgets}
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
