import { useState } from 'react';
import { Cpu, MemoryStick, HardDrive, Star, MessageCircle } from 'lucide-react';
import ContactProductModal from './ContactProductModal';

export default function ProductCard({ product }) {
  const [contactOpen, setContactOpen] = useState(false);
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  return (
    <div className="card group flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      {/* Image */}
      <div className="relative h-48 bg-surface-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-200 text-4xl font-display font-bold">
            {product.brand.charAt(0)}
          </div>
        )}
        {discount && (
          <span className="absolute top-2.5 left-2.5 badge bg-red-500 text-white font-semibold">
            -{discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-2.5 right-2.5 badge bg-yellow-400 text-yellow-900">
            <Star size={10} className="mr-0.5 inline" fill="currentColor" /> Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="font-display font-bold text-sm leading-snug line-clamp-2">{product.name}</h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-1.5 flex-1">
          {product.processor && (
            <div className="bg-surface-50 rounded-lg p-2 text-center">
              <Cpu size={13} className="mx-auto mb-1 text-brand-500" />
              <p className="text-xs text-surface-200 leading-tight line-clamp-2">{product.processor.replace('Intel Core ', '').replace('AMD Ryzen ', 'R').split(' ').slice(0,2).join(' ')}</p>
            </div>
          )}
          {product.ram && (
            <div className="bg-surface-50 rounded-lg p-2 text-center">
              <MemoryStick size={13} className="mx-auto mb-1 text-brand-500" />
              <p className="text-xs font-semibold">{product.ram}GB</p>
              <p className="text-xs text-surface-200">RAM</p>
            </div>
          )}
          {product.storage && (
            <div className="bg-surface-50 rounded-lg p-2 text-center">
              <HardDrive size={13} className="mx-auto mb-1 text-brand-500" />
              <p className="text-xs font-semibold">{product.storage >= 1000 ? `${product.storage/1000}TB` : `${product.storage}GB`}</p>
              <p className="text-xs text-surface-200">{product.storage_type}</p>
            </div>
          )}
        </div>

        {product.display && (
          <p className="text-xs text-surface-200 line-clamp-1">{product.display}</p>
        )}

        {/* Price & Stock */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-surface-200">
          <div>
            <p className="font-display font-bold text-lg text-surface-800">
              ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            {product.original_price && (
              <p className="text-xs text-surface-200 line-through">
                ${parseFloat(product.original_price).toLocaleString()}
              </p>
            )}
          </div>
          <span className={`badge ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="btn-secondary w-full justify-center text-sm py-2"
        >
          <MessageCircle size={16} aria-hidden />
          Contact us
        </button>
      </div>

      <ContactProductModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        product={product}
      />
    </div>
  );
}
