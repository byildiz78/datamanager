import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryView } from "./components/SummaryView"
import { SalesByTypeView } from "./components/SalesByTypeView"
import { PersonnelView } from "./components/PersonnelView"
import { DataLoader } from "./components/DataLoader"
import { useCallback, useEffect, useState, useRef } from "react"
import axios from "@/lib/axios"
import { WebWidget } from "@/types/tables"
import { useTabStore } from "@/stores/tab-store"
import { useFilterStore } from "@/stores/filters-store"
import { useFilterEventStore } from "@/stores/filter-event-store"
import { useRefreshStore } from "@/stores/refresh-store"

export default function DataAnalysisPage() {
  const [widgets, setWidgets] = useState<WebWidget[]>([]);
  const { tabs, activeTab } = useTabStore();
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
        setWidgetData(prev => ({
          ...prev,
          [reportId]: Array.isArray(response.data) ? response.data : [response.data]
        }));
        setHasFetched(true);
        
        // İlk başarılı widget verisi geldiğinde
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
        const response = await axios.get<WebWidget[]>("/api/dashboard/turnover-summary/turnover-widgets", {
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
    const isDataAnalysis = activeTab === "Cirolar Özet";
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
    // selectedFilter.branches,
    // selectedFilter.selectedBranches
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

  // Yükleme durumunu kontrol et
  const isInitialLoading = !hasFetched && Object.values(isLoading).some(Boolean);
  const hasAnyData = Object.keys(widgetData).length > 0;

  return (
    <ScrollArea className="h-[calc(90vh-8rem)]">
      <div className="space-y-6 p-6">
        <Tabs defaultValue="summary" className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-3">
            <TabsList className="bg-transparent border-b pb-px">
              <TabsTrigger
                value="summary"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                icon="∑">
                Özet Veriler
              </TabsTrigger>
              <TabsTrigger
                value="sales-by-type"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                icon="⭐">
                Satış Türüne Göre
              </TabsTrigger>
              <TabsTrigger
                value="personnel"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                icon="⭐">
                Personele Göre
              </TabsTrigger>
            </TabsList>
          </div>

          {(isLoadingWidgets || !hasFirstWidgetData) ? (
            <div className="mt-6">
              <DataLoader fullscreen={false} />
            </div>
          ) : (
            <>
              <TabsContent value="summary" className="mt-6">
                <SummaryView
                  widgets={widgets}
                  widgetData={widgetData}
                  isLoading={isLoading}
                  isUpdating={isUpdating}
                />
              </TabsContent>

              <TabsContent value="sales-by-type" className="mt-6">
                <SalesByTypeView
                  widgets={widgets}
                  widgetData={widgetData}
                  isLoading={isLoading}
                  isUpdating={isUpdating}
                />
              </TabsContent>

              <TabsContent value="personnel" className="mt-6">
                <PersonnelView
                  widgets={widgets}
                  widgetData={widgetData}
                  isLoading={isLoading}
                  isUpdating={isUpdating}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </ScrollArea>
  )
}
