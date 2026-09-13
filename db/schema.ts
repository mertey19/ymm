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
