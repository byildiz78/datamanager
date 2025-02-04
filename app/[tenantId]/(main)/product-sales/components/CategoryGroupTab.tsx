import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataLoader } from '../../data-analysis/components/DataLoader';
import { Bar } from 'react-chartjs-2';
import { WebWidget } from '@/types/tables';
import { ProductSalesData } from '../types';

interface CategoryGroupTabProps {
  isLoadingWidgets: boolean;
  hasFirstWidgetData: boolean;
  widgets: WebWidget[];
  categoryData: ProductSalesData[];
  groupData: ProductSalesData[];
  options: any;
}

export function CategoryGroupTab({
  isLoadingWidgets,
  hasFirstWidgetData,
  widgets,
  categoryData,
  groupData,
  options
}: CategoryGroupTabProps) {
  if (isLoadingWidgets || !hasFirstWidgetData) {
    return <DataLoader fullscreen={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Category Sales Chart */}
      {widgets.find(widget => widget.ReportID === 562) && categoryData && (
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Kategori Satışları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar 
                key="category-sales-chart"
                options={options} 
                data={{
                labels: categoryData.map((item: ProductSalesData) => item.reportValue1),
                datasets: [{
                  label: 'Satış Tutarı',
                  data: categoryData.map((item: ProductSalesData) => item.reportValue2),
                  backgroundColor: ['#D4AF37', '#9C27B0', '#FF9800', '#4CAF50'],
                }]
              }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Sales Chart */}
      {widgets.find(widget => widget.ReportID === 563) && groupData && (
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Grup Satışları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar 
                key="group-sales-chart"
                options={options} 
                data={{
                labels: groupData.map((item: ProductSalesData) => item.reportValue1),
                datasets: [{
                  label: 'Satış Tutarı',
                  data: groupData.map((item: ProductSalesData) => item.reportValue2),
                  backgroundColor: ['#E91E63', '#9C27B0', '#00BCD4'],
                }]
              }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
