'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useScrollLock } from '@/hooks/use-scroll-lock';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Accessible name. Rendered visually unless `hideTitle`. */
  title?: string;
  description?: string;
  hideTitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Set false for destructive confirmations where a stray click shouldn't dismiss. */
  dismissOnBackdrop?: boolean;
};

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  hideTitle,
  size = 'sm',
  dismissOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    // Focus the first real control so keyboard users land inside the dialog.
    const timer = setTimeout(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ??
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      // Keep Tab inside the dialog.
      if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null
        );
        if (items.length === 0) return;

        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={dismissOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel wrapper — min-h-full + py centres short dialogs and lets tall ones scroll */}
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          className={`relative w-full ${SIZES[size]} animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200`}
        >
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute -top-3 -right-1 sm:-top-4 sm:-right-4 z-10 p-2 rounded-full bg-white text-slate-400 hover:text-slate-900 shadow-lg border border-slate-200/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {title && !hideTitle && (
            <h2 className="sr-only">{title}</h2>
          )}
          {description && (
            <p id="modal-description" className="sr-only">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
