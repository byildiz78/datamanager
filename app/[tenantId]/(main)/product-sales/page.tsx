"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Mock data for En Çok Satan 10 Ürün Bar Chart
const mockData = {
  labels: ['Izgara Köfte', 'Ayran', 'Kola', 'Tavuk Şiş', 'Pide', 'Künefe', 'İskender', 'Lahmacun', 'Kebap', 'Baklava'],
  datasets: [
    {
      label: 'Satış Adedi',
      data: [150, 120, 110, 95, 85, 80, 75, 70, 65, 60],
      backgroundColor: [
        '#4F46E5', // Indigo
        '#7C3AED', // Purple
        '#EC4899', // Pink
        '#10B981', // Emerald
        '#F59E0B', // Amber
        '#3B82F6', // Blue
        '#EF4444', // Red
        '#8B5CF6', // Violet
        '#06B6D4', // Cyan
        '#F97316'  // Orange
      ],
      borderRadius: 6,
      borderWidth: 0,
      maxBarThickness: 40,
    }
  ],
};

// Chart options for En Çok Satan 10 Ürün Bar Chart
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
          return `${context.dataset.label}: ${context.parsed.y} adet`;
        }
      }
    },
    datalabels: {
      display: true,
      color: '#6B7280',
      anchor: 'end',
      align: 'top',
      offset: -5,
      font: {
        size: 12,
        weight: '500',
        family: 'Inter'
      },
      formatter: (value: number) => value.toLocaleString() + ' adet'
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
      },
      border: {
        display: false
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
      },
      border: {
        display: false
      }
    }
  },
  layout: {
    padding: {
      top: 20
    }
  }
};

// Mock data for Kategori Satışları Bar Chart
const kategoriMockData = {
  labels: ['ET/TAVUK', 'SICAK İÇECEK', 'Ana Menü', 'BAŞLANGIÇ'],
  datasets: [
    {
      label: 'Satış',
      data: [230, 34.3, 31.5, 22.3],
      backgroundColor: ['#D4AF37', '#9C27B0', '#FF9800', '#4CAF50'],
    }
  ],
};

// Chart options for Kategori chart
const kategoriOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: (value: number) => value + 'k',
      font: {
        weight: 'bold'
      },
      padding: 4
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return value + 'k';
        }
      }
    }
  }
};

// Mock data for Grup Satışları Bar Chart
const grupMockData = {
  labels: ['YİYECEK', 'İÇECEK', 'Ana Menü'],
  datasets: [
    {
      label: 'Satış',
      data: [252390, 34315, 31290],
      backgroundColor: ['#E91E63', '#9C27B0', '#00BCD4'],
    }
  ],
};

// Chart options for Grup chart
const grupOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: (value: number) => value.toLocaleString(),
      font: {
        weight: 'bold'
      },
      padding: 4
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return value.toLocaleString();
        }
      }
    }
  }
};

// Mock data for Saatlik Satışlar Bar Chart
const saatlikMockData = {
  labels: ['10:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
  datasets: [
    {
      label: 'Satış',
      data: [315, 5280, 8950, 19700, 32700, 51400, 61900, 56400, 67400, 51500, 33800, 7340, 670],
      backgroundColor: '#00796B',
      borderRadius: 4,
    }
  ],
};

// Chart options for Saatlik chart
const saatlikOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: (value: number) => value.toLocaleString() + 'k',
      font: {
        weight: 'bold',
        size: 11
      },
      padding: 4,
      color: '#666'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#e5e5e5',
      },
      ticks: {
        callback: function(value: any) {
          return value + 'k';
        },
        font: {
          size: 11
        },
        color: '#666'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#666'
      }
    }
  }
};

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactElement;
  color?: "blue" | "red";
}

function StatsCard({ title, value, subtitle, icon, color = "blue" }: StatsCardProps) {
  const gradients = {
    blue: "from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20",
    red: "from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20",
  };

  const iconGradients = {
    blue: "from-blue-500 to-sky-500",
    red: "from-red-500 to-rose-500",
  };

  return (
    <Card className={`bg-gradient-to-br ${gradients[color]} hover:shadow-lg transition-all duration-200 overflow-hidden relative group`}>
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-white/20 dark:from-black/5 dark:to-black/20 blur-2xl transform group-hover:scale-110 transition-transform duration-500" />
      <div className="p-4">
        <div className="flex justify-between items-start relative">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradients[color]} bg-opacity-10`}>
                {React.cloneElement(icon, { className: "w-4 h-4 text-white" })}
              </div>
              <h3 className="text-sm font-medium text-muted-foreground tracking-tight">{title}</h3>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ProductSales() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-8 p-8">
        <Tabs defaultValue="special" className="w-full">
          <TabsList className="w-full h-12 bg-muted/40 p-1 gap-2">
            <TabsTrigger 
              value="special"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4" />
                <span>Özel Bilgiler</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="category"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4" />
                <span>Kategori - Grup Satışları</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="hourly"
              className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4" />
                <span>Saatlik Satışlar</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="special" className="mt-6">
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatsCard
                  title="Ürün Bazlı Satış Tutarı"
                  value="397,423"
                  subtitle="toplam satış tutarı"
                  icon={<Star className="w-4 h-4" />}
                  color="blue"
                />
                <StatsCard
                  title="Ürün Bazlı satış adeti"
                  value="3,034"
                  subtitle="toplam porsiyon adeti"
                  icon={<Star className="w-4 h-4" />}
                  color="red"
                />
              </div>

              {/* Chart Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">En Çok Satan 10 Ürün</CardTitle>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        <span>Satış Adedi</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <Bar options={options} data={mockData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="category" className="mt-6">
            <div className="space-y-6">
              {/* Kategori Satışları Chart */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Kategori Satışları Bar</CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="grouped" name="chartType" defaultChecked />
                        <label htmlFor="grouped" className="text-sm">Grouped</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="stacked" name="chartType" />
                        <label htmlFor="stacked" className="text-sm">Stacked</label>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <Bar options={kategoriOptions} data={kategoriMockData} />
                  </div>
                </CardContent>
              </Card>

              {/* Grup Satışları Chart */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Grup Satışları Bar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <Bar options={grupOptions} data={grupMockData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hourly" className="mt-6">
            <div className="space-y-6">
              {/* Saatlik Satışlar Chart */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>Saatlik Satışlar Bar</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <Bar options={saatlikOptions} data={saatlikMockData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
