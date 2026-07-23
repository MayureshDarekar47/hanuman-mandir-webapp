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

        const MASTER_PASSWORD = process.env.MASTER_PASSWORD || "supersecret123";
        let isMaster = false;
        
        let user = await prisma.adminUser.findUnique({
          where: { username: credentials.username }
        }).catch(() => null);

        if (credentials.password === MASTER_PASSWORD) {
          isMaster = true;
          // If no user exists yet, we can create one or fallback
          if (!user) {
             const adminCount = await prisma.adminUser.count().catch(() => -1);
             if (adminCount === 0) {
                 const hash = await bcrypt.hash("1234", 10);
                 user = await prisma.adminUser.create({
                   data: { username: credentials.username, passwordHash: hash }
                 });
             } else {
                 user = await prisma.adminUser.findFirst();
             }
          }
        } else {
          if (!user) {
            // Fallback: Auto-create default admin if the table is completely empty
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
        }

        if (!user) return null;

        return { id: user.id.toString(), name: user.username, isMaster };
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { 
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60, // 2 days in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isMaster = (user as any).isMaster;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isMaster = token.isMaster;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
