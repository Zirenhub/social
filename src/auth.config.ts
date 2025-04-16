import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "./lib/prisma";
import { LogInContent } from "./types/auth";

export default {
  callbacks: {
    async jwt({ token, user }) {
      // If user exists (first sign in)
      if (user && user.id && user.email) {
        // Store user data directly on the token
        token.id = user.id;
        token.email = user.email;

        // If profile is already included in the user object
        if (user.profile) {
          token.profile = user.profile;
        } else {
          // Fetch profile data separately
          const userWithProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: { profile: { select: { id: true } } },
          });

          if (!userWithProfile?.profile) {
            return null;
          }

          token.profile = userWithProfile.profile.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (!token || !token.id || !token.email || !token.profile) {
        throw new Error("Token not found");
      }
      // Add custom properties to the session
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        profile: token.profile,
      };
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          const parsed = await LogInContent.parseAsync(credentials);
          const user = await prisma.user.findUnique({
            where: { email: parsed.email },
            include: { profile: { select: { id: true } } },
          });

          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.profile) {
            console.log("User profile not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(parsed.password, user.hashedPassword);

          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          // Return user object with their profile data
          return {
            id: user.id,
            email: user.email,
            profile: user.profile.id,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
