import { useEffect, useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../../utils/api';

const RAM_OPTIONS  = [4, 8, 16, 32, 64];
const OS_OPTIONS   = ['Windows', 'macOS', 'Linux', 'Chrome OS'];
const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'price:asc',       label: 'Price: Low → High' },
  { value: 'price:desc',      label: 'Price: High → Low' },
  { value: 'name:asc',        label: 'Name A–Z' },
  { value: 'ram:desc',        label: 'Most RAM' },
];

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-surface-200 last:border-0 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-sm font-semibold text-surface-800">{title}</span>
        <ChevronDown
          size={15}
          className={`text-surface-200 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onReset, totalResults }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.get('/products/brands').then(({ data }) => setBrands(data.brands)).catch(() => {});
  }, []);

  const sortValue = filters.sort && filters.order
    ? `${filters.sort}:${filters.order}`
    : 'created_at:desc';

  function handleSort(val) {
    const [sort, order] = val.split(':');
    onChange({ sort, order });
  }

  const activeCount = [
    filters.brand, filters.minPrice, filters.maxPrice,
    filters.minRam, filters.storageType, filters.os,
  ].filter(Boolean).length;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-brand-500" />
          <span className="font-display font-bold text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="badge bg-brand-500 text-white">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-brand-500 hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
      <p className="text-xs text-surface-200 mb-2">{totalResults} laptops found</p>

      {/* Sort */}
      <Section title="Sort By">
        <select
          value={sortValue}
          onChange={(e) => handleSort(e.target.value)}
          className="input text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Section>

      {/* Price Range */}
      <Section title="Price Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value || undefined })}
            className="input text-sm !px-3"
          />
          <span className="text-surface-200 shrink-0">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value || undefined })}
            className="input text-sm !px-3"
          />
        </div>
      </Section>

      {/* Brand */}
      <Section title="Brand">
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === b}
                onChange={() => onChange({ brand: filters.brand === b ? undefined : b })}
                className="accent-brand-500"
              />
              <span className="text-sm group-hover:text-brand-500 transition-colors">{b}</span>
            </label>
          ))}
          {filters.brand && (
            <button
              onClick={() => onChange({ brand: undefined })}
              className="text-xs text-brand-500 hover:underline mt-1"
            >
              Clear brand
            </button>
          )}
        </div>
      </Section>

      {/* RAM */}
      <Section title="Minimum RAM">
        <div className="flex flex-wrap gap-2">
          {RAM_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => onChange({ minRam: filters.minRam === r ? undefined : r })}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filters.minRam === r
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white border-surface-200 hover:border-brand-500 hover:text-brand-500'
              }`}
            >
              {r}GB+
            </button>
          ))}
        </div>
      </Section>

      {/* Storage Type */}
      <Section title="Storage Type">
        <div className="flex flex-wrap gap-2">
          {['SSD', 'HDD', 'eMMC'].map((t) => (
            <button
              key={t}
              onClick={() => onChange({ storageType: filters.storageType === t ? undefined : t })}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filters.storageType === t
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white border-surface-200 hover:border-brand-500 hover:text-brand-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      {/* OS */}
      <Section title="Operating System">
        <div className="space-y-2">
          {OS_OPTIONS.map((os) => (
            <label key={os} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="os"
                checked={filters.os === os}
                onChange={() => onChange({ os: filters.os === os ? undefined : os })}
                className="accent-brand-500"
              />
              <span className="text-sm group-hover:text-brand-500 transition-colors">{os}</span>
            </label>
          ))}
          {filters.os && (
            <button
              onClick={() => onChange({ os: undefined })}
              className="text-xs text-brand-500 hover:underline mt-1"
            >
              Clear OS
            </button>
          )}
        </div>
      </Section>
    </aside>
  );
}
