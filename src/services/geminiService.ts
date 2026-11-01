import type { InterviewQuestion, ParsedResume } from '../types/resume';
import {
  DEFAULT_GEMINI_API_KEY,
  DEFAULT_GROQ_API_KEY,
  DEFAULT_GEMINI_MODEL,
  generateInterviewQuestionsWithCascade,
  testAIConnection
} from './aiService';

export { DEFAULT_GEMINI_API_KEY, DEFAULT_GROQ_API_KEY, DEFAULT_GEMINI_MODEL };

export async function testGeminiApiKey(
  apiKey: string = DEFAULT_GEMINI_API_KEY,
  model: string = DEFAULT_GEMINI_MODEL
): Promise<{ success: boolean; message: string }> {
  return testAIConnection('gemini', apiKey, model);
}

export async function generateInterviewQuestionsWithGemini(
  parsed: ParsedResume,
  geminiKey: string = DEFAULT_GEMINI_API_KEY,
  groqKey: string = DEFAULT_GROQ_API_KEY
): Promise<{ questions: InterviewQuestion[]; usedModel: string }> {
  return generateInterviewQuestionsWithCascade(parsed, true, true, geminiKey, groqKey);
}
