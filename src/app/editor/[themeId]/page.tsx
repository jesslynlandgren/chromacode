type Params = { params: Promise<{ themeId: string }> };

// Edit a saved theme — auth required (wired up in Phase 11)
export default async function EditThemePage({ params }: Params) {
  const { themeId } = await params;
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Loading theme {themeId}…</p>
    </div>
  );
}
