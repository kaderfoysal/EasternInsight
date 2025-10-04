
// 'use client';

// import Link from "next/link";
// import { useSession } from "next-auth/react";

// export default function Footer() {
//   const { data: session, status } = useSession();
//   const currentYear = new Date().getFullYear();

//   const footerLinks = {
//     news: [
//       { name: "রাজনীতি", href: "/category/রাজনীতি" },
//       { name: "ব্যবসা", href: "/category/ব্যবসা" },
//       { name: "ক্রীড়া", href: "/category/ক্রীড়া" },
//       { name: "বিনোদন", href: "/category/বিনোদন" },
//       { name: "প্রযুক্তি", href: "/category/প্রযুক্তি" },
//       { name: "স্বাস্থ্য", href: "/category/স্বাস্থ্য" },
//       { name: "শিক্ষা", href: "/category/শিক্ষা" },
//       { name: "বিশ্ব সংবাদ", href: "/category/বিশ্ব-সংবাদ" },
//     ],
//     social: [
//       { name: "ফেসবুক", href: "#" },
//       { name: "টুইটার", href: "#" },
//       { name: "ইনস্টাগ্রাম", href: "#" },
//       { name: "ইউটিউব", href: "#" },
//     ],
//   };

//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {/* Brand */}
//           <div>
//             <Link
//               href="/"
//               className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
//             >
//               Eastern Insight
//             </Link>
//             <p className="text-gray-300 text-sm mt-2">সাইফুল ইসলাম</p>
//             <p className="text-gray-300 text-sm">প্রকাশক ও সম্পাদক</p>
//             <div className="mt-6">
//               <h3 className="text-sm font-semibold uppercase tracking-wider">
//                 আমাদের অনুসরণ করুন
//               </h3>
//               <div className="mt-4 flex flex-wrap gap-3">
//                 {footerLinks.social.map((item) => (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* News Categories */}
//           <div>
//             <h3 className="text-sm font-semibold uppercase tracking-wider">
//               সংবাদ বিভাগ
//             </h3>
//             <ul className="mt-4 grid grid-cols-2 gap-2">
//               {footerLinks.news.map((item) => (
//                 <li key={item.name}>
//                   <Link
//                     href={item.href}
//                     className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
//                   >
//                     {item.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-sm font-semibold uppercase tracking-wider">
//               যোগাযোগ
//             </h3>
//             <div className="mt-4 space-y-3 text-gray-300 text-sm">
//               <p>
//                 প্লানার্স টাওয়ার, ১৩/এ, বি. আর. উত্তম সি. আর. দত্ত রোড (সোনারগাঁও রোড), বাংলামোটর, ঢাকা-১০০০,
//                 বাংলাদেশ।
//               </p>
//               <p>📧 easterninsight@gmail.com</p>
//               <p>📞 +৮৮০ ১৭৭০ ১৯৮২৭৭</p>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-12 pt-6 border-t border-gray-700">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm text-center md:text-left">
//               © {currentYear} Eastern Insight — সকল অধিকার সংরক্ষিত।
//             </p>
//             <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4 md:gap-6">
//               <Link
//                 href="/privacy"
//                 className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
//               >
//                 গোপনীয়তা নীতি
//               </Link>
//               <Link
//                 href="/terms"
//                 className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
//               >
//                 ব্যবহারের শর্তাবলী
//               </Link>
//               {!session && status !== 'loading' && (
//                 <Link
//                   href="/auth/signin"
//                   className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
//                 >
//                   লগইন
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const { data: session, status } = useSession();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    news: [
      { name: "রাজনীতি", href: "/category/রাজনীতি" },
      { name: "ব্যবসা", href: "/category/ব্যবসা" },
      { name: "ক্রীড়া", href: "/category/ক্রীড়া" },
      { name: "বিনোদন", href: "/category/বিনোদন" },
      { name: "প্রযুক্তি", href: "/category/প্রযুক্তি" },
      { name: "স্বাস্থ্য", href: "/category/স্বাস্থ্য" },
      { name: "শিক্ষা", href: "/category/শিক্ষা" },
      { name: "বিশ্ব সংবাদ", href: "/category/বিশ্ব-সংবাদ" },
    ],
    social: [
      { name: "Facebook", href: "#", icon: <Facebook size={24} /> },
      { name: "Twitter", href: "#", icon: <Twitter size={24} /> },
      { name: "Instagram", href: "#", icon: <Instagram size={24} /> },
      { name: "YouTube", href: "#", icon: <Youtube size={24} /> },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Eastern Insight
            </Link>
            <p className="text-gray-300 text-sm mt-2">সাইফুল ইসলাম <br />প্রকাশক ও সম্পাদক</p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                আমাদের অনুসরণ করুন
              </h3>
              <div className="mt-4 flex flex-wrap gap-4">
                {footerLinks.social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={item.name}
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* News Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              সংবাদ বিভাগ
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {footerLinks.news.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              যোগাযোগ
            </h3>
            <div className="mt-4 space-y-3 text-gray-300 text-sm">
              <p>
                প্লানার্স টাওয়ার, ১৩/এ, বি. আর. উত্তম সি. আর. দত্ত রোড (সোনারগাঁও রোড), বাংলামোটর, ঢাকা-১০০০,
                বাংলাদেশ।
              </p>
              <p>📧 easterninsight@gmail.com</p>
              <p>📞 +৮৮০ ১৭৭০ ১৯৮২৭৭</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Eastern Insight — সকল অধিকার সংরক্ষিত।
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                গোপনীয়তা নীতি
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                ব্যবহারের শর্তাবলী
              </Link>
              {!session && status !== 'loading' && (
                <Link
                  href="/auth/signin"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
                >
                  লগইন
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}