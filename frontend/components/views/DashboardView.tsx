import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';

export const DashboardView: React.FC = () => {
  const { theme, navigateTo } = useApp();
  const colors = getThemeColors(theme);

  const metrics = store.getMetrics();
  const products = store.getProducts();
  const warehouses = store.getWarehouses();
  const movements = store.getMovements();
  const criticalAlerts = products.filter(p => p.quantity <= p.minStock);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 20 }}>
      {/* KPI Cards Row */}
      <View style={styles.kpiGrid}>
        {/* Total Active SKUs */}
        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.kpiHeader}>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>TOTAL ACTIVE SKUS</Text>
            <FontAwesome6 name="boxes-stacked" size={16} color={colors.brandAccent} />
          </View>
          <Text style={[styles.kpiValue, { color: colors.textMain }]}>{metrics.totalProducts}</Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Across {metrics.totalCategories} Categories</Text>
        </View>

        {/* Total Valuation */}
        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.kpiHeader}>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>TOTAL INVENTORY VALUE</Text>
            <FontAwesome6 name="sack-dollar" size={16} color={colors.statusSuccess} />
          </View>
          <Text style={[styles.kpiValue, { color: colors.statusSuccess }]}>
            ${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>
            Cost basis: ${metrics.totalCostValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Low Stock Alerts */}
        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.kpiHeader}>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>LOW STOCK ALERTS</Text>
            <FontAwesome6 name="triangle-exclamation" size={16} color={colors.statusWarning} />
          </View>
          <Text style={[styles.kpiValue, { color: colors.statusWarning }]}>{metrics.lowStockCount}</Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Below min reorder threshold</Text>
        </View>

        {/* Out of Stock */}
        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.kpiHeader}>
            <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>OUT OF STOCK</Text>
            <FontAwesome6 name="circle-exclamation" size={16} color={colors.statusDanger} />
          </View>
          <Text style={[styles.kpiValue, { color: colors.statusDanger }]}>{metrics.outOfStockCount}</Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Urgent procurement required</Text>
        </View>
      </View>

      {/* Quick Action Shortcuts */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Quick Actions & Operations</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.brandPrimary }]}
            onPress={() => navigateTo('products', { openCreateModal: true })}
          >
            <FontAwesome6 name="plus" size={14} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>Add Product SKU</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.brandAccent }]}
            onPress={() => navigateTo('purchasing', { openCreatePO: true })}
          >
            <FontAwesome6 name="cart-plus" size={14} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>New Purchase Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtnSecondary, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
            onPress={() => navigateTo('transfers')}
          >
            <FontAwesome6 name="arrow-right-arrow-left" size={14} color={colors.textMain} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnSecondaryText, { color: colors.textMain }]}>Stock Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtnSecondary, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
            onPress={() => navigateTo('costing')}
          >
            <FontAwesome6 name="chart-pie" size={14} color={colors.textMain} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnSecondaryText, { color: colors.textMain }]}>Valuation Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Two Column Grid: Critical Stock Alerts & Warehouse Distribution */}
      <View style={styles.twoColGrid}>
        {/* Critical Alerts */}
        <View style={[styles.card, { flex: 1.2, backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.cardHeaderWithLink}>
            <Text style={[styles.cardTitle, { color: colors.textMain }]}>
              Critical Stock Alerts ({criticalAlerts.length})
            </Text>
            <TouchableOpacity onPress={() => navigateTo('products', { filter: 'low_stock' })}>
              <Text style={{ color: colors.brandAccent, fontSize: 12, fontWeight: '600' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {criticalAlerts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>All products are well-stocked!</Text>
          ) : (
            <View style={{ gap: 10, marginTop: 10 }}>
              {criticalAlerts.slice(0, 4).map(prod => {
                const isOut = prod.quantity === 0;
                return (
                  <View
                    key={prod.id}
                    style={[
                      styles.alertItem,
                      {
                        backgroundColor: colors.bgSecondary,
                        borderColor: colors.border,
                        borderLeftColor: isOut ? colors.statusDanger : colors.statusWarning,
                      }
                    ]}
                  >
                    <Image source={{ uri: prod.image }} style={styles.alertThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.alertName, { color: colors.textMain }]} numberOfLines={1}>{prod.name}</Text>
                      <Text style={[styles.alertMeta, { color: colors.textMuted }]}>
                        SKU: {prod.sku} • Bin: {prod.locationBin || 'N/A'}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isOut ? colors.statusDangerBg : colors.statusWarningBg,
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isOut ? colors.statusDanger : colors.statusWarning }
                        ]}
                      >
                        {isOut ? 'Out of Stock' : `${prod.quantity} ${prod.unit} (Min: ${prod.minStock})`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Warehouse Network Distribution */}
        <View style={[styles.card, { flex: 0.8, backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.cardHeaderWithLink}>
            <Text style={[styles.cardTitle, { color: colors.textMain }]}>Warehouse Network</Text>
            <TouchableOpacity onPress={() => navigateTo('warehouses')}>
              <Text style={{ color: colors.brandAccent, fontSize: 12, fontWeight: '600' }}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12, marginTop: 10 }}>
            {warehouses.map(wh => {
              const whProds = products.filter(p => p.warehouseId === wh.id);
              const totalItems = whProds.reduce((sum, p) => sum + p.quantity, 0);

              return (
                <View
                  key={wh.id}
                  style={[styles.whItem, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.whName, { color: colors.textMain }]}>{wh.name}</Text>
                    <Text style={[styles.whCode, { color: colors.brandAccent }]}>{wh.code}</Text>
                  </View>
                  <Text style={[styles.whMeta, { color: colors.textMuted }]}>
                    Manager: {wh.manager} • {whProds.length} SKUs ({totalItems} units)
                  </Text>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.bgInput }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, Math.max(15, whProds.length * 20))}%`,
                          backgroundColor: colors.brandAccent,
                        }
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Recent Stock Movement Stream */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeaderWithLink}>
          <Text style={[styles.cardTitle, { color: colors.textMain }]}>Recent Stock Ledger Movements</Text>
          <TouchableOpacity onPress={() => navigateTo('stock')}>
            <Text style={{ color: colors.brandAccent, fontSize: 12, fontWeight: '600' }}>Full Ledger</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 8, marginTop: 10 }}>
          {movements.slice(0, 5).map(mov => {
            const isPositive = mov.type === 'IN' || (mov.type === 'ADJUSTMENT' && mov.reason?.includes('+'));
            return (
              <View
                key={mov.id}
                style={[styles.movRow, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
              >
                <View style={[styles.movTypeTag, { backgroundColor: isPositive ? colors.statusSuccessBg : colors.statusWarningBg }]}>
                  <Text style={{ color: isPositive ? colors.statusSuccess : colors.statusWarning, fontSize: 10, fontWeight: '700' }}>
                    {mov.type}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.movName, { color: colors.textMain }]}>{mov.productName}</Text>
                  <Text style={[styles.movMeta, { color: colors.textMuted }]}>
                    Ref: {mov.referenceNo} • {mov.warehouseName} • By {mov.recordedBy}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: isPositive ? colors.statusSuccess : colors.textMain, fontWeight: '700', fontSize: 13 }}>
                    {isPositive ? '+' : '-'}{mov.quantity} units
                  </Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>{mov.date}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  kpiSub: {
    fontSize: 11,
  },
  card: {
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardHeaderWithLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  twoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 10,
  },
  alertThumb: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#1e293b',
  },
  alertName: {
    fontSize: 13,
    fontWeight: '600',
  },
  alertMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  whItem: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  whName: {
    fontSize: 13,
    fontWeight: '600',
  },
  whCode: {
    fontSize: 11,
    fontWeight: '700',
  },
  whMeta: {
    fontSize: 11,
    marginVertical: 4,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 10,
  },
  movTypeTag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  movName: {
    fontSize: 13,
    fontWeight: '600',
  },
  movMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 12,
  }
});
