import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { ThemeState } from '@/types';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userThemes = await db
    .select()
    .from(themes)
    .where(eq(themes.userId, parseInt(session.user.id)))
    .orderBy(desc(themes.updatedAt));

  return NextResponse.json({ themes: userThemes });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: ThemeState = await request.json();

  const [theme] = await db
    .insert(themes)
    .values({
      userId: parseInt(session.user.id),
      name: body.name,
      basedOn: body.basedOn ?? null,
      workbenchColors: body.workbenchColors,
      tokenColors: body.tokenColors,
      semanticColors: body.semanticColors,
    })
    .returning();

  return NextResponse.json(theme, { status: 201 });
}
