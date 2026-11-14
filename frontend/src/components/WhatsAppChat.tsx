import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Lock,
  CheckCheck,
  Check,
  Sparkles,
  Languages,
  Loader2,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Play,
  Pause,
  ShieldCheck,
  Info
} from 'lucide-react';
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

type LangOption = 'en' | 'te' | 'hi';

interface OutgoingMessage {
  id: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
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
  const [selectedLang, setSelectedLang] = useState<LangOption>('en'); // English by default as requested!
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [outgoingMessages, setOutgoingMessages] = useState<OutgoingMessage[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessage, outgoingMessages, kfsDocument]);

  // Formulate text for the 3 languages with high-fidelity fallbacks
  const getLocalizedMessageText = (): string => {
    if (!chatMessage) return '';

    if (selectedLang === 'en') {
      if (chatMessage.english_text) return chatMessage.english_text;
      // If display_text doesn't look like Telugu script, use it
      if (chatMessage.display_text && !/[\u0C00-\u0C7F]/.test(chatMessage.display_text)) {
        return chatMessage.display_text;
      }
      return (
        `Hello ${merchantName}, this is Paytm Recovery Copilot on behalf of SMFG India Credit (Regulated Entity).\n\n` +
        `Our telemetry identified a 45% settlement dip in your Pin Code due to heavy monsoon waterlogging and metro excavation. ` +
        `Over 83% of neighboring Paytm merchants in your 300m cluster experienced this verified regional shock.\n\n` +
        `To protect your cash flow and keep your loan account healthy (preventing SMA-0 from slipping):\n` +
        `• Option A: Step-down EDI to ₹150/day for the next 14 days\n` +
        `• Option B: Self-healing Elastic 10% daily QR collection sweep\n\n` +
        `✓ ₹0.00 Penal Interest & ₹0.00 Bounce Charges (RBI Fair Practices Code).\n` +
        `Regulatory Contact: GRO: Rajesh Nair (SMFG-Paytm Nodal Desk) | 1800-120-9981.`
      );
    }

    if (selectedLang === 'te') {
      if (chatMessage.telugu_text) return chatMessage.telugu_text;
      if (chatMessage.display_text && /[\u0C00-\u0C7F]/.test(chatMessage.display_text)) {
        return chatMessage.display_text;
      }
      return (
        `నమస్కారం ${merchantName} గారు, Paytm Lending & SMFG India Credit (Regulated Entity) నుండి సంప్రదిస్తున్నాము.\n\n` +
        `పిన్ కోడ్ 500081 లో భారీ వర్షాలు మరియు మెట్రో కాలువల పనుల వల్ల మీ వీధిలోని 83% దుకాణాలలో వ్యాపారం తగ్గింది. ` +
        `మీ ప్రస్తుత రోజువారీ EDI ₹500 భారం తగ్గించడానికి, మేము 2 ప్రత్యామ్నాయాలు అందిస్తున్నాము:\n\n` +
        `• ఆప్షన్ A: రాబోయే 14 రోజులకు EDI ని ₹150/రోజు కు తగ్గించడం.\n` +
        `• ఆప్షన్ B: రోజూ వచ్చే QR కలెక్షన్లలో 10% మాత్రమే సర్దుబాటు చేయడం (ఎలాస్టిక్ స్వీప్).\n\n` +
        `✓ RBI నిబంధనల ప్రకారం ₹0.00 అపరాధ వడ్డీ (Penal Charges).\n` +
        `సహాయం కొరకు: GRO: Rajesh Nair (SMFG-Paytm Nodal Desk) | 1800-120-9981.`
      );
    }

    if (selectedLang === 'hi') {
      if (chatMessage.hindi_text) return chatMessage.hindi_text;
      return (
        `नमस्ते ${merchantName} जी, Paytm Lending & SMFG India Credit (Regulated Entity) की तरफ से।\n\n` +
        `पिन कोड 500081 में भारी बारिश और मेट्रो ड्रेनेज काम के कारण आपके क्षेत्र में 83% दुकानों में व्यापार प्रभावित हुआ है। ` +
        `आपकी वर्तमान दैनिक EDI ₹500/दिन का भार कम करने के लिए हम 2 विकल्प दे रहे हैं:\n\n` +
        `• विकल्प A: अगले 14 दिनों के लिए EDI घटाकर ₹150/दिन करना।\n` +
        `• विकल्प B: इलास्टिक QR स्वीप — दैनिक QR कलेक्शन का केवल 10% स्वीप।\n\n` +
        `✓ RBI नियमों के तहत ₹0.00 दंडात्मक ब्याज (Zero Penal Charges).\n` +
        `शिकायत निवारण अधिकारी: GRO: Rajesh Nair (SMFG-Paytm Nodal Desk) | 1800-120-9981.`
      );
    }

    return chatMessage.display_text;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: OutgoingMessage = {
      id: `out_${Date.now()}`,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: 'read',
    };
    setOutgoingMessages((prev) => [...prev, newMsg]);

    onSendCustomMessage(inputText.trim());
    setInputText('');
  };

  const handleOptionClick = (optionId: string, label: string) => {
    const newMsg: OutgoingMessage = {
      id: `out_${Date.now()}`,
      text: `Selected: ${label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: 'read',
    };
    setOutgoingMessages((prev) => [...prev, newMsg]);
    onSelectOption(optionId);
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
            const langCode = selectedLang === 'te' ? 'te-IN' : (selectedLang === 'hi' ? 'hi-IN' : 'en-IN');
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
          const res = await transcribeAudio(undefined, selectedLang === 'te' ? 'te-IN' : 'hi-IN');
          setInputText(res.transcript || (selectedLang === 'te' ? 'ఆప్షన్ A ఆమోదించండి' : 'Option A confirm karo'));
        } finally {
          setIsTranscribing(false);
        }
      }
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#075E54]/30 bg-[#EFEAE2] overflow-hidden shadow-md font-sans">
      {/* ========================================================================= */}
      {/* 1. AUTHENTIC WHATSAPP HEADER (#075E54) */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between bg-[#075E54] px-4 py-2.5 text-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          {/* Avatar with Verified WhatsApp Green Ring */}
          <div className="relative">
            <img
              src="/paytm-circle-logo.png"
              alt="Paytm Profile"
              className="h-10 w-10 rounded-full object-cover bg-white p-0.5 shadow-sm"
            />
            {/* Green Online Dot */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-wide">Paytm Recovery Copilot</h3>
              {/* WhatsApp Official Business Green Checkmark */}
              <span className="flex items-center justify-center h-4 w-4 rounded-full bg-[#25D366] text-white" title="Verified Business">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            </div>
            <p className="text-[11px] text-[#A0E7CB] flex items-center gap-1">
              <span>{businessName}</span>
              <span>•</span>
              <span className="text-[#D1F4E0]">Official Business Account • online</span>
            </p>
          </div>
        </div>

        {/* Right Header Actions & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* 3-Way Language Toggle: English (Default) | Telugu | Hindi */}
          <div className="flex items-center bg-[#054c44] rounded-full p-0.5 border border-white/20 shadow-inner">
            <button
              onClick={() => setSelectedLang('en')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedLang === 'en'
                  ? 'bg-white text-[#075E54] shadow-sm font-bold scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Display in English (Default for demo readability)"
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang('te')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedLang === 'te'
                  ? 'bg-white text-[#075E54] shadow-sm font-bold scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Display in Telugu (తెలుగు)"
            >
              తెలుగు
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedLang === 'hi'
                  ? 'bg-white text-[#075E54] shadow-sm font-bold scale-102'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Display in Hindi (हिंदी)"
            >
              हिंदी
            </button>
          </div>

          {/* Action Icons */}
          <div className="hidden sm:flex items-center gap-3 text-white/90">
            <Video className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
            <Phone className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
            <MoreVertical className="h-4 w-4 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHAT CANVAS WITH WHATSAPP DOODLE WALLPAPER (#EFEAE2) */}
      {/* ========================================================================= */}
      <div
        className="flex-1 space-y-3 overflow-y-auto p-4 relative"
        style={{
          backgroundColor: '#EFEAE2',
          backgroundImage: `radial-gradient(rgba(18, 140, 126, 0.08) 1px, transparent 1px), radial-gradient(rgba(7, 94, 84, 0.06) 1px, #EFEAE2 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      >
        {/* WhatsApp Security / Encryption Notice Badge */}
        <div className="mx-auto max-w-sm rounded-lg bg-[#FFEECD] px-3 py-1.5 text-center text-[10.5px] text-[#54656F] border border-[#F4DEAB] flex items-center justify-center gap-1.5 shadow-2xs">
          <Lock className="h-3 w-3 text-[#54656F] shrink-0" />
          <span>Messages are end-to-end encrypted. No one outside this chat can read them.</span>
        </div>

        {/* Date Divider Pill */}
        <div className="flex justify-center">
          <span className="rounded-md bg-white px-3 py-0.5 text-[10px] font-semibold text-[#54656F] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] uppercase tracking-wider">
            Today
          </span>
        </div>

        {/* Language Indicator Toast */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#128C7E]/10 border border-[#128C7E]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#075E54]">
            <Languages className="h-3 w-3" />
            Showing in: <strong className="font-bold">{selectedLang === 'en' ? 'English (Default)' : selectedLang === 'te' ? 'తెలుగు (Telugu)' : 'हिंदी (Hindi)'}</strong>
            <span className="text-slate-400 text-[9px]">(Use toggle above to switch)</span>
          </span>
        </div>

        {/* INCOMING AI COPILOT MESSAGE BUBBLE */}
        {chatMessage ? (
          <div className="relative max-w-[92%] sm:max-w-[85%] rounded-2xl rounded-tl-none bg-white p-3.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.15)] text-[#111B21]">
            {/* Sender Label */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
              <span className="flex items-center gap-1 text-xs font-bold text-[#075E54]">
                <Sparkles className="h-3.5 w-3.5 text-[#25D366]" />
                ~ Paytm Recovery Copilot (LSP)
              </span>
              <span className="text-[10px] text-[#667781] font-medium">14:02</span>
            </div>

            {/* Message Body (Dynamically switches between English, Telugu, Hindi) */}
            <p className="whitespace-pre-line text-xs text-[#111B21] leading-relaxed select-text font-normal">
              {getLocalizedMessageText()}
            </p>

            {/* WhatsApp Voice Note Audio Player (Sarvam AI Bulbul v4) */}
            <div className="mt-3 rounded-xl bg-[#F0F2F5] p-2.5 border border-[#E0E2E5] flex items-center gap-3">
              <button
                onClick={onPlayVoice}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00A884] hover:bg-[#008f72] text-white shadow-sm transition-transform active:scale-95"
                title={isPlayingVoice ? 'Pause voice message' : 'Play Sarvam AI Indic voice note'}
              >
                {isPlayingVoice ? (
                  <Pause className="h-4 w-4 fill-white" />
                ) : (
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-[#075E54] flex items-center gap-1">
                    <Volume2 className="h-3 w-3 text-[#00A884]" />
                    Sarvam Bulbul v4 Voice Note
                  </span>
                  <span className="text-[10px] text-[#667781] font-mono">0:24</span>
                </div>

                {/* Simulated Audio Waveform Bar */}
                <div className="flex items-center gap-0.5 h-3">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const barHeights = [4, 8, 14, 10, 6, 12, 16, 8, 14, 6, 10, 16, 12, 6, 14, 16, 10, 4, 8, 14, 12, 6, 10, 14, 8, 4, 10, 6];
                    const h = isPlayingVoice ? barHeights[i % barHeights.length] : 4;
                    return (
                      <div
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingVoice ? 'bg-[#00A884]' : 'bg-[#B0B9BE]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <span className="rounded bg-[#075E54]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#075E54]">
                1.0x
              </span>
            </div>

            {/* WhatsApp Business Interactive Action Buttons */}
            {chatMessage.options && !kfsDocument && (
              <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-semibold text-[#667781] uppercase tracking-wider mb-1">
                  Select Restructuring Action:
                </p>
                {chatMessage.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt.id, opt.label)}
                    className="w-full flex items-center justify-between rounded-lg border border-[#25D366]/40 bg-[#E8F8F0] hover:bg-[#D4F4E4] px-3 py-2 text-xs font-semibold text-[#075E54] transition-all shadow-2xs active:scale-98 text-left"
                  >
                    <span>{opt.label}</span>
                    <span className="text-[#00A884] font-bold text-xs">&rarr;</span>
                  </button>
                ))}
              </div>
            )}

            {/* Timestamp and Double Tick for incoming message */}
            <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
              <span>14:02</span>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 italic bg-white/70 rounded-xl max-w-sm mx-auto border border-slate-200">
            Formulating zero-penalty empathetic offer in English & Indic rails...
          </div>
        )}

        {/* OUTGOING MERCHANT REPLIES (WhatsApp Green #D9FDD3) */}
        {outgoingMessages.map((msg) => (
          <div
            key={msg.id}
            className="ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-[#D9FDD3] p-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-[#111B21]"
          >
            <p className="text-xs text-[#111B21] leading-relaxed whitespace-pre-line">{msg.text}</p>
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
              <span>{msg.timestamp}</span>
              <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
            </div>
          </div>
        ))}

        {/* Embedded KFS Card when Restructured */}
        {kfsDocument && (
          <div className="mt-3">
            <KFSMandateCard kfs={kfsDocument} />
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ========================================================================= */}
      {/* 3. AUTHENTIC WHATSAPP INPUT BAR (#F0F2F5) */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2.5 border-t border-[#E0E2E5]"
      >
        {/* Emoji and Attachment Icons */}
        <div className="flex items-center gap-1.5 text-[#54656F]">
          <button
            type="button"
            className="p-1 rounded-full hover:bg-slate-200 text-[#54656F] transition-colors"
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-1 rounded-full hover:bg-slate-200 text-[#54656F] transition-colors"
            title="Attach documents"
          >
            <Paperclip className="h-5 w-5" />
          </button>
        </div>

        {/* Pill Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isRecording
              ? 'Listening with Sarvam Saaras v4 STT...'
              : isTranscribing
              ? 'Transcribing Indic audio...'
              : selectedLang === 'te'
              ? 'తెలుగులో టైప్ చేయండి లేదా మైక్ వాడండి...'
              : selectedLang === 'hi'
              ? 'हिंदी में टाइप करें या माइक का उपयोग करें...'
              : 'Type a message in English or click mic...'
          }
          className="flex-1 rounded-full bg-white px-4 py-2 text-xs text-[#111B21] placeholder:text-[#8696A0] shadow-[0_1px_1px_rgba(0,0,0,0.06)] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#00A884]"
        />

        {/* Circular WhatsApp Green Action Button: Mic or Send */}
        {inputText.trim() ? (
          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00A884] hover:bg-[#008f72] text-white shadow-sm transition-transform active:scale-95"
            title="Send WhatsApp message"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isTranscribing}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-all active:scale-95 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : isTranscribing
                ? 'bg-[#00A884]/40 text-white'
                : 'bg-[#00A884] hover:bg-[#008f72] text-white'
            }`}
            title={
              isRecording
                ? 'Click to stop recording'
                : `Click to speak using Sarvam Saaras v4 (${selectedLang.toUpperCase()})`
            }
          >
            {isTranscribing ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : isRecording ? (
              <MicOff className="h-4 w-4 text-white" />
            ) : (
              <Mic className="h-4 w-4 text-white" />
            )}
          </button>
        )}
      </form>
    </div>
  );
};
