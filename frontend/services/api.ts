import { Product, Category, Metrics } from '../types';
import { store } from './store';

export const ApiService = {
  getCategories: async (): Promise<Category[]> => store.getCategories(),
  
  saveCategory: async (category: Partial<Category>): Promise<Category> => {
    return store.saveCategory(category);
  },

  deleteCategory: async (id: string): Promise<void> => {
    store.deleteCategory(id);
  },

  getProducts: async (): Promise<Product[]> => store.getProducts(),

  saveProduct: async (product: Partial<Product>): Promise<Product> => {
    return store.saveProduct(product);
  },

  deleteProduct: async (id: string): Promise<void> => {
    store.deleteProduct(id);
  },

  getMetrics: async (): Promise<Metrics> => {
    return store.getMetrics();
  }
};
