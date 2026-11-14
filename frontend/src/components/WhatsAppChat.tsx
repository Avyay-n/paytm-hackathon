import React, { useState } from 'react';
import { Send, Mic, Volume2, ShieldCheck, CheckCheck, Sparkles, Languages } from 'lucide-react';
import { ChatMessage, KFSDocument } from '../types';
import { KFSMandateCard } from './KFSMandateCard';

interface WhatsAppChatProps {
  merchantName: string;
  businessName: string;
  language: string;
  chatMessage: ChatMessage | null;
  kfsDocument: KFSDocument | null;
  onSendCustomMessage: (msg: string) => void;
  onSelectOption: (optionId: string) => void;
  onPlayVoice: () => void;
  isPlayingVoice: boolean;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  merchantName,
  businessName,
  language,
  chatMessage,
  kfsDocument,
  onSendCustomMessage,
  onSelectOption,
  onPlayVoice,
  isPlayingVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [showNativeScript, setShowNativeScript] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendCustomMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-[#0B1120] overflow-hidden shadow-2xl">
      {/* WhatsApp / Paytm Business Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#002970] to-[#00BAF2] text-white font-bold">
            <span>{merchantName.charAt(0)}</span>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">{businessName}</h3>
              <CheckCheck className="h-4 w-4 text-[#00BAF2]" />
            </div>
            <p className="text-[11px] text-slate-400">
              {merchantName} • <span className="text-[#00BAF2]">{language}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
            DPDP VERIFIED
          </span>
          <button
            onClick={() => setShowNativeScript(!showNativeScript)}
            className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-[#FF6B35]" />
            <span>{showNativeScript ? 'Script: Latin' : 'Script: Native'}</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* End-to-End Encryption Notice */}
        <div className="mx-auto max-w-xs rounded-lg bg-slate-950/80 px-3 py-1.5 text-center text-[10px] text-slate-400 border border-slate-800/80 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>Paytm Lending & RBI Fair Practices Encrypted Stream</span>
        </div>

        {/* Incoming Recovery Offer Message Bubble */}
        {chatMessage ? (
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-900 p-4 border border-slate-800/90 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#00BAF2]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6B35]" />
                Paytm Recovery Copilot
              </span>
              <span className="font-mono text-[10px] text-slate-400">14:02 IST</span>
            </div>

            {/* Message Body */}
            <p className="whitespace-pre-line text-xs text-slate-200 leading-relaxed indic-text">
              {showNativeScript && chatMessage.tts_native_text
                ? chatMessage.tts_native_text
                : chatMessage.display_text}
            </p>

            {/* Interactive Sarvam Voice Pill Player */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
              <button
                onClick={onPlayVoice}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#F59E0B] px-3 py-1 text-xs font-bold text-slate-950 hover:brightness-110 transition-all"
              >
                <Volume2 className="h-4 w-4" />
                <span>{isPlayingVoice ? 'Pause Audio' : 'Listen Sarvam Voice'}</span>
              </button>

              {/* Reactive Soundwave Bars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlayingVoice ? `${Math.sin(i * 0.7) * 8 + 12}px` : '4px',
                    }}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPlayingVoice ? 'bg-[#FF6B35]' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <span className="font-mono text-[10px] text-slate-400">
                {chatMessage.audio?.provider || 'Sarvam Bulbul v4'}
              </span>
            </div>

            {/* Quick Action Chips */}
            {chatMessage.options && !kfsDocument && (
              <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                {chatMessage.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onSelectOption(opt.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                      opt.variant === 'cyan'
                        ? 'bg-[#00BAF2] text-[#002970] hover:bg-[#00BAF2]/90 shadow-md'
                        : opt.variant === 'indigo'
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/40'
                        : opt.variant === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 italic">
            Connecting to merchant telemetry and formulating recovery offer...
          </div>
        )}

        {/* Embedded Digital KFS Pass when Restructured */}
        {kfsDocument && (
          <div className="mt-3">
            <KFSMandateCard kfs={kfsDocument} />
          </div>
        )}
      </div>

      {/* Bottom Message Input Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-slate-800 bg-slate-900/90 p-3"
      >
        <button
          type="button"
          onClick={onPlayVoice}
          title="Sarvam AI Speech-to-Text Voice Input"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F59E0B] text-slate-950 hover:brightness-110 active:scale-95"
        >
          <Mic className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Reply to Paytm Lending in ${language}... (e.g. "Haan, Option A confirm karo")`}
          className="flex-1 rounded-xl bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 border border-slate-800 focus:border-[#00BAF2] focus:outline-none"
        />

        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00BAF2] text-[#002970] hover:bg-[#00BAF2]/90 active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
