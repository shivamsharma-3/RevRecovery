'use client';

import React from 'react';
import { X } from 'lucide-react';
import { AuthForm } from './AuthForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-4 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <AuthForm />
      </div>
    </div>
  );
}
