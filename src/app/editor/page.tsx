import { EditorClient } from './EditorClient';

export const metadata = {
  title: 'Editor — Chromacode',
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ themeId?: string }>;
}) {
  const { themeId } = await searchParams;
  return <EditorClient initialThemeId={themeId} />;
}
