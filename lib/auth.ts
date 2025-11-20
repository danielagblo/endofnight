import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Simple in-memory user store (replace with database in production)
const users = [
  {
    id: "1",
    email: "admin@endofnight.com",
    password: "admin123", // In production, use hashed passwords
    role: "ADMIN",
    name: "Admin User"
  }
]

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development-only"
}

// Use lazy initialization so the auth helpers (middleware wrapper and handlers)
// are created in a request-aware way. This avoids the app returning HTML
// documents where a JSON auth response is expected.
export const { handlers, signIn, signOut, auth } = NextAuth(() => authConfig)

