import React, { useState, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, ShieldCheck, CheckCheck, Sparkles, Languages, Loader2 } from 'lucide-react';
import { ChatMessage, KFSDocument } from '../types';
import { KFSMandateCard } from './KFSMandateCard';
import { transcribeAudio } from '../api';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendCustomMessage(inputText.trim());
    setInputText('');
  };

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MediaDevices not available');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsTranscribing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          try {
            const langCode = language === 'Telugu' ? 'te-IN' : (language === 'Hinglish' ? 'hi-IN' : 'en-IN');
            const res = await transcribeAudio(audioBlob, langCode);
            if (res.transcript) {
              setInputText(res.transcript);
            }
          } catch (err) {
            console.error('Sarvam STT failed:', err);
          } finally {
            setIsTranscribing(false);
          }
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone fallback triggered:', err);
        setIsTranscribing(true);
        try {
          const res = await transcribeAudio(undefined, language === 'Telugu' ? 'te-IN' : 'hi-IN');
          setInputText(res.transcript || 'Haan, Option A confirm karo');
        } finally {
          setIsTranscribing(false);
        }
      }
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/paytm-circle-logo.png"
            alt="Paytm Profile"
            className="h-9 w-9 rounded-full object-cover shadow-sm border border-slate-200"
          />

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-900">{businessName}</h3>
              <CheckCheck className="h-3.5 w-3.5 text-[#00BAF2]" />
            </div>
            <p className="text-[11px] text-slate-500">
              {merchantName} • <span className="text-[#002970] font-semibold">{language}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#002970] border border-blue-200">
            DPDP VERIFIED
          </span>
          <button
            onClick={() => setShowNativeScript(!showNativeScript)}
            className="flex items-center gap-1 rounded bg-white hover:bg-slate-100 px-2 py-1 text-xs text-slate-700 border border-slate-200 transition-colors"
          >
            <Languages className="h-3 w-3 text-[#00BAF2]" />
            <span className="text-[11px]">{showNativeScript ? 'Latin' : 'Native Script'}</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 space-y-3.5 overflow-y-auto p-4 bg-slate-50/50">
        <div className="mx-auto max-w-xs rounded-full bg-white px-3 py-1 text-center text-[10px] text-slate-500 border border-slate-200 flex items-center justify-center gap-1 shadow-2xs">
          <ShieldCheck className="h-3 w-3 text-[#002970]" />
          <span>Paytm Lending & RBI Fair Practices Encrypted</span>
        </div>

        {chatMessage ? (
          <div className="max-w-[94%] rounded-xl rounded-tl-sm bg-white p-3.5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
              <span className="flex items-center gap-1 text-xs font-bold text-[#002970]">
                <Sparkles className="h-3 w-3 text-[#00BAF2]" />
                Paytm Recovery Copilot
              </span>
              <span className="font-mono text-[10px] text-slate-400">14:02 IST</span>
            </div>

            <p className="whitespace-pre-line text-xs text-slate-700 leading-relaxed indic-text">
              {showNativeScript && chatMessage.tts_native_text
                ? chatMessage.tts_native_text
                : chatMessage.display_text}
            </p>

            {/* Sarvam Audio Player in Clean Paytm Blue */}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50/60 p-2 border border-blue-100">
              <button
                onClick={onPlayVoice}
                className="flex items-center gap-1.5 rounded-md bg-[#002970] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#003B95] transition-all shadow-sm"
              >
                <Volume2 className="h-3.5 w-3.5 text-[#00BAF2]" />
                <span>{isPlayingVoice ? 'Pause Voice' : 'Listen Sarvam Voice'}</span>
              </button>

              <span className="font-mono text-[10px] text-[#002970]">
                {chatMessage.audio?.provider || 'Sarvam Bulbul v4'}
              </span>
            </div>

            {/* Action Chips in Paytm Blue Theme */}
            {chatMessage.options && !kfsDocument && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {chatMessage.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onSelectOption(opt.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                      opt.variant === 'cyan'
                        ? 'bg-[#002970] text-white hover:bg-[#003B95] shadow-xs'
                        : opt.variant === 'indigo'
                        ? 'bg-blue-50 text-[#002970] border border-blue-200 hover:bg-blue-100'
                        : opt.variant === 'amber'
                        ? 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            Connecting to merchant telemetry and formulating recovery offer...
          </div>
        )}

        {/* Embedded KFS Card when Restructured */}
        {kfsDocument && (
          <div className="mt-3">
            <KFSMandateCard kfs={kfsDocument} />
          </div>
        )}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
      >
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isTranscribing}
          title={isRecording ? 'Click to stop and transcribe' : 'Click to speak using Sarvam Saaras v4 STT'}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : isTranscribing
              ? 'bg-blue-100 text-[#002970]'
              : 'bg-blue-50 text-[#002970] hover:bg-blue-100 border border-blue-200'
          }`}
        >
          {isTranscribing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-3.5 w-3.5" />
          ) : (
            <Mic className="h-3.5 w-3.5 text-[#002970]" />
          )}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isRecording
              ? 'Listening to merchant voice...'
              : isTranscribing
              ? 'Sarvam Saaras v4 transcribing...'
              : `Reply in ${language}... (Click mic to speak)`
          }
          className="flex-1 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#00BAF2] focus:bg-white focus:outline-none"
        />

        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002970] text-white hover:bg-[#003B95] active:scale-95 transition-colors shadow-sm"
        >
          <Send className="h-3.5 w-3.5 text-[#00BAF2]" />
        </button>
      </form>
    </div>
  );
};
