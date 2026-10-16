"use client";

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmWord?: string; // If provided, user must type this exact word to confirm
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmWord,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const [typedInput, setTypedInput] = useState('');

  if (!isOpen) return null;

  const isConfirmDisabled = confirmWord ? typedInput.trim().toUpperCase() !== confirmWord.toUpperCase() : false;

  const handleConfirm = () => {
    onConfirm();
    setTypedInput('');
  };

  const handleClose = () => {
    setTypedInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-xl bg-[#FFFFFF] dark:bg-[#161815] border border-[#E7E5DF] dark:border-[#2A2C27] shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#8C8B83] hover:text-[#161714] dark:hover:text-[#F2F1EC] p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              variant === 'danger'
                ? 'bg-[#C0392B]/10 text-[#C0392B]'
                : 'bg-[#B87A22]/10 text-[#B87A22]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-[16px] font-bold text-[#161714] dark:text-[#F2F1EC] leading-snug">
              {title}
            </h3>
            <p className="text-[13px] text-[#6B6A63] dark:text-[#9A9A92] mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {confirmWord && (
          <div className="mt-4 pt-4 border-t border-[#E7E5DF] dark:border-[#2A2C27]">
            <label className="block text-[12px] font-medium text-[#161714] dark:text-[#F2F1EC] mb-1.5">
              Type <span className="font-mono font-bold text-[#C0392B] bg-[#C0392B]/10 px-1.5 py-0.5 rounded">{confirmWord}</span> to verify:
            </label>
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={`Type "${confirmWord}"`}
              className="w-full px-3 py-2 rounded-lg border border-[#DCDAD2] dark:border-[#30332C] bg-[#FAFAF7] dark:bg-[#0E0F0D] text-[#161714] dark:text-[#F2F1EC] text-[13px] focus:outline-none focus:ring-1.5 focus:ring-[#B87A22]"
              autoFocus
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button variant="outline" size="md" onClick={handleClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isLoading}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
