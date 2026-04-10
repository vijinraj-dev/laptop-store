import { useEffect, useState } from 'react';
import { Package, TrendingUp, Archive, Star } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { Spinner } from '../components/ui';
import api from '../utils/api';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-surface-200">{label}</p>
        <p className="font-display font-bold text-2xl">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1000'),
    ]).then(([products]) => {
      const all = products.data.products;
      setStats({
        total:    products.data.total,
        active:   all.filter((p) => p.is_active).length,
        featured: all.filter((p) => p.is_featured).length,
        outOfStock: all.filter((p) => p.stock === 0).length,
        totalValue: all.reduce((s, p) => s + parseFloat(p.price) * p.stock, 0),
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner className="w-8 h-8" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-2xl">Dashboard</h1>
          <p className="text-surface-200 text-sm mt-1">Overview of your laptop store</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package}    label="Total Products"   value={stats?.total ?? 0}       color="bg-brand-500" />
          <StatCard icon={TrendingUp} label="Active Products"  value={stats?.active ?? 0}      color="bg-green-500" />
          <StatCard icon={Star}       label="Featured"         value={stats?.featured ?? 0}    color="bg-yellow-500" />
          <StatCard icon={Archive}    label="Out of Stock"     value={stats?.outOfStock ?? 0}  color="bg-red-500" />
        </div>

        {/* Inventory value */}
        <div className="card p-6">
          <h2 className="font-display font-bold text-lg mb-1">Inventory Value</h2>
          <p className="text-surface-200 text-sm mb-4">Total value of current stock</p>
          <p className="font-display font-bold text-4xl text-brand-500">
            ${(stats?.totalValue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="font-display font-bold text-lg mb-4">Quick Actions</h2>
          <div className="flex gap-3 flex-wrap">
            <a href="/admin/products" className="btn-primary">
              <Package size={16} /> Manage Products
            </a>
            <a href="/" target="_blank" className="btn-secondary">
              View Store →
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
