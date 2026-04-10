import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Laptop } from 'lucide-react';
import Navbar from '../components/shop/Navbar';
import FilterSidebar from '../components/shop/FilterSidebar';
import ProductCard from '../components/shop/ProductCard';
import { Spinner, Pagination, EmptyState } from '../components/ui';
import { useProducts } from '../hooks/useProducts';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);

  const { products, total, page, setPage, limit, loading, filters, updateFilters, resetFilters } =
    useProducts({ search: searchParams.get('search') || undefined });

  // Sync URL search param → filter
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) updateFilters({ search: q });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-100 text-sm font-medium mb-2 uppercase tracking-widest">Premium Selection</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-3">Find Your<br />Perfect Laptop</h1>
          <p className="text-brand-100 text-sm max-w-md">
            Browse {total} laptops from the world's top brands — filtered to match exactly what you need.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Active filters pills */}
        {(filters.brand || filters.minPrice || filters.maxPrice || filters.minRam || filters.storageType || filters.os || filters.search) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.search && (
              <Pill label={`Search: "${filters.search}"`} onRemove={() => updateFilters({ search: undefined })} />
            )}
            {filters.brand && (
              <Pill label={`Brand: ${filters.brand}`} onRemove={() => updateFilters({ brand: undefined })} />
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Pill
                label={`Price: $${filters.minPrice || 0} – $${filters.maxPrice || '∞'}`}
                onRemove={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
              />
            )}
            {filters.minRam && (
              <Pill label={`RAM: ${filters.minRam}GB+`} onRemove={() => updateFilters({ minRam: undefined })} />
            )}
            {filters.storageType && (
              <Pill label={`Storage: ${filters.storageType}`} onRemove={() => updateFilters({ storageType: undefined })} />
            )}
            {filters.os && (
              <Pill label={`OS: ${filters.os}`} onRemove={() => updateFilters({ os: undefined })} />
            )}
            <button onClick={resetFilters} className="text-xs text-red-500 hover:underline px-1">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-60 shrink-0 card p-4 self-start sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              totalResults={total}
            />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="flex items-center justify-between mb-5 lg:hidden">
              <p className="text-sm text-surface-200">{total} laptops</p>
              <button
                onClick={() => setMobileFilters(true)}
                className="btn-secondary !py-2 !px-3 text-sm"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner className="w-8 h-8" />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={Laptop}
                title="No laptops found"
                description="Try adjusting your filters or search terms to find what you're looking for."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                <div className="mt-8">
                  <Pagination page={page} total={total} limit={limit} onPage={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white overflow-y-auto p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Filters</h2>
              <button onClick={() => setMobileFilters(false)} className="p-2 hover:bg-surface-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={(f) => { updateFilters(f); }}
              onReset={resetFilters}
              totalResults={total}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-600 border border-brand-100 rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-brand-800 ml-0.5">
        <X size={11} />
      </button>
    </span>
  );
}
