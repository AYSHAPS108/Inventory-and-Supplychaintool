import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { getThemeColors } from '../styles/theme';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from './ToastContainer';

import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { StockView } from './views/StockView';
import { WarehousesView } from './views/WarehousesView';
import { PurchasingView } from './views/PurchasingView';
import { TransfersView } from './views/TransfersView';
import { CostingView } from './views/CostingView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

export const ZenoraApp: React.FC = () => {
  const { theme, currentRoute } = useApp();
  const colors = getThemeColors(theme);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'dashboard':  return <DashboardView />;
      case 'products':   return <ProductsView />;
      case 'stock':      return <StockView />;
      case 'warehouses': return <WarehousesView />;
      case 'purchasing': return <PurchasingView />;
      case 'transfers':  return <TransfersView />;
      case 'costing':    return <CostingView />;
      case 'reports':    return <ReportsView />;
      case 'settings':   return <SettingsView />;
      default:           return <DashboardView />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Sidebar (Desktop permanent, Mobile overlay) */}
      <Sidebar />

      {/* Main Content Area */}
      <View style={styles.mainWrapper}>
        <Header />
        <View style={[styles.contentArea, { backgroundColor: colors.bgPrimary }]}>
          {renderActiveView()}
        </View>
      </View>

      {/* Floating Notifications */}
      <ToastContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh' as any,
    width: '100vw' as any,
    overflow: 'hidden',
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    overflow: 'auto' as any,
  }
});
