import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ThemesDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">My Themes</h1>
      <p className="text-muted-foreground">Sign in to save and manage your themes.</p>
      <Link href="/editor">
        <Button>Go to Editor</Button>
      </Link>
    </div>
  );
}
