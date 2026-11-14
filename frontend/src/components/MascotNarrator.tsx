import React from 'react';
import { Sparkles, ArrowRight, RotateCcw, Bot, CheckCircle2, Shield, Clock, Volume2 } from 'lucide-react';

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
  const getNarration = () => {
    if (currentScenario === 'NIGHT_BLOCK') {
      return {
        phoneState: 'Merchant phone is silent — zero automated calls or WhatsApp messages sent.',
        backendState: 'Node 2 (RBI Fair Practices) blocked outreach at 21:30 IST. Logged queue action for 08:05 AM tomorrow.',
        nextAction: 'Slide the IST Clock slider back between 08:00–19:00 IST to resume active daytime recovery.',
        badge: 'RBI NIGHT BLOCK (21:30 IST)',
        badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        dotColor: 'bg-rose-400',
      };
    }

    if (currentScenario === 'PRIYA') {
      if (currentStepIndex === 0) {
        return {
          phoneState: 'Priya received a notification for 1 missed ₹400 daily EDI due to a transient bank server timeout.',
          backendState: 'Node 1 verified ₹6,800/day healthy revenue. Node 3 strictly prohibits haircuts for healthy businesses.',
          nextAction: 'Click "Can you make it ₹50/day?" on phone to verify that the AI rejects unjustified discounts, or double-press Soundbox to retry ₹400.',
          badge: 'SCENARIO 2: HEALTHY CASH FLOW',
          badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
          dotColor: 'bg-teal-400',
        };
      }
      return {
        phoneState: 'AI politely declined ₹50/day discount request, offering 1-click ₹400 retry to protect lender yield.',
        backendState: 'Node 3 strictly enforced deterministic policy: Healthy volume (>₹5k/day) cannot receive EDI haircut.',
        nextAction: 'Double-press the Soundbox button on the right to retry the missed ₹400 sweep, or switch to Scenario 3.',
        badge: 'POLICY ENFORCED (NO HAIRCUT)',
        badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
        dotColor: 'bg-teal-400',
      };
    }

    if (currentScenario === 'APEX') {
      return {
        phoneState: 'No automated loan concession offered. Merchant phone shows formal statutory compliance notice.',
        backendState: 'Node 1 detected 25 days of zero UPI volume + offline Soundbox. Immediately bypassed Node 3 and triggered Node 5 HITL.',
        nextAction: 'Inspect the generated AI Risk Dossier and allocated DRA field agent assignment in Node 5.',
        badge: 'SCENARIO 3: CHRONIC DORMANT (HITL)',
        badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        dotColor: 'bg-amber-400',
      };
    }

    // Default: RAMESH KIRANA
    if (currentStepIndex === 0) {
      return {
        phoneState: 'Ramesh receives an empathetic Hindi/Telugu WhatsApp message diagnosing his -45% monsoon sales dip.',
        backendState: 'Node 1 ingested 30d UPI data & correlated with Pin Code 500081 peer radar. Genuine localized shock confirmed.',
        nextAction: 'Tap "Haan, ₹150/day confirm kar do ✅" on phone OR double-press the Soundbox button to accept ₹150/day.',
        badge: 'SCENARIO 1: RAMESH KIRANA (-45% DIP)',
        badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        dotColor: 'bg-cyan-400',
      };
    } else {
      return {
        phoneState: 'Ramesh agreed to restructure! Digital RBI Key Fact Statement (KFS) & UPI AutoPay Mandate link delivered.',
        backendState: 'Node 4 executed ACID transaction: SQL loan ledger updated ₹500 ➔ ₹150/day, ₹0 penal interest guaranteed.',
        nextAction: 'Inspect the flashing green row in the SQL database table below, or test Scenario 2.',
        badge: 'SCENARIO 1: LOAN RESTRUCTURED CURED',
        badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        dotColor: 'bg-emerald-400',
      };
    }
  };

  const narration = getNarration();

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0A224E]/90 to-[#071838]/90 border border-white/10 p-5 backdrop-blur-md shadow-xl relative overflow-hidden">
      {/* Subtle Ambient Radial Highlight */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#00BAF2]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Mascot Header & Guided Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Mascot Identity */}
        <div className="flex items-center gap-3.5">
          {/* Animated Glowing Paytm Logo Badge */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Pulsing Outer Aura */}
            <div
              className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00BAF2] via-sky-400 to-[#002970] opacity-50 blur-sm transition-all duration-700 ${
                isSpeaking ? 'animate-pulse scale-110 opacity-75' : ''
              }`}
            />

            {/* Saffron Voice Waveform Ring when Speaking */}
            {isSpeaking && (
              <div className="absolute -inset-2 rounded-2xl border-2 border-amber-400/80 animate-ping opacity-60 pointer-events-none" />
            )}

            <div className="relative h-11 w-11 rounded-2xl bg-white border border-cyan-400/40 p-1 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/paytm-circle-logo.png"
                alt="Paytm"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-tight">
                Paytm Sahayak
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#00BAF2]/15 text-[#00BAF2] border border-[#00BAF2]/30">
                Recovery Copilot AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Autonomous Narrative & Live Backend X-Ray</p>
          </div>
        </div>

        {/* Guided Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNextStep}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00BAF2] hover:bg-sky-400 text-[#002970] font-black text-xs shadow-md shadow-[#00BAF2]/20 active:scale-95 transition-all"
          >
            <span>Next Step in Flow</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onReset}
            title="Reset to Initial Archetype State"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Scenario Filter Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs font-semibold">
        <button
          onClick={() => onSelectScenario('RAMESH')}
          className={`px-3 py-2 rounded-xl border transition-all text-left truncate flex items-center gap-2 ${
            currentScenario === 'RAMESH'
              ? 'bg-[#00BAF2]/20 border-[#00BAF2]/80 text-white font-bold shadow-sm'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
          <span className="truncate">1: Ramesh (-45% Dip)</span>
        </button>

        <button
          onClick={() => onSelectScenario('PRIYA')}
          className={`px-3 py-2 rounded-xl border transition-all text-left truncate flex items-center gap-2 ${
            currentScenario === 'PRIYA'
              ? 'bg-teal-500/20 border-teal-400/80 text-white font-bold shadow-sm'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-teal-400 shrink-0" />
          <span className="truncate">2: Priya (Healthy Flow)</span>
        </button>

        <button
          onClick={() => onSelectScenario('APEX')}
          className={`px-3 py-2 rounded-xl border transition-all text-left truncate flex items-center gap-2 ${
            currentScenario === 'APEX'
              ? 'bg-amber-500/20 border-amber-400/80 text-white font-bold shadow-sm'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
          <span className="truncate">3: Apex (25d Dormant)</span>
        </button>

        <button
          onClick={() => onSelectScenario('NIGHT_BLOCK')}
          className={`px-3 py-2 rounded-xl border transition-all text-left truncate flex items-center gap-2 ${
            currentScenario === 'NIGHT_BLOCK'
              ? 'bg-rose-500/20 border-rose-400/80 text-white font-bold shadow-sm'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0" />
          <span className="truncate">Test Night Block (21:30)</span>
        </button>
      </div>

      {/* Sahayak Explanation Console */}
      <div className="rounded-xl bg-[#001433]/80 border border-white/10 p-4 space-y-3 shadow-inner">
        {/* Console Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Sahayak Live Commentary</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${narration.badgeColor}`}>
            {narration.badge}
          </span>
        </div>

        {/* 3 Clear Narrative Rows */}
        <div className="space-y-2.5 text-xs">
          {/* Row 1: Phone UI */}
          <div className="flex items-start gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-400/30 px-2 py-0.5 rounded-md shrink-0">
              Phone UI
            </span>
            <p className="text-slate-200 leading-relaxed font-normal">{narration.phoneState}</p>
          </div>

          {/* Row 2: Backend X-Ray */}
          <div className="flex items-start gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-md shrink-0">
              Backend X-Ray
            </span>
            <p className="text-slate-300 leading-relaxed font-normal">{narration.backendState}</p>
          </div>

          {/* Row 3: Judge Action */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-md shrink-0">
              Judge Action
            </span>
            <p className="text-amber-200/90 leading-relaxed font-medium">{narration.nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
