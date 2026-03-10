import { NextResponse } from 'next/server';

interface Params {
  params: { id: string };
}

// GET /api/themes/[id] (Phase 12)
export function GET(_req: Request, { params }: Params) {
  return NextResponse.json({ id: params.id });
}

// PUT /api/themes/[id] (Phase 12)
export async function PUT(request: Request, { params }: Params) {
  const body = await request.json();
  return NextResponse.json({ id: params.id, ...body });
}

// DELETE /api/themes/[id] — soft delete (Phase 12)
export function DELETE(_req: Request, { params }: Params) {
  return NextResponse.json({ id: params.id, isDeleted: true });
}
