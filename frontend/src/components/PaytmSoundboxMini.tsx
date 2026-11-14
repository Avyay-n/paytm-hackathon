import React, { useState } from 'react';
import { Radio, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface PaytmSoundboxMiniProps {
  deviceId?: string;
  heartbeatPct?: number;
  onDoublePressConfirm: () => void;
  isRestructured?: boolean;
  stepDownEdi?: number;
}

export const PaytmSoundboxMini: React.FC<PaytmSoundboxMiniProps> = ({
  deviceId = 'PSB_HYD_9921',
  heartbeatPct = 99.4,
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
      // AudioContext unavailable fallback
    }
  };

  // Indian accented Voice confirmation
  const speakConfirmation = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `Paytm par ₹${stepDownEdi} pratidin Elastic EDI plan safaltapoorvak chalu ho gaya hai!`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleButtonPress = () => {
    const now = Date.now();
    playPaytmChime();

    if (now - lastTapTime < 800) {
      // Double tap confirmed!
      setTapCount(0);
      setFeedback(`✓ Double-Press Confirmed: ₹${stepDownEdi}/day committed!`);
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
            src="/paytm-lsp-badge.png"
            alt="Paytm Soundbox"
            className="h-6 w-auto object-contain rounded"
          />
          <div>
            <span className="font-mono text-xs font-bold text-white block">
              Paytm Soundbox 4.0
            </span>
            <span className="text-[10px] text-cyan-300 font-mono">{deviceId}</span>
          </div>
        </div>

        {/* LED Light & Uptime */}
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
          <span className={`h-2 w-2 rounded-full ${isRestructured ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
          <span className="text-[10px] font-bold text-slate-300">{heartbeatPct}% Live</span>
        </div>
      </div>

      {/* Interactive Soundbox Speaker Grille & Button */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'text-amber-400 animate-bounce' : 'text-cyan-400'}`} />
            <span className="text-[11px] text-slate-200">
              {isPlayingAudio ? 'Playing Chime Announcement...' : '2-Way Hardware Acceptance Rail'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">IoT Event</span>
        </div>

        {/* Tactile Hardware Double-Press Button */}
        <button
          onClick={handleButtonPress}
          disabled={isRestructured}
          className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            isRestructured
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 cursor-default'
              : 'bg-gradient-to-r from-[#00BAF2] to-sky-400 hover:from-sky-400 hover:to-cyan-300 text-[#002970] shadow-cyan-400/30'
          }`}
        >
          {isRestructured ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>✓ Plan Active (₹{stepDownEdi}/day Committed)</span>
            </>
          ) : (
            <>
              <span className="h-3.5 w-3.5 rounded-full bg-[#002970] text-[#00BAF2] text-[10px] flex items-center justify-center font-bold">
                {tapCount > 0 ? '2' : '🔘'}
              </span>
              <span>
                {tapCount > 0
                  ? 'Click Once More to Accept!'
                  : `Double-Press: Confirm ₹${stepDownEdi} EDI`}
              </span>
            </>
          )}
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
