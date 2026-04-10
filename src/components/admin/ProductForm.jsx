import { useState } from 'react';
import { Spinner, Alert } from '../ui';
import api from '../../utils/api';

const FIELDS = [
  { name: 'name',          label: 'Product Name',    type: 'text',     required: true,  col: 2 },
  { name: 'brand',         label: 'Brand',           type: 'text',     required: true },
  { name: 'model',         label: 'Model',           type: 'text',     required: true },
  { name: 'price',         label: 'Price ($)',       type: 'number',   required: true },
  { name: 'original_price',label: 'Original Price',  type: 'number' },
  { name: 'stock',         label: 'Stock',           type: 'number',   required: true },
  { name: 'image_url',     label: 'Image URL',       type: 'text',     col: 2 },
  { name: 'processor',     label: 'Processor',       type: 'text',     col: 2 },
  { name: 'ram',           label: 'RAM (GB)',        type: 'number' },
  { name: 'storage',       label: 'Storage (GB)',    type: 'number' },
  { name: 'storage_type',  label: 'Storage Type',    type: 'select',   options: ['SSD','HDD','eMMC'] },
  { name: 'display',       label: 'Display',         type: 'text' },
  { name: 'gpu',           label: 'GPU',             type: 'text',     col: 2 },
  { name: 'battery',       label: 'Battery',         type: 'text' },
  { name: 'weight',        label: 'Weight (kg)',     type: 'number' },
  { name: 'os',            label: 'Operating System',type: 'text',     col: 2 },
];

function emptyForm() {
  return {
    name: '', brand: '', model: '', price: '', original_price: '', stock: 0,
    image_url: '', processor: '', ram: '', storage: '', storage_type: 'SSD',
    display: '', gpu: '', battery: '', weight: '', os: '',
    is_featured: false, is_active: true,
  };
}

function toForm(p) {
  return {
    ...emptyForm(),
    ...p,
    price:          p.price ?? '',
    original_price: p.original_price ?? '',
    ram:            p.ram ?? '',
    storage:        p.storage ?? '',
    weight:         p.weight ?? '',
  };
}

export default function ProductForm({ product, onSuccess, onCancel }) {
  const [form, setForm]   = useState(product ? toForm(product) : emptyForm());
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price:          parseFloat(form.price)          || 0,
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock:          parseInt(form.stock)            || 0,
        ram:            form.ram     ? parseInt(form.ram)       : null,
        storage:        form.storage ? parseInt(form.storage)   : null,
        weight:         form.weight  ? parseFloat(form.weight)  : null,
      };

      if (product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert message={error} />}

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ name, label, type, required, col, options }) => (
          <div key={name} className={col === 2 ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-surface-800 mb-1.5">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'select' ? (
              <select
                value={form[name]}
                onChange={(e) => set(name, e.target.value)}
                className="input"
              >
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type={type}
                value={form[name]}
                onChange={(e) => set(name, e.target.value)}
                required={required}
                step={type === 'number' ? 'any' : undefined}
                className="input"
              />
            )}
          </div>
        ))}

        <div className="col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="w-4 h-4 accent-brand-500"
            />
            <span className="text-sm font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set('is_active', e.target.checked)}
              className="w-4 h-4 accent-brand-500"
            />
            <span className="text-sm font-medium">Active (visible in store)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Spinner className="w-4 h-4" />}
          {product ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
