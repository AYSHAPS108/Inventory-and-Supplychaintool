import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';

export const CostingView: React.FC = () => {
  const { theme } = useApp();
  const colors = getThemeColors(theme);

  const products = store.getProducts();
  const categories = store.getCategories();
  const settings = store.getSettings();

  const totalCostBasis = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
  const totalSellingVal = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
  const grossMargin = totalSellingVal - totalCostBasis;
  const marginPercent = totalSellingVal > 0 ? (grossMargin / totalSellingVal) * 100 : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 20 }}>
      {/* Top Valuation Metrics */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>TOTAL COST BASIS ({settings.valuationMethod})</Text>
          <Text style={[styles.kpiValue, { color: colors.brandAccent }]}>
            ${totalCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Total acquisition cost</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>TOTAL RETAIL / SELLING VALUE</Text>
          <Text style={[styles.kpiValue, { color: colors.statusSuccess }]}>
            ${totalSellingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Current inventory market value</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>ESTIMATED GROSS PROFIT</Text>
          <Text style={[styles.kpiValue, { color: colors.statusSuccess }]}>
            ${grossMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Profit potential on liquidation</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>GROSS MARGIN RATE</Text>
          <Text style={[styles.kpiValue, { color: colors.statusWarning }]}>
            {marginPercent.toFixed(1)}%
          </Text>
          <Text style={[styles.kpiSub, { color: colors.textSubtle }]}>Weighted average margin</Text>
        </View>
      </View>

      {/* Valuation by Category breakdown */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Valuation Distribution by Category</Text>

        <View style={{ gap: 12, marginTop: 14 }}>
          {categories.map(cat => {
            const catProds = products.filter(p => p.categoryId === cat.id);
            const catCost = catProds.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
            const percent = totalCostBasis > 0 ? (catCost / totalCostBasis) * 100 : 0;

            return (
              <View key={cat.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 13 }}>{cat.name}</Text>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13 }}>
                    ${catCost.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({percent.toFixed(1)}%)
                  </Text>
                </View>
                <View style={[styles.progBg, { backgroundColor: colors.bgInput }]}>
                  <View style={[styles.progFill, { width: `${percent}%`, backgroundColor: cat.color || colors.brandAccent }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* SKU Margin Analysis Table */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain, marginBottom: 12 }]}>SKU Profitability & Margin Analysis</Text>

        <View style={[styles.tableContainer, { borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>SKU & PRODUCT</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>UNIT COST</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>SELLING PRICE</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>UNIT MARGIN ($)</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>MARGIN (%)</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'right', color: colors.textMuted }]}>TOTAL PROFIT</Text>
          </View>

          {products.map(p => {
            const unitMargin = p.sellingPrice - p.costPrice;
            const marginPct = p.sellingPrice > 0 ? (unitMargin / p.sellingPrice) * 100 : 0;
            const totalProfit = unitMargin * p.quantity;

            return (
              <View key={p.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.pName, { color: colors.textMain }]}>{p.name}</Text>
                  <Text style={[styles.pSku, { color: colors.brandAccent }]}>{p.sku}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>${p.costPrice.toFixed(2)}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '700' }}>${p.sellingPrice.toFixed(2)}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.statusSuccess, fontSize: 12, fontWeight: '600' }}>+${unitMargin.toFixed(2)}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: marginPct > 30 ? colors.statusSuccess : colors.statusWarning, fontSize: 12, fontWeight: '700' }}>
                    {marginPct.toFixed(1)}%
                  </Text>
                </View>

                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.statusSuccess, fontSize: 13, fontWeight: '800' }}>
                    ${totalProfit.toFixed(2)}
                  </Text>
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
    borderRadius: 8,
    borderWidth: 1,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  kpiSub: {
    fontSize: 11,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  progBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    borderRadius: 4,
  },
  tableContainer: {
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  }
});
