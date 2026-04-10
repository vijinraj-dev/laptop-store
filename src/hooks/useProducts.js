import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [filters, setFilters]   = useState(initialFilters);

  const limit = 12;
  const abortRef = useRef(null);

  const fetch = useCallback(async (f = filters, p = page) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const params = { ...f, page: p, limit };
      // Remove undefined/empty
      Object.keys(params).forEach((k) => {
        if (params[k] === '' || params[k] == null) delete params[k];
      });
      const { data } = await api.get('/products', {
        params,
        signal: abortRef.current.signal,
      });
      setProducts(data.products);
      setTotal(data.total);
    } catch (e) {
      if (e.name !== 'CanceledError') setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetch(filters, page); }, [filters, page]);

  const updateFilters = useCallback((next) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return { products, total, page, setPage, limit, loading, error, filters, updateFilters, resetFilters, refetch: fetch };
}
