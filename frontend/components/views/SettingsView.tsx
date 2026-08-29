import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { Settings } from '../../types';
import { SelectPicker } from '../SelectPicker';

export const SettingsView: React.FC = () => {
  const { theme, showToast, resetAllData } = useApp();
  const colors = getThemeColors(theme);

  const [settingsState, setSettingsState] = useState<Settings>(store.getSettings());

  const handleSave = () => {
    store.saveSettings(settingsState);
    showToast('System configuration saved!', 'success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 20 }}>
      {/* Enterprise Company Profile */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Enterprise Company Profile</Text>

        <View style={{ gap: 12, marginTop: 14 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 2 }}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Company Name</Text>
              <TextInput
                value={settingsState.companyName}
                onChangeText={(t) => setSettingsState({ ...settingsState, companyName: t })}
                style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
              />
            </View>
            <View style={{ width: 100 }}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Currency</Text>
              <TextInput
                value={settingsState.currency}
                onChangeText={(t) => setSettingsState({ ...settingsState, currency: t })}
                style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
              />
            </View>
            <View style={{ width: 120 }}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Default Tax (%)</Text>
              <TextInput
                value={String(settingsState.defaultTaxRate)}
                onChangeText={(t) => setSettingsState({ ...settingsState, defaultTaxRate: parseFloat(t) || 0 })}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.textMuted }]}>Headquarters Address</Text>
            <TextInput
              value={settingsState.companyAddress}
              onChangeText={(t) => setSettingsState({ ...settingsState, companyAddress: t })}
              style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
            />
          </View>
        </View>
      </View>

      {/* Valuation & Inventory Methods */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Inventory Valuation & Accounting Model</Text>

        <View style={{ gap: 12, marginTop: 14 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Valuation Methodology</Text>
              <SelectPicker
                value={settingsState.valuationMethod}
                onChange={(val) => setSettingsState({ ...settingsState, valuationMethod: val as any })}
                options={[
                  { label: 'FIFO (First In, First Out)', value: 'FIFO' },
                  { label: 'Weighted Average Cost', value: 'Weighted Average' }
                ]}
                style={{ height: 36, width: '100%' }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Low Stock Alert Threshold (%)</Text>
              <TextInput
                value={String(settingsState.lowStockThresholdPercent)}
                onChangeText={(t) => setSettingsState({ ...settingsState, lowStockThresholdPercent: parseInt(t, 10) || 10 })}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.brandPrimary }]}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Permissions Matrix */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain, marginBottom: 12 }]}>Role-Based Access Control (RBAC) Matrix</Text>

        <View style={[styles.tableContainer, { borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>ROLE</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>PRODUCTS</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>ORDERS</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>TRANSFERS</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>VALUATION</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>SETTINGS</Text>
          </View>

          {[
            { role: 'Admin', p: 'Full', o: 'Full', t: 'Full', v: 'Full', s: 'Full' },
            { role: 'Inventory Manager', p: 'Full', o: 'View', t: 'Full', v: 'Full', s: 'Read' },
            { role: 'Warehouse Staff', p: 'Read', o: 'Receive', t: 'Execute', v: 'None', s: 'None' },
            { role: 'Purchase Staff', p: 'Read', o: 'Full', t: 'None', v: 'Costing', s: 'None' },
            { role: 'Store Manager', p: 'Full', o: 'Create', t: 'Request', v: 'Read', s: 'None' },
            { role: 'View Only', p: 'Read', o: 'Read', t: 'Read', v: 'Read', s: 'None' },
          ].map(r => (
            <View key={r.role} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
              <View style={{ flex: 2 }}>
                <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>{r.role}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: r.p === 'Full' ? colors.statusSuccess : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{r.p}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: r.o === 'Full' ? colors.statusSuccess : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{r.o}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: r.t === 'Full' ? colors.statusSuccess : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{r.t}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: r.v === 'Full' ? colors.statusSuccess : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{r.v}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: r.s === 'Full' ? colors.statusSuccess : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{r.s}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Danger Zone: Factory Reset */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.statusDangerBg, borderLeftWidth: 4, borderLeftColor: colors.statusDanger }]}>
        <Text style={[styles.cardTitle, { color: colors.statusDanger }]}>Danger Zone: Factory Seed Reset</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
          Restores all products, categories, warehouses, suppliers, stock movements, and purchase orders back to original sample dataset.
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (typeof window !== 'undefined') {
              if (window.confirm('Are you sure you want to reset all data to default? All local changes will be replaced.')) {
                resetAllData();
              }
            } else {
              resetAllData();
            }
          }}
          style={[styles.resetBtn, { backgroundColor: colors.statusDangerBg, borderColor: colors.statusDanger }]}
        >
          <FontAwesome6 name="triangle-exclamation" size={12} color={colors.statusDanger} style={{ marginRight: 6 }} />
          <Text style={{ color: colors.statusDanger, fontWeight: '700', fontSize: 12 }}>Reset Everything to Defaults</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 12,
  },
  selectWrap: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
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
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
  }
});
