import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/app/[tenantId]/(main)/data-analysis/components/StatsCard";
import { DataLoader } from '../../data-analysis/components/DataLoader';
import { Bar } from 'react-chartjs-2';
import { Star, DollarSign } from "lucide-react";
import { WebWidget } from '@/types/tables';
import { ProductSalesData } from '../types';

interface SpecialInfoTabProps {
  isLoadingWidgets: boolean;
  hasFirstWidgetData: boolean;
  widgets: WebWidget[];
  widgetData: { [key: number]: any[] };
  topProductsData: ProductSalesData[];
  options: any;
}

export function SpecialInfoTab({
  isLoadingWidgets,
  hasFirstWidgetData,
  widgets,
  widgetData,
  topProductsData,
  options
}: SpecialInfoTabProps) {
  if (isLoadingWidgets || !hasFirstWidgetData) {
    return <DataLoader fullscreen={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {widgets.find(widget => widget.ReportID === 559) && (
          <StatsCard
            title={widgets.find(widget => widget.ReportID === 559)?.ReportName || ""}
            value={widgetData[559]?.[0]?.reportValue1.toLocaleString('tr-TR') + " ₺"}
            subtitle="Toplam Satış Tutarı"
            icon={<DollarSign className="w-4 h-4" />}
            color="blue"
          />
        )}
        {widgets.find(widget => widget.ReportID === 560) && (
          <StatsCard
            title={widgets.find(widget => widget.ReportID === 560)?.ReportName || ""}
            value={widgetData[560]?.[0]?.reportValue1.toLocaleString('tr-TR')}
            subtitle="Toplam Porsiyon Adeti"
            icon={<Star className="w-4 h-4" />}
            color="green"
          />
        )}
      </div>

      {/* Top Products Chart */}
      {widgets.find(widget => widget.ReportID === 561) && topProductsData && (
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">En Çok Satan 10 Ürün</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <Bar 
                key="top-products-chart"
                options={options} 
                data={{
                labels: topProductsData.map((item: ProductSalesData) => item.reportValue1),
                datasets: [{
                  label: 'Satış Adedi',
                  data: topProductsData.map((item: ProductSalesData) => item.reportValue2),
                  backgroundColor: [
                    '#4F46E5', '#7C3AED', '#EC4899', '#10B981', '#F59E0B',
                    '#3B82F6', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'
                  ],
                  borderRadius: 6,
                  maxBarThickness: 40,
                }]
              }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
