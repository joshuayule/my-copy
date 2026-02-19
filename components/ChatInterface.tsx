
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  isReady: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isGenerating, isReady }) => {
  const [input, setInput] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || !isReady) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa] relative font-sans">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 relative z-10"
      >
        {!isReady && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-10">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center font-bold text-lg">01</div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-widest">Awaiting Setup</h3>
              <p className="text-[9px] font-medium uppercase tracking-tighter">Initialize components to interface.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`px-5 py-4 border rounded-none ${
                msg.role === 'user' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
              <div className="mt-2 px-1 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                {msg.role === 'model' ? 'Agent' : 'User'} — {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="px-5 py-3 bg-white border border-gray-200 flex items-center space-x-3">
              <div className="w-1 h-1 bg-black rounded-full animate-ping"></div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Processing</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-gray-200 bg-white z-20">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isReady || isGenerating}
            placeholder={isReady ? "Input message..." : "System inactive..."}
            className="flex-1 p-3.5 bg-white border border-gray-200 focus:border-black focus:outline-none text-sm transition-all rounded-none"
          />
          <button
            type="submit"
            disabled={!isReady || isGenerating || !input.trim()}
            className="px-8 studio-button text-[10px]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
