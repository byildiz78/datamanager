import { StatsCard } from "./StatsCard"
import { TopBranchesChart } from "./TopBranchesChart"
import { Star, ShoppingBag } from "lucide-react"
import { BranchData } from "../data-analysis-types"

interface SalesByTypeViewProps {
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

export function SalesByTypeView({ widgets, widgetData, isLoading, isUpdating }: SalesByTypeViewProps) {
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
    const reportId = 541;
    if (!widgetsById[reportId] || !widgetData[reportId]) {
      return null;
    }

    const chartData = transformTopBranchesData(reportId);
    return (
      <TopBranchesChart
        data={chartData}
        title={widgetsById[reportId].ReportName}
        type="Satış Türlerine Göre"
      />
    );
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7 space-y-6">
        {renderTopBranchesChart()}
      </div>

      <div className="col-span-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[542, 543, 544, 545].map(reportId => (
            widgetsById[reportId] && widgetData[reportId] && (
              <StatsCard
                key={reportId}
                title={widgetsById[reportId].ReportName.trim()}
                value={getWidgetValue(reportId)}
                subtitle={
                  reportId === 542 ? (Array.isArray(widgetData[reportId]) 
                    ? widgetData[reportId][0]?.reportValue1 
                    : widgetData[reportId]?.reportValue1) || "En Çok Satan Tür" :
                  reportId === 543 ? "Tüm Satış Türleri" :
                  reportId === 544 ? "Aktif Satış Kanalı" :
                  reportId === 545 ? "Geçen Aya Göre" :
                  widgetsById[reportId].ReportName.trim()
                }
                icon={
                  reportId === 542 ? <ShoppingBag className="w-4 h-4 text-yellow-400" /> :
                  <Star className="w-4 h-4 text-yellow-400" />
                }
                color={
                  reportId === 542 ? "blue" :
                  reportId === 543 ? "purple" :
                  reportId === 544 ? "pink" :
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
