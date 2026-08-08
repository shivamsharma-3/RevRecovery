'use client';

import React from 'react';
import { Modal } from './Modal';
import { AuthForm } from './AuthForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in to RevRecover AI"
      description="Sign in or create an account to access your practice dashboard."
      size="sm"
    >
      <AuthForm />
    </Modal>
  );
}
