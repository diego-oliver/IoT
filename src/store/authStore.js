import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      
      login: (email, password) => {
        // Simulate authentication
        const mockUser = {
          id: '1',
          email: email,
          name: 'Demo User',
          role: 'Facility Manager',
        };
        
        set({
          isLoggedIn: true,
          user: mockUser,
        });
        
        return Promise.resolve(mockUser);
      },
      
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;