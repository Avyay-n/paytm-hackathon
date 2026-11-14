import React, { useState } from 'react';
import { Radio, Sparkles, Play, RotateCcw, CheckCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface SoundboxWidgetProps {
  deviceId: string;
  heartbeatPct: number;
  merchantName: string;
  currentEdi: number;
  stepDownEdi: number;
  audioText?: string;
  chatMessage?: ChatMessage | null;
  isPlayingAudio?: boolean;
  onDoubleTapConfirm: () => void;
  onPlayAudio: (textToPlay?: string, langCode?: string) => void;
  isRestructured?: boolean;
}

export const SoundboxWidget: React.FC<SoundboxWidgetProps> = ({
  deviceId,
  heartbeatPct,
  merchantName,
  currentEdi,
  stepDownEdi,
  audioText,
  chatMessage,
  isPlayingAudio = false,
  onDoubleTapConfirm,
  onPlayAudio,
  isRestructured = false,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [buttonFeedback, setButtonFeedback] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en' | 'te' | 'hi'>('en');

  // Compute unclipped localized voice announcement text
  const getLocalizedAudioText = (): string => {
    const nameTe = merchantName.includes('Ramesh')
      ? 'రమేష్ కుమార్'
      : merchantName.includes('Priya')
      ? 'ప్రియా శర్మ'
      : 'విక్రమ్ వర్మ';

    const nameHi = merchantName.includes('Ramesh')
      ? 'रमेश कुमार'
      : merchantName.includes('Priya')
      ? 'प्रिया शर्मा'
      : 'विक्रम वर्मा';

    if (selectedLang === 'te') {
      return (
        chatMessage?.telugu_text ||
        chatMessage?.tts_native_text ||
        `నమస్కారం ${nameTe} గారు, పేటీఎం రికవరీ కోపైలట్ (SMFG India Credit) నుండి. పిన్ కోడ్ 500081 లో భారీ వర్షాల వల్ల మీ వ్యాపారంలో 45% తగ్గుదల గుర్తించాము. మీ లోన్ రోజువారీ EDI భారం ₹500 నుండి ₹${stepDownEdi}/రోజుకు తగ్గించడానికి మీ సౌండ్‌బాక్స్ బటన్‌ను రెండుసార్లు నొక్కండి.`
      );
    }

    if (selectedLang === 'hi') {
      return (
        chatMessage?.hindi_text ||
        `नमस्ते ${nameHi} जी, पेटीएम रिकवरी को-पायलट (SMFG India Credit) की तरफ से। भारी बारिश एवं जलभराव के कारण आपके क्षेत्र में बिक्री में 45% की गिरावट आई है। आपकी दैनिक किस्त घटाकर ₹${stepDownEdi}/दिन करने हेतु अपने साउंडबॉक्स का बटन दो बार दबाएं।`
      );
    }

    // Default English text
    return (
      chatMessage?.english_text ||
      `Hello ${merchantName}, this is Paytm Recovery Copilot on behalf of SMFG India Credit (Regulated Entity). Our telemetry identified a 45% settlement dip in your area due to heavy monsoon waterlogging. To step down your daily EDI to ₹${stepDownEdi}/day, double-tap the Soundbox button.`
    );
  };

  const handlePlayVoice = () => {
    const text = getLocalizedAudioText();
    const langCode = selectedLang === 'te' ? 'te-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
    onPlayAudio(text, langCode);
  };

  const playPaytmChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;

      // Note 1: E6
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1318.51, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: B6 (Paytm melodic signature)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1975.53, now + 0.12);
      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleButtonPress = () => {
    const now = Date.now();
    playPaytmChime();

    if (now - lastTapTime < 700) {
      setTapCount(0);
      setButtonFeedback('✓ Double-Tap Confirmed: Plan committed to database!');
      onDoubleTapConfirm();
      setTimeout(() => setButtonFeedback(null), 3500);
    } else {
      setTapCount(1);
      setLastTapTime(now);
      setButtonFeedback('Tap once more to confirm ₹150/day EDI...');
      setTimeout(() => {
        setButtonFeedback(null);
        setTapCount(0);
      }, 1200);
    }
  };

  const isOnline = heartbeatPct > 50;

  return (
    <div className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/90 via-blue-50/40 to-white p-4 shadow-sm">
      {/* Top Header with Image 2 Logo */}
      <div className="flex items-center justify-between border-b border-blue-100/80 pb-3">
        <div className="flex items-center gap-2">
          <img
            src="/paytm-lsp-badge.png"
            alt="Paytm Soundbox"
            className="h-6 w-auto object-contain rounded"
          />
          <span className="font-mono text-xs text-slate-600 font-bold">Soundbox 4.0 • {deviceId}</span>
        </div>

        {/* Heartbeat Status */}
        <div className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-[#00BAF2] animate-pulse' : 'bg-slate-400'}`} />
          <span className={`text-xs font-bold ${isOnline ? 'text-[#002970]' : 'text-slate-500'}`}>
            {isOnline ? `${heartbeatPct}% Uptime` : 'Offline'}
          </span>
        </div>
      </div>

      {/* Center Soundbox Voice Bar */}
      <div className="my-3 rounded-lg bg-white/95 p-3.5 border border-blue-200 shadow-xs">
        {/* Top bar with Rail Title, 3-Way Language Switcher, and Replay Voice Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100/80 pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#002970] text-white shadow-xs">
              <Radio className={`h-3.5 w-3.5 ${isPlayingAudio ? 'animate-bounce text-[#00BAF2]' : 'text-white'}`} />
            </div>
            <span className="text-[11px] font-bold text-[#002970] flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#00BAF2]" />
              Sarvam AI Voice Rail
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 3-Way Language Toggle: English | Telugu | Hindi */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
              <button
                onClick={() => setSelectedLang('en')}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                  selectedLang === 'en'
                    ? 'bg-[#002970] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Show in English"
              >
                English
              </button>
              <button
                onClick={() => setSelectedLang('te')}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                  selectedLang === 'te'
                    ? 'bg-[#002970] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Show in Telugu (తెలుగు)"
              >
                తెలుగు
              </button>
              <button
                onClick={() => setSelectedLang('hi')}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                  selectedLang === 'hi'
                    ? 'bg-[#002970] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Show in Hindi (हिंदी)"
              >
                हिंदी
              </button>
            </div>

            {/* Replay Voice button */}
            <button
              onClick={handlePlayVoice}
              className="flex items-center gap-1 rounded bg-[#002970] hover:bg-[#003B95] text-white px-2.5 py-1 text-[11px] font-bold transition-colors shadow-xs active:scale-95"
            >
              {isPlayingAudio ? <RotateCcw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              <span>{isPlayingAudio ? 'Playing' : 'Replay Voice'}</span>
            </button>
          </div>
        </div>

        {/* Full Unclipped Voice Announcement Text */}
        <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-line select-text">
          "{getLocalizedAudioText()}"
        </p>

        {/* Clean Reactive Waveform in Paytm Blue */}
        <div className="mt-2.5 flex items-center gap-1 h-3 pt-1 border-t border-slate-100">
          {Array.from({ length: 28 }).map((_, i) => {
            const heights = [3, 6, 12, 14, 10, 5, 8, 14, 12, 6, 10, 14, 8, 4, 12, 14, 10, 6, 3, 8];
            const h = isPlayingAudio ? heights[i % heights.length] : 3;
            return (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlayingAudio ? 'bg-[#00BAF2]' : 'bg-slate-300'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Double-Tap Hardware Confirmation Button in Paytm Deep Navy */}
      <div>
        <button
          onClick={handleButtonPress}
          disabled={!isOnline || isRestructured}
          className={`w-full rounded-lg py-2.5 px-4 text-center font-bold text-xs transition-all shadow-sm ${
            isRestructured
              ? 'bg-blue-50 text-[#002970] border border-blue-300 cursor-default'
              : !isOnline
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-[#002970] hover:bg-[#003B95] text-white active:scale-[0.99]'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isRestructured ? (
              <>
                <CheckCircle className="h-4 w-4 text-[#00BAF2]" />
                <span>Restructuring Active (₹{stepDownEdi}/day Committed)</span>
              </>
            ) : (
              <>
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#00BAF2] text-[9px] text-[#002970] font-black">
                  {tapCount > 0 ? '2' : '🔘'}
                </span>
                <span>
                  {tapCount > 0
                    ? `Click Once More to Confirm ₹${stepDownEdi}/day Plan!`
                    : `Double-Tap Soundbox Button: Accept ₹${stepDownEdi}/day Plan`}
                </span>
              </>
            )}
          </div>
        </button>

        {buttonFeedback && (
          <p className="mt-1.5 text-center font-mono text-xs text-[#002970] font-semibold animate-pulse">
            {buttonFeedback}
          </p>
        )}
      </div>
    </div>
  );
};
