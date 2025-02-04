export interface SalesData {
  reportValue1: string;  // Satış türü (MASA SERVİS, PAKET SERVİS, vb.)
  reportValue2: number;  // Satış tutarı
  reportValue3?: string; // Tarih
}

export interface SalesStats {
  dailyAverage: number;
  highestSale: {
    amount: number;
    date: string;
  };
  totalSales: number;
  salesTypes: number;
}
