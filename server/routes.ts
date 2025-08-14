import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateContent } from "./services/content-generator";
import { contentGenerationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Content generation endpoint (unified for all content types)
  app.post("/api/content/generate", async (req, res) => {
    try {
      const request = contentGenerationSchema.parse(req.body);
      
      if (!request.text || request.text.trim().length === 0) {
        return res.status(400).json({ message: "Text is required" });
      }

      const result = await generateContent(request);
      res.json(result);
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate content" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
