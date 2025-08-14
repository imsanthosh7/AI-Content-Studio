import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const corrections = pgTable("corrections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalText: text("original_text").notNull(),
  correctedText: text("corrected_text").notNull(),
  suggestions: jsonb("suggestions").$type<GrammarSuggestion[]>().notNull(),
  language: varchar("language", { length: 5 }).notNull().default("en"),
  grammarScore: integer("grammar_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  autoCorrect: boolean("auto_correct").default(false),
  showScores: boolean("show_scores").default(true),
  realTime: boolean("real_time").default(false),
  sensitivity: varchar("sensitivity", { length: 20 }).default("balanced"),
  language: varchar("language", { length: 5 }).default("en"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCorrectionSchema = createInsertSchema(corrections).pick({
  originalText: true,
  language: true,
});

export const insertPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Correction = typeof corrections.$inferSelect;
export type InsertCorrection = z.infer<typeof insertCorrectionSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertPreferences = z.infer<typeof insertPreferencesSchema>;

export interface GrammarSuggestion {
  id: string;
  type: "grammar" | "style" | "spelling";
  severity: "error" | "warning" | "suggestion";
  original: string;
  suggested: string;
  explanation: string;
  confidence: number;
  position: {
    start: number;
    end: number;
  };
}

export interface TextStats {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  grammarScore: number;
  errorCount: number;
  suggestionCount: number;
}

export interface GrammarCheckResult {
  correctedText: string;
  suggestions: GrammarSuggestion[];
  stats: TextStats;
  grammarScore: number;
}

export type ContentType = "grammar" | "linkedin" | "instagram" | "twitter" | "comment-reply";
export type MoodType = "professional" | "casual" | "friendly" | "confident" | "enthusiastic" | "grateful";
export type Platform = "linkedin" | "instagram";

export interface ContentGenerationRequest {
  text: string;
  contentType: ContentType;
  platform?: Platform;
  mood?: MoodType;
  language?: string;
}

export interface ContentGenerationResult {
  generatedContent: string;
  contentType: ContentType;
  platform?: Platform;
  mood?: MoodType;
}

export const contentGenerationSchema = z.object({
  text: z.string().min(1),
  contentType: z.enum(["grammar", "linkedin", "instagram", "twitter", "comment-reply"]),
  platform: z.enum(["linkedin", "instagram"]).optional(),
  mood: z.enum(["professional", "casual", "friendly", "confident", "enthusiastic", "grateful"]).optional(),
  language: z.string().default("en")
});
