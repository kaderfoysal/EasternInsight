import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    news: [
      { name: 'রাজনীতি', href: '/category/রাজনীতি' },
      { name: 'ব্যবসা', href: '/category/ব্যবসা' },
      { name: 'ক্রীড়া', href: '/category/ক্রীড়া' },
      { name: 'বিনোদন', href: '/category/বিনোদন' },
      { name: 'প্রযুক্তি', href: '/category/প্রযুক্তি' },
    ],
    company: [
      { name: 'আমাদের সম্পর্কে', href: '/about' },
      { name: 'যোগাযোগ', href: '/contact' },
      { name: 'গোপনীয়তা নীতি', href: '/privacy' },
      { name: 'ব্যবহারের শর্তাবলী', href: '/terms' },
    ],
    social: [
      { name: 'ফেসবুক', href: '#' },
      { name: 'টুইটার', href: '#' },
      { name: 'ইনস্টাগ্রাম', href: '#' },
      { name: 'ইউটিউব', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              Eastern Insight
            </Link>
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              আপনার বিশ্বস্ত সংবাদ উৎস। সর্বশেষ খবর, বিশ্লেষণ এবং প্রতিবেদন।
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                আমাদের অনুসরণ করুন
              </h3>
              <div className="mt-4 flex space-x-4">
                {footerLinks.social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* News Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              সংবাদ বিভাগ
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.news.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              কোম্পানি
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              যোগাযোগ
            </h3>
            <div className="mt-4 space-y-3">
              <p className="text-gray-300 text-sm">
                সাইফুল ইসলাম
              </p>
              <p className="text-gray-300 text-sm">
                প্রকাশক ও সম্পাদক
              </p>
              <p className="text-gray-300 text-sm mt-3">
                প্লানার্স টাওয়ার, ১৩/এ, বি. আর. উত্তম সি. আর. দত্ত রোড (সোনারগাঁও রোড), বাংলামোটর, ঢাকা-১০০০, বাংলাদেশ।
              </p>
              <p className="text-gray-300 text-sm mt-3">
                মেইল: easterninsight@gmail.com
              </p>
              <p className="text-gray-300 text-sm">
                মোবাইল: +৮৮০ ১৭৭০ ১৯৮২৭৭
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Eastern Insight সকল অধিকার সংরক্ষিত।
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                গোপনীয়তা নীতি
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ব্যবহারের শর্তাবলী
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}