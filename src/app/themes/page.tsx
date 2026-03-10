import { auth, signIn, signOut } from '@/auth';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'My Themes — Chromacode',
};

export default async function ThemesDashboard() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">My Themes</h1>
        <p className="text-muted-foreground">Sign in to save and manage your themes.</p>
        <form
          action={async () => {
            'use server';
            await signIn('github', { redirectTo: '/themes' });
          }}
        >
          <Button type="submit">Sign in with GitHub</Button>
        </form>
      </div>
    );
  }

  const userThemes = await db
    .select()
    .from(themes)
    .where(eq(themes.userId, parseInt(session.user.id)))
    .orderBy(desc(themes.updatedAt));

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Themes</h1>
          <div className="flex items-center gap-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'User'}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <Button variant="ghost" size="sm" type="submit" className="text-xs">
                Sign out
              </Button>
            </form>
            <Link href="/editor">
              <Button size="sm">New Theme</Button>
            </Link>
          </div>
        </div>

        {userThemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="text-muted-foreground">No themes saved yet.</p>
            <Link href="/editor">
              <Button variant="outline">Create your first theme</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userThemes.map((theme) => (
              <div key={theme.id} className="rounded-lg border border-border bg-card p-4">
                <h2 className="font-semibold">{theme.name}</h2>
                {theme.basedOn && (
                  <p className="text-xs text-muted-foreground">Based on {theme.basedOn}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(theme.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <Link href={`/editor?themeId=${theme.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      Open in Editor
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
