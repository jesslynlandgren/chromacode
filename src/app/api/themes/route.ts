import { NextResponse } from 'next/server';

// GET /api/themes — list user themes (Phase 12)
export function GET() {
  return NextResponse.json({ themes: [] });
}

// POST /api/themes — create theme (Phase 12)
export async function POST(request: Request) {
  const body = await request.json();
  // TODO: persist to DB in Phase 12
  return NextResponse.json({ id: null, ...body }, { status: 201 });
}
