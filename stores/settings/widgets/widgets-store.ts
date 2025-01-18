import { WebWidget } from '@/pages/api/settings/widgets/types';
import { create } from 'zustand';

interface UsersState {
  widgets: WebWidget[];
  selectedWidget: WebWidget | null;
  addWidget: (widget: WebWidget) => void;
  updateWidget: (widget: WebWidget) => void;
  setWidgets: (widgets: WebWidget[]) => void;
  setSelectedWidget: (widget: WebWidget | null) => void;
  deleteWidget: (widgetId: number) => void;
}

export const useWidgetsStore = create<UsersState>((set) => ({
  widgets: [],
  selectedWidget: null,
  addWidget: (widget) =>
    set((state) => ({
      widgets: [widget, ...state.widgets],
    })),
  updateWidget: (widget) =>
    set((state) => ({
      widgets: state.widgets.map((w) => 
        w.ReportID === widget.ReportID ? widget : w
      ),
    })),
  setWidgets: (widgets) => set({ widgets }),
  setSelectedWidget: (widget) => set({ selectedWidget: widget }),
  deleteWidget: (widgetId) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.ReportID !== widgetId),
      selectedWidget: state.selectedWidget?.ReportID === widgetId ? null : state.selectedWidget
    })),
}));
