import { 
  type User, 
  type InsertUser, 
  type Correction, 
  type InsertCorrection,
  type UserPreferences,
  type InsertPreferences,
  type GrammarCheckResult
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  saveCorrection(correction: InsertCorrection & { correctedText: string; suggestions: any[]; grammarScore?: number }): Promise<Correction>;
  getCorrectionHistory(limit?: number): Promise<Correction[]>;
  
  getUserPreferences(): Promise<UserPreferences>;
  updateUserPreferences(preferences: Partial<InsertPreferences>): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private corrections: Map<string, Correction>;
  private preferences: UserPreferences;

  constructor() {
    this.users = new Map();
    this.corrections = new Map();
    this.preferences = {
      id: randomUUID(),
      autoCorrect: false,
      showScores: true,
      realTime: false,
      sensitivity: "balanced",
      language: "en"
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveCorrection(correctionData: InsertCorrection & { correctedText: string; suggestions: any[]; grammarScore?: number }): Promise<Correction> {
    const id = randomUUID();
    const correction: Correction = {
      id,
      originalText: correctionData.originalText,
      correctedText: correctionData.correctedText,
      suggestions: correctionData.suggestions,
      language: correctionData.language || "en",
      grammarScore: correctionData.grammarScore || null,
      createdAt: new Date()
    };
    this.corrections.set(id, correction);
    return correction;
  }

  async getCorrectionHistory(limit: number = 10): Promise<Correction[]> {
    const corrections = Array.from(this.corrections.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
    return corrections;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    return this.preferences;
  }

  async updateUserPreferences(updates: Partial<InsertPreferences>): Promise<UserPreferences> {
    this.preferences = { ...this.preferences, ...updates };
    return this.preferences;
  }
}

export const storage = new MemStorage();
