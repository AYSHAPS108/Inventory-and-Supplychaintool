import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { Warehouse } from '../../types';
import { FontAwesome6 } from '@expo/vector-icons';

export const WarehousesView: React.FC = () => {
  const { theme, showToast } = useApp();
  const colors = getThemeColors(theme);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWh, setNewWh] = useState<Partial<Warehouse>>({
    name: '',
    code: '',
    address: '',
    manager: '',
    phone: '',
    capacity: '10,000 sq ft',
    status: 'Active',
    isPrimary: false
  });

  const warehouses = store.getWarehouses();
  const locations = store.getLocations();
  const products = store.getProducts();

  const handleSaveWarehouse = () => {
    if (!newWh.name?.trim() || !newWh.code?.trim()) {
      showToast('Warehouse name and code are required.', 'warning');
      return;
    }
    store.saveWarehouse(newWh);
    setIsModalOpen(false);
    showToast(`Warehouse "${newWh.name}" added successfully!`, 'success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 20 }}>
      {/* Header and Add Button */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Warehouse Facilities ({warehouses.length})</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Distribution centers, transit depots and storage hubs</Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          style={[styles.addBtn, { backgroundColor: colors.brandPrimary }]}
        >
          <FontAwesome6 name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Add Warehouse</Text>
        </TouchableOpacity>
      </View>

      {/* Warehouse Cards Grid */}
      <View style={styles.whGrid}>
        {warehouses.map(wh => {
          const whProducts = products.filter(p => p.warehouseId === wh.id);
          const totalUnits = whProducts.reduce((sum, p) => sum + p.quantity, 0);
          const whLocations = locations.filter(l => l.warehouseId === wh.id);

          return (
            <View
              key={wh.id}
              style={[styles.whCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
            >
              <View style={styles.whCardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.whName, { color: colors.textMain }]}>{wh.name}</Text>
                    {wh.isPrimary && (
                      <View style={[styles.primaryBadge, { backgroundColor: colors.brandAccent }]}>
                        <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>PRIMARY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.whCode, { color: colors.brandAccent }]}>{wh.code}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: colors.statusSuccessBg }]}>
                  <Text style={{ color: colors.statusSuccess, fontSize: 10, fontWeight: '700' }}>{wh.status}</Text>
                </View>
              </View>

              <View style={{ gap: 6, marginVertical: 12 }}>
                <View style={styles.infoRow}>
                  <FontAwesome6 name="location-dot" size={12} color={colors.textMuted} style={{ width: 18 }} />
                  <Text style={[styles.infoText, { color: colors.textMuted }]}>{wh.address}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome6 name="user-tie" size={12} color={colors.textMuted} style={{ width: 18 }} />
                  <Text style={[styles.infoText, { color: colors.textMuted }]}>Manager: {wh.manager} ({wh.phone})</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome6 name="cubes" size={12} color={colors.textMuted} style={{ width: 18 }} />
                  <Text style={[styles.infoText, { color: colors.textMuted }]}>
                    Capacity: {wh.capacity} • {whLocations.length} Bins
                  </Text>
                </View>
              </View>

              <View style={[styles.statsRow, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>ACTIVE SKUS</Text>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 14 }}>{whProducts.length}</Text>
                </View>
                <View style={{ width: 1, height: 24, backgroundColor: colors.border }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>TOTAL UNITS</Text>
                  <Text style={{ color: colors.brandAccent, fontWeight: '700', fontSize: 14 }}>{totalUnits.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Storage Bins Directory */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textMain, marginBottom: 12 }]}>Storage Bins & Rack Hierarchy</Text>
        <View style={[styles.tableContainer, { borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>BIN CODE</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>WAREHOUSE</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>ZONE</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>AISLE</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>RACK</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>SHELF / BIN</Text>
          </View>

          {locations.map(loc => {
            const wh = warehouses.find(w => w.id === loc.warehouseId);
            return (
              <View key={loc.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.brandAccent, fontWeight: '700', fontSize: 12 }}>{loc.code}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '600' }}>{wh?.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{loc.zone}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{loc.aisle}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{loc.rack}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{loc.shelf} - #{loc.bin}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Add Warehouse Modal */}
      {isModalOpen && (
        <Modal transparent animationType="fade" visible={isModalOpen}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>Register New Warehouse</Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 16, gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Warehouse Name *</Text>
                    <TextInput
                      value={newWh.name}
                      onChangeText={(t) => setNewWh({ ...newWh, name: t })}
                      placeholder="e.g. West Coast Distribution"
                      placeholderTextColor={colors.textSubtle}
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Code *</Text>
                    <TextInput
                      value={newWh.code}
                      onChangeText={(t) => setNewWh({ ...newWh, code: t })}
                      placeholder="WH-WEST"
                      placeholderTextColor={colors.textSubtle}
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Address</Text>
                  <TextInput
                    value={newWh.address}
                    onChangeText={(t) => setNewWh({ ...newWh, address: t })}
                    placeholder="Physical street address, city, country"
                    placeholderTextColor={colors.textSubtle}
                    style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Facility Manager</Text>
                    <TextInput
                      value={newWh.manager}
                      onChangeText={(t) => setNewWh({ ...newWh, manager: t })}
                      placeholder="Manager Name"
                      placeholderTextColor={colors.textSubtle}
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Contact Phone</Text>
                    <TextInput
                      value={newWh.phone}
                      onChangeText={(t) => setNewWh({ ...newWh, phone: t })}
                      placeholder="+1 555-0000"
                      placeholderTextColor={colors.textSubtle}
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity onPress={() => setIsModalOpen(false)} style={[styles.modalBtnSec, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveWarehouse} style={[styles.modalBtnPrim, { backgroundColor: colors.brandPrimary }]}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Create Warehouse</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  whGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  whCard: {
    flex: 1,
    minWidth: 280,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  whCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  whName: {
    fontSize: 14,
    fontWeight: '700',
  },
  whCode: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  primaryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 6,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  fieldLabel: {
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
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  modalBtnSec: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  modalBtnPrim: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  }
});
