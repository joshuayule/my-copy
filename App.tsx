
import React, { useState, useCallback } from 'react';
import ConfigPanel from './components/ConfigPanel';
import ChatInterface from './components/ChatInterface';
import { AgentConfig, Message } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<AgentConfig>({
    model: 'gemini-3-flash-preview',
    systemInstruction: `PURPOSE:
Describe what the assistant exists to help with.

CONTEXT ASSUMPTIONS:
What is assumed about the user and environment?

BOUNDARIES:
What does the assistant not cover or decide?

MISUSE TO AVOID:
What should the assistant not encourage or enable?

PREREQUISITES:
What is the user expected to already know?`,
    knowledgeBase: `State known facts as standalone declarations.
Include explicit "does not cover" statements for specific topics.
Preserve technical data or definitions verbatim.`,
    temperature: 0,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleApplyConfig = useCallback(async () => {
    setIsApplying(true);
    try {
      await geminiService.startNewSession(config);
      setIsReady(true);
      setMessages([]); 
    } catch (error) {
      alert("Configuration failed. Please check your connection.");
    } finally {
      setIsApplying(false);
    }
  }, [config]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await geminiService.sendMessage(text);
      const modelMsg: Message = {
        role: 'model',
        content: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errMsg: Message = {
        role: 'model',
        content: "Error: The connection to the agent was lost.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col md:flex-row h-full">
        {/* LEFT SIDE: Workbench */}
        <aside className="w-full md:w-[400px] lg:w-[450px] h-[50%] md:h-full z-30 flex flex-col border-r border-[#ddd]">
          <ConfigPanel 
            config={config} 
            onChange={setConfig} 
            onApply={handleApplyConfig}
            isApplying={isApplying}
          />
        </aside>

        {/* RIGHT SIDE: Testing Ground */}
        <main className="flex-1 h-[50%] md:h-full bg-[#f9f9f9]">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isGenerating={isGenerating}
            isReady={isReady}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
