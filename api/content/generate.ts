import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import type { ContentGenerationRequest, ContentGenerationResult, ContentType, MoodType, Platform } from "../../shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MOOD_DESCRIPTIONS = {
  professional: "formal, business-appropriate tone",
  casual: "relaxed, informal tone", 
  friendly: "warm, approachable tone",
  confident: "assertive, self-assured tone",
  enthusiastic: "energetic, excited tone",
  grateful: "appreciative, thankful tone"
};

const PLATFORM_GUIDELINES = {
  linkedin: {
    maxLength: 3000,
    style: "Professional networking platform. Use hashtags strategically. Focus on career insights, industry news, professional achievements.",
    format: "Can include line breaks, bullet points, and professional hashtags"
  },
  instagram: {
    maxLength: 2200,
    style: "Visual storytelling platform. Use engaging hashtags. Focus on lifestyle, behind-the-scenes, visual content.",
    format: "Can include emojis, trending hashtags, and engaging captions"
  },
  twitter: {
    maxLength: 280,
    style: "Concise, engaging microblogging. Use trending hashtags. Be direct and impactful.",
    format: "Must be under 280 characters. Include relevant hashtags and mentions"
  },
  reddit: {
    maxLength: 3500,
    style: "Authentic, conversational community discussion. Use Reddit culture and terminology. Be genuine and add value.",
    format: "Can include markdown formatting, links, and detailed explanations"
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const request = req.body as ContentGenerationRequest;
    
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
}

async function generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
  const { text, contentType, platform, mood, language = "en", charLimit } = request;

  let prompt = "";
  
  switch (contentType) {
    case "grammar":
      prompt = `Fix the grammar, spelling, and punctuation errors in this text and return ONLY the corrected version. Do not include any explanations, quotes, or additional text:\n\n${text}`;
      break;
      
    case "linkedin":
      prompt = generateSocialMediaPrompt(text, "linkedin", mood, charLimit);
      break;
      
    case "instagram":
      prompt = generateSocialMediaPrompt(text, "instagram", mood, charLimit);
      break;
      
    case "twitter":
      prompt = generateSocialMediaPrompt(text, "twitter", mood, charLimit);
      break;
      
    case "reddit":
      prompt = generateSocialMediaPrompt(text, "reddit", mood, charLimit);
      break;
      
    case "comment-reply":
      if (!platform) throw new Error("Platform is required for comment replies");
      prompt = generateCommentReplyPrompt(text, platform, mood);
      break;
      
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: contentType === "grammar" ? {
        systemInstruction: "You are a grammar correction tool. Return only the corrected text with no explanations, quotes, or additional commentary.",
      } : undefined,
    });

    let generatedContent = response.text || "";
    
    // For grammar corrections, clean up any unwanted formatting
    if (contentType === "grammar") {
      generatedContent = generatedContent
        .replace(/^Here's the corrected version:\s*/i, '')
        .replace(/^Corrected:\s*/i, '')
        .replace(/^The corrected text is:\s*/i, '')
        .replace(/^"/, '')
        .replace(/"$/, '')
        .trim();
    }
    
    return {
      generatedContent,
      contentType,
      platform,
      mood
    };
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error(`Failed to generate ${contentType} content: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

function generateSocialMediaPrompt(text: string, platform: keyof typeof PLATFORM_GUIDELINES, mood?: MoodType, charLimit?: number): string {
  const guidelines = PLATFORM_GUIDELINES[platform];
  const moodDesc = mood ? MOOD_DESCRIPTIONS[mood] : "natural, appropriate tone";
  const maxLength = charLimit || guidelines.maxLength;
  
  return `Create a ${platform} caption based on this input text: "${text}"

Platform Guidelines:
- ${guidelines.style}
- Maximum length: ${maxLength} characters
- Format: ${guidelines.format}

Writing Style:
- Use ${moodDesc}
- Make it engaging and platform-appropriate
- Include relevant hashtags for ${platform}
- Ensure it's authentic and valuable to the audience
- Keep it under ${maxLength} characters

Return only the final caption without any explanations or additional text.`;
}

function generateCommentReplyPrompt(text: string, platform: Platform, mood?: MoodType): string {
  const moodDesc = mood ? MOOD_DESCRIPTIONS[mood] : "professional and helpful tone";
  
  const platformContext = platform === "reddit" ? 
    "Reddit comment or post" : 
    `${platform} comment`;
  
  return `Generate a thoughtful reply to this ${platformContext}: "${text}"

Guidelines:
- Use ${moodDesc}
- Be authentic and engaging
- Keep it concise but meaningful
- Match the platform's communication style
- Be respectful and add value to the conversation
${platform === "reddit" ? "- Use Reddit's conversational style and terminology" : ""}

Return only the reply text without any explanations or additional formatting.`;
} 