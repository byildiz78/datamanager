// stores/tab-store.ts
import { create } from 'zustand';

interface Tab {
  id: string;
  title: string;
  url?: string;
  selectedFilter?: any;
  lazyComponent: () => Promise<{ default: React.ComponentType }>;
}

interface TabStore {
  tabs: Tab[];
  activeTab: string;
  activeTabFilter?: any;
  renderedComponents: { [key: string]: React.ReactNode };
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  removeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  setActiveTabFilter: (filter: any) => void;
  setRenderedComponent: (id: string, component: React.ReactNode) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  tabs: [],
  activeTab: 'dashboard',
  renderedComponents: {},
  addTab: (tab) =>
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTab: tab.id,
    })),
  removeTab: (id) =>
    set((state) => ({
      tabs: state.tabs.filter((tab) => tab.id !== id),
      renderedComponents: {
        ...state.renderedComponents,
        [id]: undefined,
      },
    })),
  removeAllTabs: () =>
    set((state) => ({
      tabs: [],
      activeTab: 'dashboard',
      renderedComponents: {},
    })),
  setActiveTab: (id) => set({ activeTab: id }),
  setActiveTabFilter: (filter) => set({ activeTabFilter: filter }),
  setRenderedComponent: (id, component) =>
    set((state) => ({
      renderedComponents: {
        ...state.renderedComponents,
        [id]: component,
      },
    })),
}));
