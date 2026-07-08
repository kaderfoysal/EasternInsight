"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  serial: number;
  parentSlug?: string | null;
  isDropdown?: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: { name: string; description?: string; serial: number; parentSlug?: string | null; isDropdown?: boolean }) => void;
  category?: Category | null;
  parentCategories?: Category[];
}

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/40";
const inputStyle = { background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' };
const labelCls = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider";

export default function CategoryModal({ isOpen, onClose, onSave, category, parentCategories = [] }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serial, setSerial] = useState(0);
  const [parentSlug, setParentSlug] = useState("");
  const [isDropdown, setIsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setSerial(category.serial || 0);
      setParentSlug(category.parentSlug || "");
      setIsDropdown(category.isDropdown || false);
    } else {
      setName("");
      setDescription("");
      setSerial(0);
      setParentSlug("");
      setIsDropdown(false);
    }
    setError("");
  }, [category, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSave({ name, description, serial, parentSlug: parentSlug || null, isDropdown });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? "বিভাগ সম্পাদনা করুন" : "নতুন বিভাগ যোগ করুন"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className={labelCls}>
            বিভাগের নাম <span className="text-red-400 font-normal normal-case">*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="বিভাগের নাম লিখুন"
            className={inputCls}
            style={inputStyle}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelCls}>
            বর্ণনা (ঐচ্ছিক)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            placeholder="বিভাগের বর্ণনা লিখুন"
            rows={3}
            className={inputCls}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Serial */}
        <div>
          <label htmlFor="serial" className={labelCls}>
            সিরিয়াল নম্বর <span className="text-red-400 font-normal normal-case">*</span>
          </label>
          <input
            type="number"
            id="serial"
            value={serial}
            onChange={(e) => setSerial(Number(e.target.value))}
            name="serial"
            placeholder="সিরিয়াল নম্বর দিন"
            className={inputCls}
            style={inputStyle}
            required
          />
        </div>

        {/* Parent Category */}
        <div>
          <label htmlFor="parentSlug" className={labelCls}>
            প্রধান বিভাগ (সাবক্যাটাগরি হলে নির্বাচন করুন)
          </label>
          <select
            id="parentSlug"
            value={parentSlug}
            onChange={(e) => {
              setParentSlug(e.target.value);
              if (e.target.value) setIsDropdown(false);
            }}
            className={inputCls}
            style={inputStyle}
          >
            <option value="">কোনটি নয় (প্রধান বিভাগ)</option>
            {parentCategories.map(cat => (
              <option key={cat._id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Is Dropdown */}
        {!parentSlug && (
          <label className="flex items-center gap-3 cursor-pointer group mt-2">
            <input
              type="checkbox"
              id="isDropdown"
              checked={isDropdown}
              onChange={(e) => setIsDropdown(e.target.checked)}
              className="h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
              style={{ background: '#0D1117', borderColor: '#30363D', accentColor: '#3B82F6' }}
            />
            <span className="text-sm font-medium text-gray-300 group-hover:text-gray-100 transition-colors">
              সাবক্যাটাগরি মেনু হিসেবে দেখান (Dropdown)
            </span>
          </label>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid #30363D', color: '#8B949E' }}
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: '#2563EB' }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              "সংরক্ষণ করুন"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
