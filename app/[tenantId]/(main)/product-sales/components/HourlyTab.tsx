import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataLoader } from '../../data-analysis/components/DataLoader';
import { Bar } from 'react-chartjs-2';
import { WebWidget } from '@/types/tables';
import { ProductSalesData } from '../types';

interface HourlyTabProps {
  isLoadingWidgets: boolean;
  hasFirstWidgetData: boolean;
  widgets: WebWidget[];
  hourlyData: ProductSalesData[];
  options: any;
}

export function HourlyTab({
  isLoadingWidgets,
  hasFirstWidgetData,
  widgets,
  hourlyData,
  options
}: HourlyTabProps) {
  if (isLoadingWidgets || !hasFirstWidgetData) {
    return <DataLoader fullscreen={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Hourly Sales Chart */}
      {widgets.find(widget => widget.ReportID === 564) && hourlyData && (
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Saatlik Satışlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <Bar 
                key="hourly-sales-chart"
                options={options} 
                data={{
                labels: hourlyData.map((item: ProductSalesData) => item.reportValue1),
                datasets: [{
                  label: 'Satış Tutarı',
                  data: hourlyData.map((item: ProductSalesData) => item.reportValue2),
                  backgroundColor: '#00796B',
                  borderRadius: 4,
                }]
              }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
