import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      { message: 'Enter a valid phone number (10–15 digits)' }
    ),
  email: z
    .string()
    .trim()
    .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: 'Invalid email address',
    }),
});

export default function ContactProductModal({ open, onClose, product }) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '' },
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      reset();
      setSubmitState({ status: 'idle', message: '' });
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      const el = panelRef.current?.querySelector('input:not([type="hidden"])');
      el?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  if (!open || !product) return null;

  const onSubmit = async (data) => {
    setSubmitState({ status: 'idle', message: '' });
    try {
      await api.post('/contact', {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || undefined,
        productName: product.name,
      });
      setSubmitState({
        status: 'success',
        message: 'Thanks — we received your message and will get back to you soon.',
      });
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please try again.';
      setSubmitState({ status: 'error', message: msg });
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-[2px] transition-opacity animate-fade-in"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-lg max-h-[min(90vh,640px)] overflow-y-auto rounded-2xl border border-surface-200 bg-white shadow-xl animate-slide-up"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-surface-200 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <div>
            <h2 id={titleId} className="font-display text-lg font-bold text-surface-800">
              Contact us
            </h2>
            <p id={descId} className="mt-1 text-sm text-surface-200">
              About: <span className="font-medium text-surface-800">{product.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-surface-200 hover:bg-surface-100 hover:text-surface-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {submitState.status === 'success' ? (
            <div
              className="flex flex-col items-center gap-4 py-6 text-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="text-green-600" size={44} strokeWidth={1.75} />
              <p className="text-surface-800 max-w-sm">{submitState.message}</p>
              <button type="button" className="btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
              aria-busy={isSubmitting}
            >
              {submitState.status === 'error' && (
                <div
                  className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <span>{submitState.message}</span>
                </div>
              )}

              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-surface-800">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  className="input"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  {...register('name')}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 text-xs text-red-600" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-surface-800">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="e.g. +1 555 123 4567"
                  className="input"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p id="contact-phone-error" className="mt-1.5 text-xs text-red-600" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-surface-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} className="text-surface-200" />
                    Email <span className="font-normal text-surface-200">(optional)</span>
                  </span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 text-xs text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn-secondary w-full sm:w-auto justify-center"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto justify-center min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} aria-hidden />
                      Sending…
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}


