import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { SelectPicker } from '../SelectPicker';

export const TransfersView: React.FC = () => {
  const { theme, showToast } = useApp();
  const colors = getThemeColors(theme);

  const [tab, setTab] = useState<'transfers' | 'adjustments'>('transfers');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);

  const warehouses = store.getWarehouses();
  const products = store.getProducts();
  const transfers = store.getTransfers();
  const adjustments = store.getAdjustments();

  // New Transfer State
  const [transferFrom, setTransferFrom] = useState(warehouses[0]?.id || 'wh-1');
  const [transferTo, setTransferTo] = useState(warehouses[1]?.id || 'wh-2');
  const [transferProduct, setTransferProduct] = useState(products[0]?.id || 'prod-101');
  const [transferQty, setTransferQty] = useState(20);

  // New Adjustment State
  const [adjWarehouse, setAdjWarehouse] = useState(warehouses[0]?.id || 'wh-1');
  const [adjProduct, setAdjProduct] = useState(products[0]?.id || 'prod-101');
  const selectedAdjProd = products.find(p => p.id === adjProduct) || products[0];
  const [adjCountedQty, setAdjCountedQty] = useState(selectedAdjProd?.quantity || 0);
  const [adjReason, setAdjReason] = useState('Routine Physical Cycle Count');

  const handleCreateTransfer = () => {
    if (transferFrom === transferTo) {
      showToast('Source and destination warehouse cannot be the same.', 'warning');
      return;
    }
    const prod = products.find(p => p.id === transferProduct);
    if (!prod) return;

    store.saveStockTransfer({
      fromWarehouseId: transferFrom,
      toWarehouseId: transferTo,
      items: [{ productId: prod.id, sku: prod.sku, name: prod.name, quantity: transferQty }],
      status: 'Completed',
      notes: 'Transfer dispatched'
    });

    setIsTransferModalOpen(false);
    showToast(`Transfer ${transferQty}x ${prod.sku} completed!`, 'success');
  };

  const handleCreateAdjustment = () => {
    if (!selectedAdjProd) return;

    store.saveStockAdjustment({
      warehouseId: adjWarehouse,
      productId: selectedAdjProd.id,
      productName: selectedAdjProd.name,
      systemQty: selectedAdjProd.quantity,
      countedQty: adjCountedQty,
      reason: adjReason
    });

    setIsAdjModalOpen(false);
    showToast('Stock adjustment and audit entry recorded!', 'success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.tabsWrap}>
          <TouchableOpacity
            onPress={() => setTab('transfers')}
            style={[styles.tabBtn, tab === 'transfers' && { borderBottomColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="right-left" size={13} color={tab === 'transfers' ? colors.brandAccent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, { color: tab === 'transfers' ? colors.textMain : colors.textMuted, fontWeight: tab === 'transfers' ? '700' : '500' }]}>
              Stock Transfers ({transfers.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('adjustments')}
            style={[styles.tabBtn, tab === 'adjustments' && { borderBottomColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="clipboard-check" size={13} color={tab === 'adjustments' ? colors.brandAccent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, { color: tab === 'adjustments' ? colors.textMain : colors.textMuted, fontWeight: tab === 'adjustments' ? '700' : '500' }]}>
              Adjustments & Cycle Counts ({adjustments.length})
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'transfers' ? (
          <TouchableOpacity
            onPress={() => setIsTransferModalOpen(true)}
            style={[styles.addBtn, { backgroundColor: colors.brandPrimary }]}
          >
            <FontAwesome6 name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>New Transfer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setAdjCountedQty(selectedAdjProd?.quantity || 0);
              setIsAdjModalOpen(true);
            }}
            style={[styles.addBtn, { backgroundColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>New Cycle Adjustment</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab 1: Transfers */}
      {tab === 'transfers' ? (
        <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>TRANSFER NO</Text>
            <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>DATE</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>ORIGIN & DESTINATION</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>ITEMS TRANSFERRED</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'center', color: colors.textMuted }]}>STATUS</Text>
          </View>

          {transfers.map(tr => {
            const fromWh = warehouses.find(w => w.id === tr.fromWarehouseId);
            const toWh = warehouses.find(w => w.id === tr.toWarehouseId);

            return (
              <View key={tr.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.brandAccent, fontWeight: '700', fontSize: 13 }}>{tr.transferNo}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>By {tr.createdBy}</Text>
                </View>

                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12 }}>{tr.date}</Text>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>
                    {fromWh?.name} → {toWh?.name}
                  </Text>
                  {tr.notes && <Text style={{ color: colors.textMuted, fontSize: 10 }}>{tr.notes}</Text>}
                </View>

                <View style={{ flex: 2 }}>
                  {tr.items.map((i, idx) => (
                    <Text key={idx} style={{ color: colors.textMain, fontSize: 12 }}>
                      • {i.quantity}x {i.name} ({i.sku})
                    </Text>
                  ))}
                </View>

                <View style={{ flex: 1.2, alignItems: 'center' }}>
                  <View style={[styles.statusPill, { backgroundColor: colors.statusSuccessBg }]}>
                    <Text style={{ color: colors.statusSuccess, fontSize: 11, fontWeight: '700' }}>{tr.status}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        /* Tab 2: Adjustments Table */
        <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>ADJUSTMENT NO</Text>
            <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>DATE</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>PRODUCT / SKU</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>SYSTEM</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>COUNTED</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>VARIANCE</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>REASON & AUDIT</Text>
          </View>

          {adjustments.map(adj => {
            const isPos = adj.varianceQty > 0;
            return (
              <View key={adj.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.brandAccent, fontWeight: '700', fontSize: 13 }}>{adj.adjustmentNo}</Text>
                </View>

                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12 }}>{adj.date}</Text>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>{adj.productName}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{adj.systemQty}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>{adj.countedQty}</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: isPos ? colors.statusSuccess : colors.statusDanger, fontWeight: '800', fontSize: 12 }}>
                    {isPos ? '+' : ''}{adj.varianceQty}
                  </Text>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 11 }}>{adj.reason}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>Audited by {adj.recordedBy}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <Modal transparent animationType="fade" visible={isTransferModalOpen}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>Create Inter-Warehouse Transfer</Text>
                <TouchableOpacity onPress={() => setIsTransferModalOpen(false)}>
                  <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 16, gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Source Warehouse</Text>
                    <SelectPicker
                      value={transferFrom}
                      onChange={setTransferFrom}
                      options={warehouses.map(w => ({ label: w.name, value: w.id }))}
                      style={{ height: 36, width: '100%' }}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Destination Warehouse</Text>
                    <SelectPicker
                      value={transferTo}
                      onChange={setTransferTo}
                      options={warehouses.map(w => ({ label: w.name, value: w.id }))}
                      style={{ height: 36, width: '100%' }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Product to Transfer</Text>
                    <SelectPicker
                      value={transferProduct}
                      onChange={setTransferProduct}
                      options={products.map(p => ({ label: `${p.name} (${p.quantity} avail)`, value: p.id }))}
                      style={{ height: 36, width: '100%' }}
                    />
                  </View>

                  <View style={{ width: 110 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Quantity</Text>
                    <TextInput
                      value={String(transferQty)}
                      onChangeText={(t) => setTransferQty(parseInt(t, 10) || 0)}
                      keyboardType="numeric"
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity onPress={() => setIsTransferModalOpen(false)} style={[styles.modalBtnSec, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateTransfer} style={[styles.modalBtnPrim, { backgroundColor: colors.brandPrimary }]}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Dispatch Transfer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Cycle Count Modal */}
      {isAdjModalOpen && (
        <Modal transparent animationType="fade" visible={isAdjModalOpen}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>Physical Stock Count Adjustment</Text>
                <TouchableOpacity onPress={() => setIsAdjModalOpen(false)}>
                  <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 16, gap: 12 }}>
                <View>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Product</Text>
                  <SelectPicker
                    value={adjProduct}
                    onChange={(val) => {
                      setAdjProduct(val);
                      const p = products.find(prod => prod.id === val);
                      if (p) setAdjCountedQty(p.quantity);
                    }}
                    options={products.map(p => ({ label: `${p.name} (${p.sku})`, value: p.id }))}
                    style={{ height: 36, width: '100%' }}
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Current System Qty</Text>
                    <View style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, justifyContent: 'center' }]}>
                      <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13 }}>{selectedAdjProd?.quantity} {selectedAdjProd?.unit}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Physical Counted Qty</Text>
                    <TextInput
                      value={String(adjCountedQty)}
                      onChangeText={(t) => setAdjCountedQty(parseInt(t, 10) || 0)}
                      keyboardType="numeric"
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Adjustment Reason</Text>
                  <TextInput
                    value={adjReason}
                    onChangeText={setAdjReason}
                    placeholder="e.g. Damage, Expired stock, Found excess"
                    placeholderTextColor={colors.textSubtle}
                    style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                  />
                </View>
              </View>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity onPress={() => setIsAdjModalOpen(false)} style={[styles.modalBtnSec, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateAdjustment} style={[styles.modalBtnPrim, { backgroundColor: colors.brandAccent }]}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Apply Adjustment</Text>
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
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
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
  selectWrap: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
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
