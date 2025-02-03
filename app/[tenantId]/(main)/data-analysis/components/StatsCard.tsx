import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactElement } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: ReactElement
  className?: string
  color?: "blue" | "purple" | "pink" | "orange" | "green" | "indigo" | "red"
}

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

export function StatsCard({ title, value, subtitle, icon, className, color = "blue" }: StatsCardProps) {
  return (
    <Card className={cn(
      `bg-gradient-to-br ${gradients[color]} hover:shadow-lg transition-all duration-200 overflow-hidden relative group`,
      className
    )}>
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-white/20 dark:from-black/5 dark:to-black/20 blur-2xl transform group-hover:scale-110 transition-transform duration-500" />
      <div className="p-4">
        <div className="flex justify-between items-start relative">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradients[color]} bg-opacity-10`}>
                {icon && icon.type && (
                  <icon.type {...icon.props} className="w-4 h-4 text-white" />
                )}
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
  )
}
