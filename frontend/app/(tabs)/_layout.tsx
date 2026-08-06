import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        tabBarStyle: { backgroundColor: '#1e293b', borderTopColor: 'rgba(255,255,255,0.1)', height: 60 },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Product Master',
          headerTitle: 'Supply Chain - Product Master',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Product List',
          headerTitle: 'Product Inventory List',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📦</Text>,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create Product',
          headerTitle: 'New Product Specification',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>➕</Text>,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerTitle: 'Category Management',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📁</Text>,
        }}
      />
    </Tabs>
  );
}
