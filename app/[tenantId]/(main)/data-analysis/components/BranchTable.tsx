import { Card } from "@/components/ui/card"
import { BranchData } from "../data-analysis-types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BranchTableProps {
  data: BranchData[]
}

export function BranchTable({ data }: BranchTableProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ciro özet dashboard
          </h3>
          <div className="flex items-center space-x-4">
            <select className="text-sm border rounded-full px-3 py-1 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="200">200 entries</option>
              <option value="500">500 entries</option>
              <option value="1000">1000 entries</option>
            </select>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-x-auto rounded-lg border bg-white dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableHead className="font-semibold">BranchName</TableHead>
                <TableHead className="font-semibold">SUM(Amount due)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((branch, index) => (
                <TableRow 
                  key={branch.name}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                    {branch.amount.toLocaleString('tr-TR')} TRY
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
