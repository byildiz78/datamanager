import { Card } from "@/components/ui/card"
import { BranchData } from "../data-analysis-types"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBranchesChartProps {
  data: BranchData[]
  title: string
  type: string
}

export function TopBranchesChart({ data, title, type }: TopBranchesChartProps) {
  const maxValue = Math.max(...data.map(d => d.amount))
  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
  ]

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">⭐</span>
            <h3 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{title}</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium text-blue-700 dark:text-blue-300">{type}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {data.map((branch, index) => (
            <div key={branch.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{branch.name}</span>
                <span className="text-muted-foreground font-medium">{branch.amount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500 ease-out`}
                  style={{ 
                    width: `${(branch.amount / maxValue) * 100}%`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1) inset"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
