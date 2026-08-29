import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { getThemeColors } from '../../styles/theme';
import { Product } from '../../types';
import { FontAwesome6 } from '@expo/vector-icons';
import { SelectPicker } from '../SelectPicker';

export const ProductsView: React.FC = () => {
  const { theme, showToast, routeOptions, currentRole } = useApp();
  const colors = getThemeColors(theme);

  const [search, setSearch] = useState<string>(routeOptions?.searchQuery || '');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>(
    routeOptions?.filter || 'all'
  );
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(Boolean(routeOptions?.openCreateModal));
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const canEdit = currentRole === 'Admin' || currentRole === 'Inventory Manager' || currentRole === 'Purchase Staff';

  const categories = store.getCategories();
  const warehouses = store.getWarehouses();
  const suppliers = store.getSuppliers();
  const allProducts = store.getProducts();

  // Filter products
  const filteredProducts = allProducts.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.locationBin && p.locationBin.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) {
      return false;
    }
    if (statusFilter === 'in_stock' && p.quantity <= p.minStock) {
      return false;
    }
    if (statusFilter === 'low_stock' && (p.quantity === 0 || p.quantity > p.minStock)) {
      return false;
    }
    if (statusFilter === 'out_of_stock' && p.quantity > 0) {
      return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      sku: '',
      categoryId: categories[0]?.id || 'cat-1',
      warehouseId: warehouses[0]?.id || 'wh-1',
      supplierId: suppliers[0]?.id || 'sup-1',
      locationBin: 'A-01-01',
      costPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      minStock: 10,
      maxStock: 500,
      unit: 'pcs',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct?.name?.trim() || !editingProduct?.sku?.trim()) {
      showToast('Please provide a valid Product Name and SKU.', 'warning');
      return;
    }
    store.saveProduct(editingProduct);
    setIsModalOpen(false);
    setEditingProduct(null);
    showToast(`Product "${editingProduct.name}" saved successfully!`, 'success');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (!canEdit) {
      showToast('You do not have permission to delete products in this role.', 'danger');
      return;
    }
    if (typeof window !== 'undefined') {
      if (window.confirm(`Delete product "${name}" permanently?`)) {
        store.deleteProduct(id);
        showToast(`Product "${name}" deleted.`, 'info');
      }
    } else {
      store.deleteProduct(id);
      showToast(`Product "${name}" deleted.`, 'info');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 16 }}>
      {/* Control Bar */}
      <View style={[styles.controlBar, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.controlLeft}>
          {/* Search */}
          <View style={[styles.searchBox, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
            <FontAwesome6 name="magnifying-glass" size={13} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Filter by SKU, Name or Bin..."
              placeholderTextColor={colors.textSubtle}
              style={[styles.searchInput, { color: colors.textMain }]}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <FontAwesome6 name="xmark" size={12} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Dropdown */}
          <SelectPicker
            value={selectedCat}
            onChange={setSelectedCat}
            options={[
              { label: 'All Categories', value: 'all' },
              ...categories.map(c => ({ label: c.name, value: c.id }))
            ]}
            style={{ height: 34, minWidth: 140 }}
          />

          {/* Stock Status Filter */}
          <SelectPicker
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
            options={[
              { label: 'All Stock Statuses', value: 'all' },
              { label: 'In Stock', value: 'in_stock' },
              { label: 'Low Stock Alerts', value: 'low_stock' },
              { label: 'Out of Stock', value: 'out_of_stock' }
            ]}
            style={{ height: 34, minWidth: 150 }}
          />
        </View>

        <View style={styles.controlRight}>
          {/* View Toggle */}
          <View style={[styles.viewToggle, { borderColor: colors.border, backgroundColor: colors.bgInput }]}>
            <TouchableOpacity
              onPress={() => setViewMode('table')}
              style={[styles.toggleBtn, viewMode === 'table' && { backgroundColor: colors.brandPrimary }]}
            >
              <FontAwesome6 name="table-list" size={13} color={viewMode === 'table' ? '#fff' : colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={[styles.toggleBtn, viewMode === 'grid' && { backgroundColor: colors.brandPrimary }]}
            >
              <FontAwesome6 name="grip" size={13} color={viewMode === 'grid' ? '#fff' : colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Add Product Button */}
          {canEdit && (
            <TouchableOpacity
              onPress={handleOpenAdd}
              style={[styles.addBtn, { backgroundColor: colors.brandPrimary }]}
            >
              <FontAwesome6 name="plus" size={12} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.addBtnText}>Add SKU</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Product count indicator */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>
          Showing <Text style={{ color: colors.textMain, fontWeight: '700' }}>{filteredProducts.length}</Text> of {allProducts.length} items
        </Text>
      </View>

      {/* Grid or Table Mode */}
      {viewMode === 'table' ? (
        <View style={[styles.tableContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.th, { flex: 2, color: colors.textMuted }]}>PRODUCT / SKU</Text>
            <Text style={[styles.th, { flex: 1.2, color: colors.textMuted }]}>CATEGORY</Text>
            <Text style={[styles.th, { flex: 1, color: colors.textMuted }]}>LOCATION</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.textMuted }]}>COST / PRICE</Text>
            <Text style={[styles.th, { flex: 1.2, textAlign: 'center', color: colors.textMuted }]}>ON HAND</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.textMuted }]}>ACTIONS</Text>
          </View>

          {/* Table Rows */}
          {filteredProducts.map(p => {
            const cat = categories.find(c => c.id === p.categoryId);
            const isLow = p.quantity > 0 && p.quantity <= p.minStock;
            const isOut = p.quantity === 0;

            return (
              <View
                key={p.id}
                style={[styles.tableRow, { borderBottomColor: colors.border }]}
              >
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Image source={{ uri: p.image }} style={styles.tableThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pName, { color: colors.textMain }]} numberOfLines={1}>{p.name}</Text>
                    <Text style={[styles.pSku, { color: colors.brandAccent }]}>{p.sku}</Text>
                  </View>
                </View>

                <View style={{ flex: 1.2 }}>
                  <Text style={[styles.catBadge, { color: cat?.color || colors.textMuted }]}>
                    {cat?.name || 'Unassigned'}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '600' }}>{p.locationBin || 'N/A'}</Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>
                    {warehouses.find(w => w.id === p.warehouseId)?.code || 'WH'}
                  </Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '700' }}>
                    ${p.sellingPrice.toFixed(2)}
                  </Text>
                  <Text style={{ color: colors.textSubtle, fontSize: 10 }}>
                    Cost: ${p.costPrice.toFixed(2)}
                  </Text>
                </View>

                <View style={{ flex: 1.2, alignItems: 'center' }}>
                  <View
                    style={[
                      styles.stockPill,
                      {
                        backgroundColor: isOut
                          ? colors.statusDangerBg
                          : isLow
                          ? colors.statusWarningBg
                          : colors.statusSuccessBg,
                      }
                    ]}
                  >
                    <Text
                      style={{
                        color: isOut
                          ? colors.statusDanger
                          : isLow
                          ? colors.statusWarning
                          : colors.statusSuccess,
                        fontSize: 11,
                        fontWeight: '700',
                      }}
                    >
                      {p.quantity} {p.unit}
                    </Text>
                  </View>
                  <Text style={{ color: colors.textSubtle, fontSize: 9, marginTop: 2 }}>
                    Min: {p.minStock} | Max: {p.maxStock}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                  {canEdit && (
                    <TouchableOpacity
                      onPress={() => handleOpenEdit(p)}
                      style={[styles.actionIconBtn, { backgroundColor: colors.bgInput }]}
                    >
                      <FontAwesome6 name="pen-to-square" size={12} color={colors.brandAccent} />
                    </TouchableOpacity>
                  )}
                  {canEdit && (
                    <TouchableOpacity
                      onPress={() => handleDeleteProduct(p.id, p.name)}
                      style={[styles.actionIconBtn, { backgroundColor: colors.bgInput }]}
                    >
                      <FontAwesome6 name="trash-can" size={12} color={colors.statusDanger} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        /* Grid Cards Mode */
        <View style={styles.gridContainer}>
          {filteredProducts.map(p => {
            const cat = categories.find(c => c.id === p.categoryId);
            const isLow = p.quantity > 0 && p.quantity <= p.minStock;
            const isOut = p.quantity === 0;

            return (
              <View
                key={p.id}
                style={[styles.gridCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              >
                <Image source={{ uri: p.image }} style={styles.gridCardImg} />
                <View style={{ padding: 12, gap: 6 }}>
                  <Text style={[styles.gridSku, { color: colors.brandAccent }]}>{p.sku}</Text>
                  <Text style={[styles.gridName, { color: colors.textMain }]} numberOfLines={2}>{p.name}</Text>
                  <Text style={{ color: cat?.color || colors.textMuted, fontSize: 11, fontWeight: '600' }}>
                    {cat?.name}
                  </Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <View>
                      <Text style={{ color: colors.textSubtle, fontSize: 10 }}>PRICE</Text>
                      <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 14 }}>${p.sellingPrice.toFixed(2)}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: colors.textSubtle, fontSize: 10 }}>STOCK</Text>
                      <Text
                        style={{
                          fontWeight: '800',
                          fontSize: 14,
                          color: isOut ? colors.statusDanger : isLow ? colors.statusWarning : colors.statusSuccess,
                        }}
                      >
                        {p.quantity} {p.unit}
                      </Text>
                    </View>
                  </View>

                  {canEdit && (
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
                      <TouchableOpacity
                        onPress={() => handleOpenEdit(p)}
                        style={[styles.cardBtn, { flex: 1, backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
                      >
                        <Text style={{ color: colors.textMain, fontSize: 11, fontWeight: '600' }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteProduct(p.id, p.name)}
                        style={[styles.cardBtn, { backgroundColor: colors.statusDangerBg, borderColor: colors.statusDanger }]}
                      >
                        <FontAwesome6 name="trash-can" size={11} color={colors.statusDanger} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <Modal transparent animationType="fade" visible={isModalOpen}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>
                  {editingProduct.id ? 'Edit Product SKU' : 'New Product Specification'}
                </Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <FontAwesome6 name="xmark" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 460, padding: 16 }}>
                <View style={{ gap: 12 }}>
                  <View style={styles.formRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Product Name *</Text>
                      <TextInput
                        value={editingProduct.name}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, name: t })}
                        placeholder="e.g. Optical Sensor Assembly"
                        placeholderTextColor={colors.textSubtle}
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                    <View style={{ width: 140 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>SKU Code *</Text>
                      <TextInput
                        value={editingProduct.sku}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, sku: t })}
                        placeholder="e.g. SENS-001"
                        placeholderTextColor={colors.textSubtle}
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Category</Text>
                      <SelectPicker
                        value={editingProduct.categoryId || 'cat-1'}
                        onChange={(val) => setEditingProduct({ ...editingProduct, categoryId: val })}
                        options={categories.map(c => ({ label: c.name, value: c.id }))}
                        style={{ height: 36, width: '100%' }}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Warehouse & Bin</Text>
                      <TextInput
                        value={editingProduct.locationBin}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, locationBin: t })}
                        placeholder="e.g. A-12-04"
                        placeholderTextColor={colors.textSubtle}
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Cost Price ($)</Text>
                      <TextInput
                        value={String(editingProduct.costPrice || '')}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, costPrice: parseFloat(t) || 0 })}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={colors.textSubtle}
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Selling Price ($)</Text>
                      <TextInput
                        value={String(editingProduct.sellingPrice || '')}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, sellingPrice: parseFloat(t) || 0 })}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={colors.textSubtle}
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                    <View style={{ width: 90 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Unit</Text>
                      <TextInput
                        value={editingProduct.unit}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, unit: t })}
                        placeholder="pcs"
                        placeholderTextColor={colors.textSubtle}
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                  </View>

                  <View style={styles.formRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Initial / Current Quantity</Text>
                      <TextInput
                        value={String(editingProduct.quantity || 0)}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, quantity: parseInt(t, 10) || 0 })}
                        keyboardType="numeric"
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Min Stock Alert</Text>
                      <TextInput
                        value={String(editingProduct.minStock || 10)}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, minStock: parseInt(t, 10) || 0 })}
                        keyboardType="numeric"
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Max Stock</Text>
                      <TextInput
                        value={String(editingProduct.maxStock || 500)}
                        onChangeText={(t) => setEditingProduct({ ...editingProduct, maxStock: parseInt(t, 10) || 0 })}
                        keyboardType="numeric"
                        style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Image URL</Text>
                    <TextInput
                      value={editingProduct.image}
                      onChangeText={(t) => setEditingProduct({ ...editingProduct, image: t })}
                      placeholder="https://..."
                      placeholderTextColor={colors.textSubtle}
                      style={[styles.input, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>

                  <View>
                    <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Description</Text>
                    <TextInput
                      value={editingProduct.description}
                      onChangeText={(t) => setEditingProduct({ ...editingProduct, description: t })}
                      placeholder="Technical specs, supplier notes, handling details..."
                      multiline
                      numberOfLines={3}
                      placeholderTextColor={colors.textSubtle}
                      style={[styles.input, { height: 60, backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textMain }]}
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  onPress={() => setIsModalOpen(false)}
                  style={[styles.modalBtnSec, { borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.textMain, fontWeight: '600', fontSize: 12 }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveProduct}
                  style={[styles.modalBtnPrim, { backgroundColor: colors.brandPrimary }]}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Save SKU</Text>
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
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  controlLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  controlRight: {
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
    minWidth: 220,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    height: '100%',
  },
  selectWrap: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  selectWrapModal: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  tableThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#1e293b',
  },
  pName: {
    fontSize: 13,
    fontWeight: '600',
  },
  pSku: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  catBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridCard: {
    flex: 1,
    minWidth: 240,
    maxWidth: 320,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridCardImg: {
    width: '100%',
    height: 140,
    backgroundColor: '#1e293b',
  },
  gridSku: {
    fontSize: 11,
    fontWeight: '700',
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    minHeight: 34,
  },
  cardBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: 620,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
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
    padding: 14,
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
