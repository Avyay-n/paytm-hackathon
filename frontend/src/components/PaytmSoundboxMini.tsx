import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, AlertTriangle, Moon } from 'lucide-react';
import { API_BASE } from '../api';

interface PaytmSoundboxMiniProps {
  deviceId?: string;
  heartbeatPct?: number;
  scenario: 'RAMESH' | 'PRIYA' | 'APEX' | 'NIGHT_BLOCK';
  onDoublePressConfirm: () => void;
  isRestructured?: boolean;
  stepDownEdi?: number;
}

export const PaytmSoundboxMini: React.FC<PaytmSoundboxMiniProps> = ({
  deviceId = 'PSB_HYD_9921',
  heartbeatPct = 99.4,
  scenario = 'RAMESH',
  onDoublePressConfirm,
  isRestructured = false,
  stepDownEdi = 150,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Synthesizes the signature Paytm double chime (E6 -> B6 harmonic)
  const playPaytmChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;

      // Note 1: E6 (1318.51 Hz)
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

      // Note 2: B6 (1975.53 Hz)
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
      // AudioContext fallback
    }
  };

  // Indian accented Voice confirmation via Sarvam AI or browser fallback
  const speakConfirmation = async () => {
    const textToAnnounce =
      scenario === 'PRIYA'
        ? 'Paytm par 400 rupaye ka daily settlement safaltapoorvak process ho gaya hai'
        : `Paytm par ${stepDownEdi} rupaye pratidin Elastic EDI plan safaltapoorvak chalu ho gaya hai`;

    try {
      setIsPlayingAudio(true);
      const res = await fetch(`${API_BASE}/sarvam/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnnounce, language_code: 'hi-IN' })
      });
      const data = await res.json();
      if (data.success && data.audio_base64) {
        const audio = new Audio('data:audio/wav;base64,' + data.audio_base64);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
        return;
      }
    } catch {
      // Browser fallback
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToAnnounce);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.lang = 'hi-IN';
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleButtonPress = () => {
    if (scenario === 'APEX' || scenario === 'NIGHT_BLOCK') return;

    const now = Date.now();
    playPaytmChime();

    if (now - lastTapTime < 800) {
      setTapCount(0);
      const msg =
        scenario === 'PRIYA'
          ? '✓ Double-Press Confirmed: ₹400 retry cleared!'
          : `✓ Double-Press Confirmed: ₹${stepDownEdi}/day committed!`;
      setFeedback(msg);
      speakConfirmation();
      onDoublePressConfirm();
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setTapCount(1);
      setLastTapTime(now);
      setFeedback('Press once more to confirm...');
      setTimeout(() => {
        setFeedback(null);
        setTapCount(0);
      }, 1200);
    }
  };

  // Dynamic button labels based on scenario
  const getButtonContent = () => {
    if (scenario === 'NIGHT_BLOCK') {
      return (
        <div className="flex items-center justify-center gap-2 text-rose-300 font-bold">
          <Moon className="h-4 w-4" />
          <span>Outreach Blocked (21:30 IST) • Queued for 08:05 AM</span>
        </div>
      );
    }

    if (scenario === 'APEX') {
      return (
        <div className="flex items-center justify-center gap-2 text-amber-300 font-bold">
          <AlertTriangle className="h-4 w-4" />
          <span>Soundbox Offline • Locked for DRA Field Agent</span>
        </div>
      );
    }

    if (scenario === 'PRIYA') {
      if (isRestructured) {
        return (
          <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>✓ Missed Sweep Cleared (₹400 Paid via 1-Click Retry)</span>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-[#002970] text-[#00BAF2] text-[10px] flex items-center justify-center font-black">
            {tapCount > 0 ? '2' : '🔄'}
          </span>
          <span>
            {tapCount > 0
              ? 'Click Once More to Clear ₹400 Sweep!'
              : 'Double-Press: Retry Missed ₹400 Daily Sweep'}
          </span>
        </div>
      );
    }

    // Default: RAMESH
    if (isRestructured) {
      return (
        <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>✓ Restructuring Active (₹150/day Committed)</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <span className="h-3.5 w-3.5 rounded-full bg-[#002970] text-[#00BAF2] text-[10px] flex items-center justify-center font-black">
          {tapCount > 0 ? '2' : '🔘'}
        </span>
        <span>
          {tapCount > 0
            ? 'Click Once More to Accept ₹150/day Plan!'
            : 'Double-Press: Confirm ₹150/day EDI Plan'}
        </span>
      </div>
    );
  };

  const isButtonDisabled = scenario === 'APEX' || scenario === 'NIGHT_BLOCK' || isRestructured;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#002970] via-[#001D4D] to-[#001433] p-4 text-white shadow-xl border-2 border-cyan-400/40 relative overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10">
      {/* Decorative Speaker Mesh Texture */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-20 pointer-events-none">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-cyan-300" />
          ))}
        </div>
      </div>

      {/* Top Device Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <img
            src="/paytm-circle-logo.png"
            alt="Paytm"
            className="h-7 w-7 object-contain rounded-full bg-white p-0.5 border border-white/20 shadow-xs"
          />
          <div>
            <span className="font-mono text-xs font-bold text-white block">
              Paytm Soundbox 4.0
            </span>
            <span className="text-[10px] text-cyan-300 font-mono">
              {scenario === 'APEX' ? 'OFFLINE_14D' : deviceId}
            </span>
          </div>
        </div>

        {/* LED Light & Uptime */}
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
          <span
            className={`h-2 w-2 rounded-full ${
              scenario === 'APEX' || scenario === 'NIGHT_BLOCK'
                ? 'bg-rose-500'
                : isRestructured
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-cyan-400 animate-pulse'
            }`}
          />
          <span className="text-[10px] font-bold text-slate-300">
            {scenario === 'APEX' ? 'Offline' : `${heartbeatPct}% Live`}
          </span>
        </div>
      </div>

      {/* Interactive Soundbox Speaker Grille & Button */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'text-amber-400 animate-bounce' : 'text-cyan-400'}`} />
            <span className="text-[11px] text-slate-200">
              {isPlayingAudio
                ? 'Playing Chime Announcement...'
                : scenario === 'PRIYA'
                ? '1-Click Settlement Retry Rail'
                : '2-Way Hardware Acceptance Rail'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">IoT Event</span>
        </div>

        {/* Tactile Hardware Double-Press Button */}
        <button
          onClick={handleButtonPress}
          disabled={isButtonDisabled}
          className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 ${
            isButtonDisabled
              ? 'bg-white/10 text-slate-400 border border-white/10 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-[#00BAF2] to-sky-400 hover:from-sky-400 hover:to-cyan-300 text-[#002970] shadow-cyan-400/30'
          }`}
        >
          {getButtonContent()}
        </button>

        {feedback && (
          <p className="text-[11px] text-center font-mono font-bold text-cyan-300 animate-pulse">
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};
