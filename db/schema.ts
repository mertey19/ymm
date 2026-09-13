import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const content = sqliteTable('content', {
  id: integer('id').primaryKey(),
  document: text('document').notNull(),
  revision: integer('revision').notNull().default(0),
  updatedAt: text('updated_at').notNull(),
});
export const administrators = sqliteTable('administrators', {
  id: integer('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
});
export const adminSessions = sqliteTable('admin_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  expiresAt: integer('expires_at').notNull(),
  passwordVersion: text('password_version').notNull(),
});
export const loginAttempts = sqliteTable('login_attempts', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  expiresAt: integer('expires_at').notNull(),
});
