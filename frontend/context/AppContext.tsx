import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppRoute, ThemeMode, UserRole, ToastMessage } from '../types';
import { store } from '../services/store';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute, options?: any) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'danger' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  routeOptions: any;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const [routeOptions, setRouteOptions] = useState<any>({});
  const [currentRole, setCurrentRole] = useState<UserRole>(store.getCurrentRole());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
      setCurrentRole(store.getCurrentRole());
    });
    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
  };

  const navigateTo = (route: AppRoute, options?: any) => {
    setCurrentRoute(route);
    setRouteOptions(options || {});
    setSidebarOpen(false);
  };

  const setRole = (role: UserRole) => {
    store.setCurrentRole(role);
    setCurrentRole(role);
    showToast(`Role switched to: ${role}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const resetAllData = () => {
    store.resetToDefault();
    showToast('Data reset to factory defaults.', 'info');
    navigateTo('dashboard');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRoute,
        navigateTo,
        currentRole,
        setRole,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast,
        resetAllData,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        routeOptions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
