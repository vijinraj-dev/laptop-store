import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Monitor, Search, ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            {/* <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center"> */}
                <img src="./dist/assets/lap.jpeg" alt="Logo" className="w-8 h-8" />
              {/* <Monitor size={16} className="text-white" /> */}
            {/* </div> */}
            <span className="font-display font-bold text-lg tracking-tight">LaptopStore</span>
          </Link>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search laptops, brands…"
                className="input !pl-9 !py-2 text-sm"
              />
            </div>
          </form>

          <div className="flex-1" />

          {/* Admin link */}
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-surface-800 hover:text-brand-500 transition-colors"
          >
            <ShieldCheck size={16} />
            Admin
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-surface-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden pb-4 space-y-3 animate-slide-down">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search laptops…"
                  className="input !pl-9 !py-2 text-sm"
                />
              </div>
            </form>
            <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-surface-800 hover:text-brand-500">
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
