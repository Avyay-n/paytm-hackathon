import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, CheckCircle, Sparkles, Play, RotateCcw } from 'lucide-react';
import { BorderBeam } from './ui/BorderBeam';

interface SoundboxWidgetProps {
  deviceId: string;
  heartbeatPct: number;
  merchantName: string;
  currentEdi: number;
  stepDownEdi: number;
  audioText?: string;
  isPlayingAudio?: boolean;
  onDoubleTapConfirm: () => void;
  onPlayAudio: () => void;
  isRestructured?: boolean;
}

export const SoundboxWidget: React.FC<SoundboxWidgetProps> = ({
  deviceId,
  heartbeatPct,
  merchantName,
  currentEdi,
  stepDownEdi,
  audioText,
  isPlayingAudio = false,
  onDoubleTapConfirm,
  onPlayAudio,
  isRestructured = false,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [buttonFeedback, setButtonFeedback] = useState<string | null>(null);

  // Play synthetic Paytm Soundbox Chime using Web Audio API
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
      // AudioContext unavailable in silent environments
    }
  };

  const handleButtonPress = () => {
    const now = Date.now();
    playPaytmChime();

    if (now - lastTapTime < 700) {
      // Double tap registered!
      setTapCount(0);
      setButtonFeedback('✓ Double-Tap Confirmed: Restructuring to ₹150/day committed!');
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#001844] via-[#002970] to-[#070B14] p-4 text-white shadow-2xl border border-[#00BAF2]/30">
      <BorderBeam colorFrom="#00BAF2" colorTo="#FF6B35" duration={8} />

      {/* Top Soundbox Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          {/* Paytm Brand Logo Badge */}
          <div className="flex items-center gap-1.5 rounded-lg bg-[#00BAF2] px-2.5 py-1 text-xs font-black tracking-tight text-[#002970]">
            <span>paytm</span>
            <span className="text-[10px] font-bold text-white bg-[#002970] px-1 rounded">Soundbox 4.0</span>
          </div>
          <span className="font-mono text-xs text-slate-300">{deviceId}</span>
        </div>

        {/* Heartbeat Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isOnline ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
            <span>{isOnline ? `${heartbeatPct}% Uptime` : 'Offline (0.0%)'}</span>
          </div>
        </div>
      </div>

      {/* Center Soundbox Chassis Visual with Speaker Mesh */}
      <div className="my-3 flex items-center gap-4 rounded-xl bg-slate-950/60 p-3.5 border border-white/5 backdrop-blur-md">
        {/* Pulsing Speaker Cone & LED Ring */}
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#002970] to-slate-900 border-2 border-[#00BAF2]/40 shadow-inner">
          {/* LED Ring */}
          <div className={`absolute inset-1 rounded-xl transition-all duration-300 ${
            isPlayingAudio
              ? 'border-2 border-[#FF6B35] shadow-[0_0_20px_#FF6B35] animate-pulse'
              : isRestructured
              ? 'border-2 border-emerald-400 shadow-[0_0_15px_#10B981]'
              : 'border border-[#00BAF2]/40'
          }`} />

          {/* Perforated Speaker Grill Matrix */}
          <div className="grid grid-cols-4 gap-1 p-2 opacity-70">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  isPlayingAudio
                    ? i % 2 === 0
                      ? 'bg-[#FF6B35]'
                      : 'bg-[#F59E0B]'
                    : isRestructured
                    ? 'bg-emerald-400'
                    : 'bg-[#00BAF2]/40'
                }`}
              />
            ))}
          </div>

          <Radio className={`absolute h-5 w-5 ${isPlayingAudio ? 'text-[#FF6B35] animate-bounce' : 'text-[#00BAF2]'}`} />
        </div>

        {/* Live Audio & Restructure Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide uppercase text-[#00BAF2] flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#FF6B35]" />
              Sarvam AI Indic Voice Rail
            </span>
            <button
              onClick={onPlayAudio}
              className="flex items-center gap-1 rounded bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 text-[#FF6B35] px-2 py-0.5 text-xs font-semibold transition-colors"
            >
              {isPlayingAudio ? <RotateCcw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              <span>{isPlayingAudio ? 'Playing' : 'Replay Voice'}</span>
            </button>
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-slate-300 italic">
            "{audioText || `Paytm par ek sau pachaas rupaye ki revised daily EDI accept karne ke liye button double-tap karein.`}"
          </p>

          {/* Reactive Waveform Bars */}
          <div className="mt-2 flex items-center gap-1 h-4">
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [4, 8, 14, 16, 12, 6, 10, 16, 14, 8, 12, 16, 10, 6, 14, 16, 12, 8, 4, 10, 14, 8, 6, 4];
              const h = isPlayingAudio ? heights[i % heights.length] : 4;
              return (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlayingAudio ? 'bg-gradient-to-t from-[#FF6B35] to-[#F59E0B]' : 'bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Way Tactile Confirmation Hardware Button */}
      <div className="mt-2">
        <button
          onClick={handleButtonPress}
          disabled={!isOnline || isRestructured}
          className={`group relative w-full overflow-hidden rounded-xl py-3 px-4 text-center font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
            isRestructured
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 cursor-default'
              : !isOnline
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#00BAF2] via-[#003B95] to-[#002970] text-white hover:brightness-110 shadow-lg hover:shadow-[#00BAF2]/30 border border-[#00BAF2]'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isRestructured ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Restructuring Active (₹{stepDownEdi}/day Committed)</span>
              </>
            ) : (
              <>
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-white text-[10px] text-[#002970] font-black">
                  {tapCount > 0 ? '2' : '🔘'}
                </span>
                <span>
                  {tapCount > 0
                    ? `Click Once More to Confirm ₹${stepDownEdi}/day EDI!`
                    : `Double-Tap Soundbox Button: Accept ₹${stepDownEdi}/day EDI`}
                </span>
              </>
            )}
          </div>
        </button>

        {buttonFeedback && (
          <p className="mt-1.5 text-center font-mono text-xs text-[#00BAF2] animate-pulse">
            {buttonFeedback}
          </p>
        )}
      </div>
    </div>
  );
};
