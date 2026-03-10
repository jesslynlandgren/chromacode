import NextAuth, { type DefaultSession } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { db } from '@/db';
import { users } from '@/db/schema';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    dbUserId?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const githubProfile = profile as { id: number; login: string; avatar_url: string };
        const [user] = await db
          .insert(users)
          .values({
            githubId: String(githubProfile.id),
            username: githubProfile.login,
            avatarUrl: githubProfile.avatar_url ?? null,
          })
          .onConflictDoUpdate({
            target: users.githubId,
            set: {
              username: githubProfile.login,
              avatarUrl: githubProfile.avatar_url ?? null,
            },
          })
          .returning();
        token.dbUserId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = String(token.dbUserId ?? '');
      return session;
    },
  },
});
