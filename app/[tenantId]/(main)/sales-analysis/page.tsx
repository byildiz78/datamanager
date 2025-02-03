"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, BarChart2, Star } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { StatsCard } from "../data-analysis/components/StatsCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'start',
      labels: {
        padding: 25,
        font: { size: 12, family: 'Inter' },
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 6
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'rgb(255, 255, 255)',
      bodyColor: 'rgb(255, 255, 255)',
      padding: 12,
      titleFont: { size: 14, family: 'Inter' },
      bodyFont: { size: 13, family: 'Inter' },
      cornerRadius: 4,
      displayColors: true,
      boxPadding: 4,
      usePointStyle: true,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(1) + 'M';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { 
        font: { size: 12, family: 'Inter' },
        padding: 8,
        color: '#64748b'
      },
      border: { display: false }
    },
    y: {
      stacked: true,
      grid: {
        color: 'rgba(226, 232, 240, 0.5)',
        drawBorder: false,
        lineWidth: 1
      },
      border: { display: false },
      ticks: {
        font: { size: 12, family: 'Inter' },
        padding: 12,
        maxTicksLimit: 8,
        color: '#64748b',
        callback: function(value: any) {
          return value + 'M';
        }
      }
    }
  },
  layout: {
    padding: {
      top: 25,
      right: 25,
      bottom: 15,
      left: 15
    }
  },
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  }
};

const mockData = {
  labels: ['27', '28', '29', '30', '31', 'Feb'],
  datasets: [
    {
      label: 'MASA SERVİS',
      data: [22, 25, 25, 23, 25, 0.355],
      backgroundColor: 'rgb(99, 102, 241)',
      hoverBackgroundColor: 'rgb(79, 82, 221)',
      stack: 'Stack 0'
    },
    {
      label: 'PAKET SERVİS',
      data: [4, 4, 4, 5, 5, 0],
      backgroundColor: 'rgb(168, 85, 247)',
      hoverBackgroundColor: 'rgb(148, 65, 227)',
      stack: 'Stack 0'
    },
    {
      label: 'TEZGAH',
      data: [2, 2, 2, 2, 2, 0],
      backgroundColor: 'rgb(236, 72, 153)',
      hoverBackgroundColor: 'rgb(216, 52, 133)',
      stack: 'Stack 0'
    },
    {
      label: 'AL GÖTÜR',
      data: [1.8, 1, 1, 1, 1, 0],
      backgroundColor: 'rgb(249, 115, 22)',
      hoverBackgroundColor: 'rgb(229, 95, 2)',
      stack: 'Stack 0'
    },
    {
      label: 'YEMEK ÇEK',
      data: [0.2, 0.3, 0.3, 0.4, 0.4, 0],
      backgroundColor: 'rgb(234, 179, 8)',
      hoverBackgroundColor: 'rgb(214, 159, 0)',
      stack: 'Stack 0'
    }
  ],
};

const BarChart = ({ data }: { data: typeof mockData }) => {
  return (
    <Bar options={options} data={data} plugins={[{
      id: 'totalLabels',
      afterDraw: (chart: any) => {
        const ctx = chart.ctx;
        chart.data.labels.forEach((label: string, index: number) => {
          const total = chart.data.datasets.reduce((sum: number, dataset: any) => {
            return sum + (dataset.data[index] || 0);
          }, 0);
          
          if (total > 0) {
            const meta = chart.getDatasetMeta(chart.data.datasets.length - 1);
            const bar = meta.data[index];
            const x = bar.x;
            const y = chart.scales.y.getPixelForValue(total);
            
            ctx.save();
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(total.toFixed(1) + 'M', x, y - 5);
            ctx.restore();
          }
        });
      }
    }]} />
  );
};

export default function SalesAnalysis() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-8 p-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Günlük Ortalama"
            value="30.2M"
            subtitle="Son 5 günün ortalaması"
            icon={<TrendingUp className="w-4 h-4" />}
            color="blue"
            className="shadow-sm hover:shadow-md transition-all duration-200"
          />
          <StatsCard
            title="En Yüksek Satış"
            value="32.3M"
            subtitle="28 Ocak tarihinde"
            icon={<BarChart2 className="w-4 h-4" />}
            color="purple"
            className="shadow-sm hover:shadow-md transition-all duration-200"
          />
          <StatsCard
            title="Toplam Satış"
            value="151M"
            subtitle="Son 5 günlük toplam"
            icon={<Star className="w-4 h-4" />}
            color="pink"
            className="shadow-sm hover:shadow-md transition-all duration-200"
          />
          <StatsCard
            title="Satış Dağılımı"
            value="5"
            subtitle="Farklı satış türü"
            icon={<Calendar className="w-4 h-4" />}
            color="orange"
            className="shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>

        {/* Chart Section */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-1.5">
              <CardTitle className="text-xl font-semibold leading-none tracking-tight">Satış Detayları</CardTitle>
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
                  >
                    Günlük
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weekly"
                    className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    Haftalık
                  </TabsTrigger>
                  <TabsTrigger 
                    value="monthly"
                    className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    Aylık
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="daily" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="h-[540px] w-full">
                  <BarChart data={mockData} />
                </div>
              </TabsContent>
              
              <TabsContent value="weekly" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="h-[540px] w-full">
                  <BarChart data={mockData} />
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="h-[540px] w-full">
                  <BarChart data={mockData} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
