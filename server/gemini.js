import { GoogleGenAI, Type } from '@google/genai';

export const studyAssistantSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 to 8 high-impact core takeaways summarizing the input material concisely and clearly.',
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: {
            type: Type.STRING,
            description: 'The front of the flashcard: key term, question, or core concept.',
          },
          back: {
            type: Type.STRING,
            description: 'The back of the flashcard: clear, concise explanation or definition.',
          },
        },
        required: ['front', 'back'],
      },
      description: '5 to 8 high-yield flashcards covering key definitions and principles.',
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: 'Multiple choice question testing comprehension.',
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Array of 4 distinct answer choices.',
          },
          correctAnswer: {
            type: Type.INTEGER,
            description: '0-based index (0, 1, 2, or 3) indicating the correct answer in options.',
          },
          explanation: {
            type: Type.STRING,
            description: 'Clear educational explanation of why the correct option is right.',
          },
        },
        required: ['question', 'options', 'correctAnswer', 'explanation'],
      },
      description: '3 to 5 conceptual multiple-choice questions.',
    },
  },
  required: ['summary', 'flashcards', 'quiz'],
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateStudyMaterial(content) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add a valid Gemini API key to the .env file in the project root.'
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a world-class academic tutor and AI Study Assistant.
Analyze the following study material carefully and generate a comprehensive study aid:
- 5 to 8 core takeaways highlighting key insights.
- 5 to 8 interactive flashcards (front: question/concept, back: concise answer/definition).
- 3 to 5 multiple-choice quiz questions (4 options each, 0-indexed correct answer, with insightful explanations).

Study Material:
"""
${content}
"""`;

  // Candidate models: start with gemini-3.6-flash, gemini-3.5-flash, gemini-3.8-flash, gemini-flash-latest, gemini-2.5-flash
  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash',
  ].filter(Boolean);

  let lastError = null;

  for (const modelName of candidateModels) {
    // Retry up to 3 times per model in case of temporary 503 high demand spike
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Gemini] Attempt ${attempt}: Generating with ${modelName}...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: studyAssistantSchema,
            temperature: 0.2,
          },
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error('No content returned from Gemini model.');
        }

        const data = JSON.parse(responseText);
        console.log(`[Gemini] Successfully generated study package with ${modelName}!`);
        return data;
      } catch (err) {
        lastError = err;
        const msg = err.message || '';
        console.warn(`[Gemini] Model ${modelName} attempt ${attempt} warning: ${msg.slice(0, 120)}`);

        // If 404 (model deprecated / not found for key), break out to try next candidate model
        if (msg.includes('404') || msg.includes('not found') || msg.includes('no longer available')) {
          break;
        }

        // If 503 / 429, wait and retry
        if (attempt < 3 && (msg.includes('503') || msg.includes('429') || msg.includes('high demand'))) {
          await wait(1500 * attempt);
          continue;
        }

        // If it's the last attempt for this model, move to next model
        break;
      }
    }
  }

  throw lastError || new Error('Failed to generate content with available Gemini models.');
}
