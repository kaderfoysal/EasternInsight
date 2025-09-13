// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface Writer {
//   id: string;
//   name: string;
//   bio?: string;
//   image?: string;
//   _count: {
//     articles: number;
//   };
// }

// const WriterSection = () => {
//   const [writers, setWriters] = useState<Writer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchWriters = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/writers');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch writers');
//         }
        
//         const data = await response.json();
//         setWriters(data);
//       } catch (err) {
//         setError('Error loading writers');
//         console.error('Error fetching writers:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWriters();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8">Our Writers</h2>
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8">Our Writers</h2>
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold mb-8">Our Writers</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {writers.map((writer) => (
//             <div key={writer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-4 text-center">
//                 <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden">
//                   <Image
//                     src={writer.image || '/placeholder-writer.jpg'}
//                     alt={writer.name}
//                     fill
//                     style={{ objectFit: 'cover' }}
//                   />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{writer.name}</h3>
//                 <p className="text-gray-600 mb-2">{writer.bio || 'Writer at Eastern Insight'}</p>
//                 <p className="text-sm text-blue-600">{writer._count.articles} Articles</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WriterSection;



'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Writer {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  _count: {
    articles: number;
  };
}

const dummyWriters: Writer[] = [
  {
    id: "w1",
    name: "Emily Johnson",
    bio: "Senior Political Correspondent covering global affairs and governance.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=600&auto=format&fit=crop",
    _count: { articles: 45 },
  },
  {
    id: "w2",
    name: "Michael Lee",
    bio: "Business Analyst focusing on international markets and trade.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    _count: { articles: 38 },
  },
  {
    id: "w3",
    name: "Sophia Martinez",
    bio: "Investigative journalist covering environmental issues worldwide.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    _count: { articles: 52 },
  },
  {
    id: "w4",
    name: "David Chen",
    bio: "Technology Reporter exploring innovation, AI, and future trends.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    _count: { articles: 40 },
  },
];

const WriterSection = () => {
  const [writers, setWriters] = useState<Writer[]>(dummyWriters);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const response = await fetch('/api/writers');
        if (!response.ok) throw new Error("No writers");
        const data = await response.json();
        setWriters(data.length ? data : dummyWriters);
      } catch {
        setWriters(dummyWriters);
      }
    };
    fetchWriters();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Meet Our Writers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {writers.map((writer) => (
            <div
              key={writer.id}
              className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition overflow-hidden text-center p-6"
            >
              <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-gray-200">
                <Image
                  src={writer.image || "/placeholder-writer.jpg"}
                  alt={writer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{writer.name}</h3>
              <p className="text-gray-600 mb-3 text-sm">{writer.bio}</p>
              <p className="text-sm font-medium text-red-600">{writer._count.articles} Articles</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WriterSection;
