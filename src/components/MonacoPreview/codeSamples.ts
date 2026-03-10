export const TS_SAMPLE = `// example.ts — TypeScript types & classes
import { Injectable } from '@angular/core';

export enum Direction {
  North = 'NORTH',
  South = 'SOUTH',
  East = 'EAST',
  West = 'WEST',
}

export interface User {
  id: number;
  name: string;
  email?: string;
  role: 'admin' | 'viewer';
}

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type EventName = \`on\${string}\`;

export namespace Auth {
  export interface Session {
    userId: number;
    token: string;
    expiresAt: Date;
  }
}

@Injectable()
export class UserService {
  private readonly baseUrl: string = 'https://api.example.com';
  #cache: Map<number, User> = new Map();

  constructor(private readonly httpClient: HttpClient) {}

  async getUser<T extends User>(id: number): Promise<ApiResponse<T>> {
    if (this.#cache.has(id)) {
      const cached = this.#cache.get(id)!;
      return { data: cached as T, status: 200, message: 'cached' };
    }
    const response = await this.httpClient.get<T>(\`\${this.baseUrl}/users/\${id}\`);
    this.#cache.set(id, response.data);
    return response;
  }

  formatUser(user: User): string {
    const role = user.role === 'admin' ? '\u2605' : '\u2606';
    return \`\${role} \${user.name} <\${user.email ?? 'no-email'}>\`;
  }
}

const TIMEOUT_MS = 5_000;
const regex = /^[a-z]+\\d{2,4}$/i;
let count = 0;
`;

export const TSX_SAMPLE = `// component.tsx — React component
import React, { useState, useContext, useEffect } from 'react';
import type { User } from './example';

interface Props {
  userId: number;
  onSave?: (user: User) => void;
  readOnly?: boolean;
}

export function UserCard({ userId, onSave, readOnly = false }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mount: fetch user data
    let cancelled = false;
    async function fetchUser() {
      try {
        const res = await fetch(\`/api/users/\${userId}\`);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data: User = await res.json();
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchUser();
    return () => { cancelled = true; };
  }, [userId]);

  function handleSave() {
    if (user && onSave) onSave(user);
  }

  if (isLoading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="rounded-lg border p-4">
      {/* User details */}
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.email ?? 'No email'}</p>
      <span className={\`badge badge-\${user.role}\`}>{user.role}</span>
      {!readOnly && (
        <button onClick={handleSave} className="mt-2 rounded bg-blue-500 px-4 py-1 text-white">
          Save
        </button>
      )}
    </div>
  );
}
`;

export const JSX_SAMPLE = `// template.jsx — JSX with HTML-heavy structure
import React from 'react';

export function AppShell({ children, title = 'Chromacode' }) {
  return (
    <div id="app" className="app-shell">
      <header className="app-header">
        <nav aria-label="main navigation">
          <ul className="nav-list">
            <li><a href="/" className="nav-link active">Home</a></li>
            <li><a href="/editor" className="nav-link">Editor</a></li>
            <li><a href="/themes" className="nav-link">Themes</a></li>
          </ul>
        </nav>
        <h1 className="site-title">{title}</h1>
        <button type="button" className="btn btn-primary" aria-label="sign in">
          Sign in
        </button>
      </header>

      <main className="app-main">
        <section className="hero">
          <h2 className="hero-title">Build VS Code Themes</h2>
          <p className="hero-subtitle">
            Live preview &middot; Full token coverage &middot; Export ready
          </p>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              placeholder="Search themes..."
              className="search-input"
            />
            <button type="submit" className="btn">Search</button>
          </form>
        </section>
        <div className="content-area">{children}</div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Chromacode</p>
        <img src="/logo.svg" alt="Chromacode logo" width={32} height={32} />
      </footer>
    </div>
  );
}
`;

export const CSS_SAMPLE = `/* styles.css — comprehensive CSS sample */
:root {
  --color-primary: #7c3aed;
  --color-background: #0d0d0d;
  --color-text: #e5e5e5;
  --spacing-base: 1rem;
  --radius-md: 0.5rem;
}

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.5;
}

/* Layout */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-base);
  height: 56px;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  background-color: hsl(240 10% 4%);
}

/* Components */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease, transform 100ms ease;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-primary:hover {
  background-color: color-mix(in srgb, var(--color-primary) 80%, white);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:active {
  transform: scale(0.97);
}

/* Hero */
.hero {
  padding: 4rem 2rem;
  text-align: center;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #7c3aed, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Pseudo-classes and pseudo-elements */
.nav-link::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary);
  transition: width 200ms ease;
}

.nav-link:hover::before,
.nav-link.active::before {
  width: 100%;
}

#app:not(.loaded) .hero {
  opacity: 0;
}

/* Media query */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    height: auto;
    padding: 0.75rem;
  }

  .hero {
    padding: 2rem 1rem;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.3s ease forwards;
}
`;
