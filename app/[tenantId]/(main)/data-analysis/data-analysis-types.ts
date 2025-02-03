export interface BranchData {
  name: string
  amount: number
}

export interface DataAnalysisStats {
  totalRevenue: number
  totalDiscount: number
  totalAdditions: number
  averagePersonPerBranch: number
  totalCustomers: number
  activeBranchCount: number
  topBranches: BranchData[]
}
