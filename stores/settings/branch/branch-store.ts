import { Efr_Branches } from '@/pages/api/settings/branches/types';
import { create } from 'zustand';

interface UsersState {
  branches: Efr_Branches[];
  selectedBranch: Efr_Branches | null;
  addBranch: (branch: Efr_Branches) => void;
  updateBranch: (branch: Efr_Branches) => void;
  setBranches: (branches: Efr_Branches[]) => void;
  setSelectedBranch: (branch: Efr_Branches | null) => void;
  deleteBranch: (branchId: number) => void;
}

export const useBranchesStore = create<UsersState>((set) => ({
  branches: [],
  selectedBranch: null,
  addBranch: (branch) =>
    set((state) => ({
      branches: [branch, ...state.branches],
    })),
  updateBranch: (branch) =>
    set((state) => ({
      branches: state.branches.map((b) => 
        b.BranchID === branch.BranchID ? branch : b
      ),
    })),
  setBranches: (branches) => set({ branches }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  deleteBranch: (branchId) =>
    set((state) => ({
      branches: state.branches.filter((b) => b.BranchID !== branchId),
      selectedBranch: state.selectedBranch?.BranchID === branchId ? null : state.selectedBranch
    })),
}));
