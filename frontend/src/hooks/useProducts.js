import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 9 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/products', { params });
      setProducts(data.data ?? []);
      setPagination(data.pagination ?? { total: 0, page: 1, pages: 1, limit: 9 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      const { data } = await api.post('/products', productData);
      return { success: true, data: data.data };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors ? errors[0].msg : err.response?.data?.message || 'Failed to create';
      return { success: false, message };
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return { success: true, data: data.data };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors ? errors[0].msg : err.response?.data?.message || 'Failed to update';
      return { success: false, message };
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
