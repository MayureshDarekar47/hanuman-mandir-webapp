import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Find admin user in DB
        let user = await prisma.adminUser.findUnique({
          where: { username: credentials.username }
        }).catch(() => null);

        if (!user) {
          // Fallback: Auto-create default admin if the table is completely empty
          // This helps when migrating to a new DB without manually running seed scripts
          const adminCount = await prisma.adminUser.count().catch(() => -1);
          
          if (adminCount === 0 && credentials.username === (process.env.ADMIN_USERNAME || "admin") && credentials.password === (process.env.ADMIN_PASSWORD || "1234")) {
            const hash = await bcrypt.hash(credentials.password, 10);
            user = await prisma.adminUser.create({
              data: {
                username: credentials.username,
                passwordHash: hash
              }
            });
          } else {
            return null;
          }
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id.toString(), name: user.username };
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
