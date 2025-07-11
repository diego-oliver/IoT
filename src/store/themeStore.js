import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      
      toggleTheme: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      setTheme: (isDark) => {
        set({ isDarkMode: isDark });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;