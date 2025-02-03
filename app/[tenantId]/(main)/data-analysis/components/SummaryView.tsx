import { StatsCard } from "./StatsCard"
import { TopBranchesChart } from "./TopBranchesChart"
import { Star, Users, Building2 } from "lucide-react"
import { BranchData } from "../data-analysis-types"

interface SummaryViewProps {
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

export function SummaryView({ widgets, widgetData, isLoading, isUpdating }: SummaryViewProps) {
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
    const result = dataArray.map(item => {
      if (!item) return null;
      return {
        reportValue1: String(item.reportValue1 || ''),
        reportValue2: Number(item.reportValue2 || 0)
      };
    }).filter(Boolean) as BranchData[];

    return result;
  };

  // Widget değerini al (tek değer için)
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
    const reportId = 535;
    if (!widgetsById[reportId] || !widgetData[reportId]) {
      return null;
    }

    const chartData = transformTopBranchesData(reportId);
    return (
      <TopBranchesChart
        data={chartData}
        title={widgetsById[reportId].ReportName}
        type="Toplam Ciro"
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
          {[536, 551, 537, 538, 539, 540].map(reportId => (
            widgetsById[reportId] && widgetData[reportId] && (
              <StatsCard
                key={reportId}
                title={widgetsById[reportId].ReportName.trim()}
                value={getWidgetValue(reportId)}
                subtitle={
                  reportId === 536 ? "Toplam Ciro" :
                  reportId === 551 ? "Toplam indirim" :
                  reportId === 537 ? "Adet Adisyon" :
                  reportId === 538 ? "Kişi Başı Ortalama Harcama" :
                  reportId === 539 ? "Kişi" :
                  reportId === 540 ? "Aktif Şube Sayısı" :
                  widgetsById[reportId].ReportName.trim()
                }
                icon={
                  reportId === 539 ? <Users className="w-4 h-4 text-yellow-400" /> :
                  reportId === 540 ? <Building2 className="w-4 h-4 text-yellow-400" /> :
                  <Star className="w-4 h-4 text-yellow-400" />
                }
                color={
                  reportId === 536 ? "blue" :
                  reportId === 551 ? "purple" :
                  reportId === 537 ? "pink" :
                  reportId === 538 ? "orange" :
                  reportId === 539 ? "green" :
                  "indigo"
                }
              />
            )
          ))}
        </div>
      </div>
    </div>
  )
}
