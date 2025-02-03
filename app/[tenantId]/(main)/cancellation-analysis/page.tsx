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
import { Star, Search, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";

const mockData = {
  cancellations: [
    { 
      sube: "PERLAVISTA AVM",
      tarih: "2025-01-31",
      no: "101129",
      urun: "EKORI",
      adet: 1,
      ekleyenKullanici: "Muhammet",
      iptalEdenKullanici: "Muhammet",
      sebep: "101131 numaralı çek ile birleştirildi",
      iptalSaati: "16:08:53",
      siparisSaati: "17:43:20",
      tutar: 220
    },
    { 
      sube: "BUYAKA AVM",
      tarih: "2025-01-31",
      no: "212691",
      urun: "TRUFLÜ TAVUK KTD",
      adet: 1,
      ekleyenKullanici: "MUKADDES BEKTAŞ",
      iptalEdenKullanici: "GÖKHAN BEY",
      sebep: "MERKEZ KOD",
      iptalSaati: "18:30:38",
      siparisSaati: "20:10:45",
      tutar: 280
    },
    { 
      sube: "BUYAKA AVM",
      tarih: "2025-01-31",
      no: "212691",
      urun: "TAVUK TERİYAKİ",
      adet: 1,
      ekleyenKullanici: "MUKADDES BEKTAŞ",
      iptalEdenKullanici: "GÖKHAN BEY",
      sebep: "MERKZ KOD",
      iptalSaati: "18:30:38",
      siparisSaati: "20:10:37",
      tutar: 260
    },
    { 
      sube: "PERLAVISTA AVM",
      tarih: "2025-01-31",
      no: "101129",
      urun: "LABIETE",
      adet: 1,
      ekleyenKullanici: "Muhammet",
      iptalEdenKullanici: "Muhammet",
      sebep: "101131 numaralı çek ile birleştirildi",
      iptalSaati: "16:08:53",
      siparisSaati: "17:43:20",
      tutar: 260
    },
    { 
      sube: "PERLAVISTA AVM",
      tarih: "2025-01-31",
      no: "101131",
      urun: "KEKİKLİM",
      adet: 1,
      ekleyenKullanici: "Muhammet",
      iptalEdenKullanici: "Muhammet",
      sebep: "DEĞİŞTİRCİ",
      iptalSaati: "16:12:44",
      siparisSaati: "16:13:05",
      tutar: 260
    },
    { 
      sube: "PERLAVISTA AVM",
      tarih: "2025-01-31",
      no: "101129",
      urun: "LİMONATA",
      adet: 3,
      ekleyenKullanici: "Muhammet",
      iptalEdenKullanici: "Muhammet",
      sebep: "101131 numaralı çek ile birleştirildi",
      iptalSaati: "16:08:53",
      siparisSaati: "17:43:20",
      tutar: 210
    },
    { 
      sube: "PERLAVISTA AVM",
      tarih: "2025-01-31",
      no: "101129",
      urun: "KARIŞIK BAŞLANGIÇ TABAĞI",
      adet: 1,
      ekleyenKullanici: "Muhammet",
      iptalEdenKullanici: "Muhammet",
      sebep: "101131 numaralı çek ile birleştirildi",
      iptalSaati: "16:08:53",
      siparisSaati: "17:43:20",
      tutar: 200
    },
    { 
      sube: "BUYAKA AVM",
      tarih: "2025-01-31",
      no: "212584",
      urun: "COCA COLA KUTU",
      adet: 1,
      ekleyenKullanici: "Murat",
      iptalEdenKullanici: "GÖKHAN BEY",
      sebep: "VAZGEÇTİ",
      iptalSaati: "12:23:52",
      siparisSaati: "12:54:04",
      tutar: 55
    }
  ]
};

const gradients = {
  blue: "from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20",
  purple: "from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20",
  pink: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
  orange: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
  green: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  indigo: "from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20",
  red: "from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20",
}

const iconGradients = {
  blue: "from-blue-500 to-sky-500",
  purple: "from-purple-500 to-fuchsia-500",
  pink: "from-pink-500 to-rose-500",
  orange: "from-orange-500 to-amber-500",
  green: "from-emerald-500 to-teal-500",
  indigo: "from-indigo-500 to-violet-500",
  red: "from-red-500 to-rose-500",
}

const textGradients = {
  blue: "from-blue-600 to-sky-600",
  purple: "from-purple-600 to-fuchsia-600",
  pink: "from-pink-600 to-rose-600",
  orange: "from-orange-600 to-amber-600",
  green: "from-emerald-600 to-teal-600",
  indigo: "from-indigo-600 to-violet-600",
  red: "from-red-600 to-rose-600",
}

function StatsCard({ title, value, subtitle, icon, color = "blue" }) {
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
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
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
      <div className="relative rounded-md border">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[120px]">
                  <div className="flex items-center justify-between">
                    Şube
                    <SortButton column="sube" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[100px]">
                  <div className="flex items-center justify-between">
                    Tarih
                    <SortButton column="tarih" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[80px]">
                  <div className="flex items-center justify-between">
                    No
                    <SortButton column="no" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[160px]">
                  <div className="flex items-center justify-between">
                    Ürün
                    <SortButton column="urun" />
                  </div>
                </th>
                <th className="h-10 px-2 text-center align-middle font-medium w-[60px]">
                  <div className="flex items-center justify-center">
                    Adet
                    <SortButton column="adet" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[140px]">
                  <div className="flex items-center justify-between">
                    Ekleyen Kullanıcı
                    <SortButton column="ekleyenKullanici" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[140px]">
                  <div className="flex items-center justify-between">
                    İptal Eden Kullanıcı
                    <SortButton column="iptalEdenKullanici" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[200px]">
                  <div className="flex items-center justify-between">
                    Sebep
                    <SortButton column="sebep" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[100px]">
                  <div className="flex items-center justify-between">
                    İptal Saati
                    <SortButton column="iptalSaati" />
                  </div>
                </th>
                <th className="h-10 px-2 text-left align-middle font-medium min-w-[100px]">
                  <div className="flex items-center justify-between">
                    Sipariş Saati
                    <SortButton column="siparisSaati" />
                  </div>
                </th>
                <th className="h-10 px-2 text-right align-middle font-medium min-w-[100px]">
                  <div className="flex items-center justify-end">
                    Tutar
                    <SortButton column="tutar" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-2 align-middle font-medium">
                    {item.sube}
                  </td>
                  <td className="p-2 align-middle">
                    {item.tarih}
                  </td>
                  <td className="p-2 align-middle">
                    {item.no}
                  </td>
                  <td className="p-2 align-middle">
                    {item.urun}
                  </td>
                  <td className="p-2 align-middle text-center">
                    {item.adet}
                  </td>
                  <td className="p-2 align-middle">
                    {item.ekleyenKullanici}
                  </td>
                  <td className="p-2 align-middle">
                    {item.iptalEdenKullanici}
                  </td>
                  <td className="p-2 align-middle max-w-[200px] truncate">
                    {item.sebep}
                  </td>
                  <td className="p-2 align-middle">
                    {item.iptalSaati}
                  </td>
                  <td className="p-2 align-middle">
                    {item.siparisSaati}
                  </td>
                  <td className="p-2 align-middle text-right font-medium">
                    {item.tutar.toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2 text-sm">
          <p className="text-muted-foreground">
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
          <p className="text-muted-foreground">satır</p>
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

export default function CancellationAnalysis() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const totalAmount = mockData.cancellations.reduce((sum, item) => sum + item.tutar, 0);
  const totalItems = mockData.cancellations.reduce((sum, item) => sum + item.adet, 0);

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <StatsCard
            title="İptal İşlemleri Toplam"
            value={totalAmount.toLocaleString('tr-TR') + " ₺"}
            subtitle="toplam iptal tutarı"
            icon={<Star className="w-4 h-4" />}
            color="red"
          />
          <StatsCard
            title="İptal İşlemleri Toplam Adet"
            value={totalItems.toString()}
            subtitle="adet ürün"
            icon={<XCircle className="w-4 w-4" />}
            color="red"
          />
        </div>

        {/* Table Section */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>İptal İşlemleri Liste</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  İptal edilen siparişlerin detaylı listesi
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-[200px] pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable data={mockData.cancellations} searchTerm={searchTerm} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
