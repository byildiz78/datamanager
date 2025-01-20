import { create } from 'zustand';
import { SupersetDashboard } from '@/pages/api/settings/superset/types';

interface SupersetStore {
    dashboards: SupersetDashboard[];
    setDashboards: (dashboards: SupersetDashboard[]) => void;
    addSuperset: (dashboard: SupersetDashboard) => void;
    updateSuperset: (dashboard: SupersetDashboard) => void;
    removeSuperset: (id: number) => void;
}

export const useSupersetStore = create<SupersetStore>((set) => ({
    dashboards: [],
    setDashboards: (dashboards) => set({ dashboards }),
    addSuperset: (dashboard) => set((state) => ({
        dashboards: [...state.dashboards, dashboard]
    })),
    updateSuperset: (dashboard) => set((state) => ({
        dashboards: state.dashboards.map((d) =>
            d.AutoID === dashboard.AutoID ? dashboard : d
        )
    })),
    removeSuperset: (id) => set((state) => ({
        dashboards: state.dashboards.filter((d) => d.AutoID !== id)
    }))
}));
