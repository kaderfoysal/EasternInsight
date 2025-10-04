// "use client";

// import React, { useState, useEffect } from 'react';
// import Modal from './Modal';

// interface Category {
//   _id: string;
//   name: string;
//   description?: string;
// }

// interface CategoryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (category: { name: string; description?: string }) => void;
//   category?: Category | null;
// }

// export default function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (category) {
//       setName(category.name);
//       setDescription(category.description || '');
//     } else {
//       setName('');
//       setDescription('');
//     }
//     setError('');
//   }, [category, isOpen]);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       await onSave({ name, description });
//       onClose();
//     } catch (err: any) {
//       setError(err.message || 'Failed to save category');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={category ? "বিভাগ সম্পাদনা করুন" : "নতুন বিভাগ যোগ করুন"}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//             বিভাগের নাম <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             name="name"
//             placeholder="বিভাগের নাম লিখুন"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             required
//           />
//         </div>
        
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//             বর্ণনা (ঐচ্ছিক)
//           </label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             name="description"
//             placeholder="বিভাগের বর্ণনা লিখুন"
//             rows={3}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           />
//         </div>
        
//         {error && (
//           <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//             {error}
//           </div>
//         )}
        
//         <div className="flex justify-end space-x-3 pt-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             বাতিল
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 সংরক্ষণ হচ্ছে...
//               </>
//             ) : (
//               'সংরক্ষণ করুন'
//             )}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface Category {
  _id: string;
  name: string;
  description?: string;
  serial: number; // 🔹 Added serial field
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: { name: string; description?: string; serial: number }) => void;
  category?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serial, setSerial] = useState(0); // 🔹 State for serial
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setSerial(category.serial || 0); // 🔹 populate serial if editing
    } else {
      setName("");
      setDescription("");
      setSerial(0);
    }
    setError("");
  }, [category, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSave({ name, description, serial }); // 🔹 send serial too
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            বিভাগের নাম <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="বিভাগের নাম লিখুন"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            বর্ণনা (ঐচ্ছিক)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            placeholder="বিভাগের বর্ণনা লিখুন"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Serial */}
        <div>
          <label
            htmlFor="serial"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            সিরিয়াল নম্বর <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="serial"
            value={serial}
            onChange={(e) => setSerial(Number(e.target.value))}
            name="serial"
            placeholder="সিরিয়াল নম্বর দিন"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
