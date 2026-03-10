import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/themes/[id] (Phase 12)
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  return NextResponse.json({ id });
}

// PUT /api/themes/[id] (Phase 12)
export async function PUT(request: Request, { params }: Params) {
  const [{ id }, body] = await Promise.all([params, request.json()]);
  return NextResponse.json({ id, ...body });
}

// DELETE /api/themes/[id] — soft delete (Phase 12)
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  return NextResponse.json({ id, isDeleted: true });
}
