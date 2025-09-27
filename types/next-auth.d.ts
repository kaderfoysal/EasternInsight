// import NextAuth from 'next-auth';

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       role: string;
//     };
//   }

//   interface User {
//     role: string;
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     role: string;
//   }
// }


import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id?: string;
      role?: string;
    };
  }

  // extends returned user from adapter or credentials provider
  interface User extends DefaultUser {
    id?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
