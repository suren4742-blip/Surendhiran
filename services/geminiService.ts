
import { GoogleGenAI } from "@google/genai";

export const getSpiritualInsight = async (tithi: string, nakshatram: string, lang: string) => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Explain the spiritual and astrological significance of the Tithi "${tithi}" and Nakshatram "${nakshatram}" in Tamil culture. Keep it concise (max 100 words). Return the answer in ${lang === 'ta' ? 'Tamil' : 'English'}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || (lang === 'ta' ? "தகவல் இல்லை." : "No information available.");
  } catch (error) {
    console.error("Error fetching spiritual insight:", error);
    return null;
  }
};

export const generateDeityImage = async (deityName: string) => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const aiImage = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await aiImage.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A divine and majestic portrait of ${deityName}, traditional Tamil iconography style, vibrant colors, intricate details, spiritual aura, gold accents, 4k resolution.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating deity image:", error);
    return null;
  }
};
