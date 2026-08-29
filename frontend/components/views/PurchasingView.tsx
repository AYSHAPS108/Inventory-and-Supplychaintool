import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { PurchaseOrder, POLineItem } from '../../types';
import { FontAwesome6 } from '@expo/vector-icons';
import { SelectPicker } from '../SelectPicker';

export const PurchasingView: React.FC = () => {
  const { theme, showToast, routeOptions, currentRole } = useApp();
  const colors = getThemeColors(theme);

  const [tab, setTab] = useState<'orders' | 'suppliers'>('orders');
  const [isPOModalOpen, setIsPOModalOpen] = useState(Boolean(routeOptions?.openCreatePO));

  const suppliers = store.getSuppliers();
  const warehouses = store.getWarehouses();
  const products = store.getProducts();
  const purchaseOrders = store.getPurchaseOrders();

  const [newPO, setNewPO] = useState<{
    supplierId: string;
    warehouseId: string;
    items: POLineItem[];
    paymentTerms: string;
    notes: string;
  }>({
    supplierId: suppliers[0]?.id || 'sup-1',
    warehouseId: warehouses[0]?.id || 'wh-1',
    items: [{
      productId: products[0]?.id || 'prod-101',
      sku: products[0]?.sku || '',
      name: products[0]?.name || '',
      quantity: 50,
      unitPrice: products[0]?.costPrice || 10,
      taxPercent: 18,
      totalAmount: (50 * (products[0]?.costPrice || 10)) * 1.18
    }],
    paymentTerms: 'Net 30',
    notes: ''
  });

  const handleUpdateStatus = (po: PurchaseOrder, nextStatus: PurchaseOrder['status']) => {
    store.savePurchaseOrder({ ...po, status: nextStatus });
    showToast(`PO ${po.poNumber} status updated to ${nextStatus}`, 'success');
  };

  const handleCreatePO = () => {
    const subtotal = newPO.items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
    const taxTotal = newPO.items.reduce((s, i) => s + ((i.quantity * i.unitPrice) * (i.taxPercent / 100)), 0);
    const grandTotal = subtotal + taxTotal;

    store.savePurchaseOrder({
      supplierId: newPO.supplierId,
      warehouseId: newPO.warehouseId,
      status: 'Sent',
      paymentTerms: newPO.paymentTerms,
      notes: newPO.notes,
      subtotal,
      taxTotal,
      grandTotal,
      items: newPO.items
    });

    setIsPOModalOpen(false);
    showToast('Purchase Order generated and sent!', 'success');
  };

  const canManage = currentRole === 'Admin' || currentRole === 'Purchase Staff' || currentRole === 'Inventory Manager';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.tabsWrap}>
          <TouchableOpacity
            onPress={() => setTab('orders')}
            style={[styles.tabBtn, tab === 'orders' && { borderBottomColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="file-invoice-dollar" size={13} color={tab === 'orders' ? colors.brandAccent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, { color: tab === 'orders' ? colors.textMain : colors.textMuted, fontWeight: tab === 'orders' ? '700' : '500' }]}>
              Purchase Orders ({purchaseOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab('suppliers')}
            style={[styles.tabBtn, tab === 'suppliers' && { borderBottomColor: colors.brandAccent }]}
          >
            <FontAwesome6 name="handshake" size={13} color={tab === 'suppliers' ? colors.brandAccent : colors.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, { color: tab === 'suppliers' ? colors.textMain : colors.textMuted, fontWeight: tab === 'suppliers' ? '700' : '500' }]}>
              Supplier Directory ({suppliers.length})
            </Text>
          </TouchableOpacity>
        </View>

        {canManage && (
          <TouchableOpacity
            onPress={() => setIsPOModalOpen(true)}
            style={[styles.addBtn, { backgroundColor: colors.brandPrimary }]}
          >
            <FontAwesome6 name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>New Purchase Order</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab 1: Orders Table */}
      {tab === 'orders' ? (
        <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 1.5, color: colors.textMuted }]}>PO NUMBER</Text>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>SUPPLIER</Text>
            <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>ORDER DATE</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'right', color: colors.textMuted }]}>GRAND TOTAL</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'center', color: colors.textMuted }]}>STATUS</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: 'center', color: colors.textMuted }]}>ACTIONS</Text>
          </View>

          {purchaseOrders.map(po => {
            const sup = suppliers.find(s => s.id === po.supplierId);
            let badgeBg = colors.bgInput;
            let badgeColor = colors.textMuted;

            if (po.status === 'Received') {
              badgeBg = colors.statusSuccessBg;
              badgeColor = colors.statusSuccess;
            } else if (po.status === 'Approved' || po.status === 'Sent') {
              badgeBg = colors.statusInfoBg;
              badgeColor = colors.statusInfo;
            } else if (po.status === 'Draft') {
              badgeBg = colors.statusWarningBg;
              badgeColor = colors.statusWarning;
            }

            return (
              <View key={po.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ color: colors.brandAccent, fontWeight: '700', fontSize: 13 }}>{po.poNumber}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>{po.items.length} Line Items</Text>
                </View>

                <View style={{ flex: 2 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>{sup?.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10 }}>Terms: {po.paymentTerms}</Text>
                </View>

                <View style={{ flex: 1.2 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12 }}>{po.orderDate}</Text>
                </View>

                <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.statusSuccess, fontWeight: '700', fontSize: 13 }}>
                    ${po.grandTotal.toFixed(2)}
                  </Text>
                </View>

                <View style={{ flex: 1.2, alignItems: 'center' }}>
                  <View style={[styles.statusPill, { backgroundColor: badgeBg }]}>
                    <Text style={{ color: badgeColor, fontSize: 11, fontWeight: '700' }}>{po.status}</Text>
                  </View>
                </View>

                <View style={{ flex: 1.5, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                  {po.status === 'Sent' && canManage && (
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(po, 'Approved')}
                      style={[styles.actionBtnSmall, { backgroundColor: colors.statusInfoBg }]}
                    >
                      <Text style={{ color: colors.statusInfo, fontSize: 10, fontWeight: '700' }}>Approve</Text>
                    </TouchableOpacity>
                  )}

                  {po.status === 'Approved' && canManage && (
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(po, 'Received')}
                      style={[styles.actionBtnSmall, { backgroundColor: colors.statusSuccessBg }]}
                    >
                      <Text style={{ color: colors.statusSuccess, fontSize: 10, fontWeight: '700' }}>Receive Stock</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        /* Tab 2: Suppliers Directory */
        <View style={styles.supGrid}>
          {suppliers.map(sup => (
            <View key={sup.id} style={[styles.supCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.supName, { color: colors.textMain }]}>{sup.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <FontAwesome6 name="star" size={11} color="#f59e0b" solid />
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '700' }}>{sup.rating.toFixed(1)}</Text>
                </View>
              </View>

              <View style={{ gap: 6, marginVertical: 10 }}>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Contact: {sup.contactPerson} ({sup.phone})</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Email: {sup.email}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Address: {sup.address}</Text>
              </View>

              <View style={[styles.supFooter, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                <Text style={{ color: colors.textSubtle, fontSize: 11 }}>Lead Time: <Text style={{ color: colors.textMain, fontWeight: '700' }}>{sup.leadTimeDays} days</Text></Text>
                <Text style={{ color: colors.textSubtle, fontSize: 11 }}>Terms: <Text style={{ color: colors.textMain, fontWeight: '700' }}>{sup.paymentTerms}</Text></Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Create PO Modal */}
      {isPOModalOpen && (
        <Modal transparent animationType="fade" visible={isPOModalOpen}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>Create Purchase Order</Text>
                <TouchableOpacity onPress={() => setIsPOModalOpen(false)}>
                  <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420, padding: 16 }}>
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Select Supplier</Text>
                      <SelectPicker
                        value={newPO.supplierId}
                        onChange={(val) => setNewPO({ ...newPO, supplierId: val })}
                        options={suppliers.map(s => ({ label: s.name, value: s.id }))}
                        style={{ height: 36, width: '100%' }}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Receiving Warehouse</Text>
                      <SelectPicker
                        value={newPO.warehouseId}
                        onChange={(val) => setNewPO({ ...newPO, warehouseId: val })}
                        options={warehouses.map(w => ({ label: w.name, value: w.id }))}
                        style={{ height: 36, width: '100%' }}
                      />
                    </View>
                  </View>

                  <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 6 }]}>Order Line Item</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 2 }}>
                      <SelectPicker
                        value={newPO.items[0]?.productId || products[0]?.id}
                        onChange={(val) => {
                          const p = products.find(prod => prod.id === val);
                          if (p) {
                            setNewPO({
                              ...newPO,
                              items: [{
                                productId: p.id,
                                sku: p.sku,
                                name: p.name,
                                quantity: newPO.items[0]?.quantity || 50,
                                unitPrice: p.costPrice,
                                taxPercent: 18,
                                totalAmount: (newPO.items[0]?.quantity || 50) * p.costPrice * 1.18
                              }]
                            });
                          }
                        }}
                        options={products.map(p => ({ label: `${p.name} (${p.sku})`, value: p.id }))}
                        style={{ height: 36, width: '100%' }}
                      />
                    </View>

                    <View style={{ width: 100 }}>
                      <TextInput
                        value={String(newPO.items[0]?.quantity || 0)}
                        onChangeText={(t) => {
                          const qty = parseInt(t, 10) || 0;
                          const currentItem = newPO.items[0];
                          setNewPO({
                            ...newPO,
                            items: [{
                              ...currentItem,
                              quantity: qty,
                              totalAmount: qty * currentItem.unitPrice * 1.18
                            }]
                          });
                        }}
                        keyboardType="numeric"
                        placeholder="Quantity"
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity onPress={() => setIsPOModalOpen(false)} style={[styles.modalBtnSec, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreatePO} style={[styles.modalBtnPrim, { backgroundColor: colors.brandPrimary }]}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Generate PO</Text>
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
  actionBtnSmall: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  supGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  supCard: {
    flex: 1,
    minWidth: 280,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  supName: {
    fontSize: 14,
    fontWeight: '700',
  },
  supFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
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
    maxWidth: 540,
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
