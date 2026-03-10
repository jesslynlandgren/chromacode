import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import type { TextMateRule, SemanticColors } from '@/types';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  githubId: varchar('github_id', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  basedOn: varchar('based_on', { length: 255 }),
  workbenchColors: jsonb('workbench_colors').notNull().$type<Record<string, string>>(),
  tokenColors: jsonb('token_colors').notNull().$type<TextMateRule[]>(),
  semanticColors: jsonb('semantic_colors').notNull().$type<SemanticColors>(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
