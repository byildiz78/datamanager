export interface BranchData {
  reportValue1: string;
  reportValue2: number;
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
