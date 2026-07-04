'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  // Don't show public header on admin or editor pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/editor')) return null;
  return <Header />;
}
