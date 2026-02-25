
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Ensure GEMINI_API_KEY is available in the environment
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const getArtistInsight = async (productName: string, description: string): Promise<string> => {
    try {
        const prompt = `You are a poetic art critic. Write a short, ethereal, and insightful paragraph (2-3 sentences) about an artwork titled "${productName}". The piece is described as: "${description}". Do not repeat the title or description. Capture the soul of the piece.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text ?? "A whisper of creativity, frozen in time.";
    } catch (error) {
        console.error("Error fetching artist insight:", error);
        return "Could not retrieve the artist's insight at this time.";
    }
};

export const getMoodRecommendation = async (mood: string): Promise<string> => {
     try {
        const prompt = `Based on the mood "${mood}", what kind of art would be a perfect match? Briefly describe the ideal artwork in one sentence.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text ?? "Art that mirrors the quiet depth of a forest.";
    } catch (error) {
        console.error("Error fetching mood recommendation:", error);
        return "Could not generate a recommendation. Please try again.";
    }
};


export const validateCreativePromoCode = async (code: string): Promise<{ isValid: boolean; discount: number; message: string }> => {
    try {
        const prompt = `Is the word "${code}" an artistic, creative, or ethereal concept (like "dream", "soul", "cosmic", "art", "muse")? Respond with only "YES" or "NO".`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        
        const answer = response.text?.trim().toUpperCase();

        if (answer === 'YES') {
            const discount = 15; // 15% discount for creative codes
            return { isValid: true, discount, message: `"${code}" is a valid creative code! ${discount}% discount applied.` };
        } else {
            return { isValid: false, discount: 0, message: `"${code}" is not a recognized creative code.` };
        }
    } catch (error) {
        console.error("Error validating promo code:", error);
        return { isValid: false, discount: 0, message: "Error validating code. Please try again." };
    }
};


export const refineContactMessage = async (message: string): Promise<string> => {
    try {
        const prompt = `A user wants to send the following message to an art gallery. Refine it to be slightly more formal and professional, while retaining the original intent. Keep it concise.
        
        Original Message: "${message}"
        
        Refined Message:`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text ?? message;
    } catch (error) {
        console.error("Error refining message:", error);
        return message; // Return original message on error
    }
};

export const generateHeroBackground = async (): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: 'A high-resolution, ethereal, and minimalist digital painting of a cosmic nebula with soft pink, deep purple, and golden stardust. The composition should be clean and elegant, suitable as a background for an art gallery website hero section. Soft lighting, cinematic feel.',
                    },
                ],
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                },
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating hero background:", error);
        return null;
    }
};

export const generateGalleryBackground = async (): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: 'A high-resolution, artistic, and sophisticated digital painting of an abstract art gallery space. The style should be minimalist with clean white walls, soft natural lighting, and a few floating, ethereal art pieces in the distance. Subtle hints of cosmic dust and soft pastel colors. Elegant and inspiring background for an art collection page.',
                    },
                ],
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                },
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating gallery background:", error);
        return null;
    }
};
