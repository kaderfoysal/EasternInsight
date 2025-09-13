// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// interface Category {
//   id: string;
//   name: string;
//   image?: string;
//   _count: {
//     articles: number;
//   };
// }

// const CategorySection = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/categories');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch categories');
//         }
        
//         const data = await response.json();
//         setCategories(data);
//       } catch (err) {
//         setError('Error loading categories');
//         console.error('Error fetching categories:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {categories.map((category) => (
//             <Link 
//               href={`/category/${category.name.toLowerCase()}`} 
//               key={category.id}
//               className="block group"
//             >
//               <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:scale-105">
//                 <div className="relative h-40">
//                   <Image
//                     src={category.image || '/placeholder-category.jpg'}
//                     alt={category.name}
//                     fill
//                     style={{ objectFit: 'cover' }}
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//                     <h3 className="text-white text-2xl font-bold">{category.name}</h3>
//                   </div>
//                 </div>
//                 <div className="p-4 text-center">
//                   <p className="text-gray-600">{category._count.articles} Articles</p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategorySection;



'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  image?: string;
  _count: {
    articles: number;
  };
}

const dummyCategories: Category[] = [
  {
    id: "1",
    name: "World",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=1200&auto=format&fit=crop",
    _count: { articles: 120 },
  },
  {
    id: "2",
    name: "Politics",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
    _count: { articles: 85 },
  },
  {
    id: "3",
    name: "Business",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    _count: { articles: 95 },
  },
  {
    id: "4",
    name: "Sports",
    image: "https://images.unsplash.com/photo-1505842465776-3d90f616310d?q=80&w=1200&auto=format&fit=crop",
    _count: { articles: 60 },
  },
];

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error("No categories");
        const data = await response.json();
        setCategories(data.length ? data : dummyCategories);
      } catch {
        setCategories(dummyCategories);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              href={`/category/${category.name.toLowerCase()}`}
              key={category.id}
              className="block group"
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                <div className="relative h-52">
                  <Image
                    src={category.image || "/placeholder-category.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    <p className="text-gray-200 text-sm">{category._count.articles} Articles</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
