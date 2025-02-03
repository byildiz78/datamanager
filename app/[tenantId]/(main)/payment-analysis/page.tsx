"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Star, Search, DollarSign, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";

ChartJS.register(ArcElement, Tooltip, Legend);

const mockData = {
  payments: [
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'VISA', amount: 38390, percentage: 50 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'YEMEKSEPETI ONLINE', amount: 9038, percentage: 12 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'NAKIT', amount: 7320, percentage: 9 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'TRENDYOL', amount: 7287, percentage: 9 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'SODEXO', amount: 3600, percentage: 5 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'GETIR', amount: 3380, percentage: 4 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'TICKET', amount: 2610, percentage: 3 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'MULTINET', amount: 2340, percentage: 3 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'SETCARD', amount: 1915, percentage: 2 },
    { branchName: 'BRANDIUM AYYP', paymentMethod: 'METROPOL', amount: 1480, percentage: 2 },
  ]
};

const pieData = {
  labels: mockData.payments.map(p => p.paymentMethod),
  datasets: [
    {
      data: mockData.payments.map(p => p.amount),
      backgroundColor: [
        'rgb(66, 133, 244)',   // VISA
        'rgb(52, 168, 83)',    // YEMEKSEPETI
        'rgb(251, 188, 4)',    // NAKIT
        'rgb(234, 67, 53)',    // TRENDYOL
        'rgb(255, 64, 129)',   // SODEXO
        'rgb(171, 71, 188)',   // GETIR
        'rgb(0, 150, 136)',    // TICKET
        'rgb(63, 81, 181)',    // MULTINET
        'rgb(121, 85, 72)',    // SETCARD
        'rgb(158, 158, 158)',  // METROPOL
      ],
      borderWidth: 1,
    },
  ],
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        padding: 20,
        font: { size: 12 },
        usePointStyle: true,
        boxWidth: 6
      }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const value = context.raw;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value.toLocaleString('tr-TR')} (${percentage}%)`;
        }
      }
    }
  }
};

const gradients = {
  blue: "from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20",
  purple: "from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20",
  pink: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
  orange: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
  green: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  indigo: "from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20",
}

const textGradients = {
  blue: "from-blue-600 to-sky-600",
  purple: "from-purple-600 to-fuchsia-600",
  pink: "from-pink-600 to-rose-600",
  orange: "from-orange-600 to-amber-600",
  green: "from-emerald-600 to-teal-600",
  indigo: "from-indigo-600 to-violet-600",
}

function StatsCard({ title, value, subtitle, icon, color = "blue" }) {
  return (
    <Card className={`bg-gradient-to-br ${gradients[color]} hover:shadow-lg transition-all duration-200`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {icon}
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            <div className="space-y-0.5">
              <p className={`text-2xl font-semibold tracking-tight bg-gradient-to-r ${textGradients[color]} bg-clip-text text-transparent`}>
                {value}
              </p>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DataTable({ data, searchTerm }) {
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const sortData = (items) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortData(filteredData);
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const SortButton = ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => requestSort(column)}
      className="h-8 px-2 hover:bg-muted"
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">
                <div className="flex items-center justify-between">
                  BranchName
                  <SortButton column="branchName" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-between">
                  PaymentMethodName
                  <SortButton column="paymentMethod" />
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end">
                  SUM(Tutar)
                  <SortButton column="amount" />
                </div>
              </TableHead>
              <TableHead className="text-right w-[150px]">
                <div className="flex items-center justify-end">
                  %SUM(AmountPaid)
                  <SortButton column="percentage" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((payment, index) => (
              <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{payment.branchName}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell className="text-right">{payment.amount.toLocaleString('tr-TR')}</TableCell>
                <TableCell className="text-right font-medium">{payment.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">satır</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentAnalysis() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const totalAmount = mockData.payments.reduce((sum, p) => sum + p.amount, 0);
  const cashPayments = mockData.payments
    .filter(p => ['NAKIT'].includes(p.paymentMethod))
    .reduce((sum, p) => sum + p.amount, 0);
  const cashPercentage = ((cashPayments / totalAmount) * 100).toFixed(1);

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Table */}
          <div className="col-span-8">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ödeme İşlemleri</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ödeme yöntemlerine göre detaylı dağılım
                    </p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[200px] pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable data={mockData.payments} searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Chart */}
          <div className="col-span-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatsCard
                title="Toplam Kazanç"
                value={totalAmount.toLocaleString('tr-TR')}
                subtitle="Tüm Ödeme Yöntemleri"
                icon={<Star className="w-4 h-4 text-yellow-400" />}
                color="blue"
              />
              <StatsCard
                title="Nakit Ödemeler"
                value={`${cashPayments.toLocaleString('tr-TR')} (${cashPercentage}%)`}
                subtitle="Toplam Nakit Ödemeler"
                icon={<DollarSign className="w-4 h-4 text-yellow-400" />}
                color="green"
              />
            </div>

            {/* Pie Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ödeme Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
