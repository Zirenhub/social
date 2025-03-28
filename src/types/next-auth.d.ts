import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      profile: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    profile: string;
  }
}

// declare module 'next-auth/adapters' {
//   interface AdapterUser {
//     user: {
//       id: string;
//       profile: string;
//       email: string;
//     };
//   }
// }

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id?: string;
    email?: string;
    profile?: string;
  }
}
