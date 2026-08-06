import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ApiService } from '../../services/api';
import { Category, Product } from '../../types';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const c = await ApiService.getCategories();
    const p = await ApiService.getProducts();
    setCategories(c);
    setProducts(p);
  };

  const handleCreateCategory = async () => {
    if (!name || !code) {
      alert('Category name and code are required!');
      return;
    }

    await ApiService.saveCategory({
      name,
      code: code.toUpperCase(),
      description,
      color: '#6366f1'
    });

    alert(`Category "${name}" created!`);
    setName('');
    setCode('');
    setDescription('');
    setShowAdd(false);
    loadData();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.heading}>Category Management</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
          <Text style={styles.addBtnText}>{showAdd ? 'Cancel' : '+ Add Category'}</Text>
        </TouchableOpacity>
      </View>

      {/* New Category Form */}
      {showAdd && (
        <View style={styles.addCard}>
          <Text style={{ color: '#f8fafc', fontWeight: '700', marginBottom: 8 }}>New Category Details</Text>
          <TextInput style={styles.input} placeholder="Category Name (e.g. Tools)" placeholderTextColor="#64748b" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Code Prefix (e.g. TOOL)" placeholderTextColor="#64748b" value={code} onChangeText={setCode} />
          <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#64748b" value={description} onChangeText={setDescription} />
          <TouchableOpacity style={styles.saveCatBtn} onPress={handleCreateCategory}>
            <Text style={{ color: '#ffffff', fontWeight: '700' }}>Save Category</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Cards */}
      {categories.map(cat => {
        const catProds = products.filter(p => p.categoryId === cat.id);
        const totalVal = catProds.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);

        return (
          <View key={cat.id} style={[styles.card, { borderLeftColor: cat.color || '#6366f1' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catCode}>CODE: {cat.code}</Text>
            </View>
            <Text style={styles.catDesc}>{cat.description || 'No description.'}</Text>

            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>ASSIGNED PRODUCTS</Text>
                <Text style={styles.statValue}>{catProds.length} SKUs</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>CATEGORY VALUATION</Text>
                <Text style={[styles.statValue, { color: '#06b6d4' }]}>
                  ${totalVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  heading: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  addCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 20 },
  input: { backgroundColor: '#0f172a', color: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 10 },
  saveCatBtn: { backgroundColor: '#10b981', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4 },
  catName: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  catCode: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  catDesc: { color: '#64748b', fontSize: 13, marginVertical: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  statValue: { color: '#f8fafc', fontSize: 14, fontWeight: '700', marginTop: 2 }
});
