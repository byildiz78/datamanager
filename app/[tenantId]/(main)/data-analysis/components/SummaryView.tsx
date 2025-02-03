import { StatsCard } from "./StatsCard"
import { TopBranchesChart } from "./TopBranchesChart"
import { BranchTable } from "./BranchTable"
import { Star, Users, Building2 } from "lucide-react"

const mockTopBranches = [
  { name: "Adana", amount: 66600 },
  { name: "54 NOLU ŞUBE", amount: 54100 },
  { name: "Yozgat", amount: 53800 },
  { name: "Bingöl", amount: 53800 },
  { name: "248 NOLU ŞUBE", amount: 49200 },
  { name: "Elazığ", amount: 48800 },
  { name: "Mardin", amount: 44300 },
  { name: "Adıyaman", amount: 36100 },
  { name: "47 NOLU ŞUBE", amount: 30000 },
  { name: "Muş", amount: 29900 },
]

const mockTableData = [
  { name: "Adana", amount: 79561 },
  { name: "248 NOLU ŞUBE", amount: 59173 },
  { name: "Bingöl", amount: 55828 },
  { name: "54 NOLU ŞUBE", amount: 54072 },
  { name: "Yozgat", amount: 53838 },
  { name: "Elazığ", amount: 52046 },
  { name: "Mardin", amount: 45176 },
  { name: "Adıyaman", amount: 36108 },
  { name: "47 NOLU ŞUBE", amount: 32778 },
]

export function SummaryView() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7 space-y-6">
        <TopBranchesChart
          data={mockTopBranches}
          title="İlk 10 Şube"
          type="SUM(Tutar), MASA SERVİS"
        />
        <BranchTable data={mockTableData} />
      </div>

      <div className="col-span-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Toplam Ciro"
            value="1,615,101"
            subtitle="Toplam Ciro"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="blue"
          />
          <StatsCard
            title="Toplam indirim"
            value="23,728"
            subtitle="Toplam indirim"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="purple"
          />
          <StatsCard
            title="Adisyon sayısı"
            value="9,708"
            subtitle="Adet Adisyon"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="pink"
          />
          <StatsCard
            title="Kişi Ortalama"
            value="2"
            subtitle="Kişi Başı Ortalama Harcama"
            icon={<Star className="w-4 h-4 text-yellow-400" />}
            color="orange"
          />
          <StatsCard
            title="Konuk Sayısı"
            value="1,014,016"
            subtitle="Kişi"
            icon={<Users className="w-4 h-4 text-yellow-400" />}
            color="green"
          />
          <StatsCard
            title="Aktif şube sayısı"
            value="98"
            subtitle="Aktif Şube Sayısı"
            icon={<Building2 className="w-4 h-4 text-yellow-400" />}
            color="indigo"
          />
        </div>
      </div>
    </div>
  )
}
