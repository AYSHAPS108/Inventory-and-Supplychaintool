import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, useWindowDimensions, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { getThemeColors } from '../styles/theme';
import { AppRoute } from '../types';

const logoDark = require('../assets/zenora-icon-dark.png');
const logoLight = require('../assets/zenora-icon-light.png');

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

  const [isClientMobile, setIsClientMobile] = useState<boolean>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        setIsClientMobile(window.innerWidth < 768);
      } else {
        setIsClientMobile(width > 0 && width < 768);
      }
    };
    checkMobile();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [width]);

  const isMobile = isClientMobile;

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
            width: 268,
          }
        ]}
      >
        {/* Brand Header */}
        <View style={[styles.brandHeader, { borderBottomColor: colors.border }]}>
          <Image
            source={theme === 'light' ? logoLight : logoDark}
            style={styles.brandLogoImg}
            resizeMode="contain"
          />
          <View style={styles.brandTitleWrap}>
            <Text style={[styles.brandName, { color: colors.textMain }]}>Zenora</Text>
            <Text style={[styles.brandTagline, { color: colors.brandAccent }]}>Work, Simplified.</Text>
            <Text style={[styles.brandSub, { color: colors.textMuted }]}>Inventory & Supply Chain</Text>
          </View>
          {isMobile && (
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeBtn}>
              <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation items */}
        <ScrollView style={styles.navList} contentContainerStyle={{ paddingVertical: 14, paddingHorizontal: 12 }}>
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
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    gap: 12,
  },
  brandLogoImg: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  brandTitleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  brandTagline: {
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 1,
    marginBottom: 1,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
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
