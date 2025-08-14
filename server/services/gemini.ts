import { GoogleGenAI } from "@google/genai";
import { GrammarCheckResult, GrammarSuggestion, TextStats } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ""
});

export async function checkGrammar(text: string, language: string = "en"): Promise<GrammarCheckResult> {
  try {
    const systemPrompt = `You are an expert grammar checker and writing assistant. 
Analyze the provided text for grammar, spelling, and style issues.
Provide corrections and suggestions with detailed explanations.
Return the result in the exact JSON format specified.

For each suggestion, provide:
- type: "grammar", "style", or "spelling"
- severity: "error", "warning", or "suggestion"
- original: the problematic text
- suggested: the corrected text
- explanation: detailed explanation of the issue
- confidence: score between 0-100
- position: start and end character positions

Also calculate text statistics and an overall grammar score (0-100).`;

    const prompt = `Please analyze this ${language} text for grammar, spelling, and style issues:

"${text}"

Return a JSON response with this exact structure:
{
  "correctedText": "fully corrected version of the text",
  "suggestions": [
    {
      "id": "unique_id",
      "type": "grammar|style|spelling",
      "severity": "error|warning|suggestion", 
      "original": "problematic text",
      "suggested": "corrected text",
      "explanation": "detailed explanation",
      "confidence": 95,
      "position": {"start": 0, "end": 5}
    }
  ],
  "stats": {
    "wordCount": 10,
    "charCount": 50,
    "sentenceCount": 2,
    "grammarScore": 85,
    "errorCount": 1,
    "suggestionCount": 2
  },
  "grammarScore": 85
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            correctedText: { type: "string" },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ["grammar", "style", "spelling"] },
                  severity: { type: "string", enum: ["error", "warning", "suggestion"] },
                  original: { type: "string" },
                  suggested: { type: "string" },
                  explanation: { type: "string" },
                  confidence: { type: "number" },
                  position: {
                    type: "object",
                    properties: {
                      start: { type: "number" },
                      end: { type: "number" }
                    },
                    required: ["start", "end"]
                  }
                },
                required: ["id", "type", "severity", "original", "suggested", "explanation", "confidence", "position"]
              }
            },
            stats: {
              type: "object",
              properties: {
                wordCount: { type: "number" },
                charCount: { type: "number" },
                sentenceCount: { type: "number" },
                grammarScore: { type: "number" },
                errorCount: { type: "number" },
                suggestionCount: { type: "number" }
              },
              required: ["wordCount", "charCount", "sentenceCount", "grammarScore", "errorCount", "suggestionCount"]
            },
            grammarScore: { type: "number" }
          },
          required: ["correctedText", "suggestions", "stats", "grammarScore"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const result: GrammarCheckResult = JSON.parse(rawJson);
    
    // Validate and ensure data integrity
    if (!result.correctedText || !Array.isArray(result.suggestions) || !result.stats) {
      throw new Error("Invalid response format from Gemini API");
    }

    return result;
  } catch (error) {
    console.error("Grammar check failed:", error);
    throw new Error(`Failed to check grammar: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function batchProcessText(texts: string[], language: string = "en"): Promise<GrammarCheckResult[]> {
  try {
    const results = await Promise.all(
      texts.map(text => checkGrammar(text, language))
    );
    return results;
  } catch (error) {
    console.error("Batch processing failed:", error);
    throw new Error(`Failed to process batch: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
