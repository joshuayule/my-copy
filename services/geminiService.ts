
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AgentConfig } from "../types";

/**
 * ============================================================================
 * HOW THE AI "THINKS" (The Gemini Service)
 * ============================================================================
 * 
 * This file is the "Engine Room." It handles the logic of merging your design 
 * choices into a format the AI understands.
 * 
 * THE MERGE PROCESS:
 * When you click "Apply," this service takes two separate text boxes:
 * 1. The "System Instruction" (The AI's personality/rules)
 * 2. The "Knowledge Base" (The AI's library of facts)
 * 
 * It glues them together into one long instruction. This is called "Grounding."
 * By putting facts inside the instructions, we tell the AI: 
 * "Before you answer, look at this specific text first."
 */
export class GeminiAgentService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * DATA FLOW: Setting the Stage
   * 
   * This function is triggered when the student clicks the "Apply" button.
   * It takes the config (which contains the instructions and knowledge base)
   * and builds the "System Context."
   */
  public async startNewSession(config: AgentConfig) {
    // STEP 1: Combine the 'Identity' and 'Facts' into one master prompt.
    // We use a separator (---) to help the AI distinguish between rules and data.
    const fullSystemInstruction = `
ROLE & BEHAVIOR (System Instructions):
${config.systemInstruction}

FACTUAL DATA (Knowledge Base):
${config.knowledgeBase}
    `.trim();

    // STEP 2: Send this master prompt to the AI.
    // The AI will now "remember" this for every single message in this session.
    this.chat = this.ai.chats.create({
      model: config.model,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: config.temperature,
      },
    });
  }

  /**
   * DATA FLOW: The Conversation
   * 
   * This sends the user's question to the AI. Because we set the "System Instruction"
   * above, the AI will use those rules to filter its answer.
   */
  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Session not active. Please set configuration first.");
    }

    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "No response received.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiAgentService();
