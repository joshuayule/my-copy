
import React from 'react';
import { AgentConfig } from '../types';

interface ConfigPanelProps {
  config: AgentConfig;
  onChange: (newConfig: AgentConfig) => void;
  onApply: () => void;
  isApplying: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange, onApply, isApplying }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...config,
      [name]: name === 'temperature' ? parseFloat(value) : value
    });
  };

  return (
    <div className="flex flex-col h-full p-8 bg-white overflow-y-auto space-y-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Agent Studio</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Component Config</p>
      </div>

      <div className="space-y-8">
        {/* MODEL SELECTION */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest block">Model Selection</label>
          <select
            name="model"
            value={config.model}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm rounded-none"
          >
            <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
          </select>
        </div>

        {/* SYSTEM INSTRUCTIONS */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest block">System Instructions</label>
          <textarea
            name="systemInstruction"
            value={config.systemInstruction}
            onChange={handleChange}
            placeholder="Define behavioral artifacts..."
            className="w-full h-52 p-4 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm leading-relaxed resize-none rounded-none"
          />
        </div>

        {/* KNOWLEDGE BASE */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest block">Knowledge Base</label>
          <textarea
            name="knowledgeBase"
            value={config.knowledgeBase}
            onChange={handleChange}
            placeholder="Input authoritative data..."
            className="w-full h-44 p-4 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm leading-normal resize-none rounded-none"
          />
        </div>

        {/* TEMPERATURE */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase tracking-widest">Temperature</label>
            <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5">{config.temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            name="temperature"
            min="0"
            max="1"
            step="0.01"
            value={config.temperature}
            onChange={handleChange}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
            <span>Deterministic</span>
            <span>Stochastic</span>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-8">
        <button
          onClick={onApply}
          disabled={isApplying}
          className="w-full py-4 studio-button text-[10px]"
        >
          {isApplying ? 'Initializing...' : 'Set Components'}
        </button>
      </div>
    </div>
  );
};

export default ConfigPanel;
