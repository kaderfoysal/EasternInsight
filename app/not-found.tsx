import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">পাতা পাওয়া যায়নি</h2>
        <p className="text-gray-600 mb-8">
          দুঃখিত, আপনি যে পাতাটি খুঁজছেন সেটি বিদ্যমান নয় বা সরানো হয়েছে।
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}