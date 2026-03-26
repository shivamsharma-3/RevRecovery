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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <AuthForm />
      </div>
    </div>
  );
}
