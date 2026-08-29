import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';

type ReportType = 'valuation' | 'low_stock' | 'movements' | 'suppliers';

export const ReportsView: React.FC = () => {
  const { theme, showToast } = useApp();
  const colors = getThemeColors(theme);

  const [activeReport, setActiveReport] = useState<ReportType>('valuation');

  const products = store.getProducts();
  const suppliers = store.getSuppliers();
  const movements = store.getMovements();
  const lowStockProds = products.filter(p => p.quantity <= p.minStock);

  const handleExportCSV = () => {
    showToast(`Exported ${activeReport.toUpperCase()} report to CSV!`, 'success');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    } else {
      showToast('Opening print preview...', 'info');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Report Switcher Header */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.textMain }]}>Enterprise Analytics & Reports Hub</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>Generate, audit and export supply chain intelligence</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={handleExportCSV}
              style={[styles.exportBtn, { backgroundColor: colors.brandPrimary }]}
            >
              <FontAwesome6 name="file-csv" size={12} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.exportBtnText}>Export CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePrint}
              style={[styles.exportBtnSec, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
            >
              <FontAwesome6 name="print" size={12} color={colors.textMain} style={{ marginRight: 6 }} />
              <Text style={[styles.exportBtnSecText, { color: colors.textMain }]}>Print</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Report Selector Pills */}
        <View style={styles.reportPillsRow}>
          <TouchableOpacity
            onPress={() => setActiveReport('valuation')}
            style={[styles.pill, activeReport === 'valuation' && { backgroundColor: colors.brandPrimary }]}
          >
            <Text style={[styles.pillText, { color: activeReport === 'valuation' ? '#fff' : colors.textMuted }]}>
              Inventory Valuation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveReport('low_stock')}
            style={[styles.pill, activeReport === 'low_stock' && { backgroundColor: colors.brandPrimary }]}
          >
            <Text style={[styles.pillText, { color: activeReport === 'low_stock' ? '#fff' : colors.textMuted }]}>
              Low Stock & Reorder ({lowStockProds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveReport('movements')}
            style={[styles.pill, activeReport === 'movements' && { backgroundColor: colors.brandPrimary }]}
          >
            <Text style={[styles.pillText, { color: activeReport === 'movements' ? '#fff' : colors.textMuted }]}>
              Movement Audit ({movements.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveReport('suppliers')}
            style={[styles.pill, activeReport === 'suppliers' && { backgroundColor: colors.brandPrimary }]}
          >
            <Text style={[styles.pillText, { color: activeReport === 'suppliers' ? '#fff' : colors.textMuted }]}>
              Supplier Performance
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Content Display */}
      <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        {activeReport === 'valuation' && (
          <>
            <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>SKU / PRODUCT</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>QTY</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>UNIT COST</Text>
              <Text style={[styles.th, { flex: 1.2, textAlign: 'right', color: colors.textMuted }]}>TOTAL COST BASIS</Text>
              <Text style={[styles.th, { flex: 1.2, textAlign: 'right', color: colors.textMuted }]}>TOTAL RETAIL</Text>
            </View>
            {products.map(p => (
              <View key={p.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>{p.name}</Text>
                  <Text style={{ color: colors.brandAccent, fontSize: 10 }}>{p.sku}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMain, fontSize: 12 }}>{p.quantity} {p.unit}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>${p.costPrice.toFixed(2)}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>${(p.quantity * p.costPrice).toFixed(2)}</Text>
                </View>
                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.statusSuccess, fontWeight: '700', fontSize: 12 }}>${(p.quantity * p.sellingPrice).toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeReport === 'low_stock' && (
          <>
            <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>SKU / PRODUCT</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>ON HAND</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>MIN STOCK</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>DEFICIT</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'right', color: colors.textMuted }]}>EST. REORDER COST</Text>
            </View>
            {lowStockProds.map(p => {
              const deficit = Math.max(0, p.minStock - p.quantity);
              const reorderCost = (p.reorderQty || deficit || 10) * p.costPrice;
              return (
                <View key={p.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>{p.name}</Text>
                    <Text style={{ color: colors.brandAccent, fontSize: 10 }}>{p.sku}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: p.quantity === 0 ? colors.statusDanger : colors.statusWarning, fontWeight: '700', fontSize: 12 }}>
                      {p.quantity} {p.unit}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>{p.minStock}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: colors.statusDanger, fontWeight: '700', fontSize: 12 }}>-{deficit}</Text>
                  </View>
                  <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>${reorderCost.toFixed(2)}</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {activeReport === 'movements' && (
          <>
            <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>DATE</Text>
              <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>TYPE</Text>
              <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>PRODUCT</Text>
              <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>REFERENCE</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>QTY</Text>
            </View>
            {movements.map(m => (
              <View key={m.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 11 }}>{m.date}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.brandAccent, fontWeight: '700', fontSize: 11 }}>{m.type}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>{m.productName}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>{m.sku}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>{m.referenceNo}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>{m.quantity}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeReport === 'suppliers' && (
          <>
            <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
              <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>SUPPLIER</Text>
              <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>CONTACT</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>LEAD TIME</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>RATING</Text>
              <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>PAYMENT TERMS</Text>
            </View>
            {suppliers.map(s => (
              <View key={s.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>{s.name}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>GSTIN: {s.gstin}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12 }}>{s.contactPerson}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10 }}>{s.phone}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>{s.leadTimeDays} days</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: '#f59e0b', fontWeight: '700', fontSize: 12 }}>★ {s.rating.toFixed(1)}</Text>
                </View>
                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{s.paymentTerms}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  exportBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  exportBtnSec: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  exportBtnSecText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableContainer: {
    borderRadius: 8,
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
  }
});
