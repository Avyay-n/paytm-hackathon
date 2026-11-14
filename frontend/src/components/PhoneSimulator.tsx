import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  CheckCheck,
  Check,
  ShieldCheck,
  Play,
  Pause,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { Merchant, Loan, ChatMessage, KFSDocument, HITLDossier } from '../types';

interface PhoneSimulatorProps {
  merchant: Merchant;
  loan: Loan;
  chatMessage: ChatMessage | null;
  kfsDocument: KFSDocument | null;
  hitlDossier?: HITLDossier | null;
  isCured: boolean;
  onSendCustomMessage: (msg: string) => void;
  onSelectActionChip: (chipText: string) => void;
  onPlayVoice: (text?: string, lang?: string) => void;
  isPlayingVoice: boolean;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  merchant,
  loan,
  chatMessage,
  kfsDocument,
  hitlDossier,
  isCured,
  onSendCustomMessage,
  onSelectActionChip,
  onPlayVoice,
  isPlayingVoice,
}) => {
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HINGLISH' | 'TELUGU'>('HINGLISH');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [localMessages, setLocalMessages] = useState<Array<{ id: string; sender: 'agent' | 'user'; text: string; time: string }>>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Synchronize language with merchant initial preference
  useEffect(() => {
    if (merchant.preferred_language.toLowerCase().includes('telugu')) {
      setSelectedLang('TELUGU');
    } else if (merchant.preferred_language.toLowerCase().includes('english')) {
      setSelectedLang('EN');
    } else {
      setSelectedLang('HINGLISH');
    }
  }, [merchant.id]);

  // Compute localized agent message
  const getAgentSpeechText = (): string => {
    if (selectedLang === 'TELUGU') {
      return (
        chatMessage?.telugu_text ||
        `నమస్కారం ${merchant.name} గారు 🙏 పేటీఎం రికవరీ కోపైలట్ (SMFG India Credit) నుండి. పిన్ కోడ్ ${merchant.pin_code} లో భారీ వర్షాలు మరియు రోడ్డు పనుల వల్ల మీ వ్యాపారంలో 45% అమ్మకాలు తగ్గినట్లు మా సిస్టమ్ గుర్తించింది. మీకు ఎలాంటి పెనాల్టీ పడకుండా ఉండేందుకు, మీ రోజువారీ EMI ని ₹${loan.original_daily_edi} నుండి ₹${loan.min_allowed_edi} కి 14 రోజుల పాటు తగ్గిస్తున్నాము. దీన్ని ఆమోదించమంటారా?`
      );
    }
    if (selectedLang === 'HINGLISH') {
      return (
        chatMessage?.hindi_text ||
        `Namaste ${merchant.name} ji 🙏 Humne dekha ki pichle 7 dino mein road construction ki wajah se aapke Paytm QR collections 45% kam hue hain (₹4,200 se ₹2,310/day). Aap par koi penalty na lage, isliye hum aapka ₹${loan.original_daily_edi}/day EDI agle 14 dino ke liye ₹${loan.min_allowed_edi}/day (Elastic 10% QR sweep) kar sakte hain. Kya main ise लागू (apply) kar doon?`
      );
    }
    return (
      chatMessage?.english_text ||
      `Hello ${merchant.name}, this is Paytm Recovery Copilot on behalf of ${loan.lender_nbfc_partner}. Our telemetry identified a 45% settlement dip in your area. To protect your credit score with zero penalties, we can lower your daily EDI from ₹${loan.original_daily_edi} to ₹${loan.min_allowed_edi}/day for 14 days. Shall I apply this?`
    );
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg = inputText.trim();
    setLocalMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: msg, time: '14:02' }
    ]);
    setInputText('');
    onSendCustomMessage(msg);
  };

  const handleChipClick = (text: string) => {
    setLocalMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text, time: '14:02' }
    ]);
    onSelectActionChip(text);
  };

  const handleVoiceToggle = () => {
    const text = getAgentSpeechText();
    const langCode = selectedLang === 'TELUGU' ? 'te-IN' : selectedLang === 'HINGLISH' ? 'hi-IN' : 'en-IN';
    onPlayVoice(text, langCode);
  };

  // Scroll chat within container
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [localMessages, isCured, hitlDossier]);

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] rounded-[48px] bg-slate-900 p-3.5 shadow-2xl border-[6px] border-slate-800 shadow-slate-900/40 select-none overflow-hidden flex flex-col justify-between">
      {/* Phone Screen Inner Container */}
      <div className="relative w-full h-full rounded-[38px] bg-[#EFEAE2] overflow-hidden flex flex-col justify-between border border-slate-700/30">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <span className="h-2 w-2 rounded-full bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue-950/80 border border-blue-500/40" />
        </div>

        {/* 1. Status Bar */}
        <div className="bg-[#002970] text-white pt-2 pb-1 px-6 flex items-center justify-between text-[11px] font-bold z-20">
          <span>14:02</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* 2. WhatsApp / Paytm for Business Header */}
        <div className="bg-[#002970] text-white px-3 py-2 flex items-center justify-between shadow-md z-20 border-b border-blue-900/60">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-white text-[#002970] font-black text-sm flex items-center justify-center shadow-sm">
                {merchant.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold leading-tight truncate max-w-[150px]">
                  {merchant.business_name}
                </h3>
                <Check className="h-3 w-3 text-[#00BAF2]" />
              </div>
              <span className="text-[10px] text-blue-200 block leading-none">
                {loan.lender_nbfc_partner} • {loan.sma_status}
              </span>
            </div>
          </div>

          {/* Quick Language Pill Switcher */}
          <div className="flex items-center rounded-lg bg-black/30 p-0.5 border border-white/20 text-[10px] font-bold">
            <button
              onClick={() => setSelectedLang('EN')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                selectedLang === 'EN' ? 'bg-[#00BAF2] text-[#002970] font-black' : 'text-slate-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setSelectedLang('HINGLISH')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                selectedLang === 'HINGLISH' ? 'bg-[#00BAF2] text-[#002970] font-black' : 'text-slate-300'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setSelectedLang('TELUGU')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                selectedLang === 'TELUGU' ? 'bg-[#00BAF2] text-[#002970] font-black' : 'text-slate-300'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* 3. Interactive Chat Area */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-3 relative z-10 text-xs"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        >
          {/* Security & Regulatory Notice Pill */}
          <div className="text-center my-1">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FFF8E7] text-[#8C6D1F] text-[10px] font-semibold border border-[#EADBBD] shadow-xs">
              🔒 End-to-end encrypted • RBI LSP Recovery Mandate
            </span>
          </div>

          {/* Proactive Agent Message Bubble */}
          <div className="flex flex-col items-start max-w-[90%]">
            <div className="rounded-2xl rounded-tl-none bg-white p-3 text-slate-800 shadow-sm border border-slate-200 space-y-2">
              {/* Agent Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-bold text-[#002970] flex items-center gap-1">
                  Paytm Recovery Copilot
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                </span>
                <span className="text-[9px] text-slate-400">14:00</span>
              </div>

              {/* Message Text */}
              <p className="text-[12px] leading-relaxed select-text font-medium text-slate-800 whitespace-pre-line">
                {getAgentSpeechText()}
              </p>

              {/* Sarvam AI 16-bar Voice Note Bar */}
              <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/80 rounded-xl p-2 flex items-center justify-between">
                <button
                  onClick={handleVoiceToggle}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#002970] text-white text-[11px] font-bold hover:bg-[#003B95] active:scale-95 transition-all shadow-xs"
                >
                  {isPlayingVoice ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>{isPlayingVoice ? 'Pause' : 'Voice Note'}</span>
                </button>

                {/* 16-Bar Waveform */}
                <div className="flex items-center gap-0.5 h-3">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const heights = [3, 8, 12, 14, 9, 4, 11, 14, 10, 6, 12, 14, 8, 5, 9, 3];
                    const h = isPlayingVoice ? heights[i % heights.length] : 3;
                    return (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingVoice ? 'bg-[#00BAF2]' : 'bg-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>

                <span className="text-[9px] font-mono text-slate-400">0:18</span>
              </div>
            </div>
          </div>

          {/* User Outgoing Messages */}
          {localMessages.map((msg) => (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="rounded-2xl rounded-tr-none bg-[#DCF8C6] p-2.5 text-slate-900 shadow-sm border border-emerald-200/60 max-w-[85%]">
                <p className="text-[12px] leading-relaxed select-text font-medium">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-slate-500">
                  <span>{msg.time}</span>
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>
          ))}

          {/* Digital Key Fact Statement (KFS) Card upon Restructure */}
          {isCured && (
            <div className="rounded-2xl bg-white p-3 border-2 border-emerald-400 shadow-md space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>RBI Key Fact Statement (KFS)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  SEALED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Daily Settlement Sweep</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span className="text-emerald-700 font-black">₹{loan.min_allowed_edi}/day</span>
                    <span className="line-through text-slate-400 text-[9px]">₹{loan.original_daily_edi}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Relief Tenure</span>
                  <span className="font-bold text-slate-800">14 Days Elastic</span>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Penal Interest</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Waived)</span>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">UPI Mandate</span>
                  <span className="font-mono text-[9px] text-[#002970] truncate block">paytmlending@okaxis</span>
                </div>
              </div>

              <div className="pt-1 text-[9px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
                <span>Grievance Officer: 1800-120-130</span>
                <span className="text-[#002970] font-bold">AutoPay Active</span>
              </div>
            </div>
          )}

          {/* HITL Escalation Notice Card for Scenario 3 */}
          {hitlDossier && (
            <div className="rounded-2xl bg-amber-50 p-3 border-2 border-amber-400 shadow-md space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Account Assigned to Field Agent</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Due to 25 consecutive days of zero QR settlements, your case has been transferred to authorized DRA Recovery Officer <strong>{hitlDossier.rbi_dra_assignment.allocated_officer}</strong>.
              </p>
              <div className="text-[9px] text-amber-700 border-t border-amber-200/80 pt-1 flex items-center justify-between">
                <span>Permitted Window: {hitlDossier.rbi_dra_assignment.visit_window_permitted}</span>
                <span className="font-bold text-amber-900">Body-Cam Mandatory</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Action Chips & Free-Play Input Bar */}
        <div className="bg-white p-2.5 border-t border-slate-200 z-20 space-y-2">
          {/* Quick-Tap Action Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px] font-bold">
            <button
              onClick={() => handleChipClick('Haan, ₹150/day confirm kar do ✅')}
              className="px-2.5 py-1 rounded-full bg-blue-50 text-[#002970] border border-blue-200 hover:bg-blue-100 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              Haan, ₹150/day confirm kar do ✅
            </button>
            <button
              onClick={() => handleChipClick('Can you make it ₹50/day?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              Can you make it ₹50/day?
            </button>
            <button
              onClick={() => handleChipClick('Why did my EDI fail?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              Why did my EDI fail?
            </button>
            <button
              onClick={() => handleChipClick('My shop is permanently closed 🚨')}
              className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              My shop is closed 🚨
            </button>
          </div>

          {/* Custom Text Input & Hold-to-Speak Mic Button */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type or test custom question..."
              className="flex-1 bg-slate-100 text-slate-800 rounded-full px-3.5 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-[#002970] placeholder-slate-400"
            />

            <button
              onClick={() => setIsRecording(!isRecording)}
              title="Sarvam AI Speech-to-Text"
              className={`p-2 rounded-full transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-[#002970] text-white hover:bg-[#003B95] disabled:opacity-40 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
