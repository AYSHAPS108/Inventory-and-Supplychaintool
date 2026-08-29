import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { getThemeColors } from '../styles/theme';
import { UserRole } from '../types';
import { SelectPicker } from './SelectPicker';

const PAGE_META: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Inventory Dashboard', sub: 'Real-time stock levels, alerts & supply chain overview' },
  products: { title: 'Product Master Catalog', sub: 'Full SKU directory with search, filters, categories & variants' },
  stock: { title: 'Stock Levels & Movements', sub: 'Real-time stock on hand, warehouse locations, batches & serial registry' },
  warehouses: { title: 'Warehouses & Storage Bins', sub: 'Manage warehouse profiles, capacities, racks, shelves & bin locations' },
  purchasing: { title: 'Procurement & Suppliers', sub: 'Purchase orders, goods receiving, supplier management & procurement history' },
  transfers: { title: 'Stock Transfers & Adjustments', sub: 'Inter-warehouse transfers, stock adjustments & physical cycle counts' },
  costing: { title: 'Costing & Valuation', sub: 'Inventory valuation (FIFO / Average Cost), cost history & margin analysis' },
  reports: { title: 'Reports Hub', sub: 'Generate, filter & export inventory, purchase, stock & supplier reports' },
  settings: { title: 'Settings', sub: 'System configuration, roles & permissions, integrations & preferences' }
};

const ROLES: UserRole[] = [
  'Admin',
  'Inventory Manager',
  'Warehouse Staff',
  'Purchase Staff',
  'Store Manager',
  'View Only'
];

export const Header: React.FC = () => {
  const { theme, toggleTheme, currentRoute, currentRole, setRole, searchQuery, setSearchQuery, navigateTo, resetAllData, toggleSidebar } = useApp();
  const colors = getThemeColors(theme);
  const { width } = useWindowDimensions();

  const [isClientMobile, setIsClientMobile] = React.useState<boolean>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  React.useEffect(() => {
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

  const meta = PAGE_META[currentRoute] || { title: 'Zenora OS', sub: 'Supply Chain Management' };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigateTo('products', { searchQuery: searchQuery.trim() });
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.bgHeader, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        {isMobile && (
          <TouchableOpacity onPress={toggleSidebar} style={[styles.iconButton, { borderColor: colors.border }]}>
            <FontAwesome6 name="bars" size={16} color={colors.textMain} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textMain }]} numberOfLines={1}>{meta.title}</Text>
          {!isMobile && <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>{meta.sub}</Text>}
        </View>
      </View>

      <View style={styles.actionsSection}>
        {/* Global Search */}
        {!isMobile && (
          <View style={[styles.searchBox, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
            <FontAwesome6 name="magnifying-glass" size={13} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              placeholder="Search SKU / Name..."
              placeholderTextColor={colors.textSubtle}
              style={[styles.searchInput, { color: colors.textMain }]}
            />
          </View>
        )}

        {/* Role Selector */}
        {!isMobile && (
          <View style={styles.roleWrapper}>
            <SelectPicker
              value={currentRole}
              onChange={(val) => setRole(val as UserRole)}
              options={ROLES.map(r => ({ label: r, value: r }))}
              style={{ height: 34, minWidth: 150 }}
            />
          </View>
        )}

        {/* Theme Toggle Button */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
          accessibilityLabel="Toggle Theme"
        >
          <FontAwesome6
            name={theme === 'dark' ? 'sun' : 'moon'}
            size={14}
            color={theme === 'dark' ? '#f59e0b' : colors.brandAccent}
          />
        </TouchableOpacity>

        {/* Reset Data Button */}
        <TouchableOpacity
          onPress={() => {
            if (typeof window !== 'undefined') {
              if (window.confirm('Reset all inventory data to default sample items?\n\nAll custom changes will be restored.')) {
                resetAllData();
              }
            } else {
              resetAllData();
            }
          }}
          style={[styles.resetButton, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
        >
          <FontAwesome6 name="rotate-left" size={12} color={colors.textMuted} style={{ marginRight: isMobile ? 0 : 6 }} />
          {!isMobile && <Text style={[styles.resetText, { color: colors.textMuted }]}>Reset Data</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    width: 180,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    height: '100%',
  },
  roleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
  }
});
