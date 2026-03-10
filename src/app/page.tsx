import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-primary">Chromacode</span>
          <Badge variant="secondary" className="text-[10px]">
            beta
          </Badge>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/editor">
            <Button size="sm">Open Editor</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="mb-4 max-w-2xl text-5xl font-bold leading-tight tracking-tight">
          Build VS Code themes{' '}
          <span className="text-primary">with live preview</span>
        </h1>
        <p className="mb-8 max-w-xl text-lg text-muted-foreground">
          Visually edit workbench colors, syntax tokens, and semantic highlights. See changes
          instantly in a real Monaco editor. Export to{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">settings.json</code> or a full
          VS Code extension.
        </p>
        <div className="flex gap-3">
          <Link href="/editor">
            <Button size="lg">Start building</Button>
          </Link>
          <a
            href="https://github.com/jesslynlandgren/chromacode"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline">
              View on GitHub
            </Button>
          </a>
        </div>
      </main>

      {/* Feature grid */}
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-2 text-2xl">{f.icon}</div>
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        Built with Next.js &amp; Monaco Editor
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: '🎨',
    title: 'Full token coverage',
    description:
      '60+ workbench colors, TextMate syntax tokens (basic & advanced), and VS Code semantic tokens.',
  },
  {
    icon: '⚡',
    title: 'Live Monaco preview',
    description:
      'See your theme applied to real TypeScript, TSX, JSX, and CSS code as you change colors.',
  },
  {
    icon: '📦',
    title: 'Export ready',
    description:
      'Copy a settings.json snippet or download a complete VS Code extension ZIP — ready to install.',
  },
];
