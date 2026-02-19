
/**
 * THE BLUEPRINT (Types)
 * 
 * In computer science, we use "Types" to define the rules for what kind of information 
 * our application is allowed to handle. Think of this file as a dictionary that 
 * ensures everyone (the code and the AI) is speaking the same language.
 */

/**
 * Represents a single piece of a conversation.
 * @param role - Who is speaking? Either the 'user' (student) or the 'model' (AI agent).
 * @param content - The actual text of what was said.
 * @param timestamp - The exact moment the message was created.
 */
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

/**
 * A list of the specific AI "brains" available to use.
 * - 'flash': Fast and responsive, good for simple tasks.
 * - 'pro': Slower but much smarter, good for complex reasoning.
 */
export type GeminiModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-flash-lite-latest';

/**
 * The core settings that define your AI Agent.
 * @param model - Which AI "brain" are we using?
 * @param systemInstruction - The personality, rules, and "prime directive" for the AI.
 * @param knowledgeBase - The specific set of facts the AI should refer to.
 * @param temperature - A setting from 0 to 1 that controls how "creative" or "precise" the AI is.
 */
export interface AgentConfig {
  model: GeminiModel;
  systemInstruction: string;
  knowledgeBase: string;
  temperature: number;
}
