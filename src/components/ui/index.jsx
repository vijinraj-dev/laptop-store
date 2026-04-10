import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ className = '' }) {
  return <Loader2 className={`animate-spin text-brand-500 ${className}`} />;
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ message, type = 'error' }) {
  const colors = {
    error:   'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm ${colors[type]}`}>
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, total, limit, onPage }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;

  const range = Array.from({ length: pages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 2);

  const items = [];
  let prev = null;
  for (const p of range) {
    if (prev && p - prev > 1) items.push('…');
    items.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center gap-1.5 justify-center">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="btn-secondary !px-3 !py-2 disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>
      {items.map((item, i) =>
        item === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-surface-200">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPage(item)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              item === page
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-surface-200 text-surface-800 hover:bg-surface-100'
            }`}
          >
            {item}
          </button>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className="btn-secondary !px-3 !py-2 disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <h2 className="text-xl font-display font-bold mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-100 text-blue-700',
    green:  'bg-green-100 text-green-700',
    red:    'bg-red-100 text-red-700',
    gray:   'bg-surface-100 text-surface-800',
    yellow: 'bg-yellow-100 text-yellow-700',
  };
  return <span className={`badge ${colors[color]}`}>{children}</span>;
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
          <Icon size={28} className="text-surface-200" />
        </div>
      )}
      <h3 className="font-display font-bold text-lg text-surface-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-200 max-w-xs">{description}</p>}
    </div>
  );
}
