import { WebReport } from '@/pages/api/settings/reports/types';
import { create } from 'zustand';

interface ReportsState {
  reports: WebReport[];
  selectedReport: WebReport | null;
  addReport: (report: WebReport) => void;
  updateReport: (report: WebReport) => void;
  setReports: (reports: WebReport[]) => void;
  setSelectedReport: (report: WebReport | null) => void;
  deleteReport: (reportId: number) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  selectedReport: null,
  addReport: (report) =>
    set((state) => ({
      reports: [report, ...state.reports],
    })),
  updateReport: (report) =>
    set((state) => ({
      reports: state.reports.map((r) => 
        r.ReportID === report.ReportID ? report : r
      ),
    })),
  setReports: (reports) => set({ reports }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  deleteReport: (reportId) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.ReportID !== reportId),
      selectedReport: state.selectedReport?.ReportID === reportId ? null : state.selectedReport
    })),
}));
