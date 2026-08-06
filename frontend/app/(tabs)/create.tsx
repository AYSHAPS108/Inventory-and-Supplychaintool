import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ApiService } from '../../services/api';
import { Category } from '../../types';

export default function CreateProductScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [supplier, setSupplier] = useState('');
  const [locationBin, setLocationBin] = useState('');

  useEffect(() => {
    ApiService.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    });
  }, []);

  const handleAutoSku = () => {
    const cat = categories.find(c => c.id === categoryId);
    const prefix = cat ? cat.code.toUpperCase() : 'PROD';
    const rand = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}-ITEM-${rand}`);
  };

  const handleSubmit = async () => {
    if (!name || !sku || !costPrice || !sellingPrice) {
      alert('Please fill in all required fields (Name, SKU, Cost Price, Selling Price)');
      return;
    }

    await ApiService.saveProduct({
      name,
      sku,
      categoryId,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      quantity: parseInt(quantity || '0', 10),
      minStock: parseInt(minStock || '10', 10),
      supplier,
      locationBin
    });

    alert(`Product "${name}" created successfully!`);
    setName('');
    setSku('');
    setCostPrice('');
    setSellingPrice('');
    setQuantity('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Product Specification</Text>

      <Text style={styles.label}>Product Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Precision Rotary Valve" placeholderTextColor="#64748b" />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>SKU Code *</Text>
          <TextInput style={styles.input} value={sku} onChangeText={setSku} placeholder="e.g. MACH-VALVE-01" placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.autoBtn} onPress={handleAutoSku}>
          <Text style={styles.autoBtnText}>✨ Auto</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerRow}>
        {categories.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.catOption, categoryId === c.id && styles.catOptionActive]}
            onPress={() => setCategoryId(c.id)}
          >
            <Text style={styles.catOptionText}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Cost Price ($) *</Text>
          <TextInput style={styles.input} value={costPrice} onChangeText={setCostPrice} keyboardType="numeric" placeholder="45.00" placeholderTextColor="#64748b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Selling Price ($) *</Text>
          <TextInput style={styles.input} value={sellingPrice} onChangeText={setSellingPrice} keyboardType="numeric" placeholder="89.00" placeholderTextColor="#64748b" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Initial Stock</Text>
          <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="100" placeholderTextColor="#64748b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Min Alert Threshold</Text>
          <TextInput style={styles.input} value={minStock} onChangeText={setMinStock} keyboardType="numeric" placeholder="10" placeholderTextColor="#64748b" />
        </View>
      </View>

      <Text style={styles.label}>Primary Supplier</Text>
      <TextInput style={styles.input} value={supplier} onChangeText={setSupplier} placeholder="Supplier Name" placeholderTextColor="#64748b" />

      <Text style={styles.label}>Warehouse Bin Location</Text>
      <TextInput style={styles.input} value={locationBin} onChangeText={setLocationBin} placeholder="e.g. A-14-02" placeholderTextColor="#64748b" />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Save Product Master</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { color: '#f8fafc', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 12, borderRadius: 8, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  autoBtn: { backgroundColor: '#334155', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, marginTop: 24 },
  autoBtnText: { color: '#6366f1', fontWeight: '700' },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 6 },
  catOption: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderHeight: 1 },
  catOptionActive: { backgroundColor: '#6366f1' },
  catOptionText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  submitBtn: { backgroundColor: '#6366f1', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 28, marginBottom: 40 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});
