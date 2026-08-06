import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { ApiService } from '../../services/api';
import { Product, Category } from '../../types';

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await ApiService.getProducts();
    const c = await ApiService.getCategories();
    setProducts(p);
    setCategories(c);
  };

  const handleDelete = async (id: string, name: string) => {
    await ApiService.deleteProduct(id);
    loadData();
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <View style={styles.container}>
      {/* Search & Category Filter */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search product name, SKU..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.catChips}>
        <TouchableOpacity
          style={[styles.chip, selectedCat === 'all' && styles.chipActive]}
          onPress={() => setSelectedCat('all')}
        >
          <Text style={styles.chipText}>All</Text>
        </TouchableOpacity>
        {categories.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.chip, selectedCat === c.id && styles.chipActive]}
            onPress={() => setSelectedCat(c.id)}
          >
            <Text style={styles.chipText}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const cat = categories.find(c => c.id === item.categoryId);
          const isLow = item.quantity <= item.minStock && item.quantity > 0;
          const isOut = item.quantity === 0;

          return (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryBadge}>{cat?.name || 'Category'}</Text>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.sku}>SKU: {item.sku} | Bin: {item.locationBin || 'N/A'}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.sellingPrice.toFixed(2)}</Text>
                  <Text style={[styles.stock, isOut ? styles.outText : isLow ? styles.lowText : styles.inText]}>
                    {isOut ? 'Out of Stock' : `${item.quantity} ${item.unit}`}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.name)}>
                <Text style={{ color: '#ef4444', fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  searchInput: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 12, borderRadius: 10, marginBottom: 12, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  catChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipActive: { backgroundColor: '#6366f1' },
  chipText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  card: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 12, backgroundColor: '#0f172a' },
  categoryBadge: { color: '#818cf8', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  title: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },
  sku: { color: '#94a3b8', fontSize: 12, marginVertical: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { color: '#06b6d4', fontSize: 16, fontWeight: '700' },
  stock: { fontSize: 13, fontWeight: '600' },
  inText: { color: '#10b981' },
  lowText: { color: '#f59e0b' },
  outText: { color: '#ef4444' },
  deleteBtn: { padding: 8, marginLeft: 8 }
});
