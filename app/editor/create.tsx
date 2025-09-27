import dynamic from 'next/dynamic';
import { useState } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CreateNewsProps {
  categories: Category[];
}

// Dynamically import React Quill for SSR compatibility
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// You should create this or replace with react-select or other select component
function CategorySelect({
  categories,
  value,
  onChange,
  placeholder,
}: {
  categories: Category[];
  value: string | null;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder ?? 'Select category'}
      </option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}

export default function CreateNewsPage({ categories }: CreateNewsProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(''); // Changed from null to empty st

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">নতুন খবর যুক্ত করুন</h1>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="title" className="block font-medium mb-2">শিরোনাম</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="খবরের শিরোনাম লিখুন"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">বিভাগ</label>
          <CategorySelect
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
            placeholder="বিভাগ নির্বাচন করুন"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">বিষয়বস্তু</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            placeholder="খবরের বিস্তারিত লিখুন"
            className="min-h-[300px]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          খবর প্রকাশ করুন
        </button>
      </form>
    </div>
  );
}
