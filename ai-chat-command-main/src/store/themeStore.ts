import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeSettings {
  businessName: string;
  botName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string | null;
}

interface ThemeState {
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
}

const defaultSettings: ThemeSettings = {
  businessName: 'Amaka',
  botName: 'Aria',
  primaryColor: '#0D9488',
  accentColor: '#F59E0B',
  logoUrl: null,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
