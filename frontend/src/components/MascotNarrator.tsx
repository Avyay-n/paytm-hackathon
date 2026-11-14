import React from 'react';
import { Sparkles, ArrowRight, RotateCcw, Bot, ShieldAlert, CheckCircle, Clock, Volume2 } from 'lucide-react';

interface MascotNarratorProps {
  currentScenario: 'RAMESH' | 'PRIYA' | 'APEX' | 'NIGHT_BLOCK';
  currentStepIndex: number;
  onSelectScenario: (scenario: 'RAMESH' | 'PRIYA' | 'APEX' | 'NIGHT_BLOCK') => void;
  onNextStep: () => void;
  onReset: () => void;
  isProcessing: boolean;
  isSpeaking?: boolean;
}

export const MascotNarrator: React.FC<MascotNarratorProps> = ({
  currentScenario,
  currentStepIndex,
  onSelectScenario,
  onNextStep,
  onReset,
  isProcessing,
  isSpeaking = false,
}) => {
  // Scenario-specific dynamic explanation logic
  const getNarration = () => {
    if (currentScenario === 'NIGHT_BLOCK') {
      return {
        phoneState: 'Merchant phone is silent — no intrusive night calls or harassment messages sent.',
        backendState: 'Node 2 (RBI Fair Practices) actively blocked outreach at 21:30 IST. Logged queue action for 08:05 AM tomorrow.',
        nextAction: 'Slide IST Clock back between 08:00–19:00 IST or click Scenario 1 to test daytime recovery.',
        badge: 'RBI NIGHT BLOCK (21:30 IST)',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      };
    }

    if (currentScenario === 'PRIYA') {
      if (currentStepIndex === 0) {
        return {
          phoneState: 'Priya received a notification asking about her missed ₹400 daily EDI.',
          backendState: 'Node 1 verified ₹6,800/day healthy cash flow. Bank webhook flagged technical server timeout, not merchant distress.',
          nextAction: 'Click "Can you make it ₹50/day?" on phone to test AI guardrails, or click Next Step.',
          badge: 'SCENARIO 2: HEALTHY CASH FLOW',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        };
      }
      return {
        phoneState: 'AI politely declined discount request to protect lender capital, offering 1-click ₹400 retry instead.',
        backendState: 'Node 3 strictly enforced deterministic policy: Healthy volume (>₹5k/day) cannot receive EDI haircut.',
        nextAction: 'Click 1-Click Retry on phone, or switch to Scenario 3 to test chronic default.',
        badge: 'POLICY ENFORCED (NO HAIRCUT)',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      };
    }

    if (currentScenario === 'APEX') {
      return {
        phoneState: 'No automated loan concession offered. Merchant phone shows formal compliance notice & field contact request.',
        backendState: 'Node 1 detected 25 days of zero UPI volume + offline Soundbox. Immediately bypassed Node 3 and triggered Node 5 HITL.',
        nextAction: 'Inspect the generated AI Risk Dossier and allocated DRA field agent assignment in Node 5.',
        badge: 'SCENARIO 3: CHRONIC DORMANT (HITL)',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }

    // Default: RAMESH KIRANA
    if (currentStepIndex === 0) {
      return {
        phoneState: 'Ramesh receives an empathetic Hindi/Telugu WhatsApp message diagnosing his -45% monsoon sales dip.',
        backendState: 'Node 1 ingested 30d UPI data & correlated with Pin Code 500081 peer radar. Genuine localized shock confirmed.',
        nextAction: 'Tap "Haan, ₹150/day confirm kar do ✅" on the phone OR double-press the physical Soundbox button.',
        badge: 'SCENARIO 1: RAMESH KIRANA (-45% DIP)',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      };
    } else {
      return {
        phoneState: 'Ramesh agreed to restructure! Digital RBI Key Fact Statement (KFS) & UPI AutoPay Mandate link delivered.',
        backendState: 'Node 4 executed ACID transaction: SQL loan ledger updated ₹500 ➔ ₹150/day, ₹0 penal interest guaranteed.',
        nextAction: 'Inspect the flashing green row in the SQL database table below, or test Scenario 2.',
        badge: 'SCENARIO 1: LOAN RESTRUCTURED CURED',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
  };

  const narration = getNarration();

  return (
    <div className="rounded-2xl bg-white/5 border border-cyan-500/20 p-4 md:p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#00BAF2]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Mascot & Scenario Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Mascot Avatar & Title */}
        <div className="flex items-center gap-3">
          {/* Animated Glowing Robot / Orb Mascot */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Aura */}
            <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00BAF2] via-sky-400 to-amber-500 opacity-60 blur-sm transition-all duration-700 ${
              isSpeaking ? 'animate-pulse scale-110' : 'animate-pulse'
            }`} />

            {/* Saffron Voice Waveform Ring when Speaking */}
            {isSpeaking && (
              <div className="absolute -inset-2.5 rounded-2xl border-2 border-amber-400/80 animate-ping opacity-75" />
            )}

            <div className="relative h-12 w-12 rounded-2xl bg-[#001D4D] border-2 border-cyan-400/60 flex items-center justify-center shadow-lg overflow-hidden">
              {/* Cute Robot Mascot Face */}
              <div className="flex flex-col items-center justify-center space-y-1">
                {/* Glowing Cyan Eyes */}
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-[#00BAF2] shadow-[0_0_8px_#00BAF2] animate-bounce" style={{ animationDuration: '1.2s' }} />
                  <span className="h-2 w-2 rounded-full bg-[#00BAF2] shadow-[0_0_8px_#00BAF2] animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
                </div>
                {/* Mouth Waveform Line */}
                <div className="flex items-center gap-0.5">
                  <span className={`h-1 w-1 rounded-full ${isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-cyan-300'}`} />
                  <span className={`h-2 w-1 rounded-full ${isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-cyan-300'}`} />
                  <span className={`h-1 w-1 rounded-full ${isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-cyan-300'}`} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-black text-white tracking-wide flex items-center gap-1.5">
                Paytm Sarthi
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-[#00BAF2]/20 text-[#00BAF2] border border-[#00BAF2]/30">
                  AI Narrator
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300">Live Autonomous Copilot Guide & Backend X-Ray</p>
          </div>
        </div>

        {/* Guided Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNextStep}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00BAF2] to-sky-400 hover:from-sky-400 hover:to-cyan-300 text-[#002970] font-black text-xs shadow-lg shadow-[#00BAF2]/20 active:scale-95 transition-all"
          >
            <span>Next Step in Flow</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onReset}
            title="Reset to Initial Archetype State"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Guided Tour Scenario Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-4 text-[11px] font-bold">
        <button
          onClick={() => onSelectScenario('RAMESH')}
          className={`px-2.5 py-1.5 rounded-xl border transition-all text-left truncate flex items-center gap-1.5 ${
            currentScenario === 'RAMESH'
              ? 'bg-[#00BAF2]/20 border-[#00BAF2] text-white shadow-[0_0_12px_rgba(0,186,242,0.3)] font-black'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="truncate">1: Ramesh (-45% Dip)</span>
        </button>

        <button
          onClick={() => onSelectScenario('PRIYA')}
          className={`px-2.5 py-1.5 rounded-xl border transition-all text-left truncate flex items-center gap-1.5 ${
            currentScenario === 'PRIYA'
              ? 'bg-teal-500/20 border-teal-400 text-white shadow-[0_0_12px_rgba(20,184,166,0.3)] font-black'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          <span className="truncate">2: Priya (Healthy Flow)</span>
        </button>

        <button
          onClick={() => onSelectScenario('APEX')}
          className={`px-2.5 py-1.5 rounded-xl border transition-all text-left truncate flex items-center gap-1.5 ${
            currentScenario === 'APEX'
              ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)] font-black'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="truncate">3: Apex (25d Dormant)</span>
        </button>

        <button
          onClick={() => onSelectScenario('NIGHT_BLOCK')}
          className={`px-2.5 py-1.5 rounded-xl border transition-all text-left truncate flex items-center gap-1.5 ${
            currentScenario === 'NIGHT_BLOCK'
              ? 'bg-rose-500/20 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)] font-black'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="truncate">Test Night Block (21:30)</span>
        </button>
      </div>

      {/* Dynamic Sarthi Explanation Speech Bubble */}
      <div className="rounded-xl bg-[#001D4D]/90 border border-cyan-400/30 p-3.5 relative shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Sarthi Live Commentary</span>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${narration.badgeColor}`}>
            {narration.badge}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {/* 1. What is happening on the phone */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 uppercase shrink-0 font-bold">
              Phone UI
            </span>
            <p className="text-slate-200 leading-snug">{narration.phoneState}</p>
          </div>

          {/* 2. Backend processing */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50 uppercase shrink-0 font-bold">
              Backend X-Ray
            </span>
            <p className="text-slate-300 leading-snug">{narration.backendState}</p>
          </div>

          {/* 3. Action prompt */}
          <div className="flex items-start gap-2 pt-1 border-t border-white/10">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 uppercase shrink-0 font-bold">
              Judge Action
            </span>
            <p className="text-amber-200 font-semibold leading-snug">{narration.nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
