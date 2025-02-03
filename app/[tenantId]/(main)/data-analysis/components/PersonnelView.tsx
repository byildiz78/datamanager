import { StatsCard } from "./StatsCard"
import { TopBranchesChart } from "./TopBranchesChart"
import { Star, Users } from "lucide-react"
import { BranchData } from "../data-analysis-types"

interface PersonnelViewProps {
  widgets: Array<{
    ReportID: number;
    ReportName: string;
  }>;
  widgetData: Record<number, any>;
  isLoading: Record<number, boolean>;
  isUpdating: Record<number, boolean>;
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('tr-TR').format(value);
}

export function PersonnelView({ widgets, widgetData, isLoading, isUpdating }: PersonnelViewProps) {
  // Widget verilerini ID'ye göre objeye dönüştür
  const widgetsById = widgets.reduce((acc, widget) => {
    acc[widget.ReportID] = widget;
    return acc;
  }, {} as Record<number, typeof widgets[0]>);

  // TopBranchesChart için veriyi dönüştür
  const transformTopBranchesData = (reportId: number): BranchData[] => {
    const data = widgetData[reportId];
    // Eğer data yoksa veya array değilse ve tek bir obje ise, onu array'e çevir
    const dataArray = Array.isArray(data) ? data : [data];
    
    // Her bir öğeyi dönüştür
    return dataArray.map(item => {
      if (!item) return null;
      return {
        reportValue1: String(item.reportValue1 || ''),
        reportValue2: Number(item.reportValue2 || 0)
      };
    }).filter(Boolean) as BranchData[];
  };

  // Widget değerini al
  const getWidgetValue = (reportId: number): string => {
    const data = widgetData[reportId];
    if (!data) return "0";

    // Array kontrolü
    if (Array.isArray(data)) {
      const firstItem = data[0];
      return firstItem?.reportValue2 
        ? formatNumber(Number(firstItem.reportValue2))
        : firstItem?.reportValue1 
          ? formatNumber(Number(firstItem.reportValue1))
          : "0";
    }
    
    // Tekil obje kontrolü
    return data.reportValue2 
      ? formatNumber(Number(data.reportValue2))
      : data.reportValue1 
        ? formatNumber(Number(data.reportValue1))
        : "0";
  };

  // TopBranchesChart render kontrolü
  const renderTopBranchesChart = () => {
    const reportId = 546;
    if (!widgetsById[reportId] || !widgetData[reportId]) {
      return null;
    }

    const chartData = transformTopBranchesData(reportId);
    return (
      <TopBranchesChart
        data={chartData}
        title={widgetsById[reportId].ReportName}
        type="Personel Bazlı"
      />
    );
  };

  // En yüksek satış yapan personelin adını al
  const getTopPerformerName = (reportId: number): string => {
    const data = widgetData[reportId];
    if (!data || !Array.isArray(data) || data.length === 0) return "";
    return data[0]?.reportValue1 || "";
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7 space-y-6">
        {renderTopBranchesChart()}
      </div>

      <div className="col-span-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[547, 548, 549, 550].map(reportId => (
            widgetsById[reportId] && widgetData[reportId] && (
              <StatsCard
                key={reportId}
                title={widgetsById[reportId].ReportName.trim()}
                value={getWidgetValue(reportId)}
                subtitle={
                  reportId === 547 ? "Aktif Çalışan" :
                  reportId === 548 ? "Kişi Başı" :
                  reportId === 549 ? getTopPerformerName(546) : // En iyi performans gösteren personelin adını al
                  reportId === 550 ? "Geçen Aya Göre" :
                  widgetsById[reportId].ReportName.trim()
                }
                icon={
                  reportId === 547 ? <Users className="w-4 h-4 text-yellow-400" /> :
                  <Star className="w-4 h-4 text-yellow-400" />
                }
                color={
                  reportId === 547 ? "blue" :
                  reportId === 548 ? "purple" :
                  reportId === 549 ? "pink" :
                  "orange"
                }
              />
            )
          ))}
        </div>
      </div>
    </div>
  )
}
