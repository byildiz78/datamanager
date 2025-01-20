import { create } from 'zustand';
import { Ai } from '@/pages/api/settings/ai/types';

interface AiStore {
  ai: Ai[];
  setAi: (ai: Ai[]) => void;
  addAi: (ai: Ai) => void;
  updateAi: (ai: Ai) => void;
  removeAi: (id: number) => void;
}

export const useAiStore = create<AiStore>((set) => ({
  ai: [],
  setAi: (ai) => set({ ai }),
  addAi: (ai) => set((state) => ({ ai: [...state.ai, ai] })),
  updateAi: (ai) => set((state) => ({
    ai: state.ai.map((item) => (item.AutoID === ai.AutoID ? ai : item)),
  })),
  removeAi: (id) => set((state) => ({
    ai: state.ai.filter((item) => item.AutoID !== id),
  })),
}));
