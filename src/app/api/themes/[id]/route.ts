import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { ThemeState } from '@/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [theme] = await db
    .select()
    .from(themes)
    .where(and(eq(themes.id, parseInt(id)), eq(themes.userId, parseInt(session.user.id))));

  if (!theme) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(theme);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: ThemeState = await request.json();

  const [theme] = await db
    .update(themes)
    .set({
      name: body.name,
      basedOn: body.basedOn ?? null,
      workbenchColors: body.workbenchColors,
      tokenColors: body.tokenColors,
      semanticColors: body.semanticColors,
      updatedAt: new Date(),
    })
    .where(and(eq(themes.id, parseInt(id)), eq(themes.userId, parseInt(session.user.id))))
    .returning();

  if (!theme) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(theme);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db
    .delete(themes)
    .where(and(eq(themes.id, parseInt(id)), eq(themes.userId, parseInt(session.user.id))));

  return new NextResponse(null, { status: 204 });
}
