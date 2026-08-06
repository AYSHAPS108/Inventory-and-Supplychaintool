import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ApiService } from '../../services/api';
import { Product, Metrics } from '../../types';

export default function ProductMasterScreen() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alertProducts, setAlertProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const m = await ApiService.getMetrics();
    const products = await ApiService.getProducts();
    setMetrics(m);
    setAlertProducts(products.filter(p => p.quantity <= p.minStock));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Executive Overview</Text>

      {/* KPI Cards */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderColor: '#6366f1' }]}>
          <Text style={styles.kpiLabel}>TOTAL ACTIVE SKUS</Text>
          <Text style={styles.kpiValue}>{metrics?.totalProducts || 0}</Text>
          <Text style={styles.kpiSub}>Across {metrics?.totalCategories || 0} Categories</Text>
        </View>

        <View style={[styles.kpiCard, { borderColor: '#10b981' }]}>
          <Text style={styles.kpiLabel}>TOTAL VALUATION</Text>
          <Text style={[styles.kpiValue, { color: '#10b981' }]}>
            ${metrics?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.kpiSub}>Cost basis: ${metrics?.totalCostValue.toLocaleString()}</Text>
        </View>

        <View style={[styles.kpiCard, { borderColor: '#f59e0b' }]}>
          <Text style={styles.kpiLabel}>LOW STOCK ALERTS</Text>
          <Text style={[styles.kpiValue, { color: '#f59e0b' }]}>{metrics?.lowStockCount || 0}</Text>
          <Text style={styles.kpiSub}>Below min threshold</Text>
        </View>

        <View style={[styles.kpiCard, { borderColor: '#ef4444' }]}>
          <Text style={styles.kpiLabel}>OUT OF STOCK</Text>
          <Text style={[styles.kpiValue, { color: '#ef4444' }]}>{metrics?.outOfStockCount || 0}</Text>
          <Text style={styles.kpiSub}>Action required</Text>
        </View>
      </View>

      {/* Stock Alerts Section */}
      <Text style={styles.sectionTitle}>Critical Stock Alerts ({alertProducts.length})</Text>
      {alertProducts.map(p => {
        const isOut = p.quantity === 0;
        return (
          <View key={p.id} style={[styles.alertCard, isOut && styles.alertCardDanger]}>
            <Image source={{ uri: p.imageUrl }} style={styles.alertThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertName}>{p.name}</Text>
              <Text style={styles.alertMeta}>SKU: {p.sku} | Location: {p.locationBin}</Text>
            </View>
            <View style={[styles.badge, isOut ? styles.badgeDanger : styles.badgeWarning]}>
              <Text style={styles.badgeText}>
                {isOut ? 'Out of Stock' : `${p.quantity} ${p.unit} (Min: ${p.minStock})`}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  sectionTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  kpiCard: { flex: 1, minWidth: 150, backgroundColor: '#1e293b', padding: 16, borderRadius: 12, borderWidth: 1 },
  kpiLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  kpiValue: { color: '#f8fafc', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  kpiSub: { color: '#64748b', fontSize: 12 },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 10, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  alertCardDanger: { borderLeftColor: '#ef4444' },
  alertThumb: { width: 44, height: 44, borderRadius: 8, marginRight: 12, backgroundColor: '#0f172a' },
  alertName: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
  alertMeta: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeWarning: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  badgeDanger: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  badgeText: { color: '#f8fafc', fontSize: 11, fontWeight: '700' }
});
