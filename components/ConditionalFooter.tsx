'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on admin or editor pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/editor')) {
    return null;
  }
  
  return <Footer />;
}
