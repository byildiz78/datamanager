import { StatsCard } from "./StatsCard"
import { TopBranchesChart } from "./TopBranchesChart"
import { BranchTable } from "./BranchTable"
import { Star, Users } from "lucide-react"

const mockTopBranches = [
  { name: "Ahmet Yılmaz", amount: 85600 },
  { name: "Mehmet Demir", amount: 78400 },
  { name: "Ayşe Kaya", amount: 72300 },
  { name: "Fatma Şahin", amount: 68900 },
  { name: "Ali Öztürk", amount: 65200 },
  { name: "Zeynep Çelik", amount: 61800 },
  { name: "Mustafa Aydın", amount: 58400 },
  { name: "Emine Yıldız", amount: 55100 },
  { name: "Hüseyin Kara", amount: 52300 },
  { name: "Hatice Arslan", amount: 49700 },
]

const mockTableData = [
  { name: "Ahmet Yılmaz", amount: 85600 },
  { name: "Mehmet Demir", amount: 78400 },
  { name: "Ayşe Kaya", amount: 72300 },
  { name: "Fatma Şahin", amount: 68900 },
  { name: "Ali Öztürk", amount: 65200 },
]

export function PersonnelView() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7 space-y-6">
        <TopBranchesChart
          data={mockTopBranches}
          title="En İyi Performans Gösteren Personel"
          type="SUM(Tutar), PERSONEL BAZLI"
        />
        <BranchTable data={mockTableData} />
      </div>

      <div className="col-span-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Toplam Personel"
            value="156"
            subtitle="Aktif Çalışan"
            icon={<Users className="w-4 h-4 text-yellow-400" />}
            color="blue"
          />
          <StatsCard
            title="Ortalama Satış"
            value="64,750"
            subtitle="Kişi Başı"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="purple"
          />
          <StatsCard
            title="En Yüksek Satış"
            value="85,600"
            subtitle="Ahmet Yılmaz"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="pink"
          />
          <StatsCard
            title="Performans Artışı"
            value="+8%"
            subtitle="Geçen Aya Göre"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="orange"
          />
        </div>
      </div>
    </div>
  )
}
