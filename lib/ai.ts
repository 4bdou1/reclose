import { GoogleGenAI, Type } from '@google/genai';

export interface ParsedTask {
  task: string;
  status: string;
  priority: string;
  deadline: string;
}

export async function parseTaskFromText(text: string, apiKey: string): Promise<ParsedTask | null> {
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error('Please set a valid GEMINI_API_KEY in your .env.local file to use the AI Task Manager.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an intelligent project manager. Your job is to extract task details from a natural language request.
    Extract the following information:
    - task: The clean, action-based objective (remove filler words, keep it concise).
    - priority: Must be exactly "High", "Medium", or "Low" (infer from urgency words like "important", "ASAP", etc.). If unknown, default to "Medium".
    - deadline: Determine the exact date mentioned. If it says "Friday" or "tomorrow", return a YYYY-MM-DD date assuming today is ${new Date().toISOString().split('T')[0]}. If no date is found, leave empty string "".
    
    The user's raw input is: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            priority: { type: Type.STRING },
            deadline: { type: Type.STRING },
          },
          required: ['task', 'priority', 'deadline']
        }
      }
    });

    const resultText = response.text();
    if (!resultText) return null;

    const data = JSON.parse(resultText);
    
    return {
      task: data.task || text,
      status: 'Not Started',
      priority: data.priority || 'Medium',
      deadline: data.deadline || '',
    };
  } catch (error) {
    console.error('Failed to parse task using Gemini:', error);
    throw new Error('Failed to connect to the AI model.');
  }
}
