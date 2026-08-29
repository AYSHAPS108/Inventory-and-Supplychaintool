import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { SelectPicker } from '../SelectPicker';

export const StockView: React.FC = () => {
  const { theme } = useApp();
  const colors = getThemeColors(theme);

  const [tab, setTab] = useState<'levels' | 'ledger'>('levels');
  const [movementFilter, setMovementFilter] = useState<'ALL' | 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT'>('ALL');
  const [search, setSearch] = useState<string>('');

  const products = store.getProducts();
  const warehouses = store.getWarehouses();
  const movements = store.getMovements();

  const filteredProducts = products.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.locationBin && p.locationBin.toLowerCase().includes(q));
  });

  const filteredMovements = movements.filter(m => {
    if (movementFilter !== 'ALL' && m.type !== movementFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.productName.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q) || m.referenceNo.toLowerCase().includes(q);
    }
    return true;
  });

  const totalStockUnits = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Top Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={[styles.mCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.mLabel, { color: colors.textMuted }]}>TOTAL UNITS ON HAND</Text>
          <Text style={[styles.mVal, { color: colors.textMain }]}>{totalStockUnits.toLocaleString()}</Text>
          <Text style={[styles.mSub, { color: colors.textSubtle }]}>Across all storage locations</Text>
        </View>

        <View style={[styles.mCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.mLabel, { color: colors.textMuted }]}>ACTIVE STORAGE BINS</Text>
          <Text style={[styles.mVal, { color: colors.brandAccent }]}>{store.getLocations().length}</Text>
          <Text style={[styles.mSub, { color: colors.textSubtle }]}>In 3 distribution centers</Text>
        </View>

        <View style={[styles.mCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.mLabel, { color: colors.textMuted }]}>LEDGER TRANSACTIONS</Text>
          <Text style={[styles.mVal, { color: colors.statusSuccess }]}>{movements.length}</Text>
          <Text style={[styles.mSub, { color: colors.textSubtle }]}>Full audit trail preserved</Text>
        </View>
      </View>

      {/* Tabs and Controls */}
      <View style={[styles.controlBar, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.tabsWrap}>
          <TouchableOpacity
            onPress={() => setTab('levels')}
            style={[styles.tabBtn, tab === 'levels' && { borderBottomColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="boxes-stacked" size={12} color={tab === 'levels' ? colors.brandAccent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, { color: tab === 'levels' ? colors.textMain : colors.textMuted, fontWeight: tab === 'levels' ? '700' : '500' }]}>
              Stock Levels by Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('ledger')}
            style={[styles.tabBtn, tab === 'ledger' && { borderBottomColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="clock-rotate-left" size={12} color={tab === 'ledger' ? colors.brandAccent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, { color: tab === 'ledger' ? colors.textMain : colors.textMuted, fontWeight: tab === 'ledger' ? '700' : '500' }]}>
              Stock Movement Ledger
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={[styles.searchBox, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
            <FontAwesome6 name="magnifying-glass" size={12} color={colors.textMuted} style={{ marginRight: 6 }} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Filter list..."
              placeholderTextColor={colors.textSubtle}
              style={[styles.searchInput, { color: colors.textMain }]}
            />
          </View>

          {tab === 'ledger' && (
            <SelectPicker
              value={movementFilter}
              onChange={(val) => setMovementFilter(val as any)}
              options={[
                { label: 'All Movements', value: 'ALL' },
                { label: 'Inbound (IN)', value: 'IN' },
                { label: 'Outbound (OUT)', value: 'OUT' },
                { label: 'Transfers', value: 'TRANSFER' },
                { label: 'Adjustments', value: 'ADJUSTMENT' }
              ]}
              style={{ height: 32, minWidth: 140 }}
            />
          )}
        </View>
      </View>

      {/* Tab 1: Stock Levels Table */}
      {tab === 'levels' ? (
        <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>SKU & PRODUCT</Text>
            <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>WAREHOUSE</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>LOCATION BIN</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>REORDER LEVEL</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'right', color: colors.textMuted }]}>ON HAND QTY</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'right', color: colors.textMuted }]}>TOTAL VALUE</Text>
          </View>

          {filteredProducts.map(p => {
            const wh = warehouses.find(w => w.id === p.warehouseId);
            const isLow = p.quantity <= p.minStock;
            const isOut = p.quantity === 0;

            return (
              <View key={p.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.pName, { color: colors.textMain }]}>{p.name}</Text>
                  <Text style={[styles.pSku, { color: colors.brandAccent }]}>{p.sku}</Text>
                </View>

                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '600' }}>{wh?.name || 'Central Hub'}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>{wh?.code || 'WH-CENTRAL'}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '700' }}>{p.locationBin || 'A-01-01'}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{p.minStock} {p.unit}</Text>
                </View>

                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '800',
                      color: isOut ? colors.statusDanger : isLow ? colors.statusWarning : colors.statusSuccess,
                    }}
                  >
                    {p.quantity} {p.unit}
                  </Text>
                </View>

                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMain, fontSize: 13, fontWeight: '700' }}>
                    ${(p.quantity * p.costPrice).toFixed(2)}
                  </Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>
                    @ ${p.costPrice.toFixed(2)}/unit
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        /* Tab 2: Stock Ledger Table */
        <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>DATE & TIME</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>TYPE</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>PRODUCT / SKU</Text>
            <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>REFERENCE NO</Text>
            <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>LOCATION / WH</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>CHANGE</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>USER</Text>
          </View>

          {filteredMovements.map(m => {
            const isPos = m.type === 'IN' || (m.type === 'ADJUSTMENT' && m.reason?.includes('+'));
            return (
              <View key={m.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 11, fontWeight: '600' }}>{m.date}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: isPos ? colors.statusSuccessBg : colors.statusWarningBg }
                    ]}
                  >
                    <Text style={{ color: isPos ? colors.statusSuccess : colors.statusWarning, fontSize: 10, fontWeight: '700' }}>
                      {m.type}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={[styles.pName, { color: colors.textMain }]}>{m.productName}</Text>
                  <Text style={[styles.pSku, { color: colors.brandAccent }]}>{m.sku}</Text>
                </View>

                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '600' }}>{m.referenceNo}</Text>
                  {m.reason && <Text style={{ color: colors.textSubtle, fontSize: 10 }}>{m.reason}</Text>}
                </View>

                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>{m.warehouseName}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: isPos ? colors.statusSuccess : colors.statusDanger, fontWeight: '800', fontSize: 13 }}>
                    {isPos ? '+' : '-'}{m.quantity}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textSubtle, fontSize: 11 }}>{m.recordedBy}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  mCard: {
    flex: 1,
    minWidth: 180,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  mLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  mVal: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  mSub: {
    fontSize: 11,
  },
  controlBar: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  tabsWrap: {
    flexDirection: 'row',
    gap: 16,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    width: 180,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    height: '100%',
  },
  selectWrap: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  pName: {
    fontSize: 12,
    fontWeight: '600',
  },
  pSku: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  }
});
