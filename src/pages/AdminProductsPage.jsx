import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import ProductForm from '../components/admin/ProductForm';
import { Modal, Spinner, Alert, Badge, EmptyState, Pagination } from '../components/ui';
import api from '../utils/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [showForm, setShowForm]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]           = useState(null);

  const limit = 15;

  const load = useCallback(async (p = page, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit, ...(q ? { search: q } : {}), sort: 'created_at', order: 'desc' };
      // Admin sees all (active + inactive) — we query without is_active filter
      // Backend returns active=TRUE by default; for admin we pass all=true
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(page, search); }, [page, search]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setEditProduct(null);
    setShowForm(true);
  }

  function openEdit(product) {
    setEditProduct(product);
    setShowForm(true);
  }

  async function handleFormSuccess() {
    setShowForm(false);
    showToast(editProduct ? 'Product updated!' : 'Product added!');
    load(page, search);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      setDeleteTarget(null);
      showToast('Product deleted');
      load(1, search);
      setPage(1);
    } catch (e) {
      showToast(e.response?.data?.error || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl">Products</h1>
            <p className="text-surface-200 text-sm mt-0.5">{total} total products</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="card p-4">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products…"
              className="input !pl-9 text-sm"
            />
          </div>
        </div>

        {/* Error */}
        {error && <Alert message={error} />}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  {['Product', 'Brand', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-200 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {loading ? (
                  <tr><td colSpan={6} className="py-16 text-center"><Spinner className="w-6 h-6 mx-auto" /></td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={6}><EmptyState icon={Package} title="No products found" description="Add your first product to get started" /></td></tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-surface-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-brand-500 font-bold text-sm shrink-0">
                            {p.brand.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-surface-200 truncate max-w-[180px]">{p.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-200">{p.brand}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">${parseFloat(p.price).toLocaleString()}</span>
                      {p.original_price && (
                        <span className="text-xs text-surface-200 line-through ml-1">
                          ${parseFloat(p.original_price).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.stock === 0 ? (
                        <Badge color="red"><AlertTriangle size={11} className="mr-1 inline" />Out</Badge>
                      ) : p.stock < 5 ? (
                        <Badge color="yellow">{p.stock} left</Badge>
                      ) : (
                        <Badge color="green">{p.stock}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.is_active   ? <Badge color="green">Active</Badge>   : <Badge color="gray">Inactive</Badge>}
                        {p.is_featured && <Badge color="yellow">Featured</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-surface-100 text-surface-200 hover:text-brand-500 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg hover:bg-red-50 text-surface-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="px-4 py-4 border-t border-surface-200">
              <Pagination page={page} total={total} limit={limit} onPage={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={editProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product">
        <p className="text-sm text-surface-200 mb-5">
          Are you sure you want to delete <strong className="text-surface-800">{deleteTarget?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
          <button onClick={confirmDelete} disabled={deleteLoading} className="btn-danger">
            {deleteLoading && <Spinner className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-surface-900 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}
