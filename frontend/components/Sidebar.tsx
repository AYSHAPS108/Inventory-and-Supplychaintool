import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { getThemeColors } from '../styles/theme';
import { AppRoute } from '../types';

interface NavItemDef {
  route: AppRoute;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItemDef[] = [
  { route: 'dashboard', label: 'Dashboard', icon: 'chart-line' },
  { route: 'products', label: 'Product Master', icon: 'box-archive' },
  { route: 'stock', label: 'Stock & Ledger', icon: 'cubes' },
  { route: 'warehouses', label: 'Warehouses & Bins', icon: 'warehouse' },
  { route: 'purchasing', label: 'Purchasing & Suppliers', icon: 'cart-shopping' },
  { route: 'transfers', label: 'Transfers & Adjustments', icon: 'right-left' },
  { route: 'costing', label: 'Costing & Valuation', icon: 'sack-dollar' },
  { route: 'reports', label: 'Reports Hub', icon: 'file-invoice-dollar' },
  { route: 'settings', label: 'Settings', icon: 'gears' },
];

export const Sidebar: React.FC = () => {
  const { theme, currentRoute, navigateTo, sidebarOpen, toggleSidebar } = useApp();
  const colors = getThemeColors(theme);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (isMobile && !sidebarOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={0.6}
          onPress={toggleSidebar}
        />
      )}

      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: colors.bgSidebar,
            borderRightColor: colors.border,
            position: isMobile ? 'absolute' : 'relative',
            zIndex: isMobile ? 1000 : 1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 250,
          }
        ]}
      >
        {/* Brand Header */}
        <View style={[styles.brandHeader, { borderBottomColor: colors.border }]}>
          <View style={[styles.brandLogo, { backgroundColor: colors.brandPrimary }]}>
            <Text style={styles.brandLogoText}>Z</Text>
          </View>
          <View style={styles.brandTitleWrap}>
            <Text style={[styles.brandName, { color: colors.textMain }]}>Zenora</Text>
            <Text style={[styles.brandSub, { color: colors.textMuted }]}>Supply Chain OS</Text>
          </View>
          {isMobile && (
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeBtn}>
              <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation items */}
        <ScrollView style={styles.navList} contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 10 }}>
          {NAV_ITEMS.map(item => {
            const isActive = currentRoute === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                activeOpacity={0.7}
                onPress={() => navigateTo(item.route)}
                style={[
                  styles.navItem,
                  isActive && {
                    backgroundColor: colors.isDark ? 'rgba(22, 93, 255, 0.15)' : 'rgba(18, 63, 168, 0.10)',
                    borderLeftColor: colors.brandAccent,
                  }
                ]}
              >
                <FontAwesome6
                  name={item.icon}
                  size={15}
                  color={isActive ? colors.brandAccent : colors.textMuted}
                  style={styles.navIcon}
                />
                <Text
                  style={[
                    styles.navText,
                    {
                      color: isActive ? (colors.isDark ? '#ffffff' : colors.brandPrimary) : colors.textMuted,
                      fontWeight: isActive ? '700' : '500',
                    }
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* System Status Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText, { color: colors.textMuted }]}>System Operational</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
  },
  sidebar: {
    borderRightWidth: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  brandHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 10,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  brandTitleWrap: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 4,
  },
  navList: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  navIcon: {
    width: 22,
    marginRight: 10,
  },
  navText: {
    fontSize: 13,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  }
});
