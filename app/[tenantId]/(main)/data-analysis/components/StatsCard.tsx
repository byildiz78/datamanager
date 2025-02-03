import { Card } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon?: React.ReactNode
  className?: string
  color?: "blue" | "purple" | "pink" | "orange" | "green" | "indigo"
}

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

export function StatsCard({ title, value, subtitle, icon, className, color = "blue" }: StatsCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradients[color]} hover:shadow-lg transition-all duration-200 ${className}`}>
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
  )
}
