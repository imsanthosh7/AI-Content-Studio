import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkGrammar, batchProcessText } from "./services/gemini";
import { insertCorrectionSchema, insertPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Grammar check endpoint
  app.post("/api/grammar/check", async (req, res) => {
    try {
      const { originalText: text, language } = insertCorrectionSchema.parse(req.body);
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Text is required" });
      }

      const result = await checkGrammar(text, language);
      
      // Save correction to storage
      const correction = await storage.saveCorrection({
        originalText: text,
        correctedText: result.correctedText,
        suggestions: result.suggestions,
        language: language || "en",
        grammarScore: result.grammarScore
      });

      res.json(result);
    } catch (error) {
      console.error("Grammar check error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to check grammar" 
      });
    }
  });

  // Batch processing endpoint
  app.post("/api/grammar/batch", async (req, res) => {
    try {
      const { texts, language } = z.object({
        texts: z.array(z.string()).min(1).max(10),
        language: z.string().default("en")
      }).parse(req.body);

      const results = await batchProcessText(texts, language);
      
      // Save all corrections
      await Promise.all(results.map((result, index) => 
        storage.saveCorrection({
          originalText: texts[index],
          correctedText: result.correctedText,
          suggestions: result.suggestions,
          language: language,
          grammarScore: result.grammarScore
        })
      ));

      res.json(results);
    } catch (error) {
      console.error("Batch processing error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process batch" 
      });
    }
  });

  // Get correction history
  app.get("/api/corrections/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await storage.getCorrectionHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({ message: "Failed to fetch correction history" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences();
      res.json(preferences);
    } catch (error) {
      console.error("Preferences fetch error:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.put("/api/preferences", async (req, res) => {
    try {
      const updates = insertPreferencesSchema.partial().parse(req.body);
      const preferences = await storage.updateUserPreferences(updates);
      res.json(preferences);
    } catch (error) {
      console.error("Preferences update error:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // API status endpoint
  app.get("/api/status", async (req, res) => {
    try {
      // Simple health check
      res.json({
        status: "connected",
        service: "Gemini Flash API",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "API unavailable"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
