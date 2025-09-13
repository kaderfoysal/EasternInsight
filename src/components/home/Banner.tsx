// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface Banner {
//   id: string;
//   title: string;
//   subtitle?: string;
//   description?: string;
//   imageUrl: string;
//   linkUrl?: string;
//   linkText?: string;
//   isActive: boolean;
// }

// const Banner = () => {
//   const [banner, setBanner] = useState<Banner | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/banners?active=true');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch banner');
//         }
        
//         const data = await response.json();
//         // Get the first active banner
//         setBanner(data.length > 0 ? data[0] : null);
//       } catch (err) {
//         setError('Error loading banner');
//         console.error('Error fetching banner:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanner();
//   }, []);

//   if (loading) {
//     return (
//       <section className="relative h-96 w-full overflow-hidden bg-gray-300 animate-pulse">
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </section>
//     );
//   }

//   if (error || !banner) {
//     // Fallback banner if there's an error or no banner found
//     return (
//       <section className="relative h-96 w-full overflow-hidden bg-gray-800">
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center text-white px-4">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">Eastern Insight</h1>
//             <p className="text-xl md:text-2xl max-w-3xl">
//               {error || "Delivering insightful news and analysis on politics, business, sports, and more."}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="relative h-96 w-full overflow-hidden">
//       <div className="absolute inset-0">
//         <Image
//           src={banner.imageUrl}
//           alt={banner.title}
//           fill
//           priority
//           style={{ objectFit: 'cover' }}
//         />
//       </div>
//       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//         <div className="text-center text-white px-4">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
//           {banner.subtitle && <h2 className="text-2xl md:text-3xl mb-2">{banner.subtitle}</h2>}
//           {banner.description && <p className="text-xl md:text-2xl max-w-3xl mb-6">{banner.description}</p>}
//           {banner.linkUrl && banner.linkText && (
//             <a 
//               href={banner.linkUrl} 
//               className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               {banner.linkText}
//             </a>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Banner;
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
}

const dummyBanner: Banner = {
  id: "dummy",
  title: "Stay Informed with Breaking News",
  subtitle: "Your Daily Dose of Global Headlines",
  description: "Get the latest updates on world events, business, technology, and culture – all in one place.",
  imageUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1600&q=80",
  linkUrl: "/articles",
  linkText: "Explore News",
  isActive: true,
};

const Banner = () => {
  const [banner, setBanner] = useState<Banner>(dummyBanner);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('/api/banners?active=true');
        if (!response.ok) throw new Error("No banner data");
        const data: Banner[] = await response.json();
        setBanner(data.length > 0 ? data[0] : dummyBanner);
      } catch {
        setBanner(dummyBanner);
      }
    };
    fetchBanner();
  }, []);

  return (
    <section className="relative h-[500px] w-full">
      <div className="absolute inset-0">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
            {banner.title}
          </h1>
          {banner.subtitle && <h2 className="text-2xl md:text-3xl mb-3">{banner.subtitle}</h2>}
          {banner.description && <p className="text-lg md:text-xl mb-6">{banner.description}</p>}
          {banner.linkUrl && banner.linkText && (
            <a
              href={banner.linkUrl}
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition"
            >
              {banner.linkText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Banner;
