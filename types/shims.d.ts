// Temporary shims to satisfy TypeScript in environments without installed types

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react/jsx-runtime' {
  const jsxRuntime: any;
  export = jsxRuntime;
}

declare module 'react';
declare module 'next/link';
declare module 'next/navigation';
declare module 'next-auth';
declare module 'lucide-react';
declare module 'mongoose';


