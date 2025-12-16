import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    throw new Error("API Key is missing. Please check your configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates metadata (title, description, tags) for a video based on a representative image frame.
 */
export const generateVideoMetadata = async (base64Image: string): Promise<VideoMetadata> => {
  const ai = getAiClient();

  const prompt = `Analyze this image frame from a video. 
  Create a catchy, SEO-friendly title, a compelling short description (max 2 sentences), 
  and a list of 5 relevant tags (lowercase, single words).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as VideoMetadata;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails
    return {
      title: "Uploaded Video",
      description: "No description generated.",
      tags: ["video", "upload"]
    };
  }
};
