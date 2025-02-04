import React from 'react';
import { Bar } from 'react-chartjs-2';
import { DataLoader } from '../../data-analysis/components/DataLoader';
import { WebWidget } from '@/types/tables';

interface WeeklyTabProps {
  widgets: WebWidget[];
  weeklyData: any[];
  options: any;
}

export function WeeklyTab({
  widgets,
  weeklyData,
  options
}: WeeklyTabProps) {

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('tr-TR').format(value);
  }

  const chartData = {
    labels: ['Haftalık'],
    datasets: [
      {
        label: 'MASA SATIŞ',
        data: [weeklyData.find(item => item.reportValue1 === "Masa Satış")?.reportValue3 || 0],
        backgroundColor: 'rgb(99, 102, 241)',
        hoverBackgroundColor: 'rgb(79, 82, 221)',
        stack: 'Stack 0'
      },
      {
        label: 'KASA SATIŞ',
        data: [weeklyData.find(item => item.reportValue1 === "Kasa Satış")?.reportValue3 || 0],
        backgroundColor: 'rgb(168, 85, 247)',
        hoverBackgroundColor: 'rgb(148, 65, 227)',
        stack: 'Stack 0'
      },
      {
        label: 'PAKET SERVİS',
        data: [weeklyData.find(item => item.reportValue1 === "Paket Servis")?.reportValue3 || 0],
        backgroundColor: 'rgb(236, 72, 153)',
        hoverBackgroundColor: 'rgb(216, 52, 133)',
        stack: 'Stack 0'
      },
      {
        label: 'TEZGAH SATIŞ',
        data: [weeklyData.find(item => item.reportValue1 === "Tezgah Satış")?.reportValue3 || 0],
        backgroundColor: 'rgb(249, 115, 22)',
        hoverBackgroundColor: 'rgb(229, 95, 2)',
        stack: 'Stack 0'
      }
    ]
  };

  const chartOptions = {
    ...options,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false
      },
      legend: {
        position: 'top' as const,
        align: 'start',
        labels: {
          padding: 20,
          color: 'rgba(0, 0, 0, 0.7)',
          font: { size: 12, family: 'Inter', weight: '500' },
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
        titleFont: { size: 14, family: 'Inter', weight: '600' },
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
              label += formatNumber(context.parsed.y) + ' ₺';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          callback: function(value: any) {
            return formatNumber(value) + ' ₺';
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          padding: 10
        }
      }
    }
  };

  return (
    <div className="h-[540px] w-full bg-white rounded-lg p-6 shadow-sm">
      <Bar 
        data={chartData} 
        options={chartOptions}
        plugins={[{
          id: 'totalLabels',
          afterDraw: (chart: any) => {
            const ctx = chart.ctx;
            ctx.save();
            
            const datasets = chart.data.datasets;
            const meta = chart.getDatasetMeta(datasets.length - 1);
            if (!meta.hidden) {
              meta.data.forEach((bar: any, index: number) => {
                const total = datasets.reduce((sum: number, dataset: any) => sum + dataset.data[index], 0);
                const formattedTotal = formatNumber(total);
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.font = '600 12px Inter';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 4;
                
                const text = formattedTotal + ' ₺';
                const x = bar.x;
                const y = bar.y - 15; 
                
                ctx.fillText(text, x, y);
                
                // Gölgeyi temizle
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                
                // Değeri tekrar çiz (daha net görünmesi için)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillText(text, x, y);
              });
            }
            ctx.restore();
          }
        }]} 
      />
    </div>
  );
}
