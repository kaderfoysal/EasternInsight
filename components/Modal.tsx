"use client";

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: any;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ background: '#161B22', border: '1px solid #30363D' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #21262D' }}
        >
          <h3 className="text-base font-semibold text-gray-100">{title}</h3>
          <button
            type="button"
            className="p-1 rounded-md transition-colors"
            style={{ color: '#8B949E' }}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}