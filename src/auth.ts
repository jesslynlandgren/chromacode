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

interface GitHubProfile {
  id: number;
  login: string;
  avatar_url: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const githubProfile = profile as unknown as GitHubProfile;
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
        (token as Record<string, unknown>).dbUserId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = String((token as Record<string, unknown>).dbUserId ?? '');
      return session;
    },
  },
});
