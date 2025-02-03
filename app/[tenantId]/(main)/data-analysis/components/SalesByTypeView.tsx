import { StatsCard } from "./StatsCard"
import { TopBranchesChart } from "./TopBranchesChart"
import { BranchTable } from "./BranchTable"
import { Star, ShoppingBag } from "lucide-react"

const mockTopBranches = [
  { name: "Paket Servis", amount: 456000 },
  { name: "Masa Servisi", amount: 423000 },
  { name: "Online Sipariş", amount: 298000 },
  { name: "Drive-Through", amount: 245000 },
  { name: "Catering", amount: 193000 },
]

const mockTableData = [
  { name: "Paket Servis", amount: 456000 },
  { name: "Masa Servisi", amount: 423000 },
  { name: "Online Sipariş", amount: 298000 },
  { name: "Drive-Through", amount: 245000 },
  { name: "Catering", amount: 193000 },
]

export function SalesByTypeView() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7 space-y-6">
        <TopBranchesChart
          data={mockTopBranches}
          title="Satış Türleri"
          type="SUM(Tutar), TÜM SATIŞ TÜRLERİ"
        />
        <BranchTable data={mockTableData} />
      </div>

      <div className="col-span-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="En Yüksek Satış"
            value="456,000"
            subtitle="Paket Servis"
            icon={<ShoppingBag className="w-4 h-4 text-yellow-400" />}
            color="blue"
          />
          <StatsCard
            title="Ortalama Satış"
            value="323,000"
            subtitle="Tüm Satış Türleri"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="purple"
          />
          <StatsCard
            title="Toplam Satış Türü"
            value="5"
            subtitle="Aktif Satış Kanalı"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="pink"
          />
          <StatsCard
            title="Büyüme Oranı"
            value="+15%"
            subtitle="Geçen Aya Göre"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="orange"
          />
        </div>
      </div>
    </div>
  )
}
